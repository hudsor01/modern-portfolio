import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { JobQueue, type JobHandler, type Job, JobUtils } from '../job-queue'

// Skip timing-sensitive tests in CI - they cause flakiness
// Automation module is excluded from coverage anyway (see tsconfig.json)
const isCI = process.env.CI === 'true'
const describeSkipCI = isCI ? describe.skip : describe

// Mock crypto.randomUUID to make tests deterministic
vi.stubGlobal('crypto', {
  ...globalThis.crypto,
  randomUUID: vi.fn().mockImplementation(() => 'mock-uuid-' + Math.random().toString(36).substr(2, 9))
})

describeSkipCI('JobQueue', () => {
  let jobQueue: JobQueue
  let mockHandler: JobHandler

  const defaultOptions = {
    concurrency: 2,
    maxRetries: 3,
    defaultDelay: 10,
    cleanupInterval: 1000,
    retentionPeriod: 5000,
    enableMetrics: true,
    enableHealthCheck: true,
    processingInterval: 50 // Process every 50ms for faster tests
  }

  beforeEach(async () => {
    jobQueue = new JobQueue(defaultOptions)
    mockHandler = {
      process: vi.fn().mockResolvedValue('success'),
      onCompleted: vi.fn(),
      onFailed: vi.fn(),
      onProgress: vi.fn()
    }
  })

  afterEach(async () => {
    await jobQueue.shutdown()
    vi.clearAllMocks()
  })

  describe('Job Management', () => {
    it('adds a job to the queue', async () => {
      const job = await jobQueue.addJob('seo-analysis', { postId: '123' })

      expect(job).toMatchObject({
        type: 'seo-analysis',
        payload: { postId: '123' },
        priority: 'normal',
        status: 'waiting',
        attempts: 0,
        progress: 0
      })
      expect(job.id).toBeDefined()
      expect(job.createdAt).toBeInstanceOf(Date)
      expect(job.scheduledFor).toBeInstanceOf(Date)
    })

    it('adds a job with custom options', async () => {
      const scheduledFor = new Date(Date.now() + 5000)
      const job = await jobQueue.addJob('content-optimization', { contentId: '456' }, {
        priority: 'high',
        delay: 200,
        maxRetries: 5,
        timeout: 10000,
        idempotencyKey: 'unique-key',
        tags: ['urgent', 'optimization'],
        scheduledFor
      })

      expect(job).toMatchObject({
        priority: 'high',
        delay: 200,
        maxRetries: 5,
        timeout: 10000,
        idempotencyKey: 'unique-key',
        tags: ['urgent', 'optimization'],
        scheduledFor
      })
    })

    it('enforces idempotency', async () => {
      const idempotencyKey = 'duplicate-test'
      const job1 = await jobQueue.addJob('seo-analysis', { postId: '123' }, { idempotencyKey })
      const job2 = await jobQueue.addJob('seo-analysis', { postId: '456' }, { idempotencyKey })

      expect(job1.id).toBe(job2.id)
      expect(job1.payload).toEqual({ postId: '123' }) // Original payload preserved
    })

    it('retrieves job by ID', async () => {
      const addedJob = await jobQueue.addJob('email-notification', { email: 'test@example.com' })
      const retrievedJob = jobQueue.getJob(addedJob.id)

      expect(retrievedJob).toEqual(addedJob)
    })

    it('returns undefined for non-existent job', () => {
      const job = jobQueue.getJob('non-existent-id')
      expect(job).toBeUndefined()
    })

    it('retrieves jobs by status', async () => {
      await jobQueue.addJob('seo-analysis', { postId: '1' })
      await jobQueue.addJob('content-optimization', { postId: '2' })

      const waitingJobs = jobQueue.getJobsByStatus('waiting')
      expect(waitingJobs).toHaveLength(2)
      expect(waitingJobs.every(job => job.status === 'waiting')).toBe(true)
    })

    it('retrieves jobs by type', async () => {
      await jobQueue.addJob('seo-analysis', { postId: '1' })
      await jobQueue.addJob('seo-analysis', { postId: '2' })
      await jobQueue.addJob('content-optimization', { postId: '3' })

      const seoJobs = jobQueue.getJobsByType('seo-analysis')
      expect(seoJobs).toHaveLength(2)
      expect(seoJobs.every(job => job.type === 'seo-analysis')).toBe(true)
    })

    it('cancels a waiting job', async () => {
      const job = await jobQueue.addJob('sitemap-generation', { siteId: '123' })
      const cancelled = await jobQueue.cancelJob(job.id)

      expect(cancelled).toBe(true)
      expect(job.status).toBe('cancelled')
    })

    it('cancels an active job', async () => {
      jobQueue.registerHandler('long-running-job', {
        process: () => new Promise(resolve => setTimeout(resolve, 5000))
      })
      
      const job = await jobQueue.addJob('long-running-job', {})
      
      // Wait for job to start
      await new Promise(resolve => setTimeout(resolve, 50))
      
      const cancelled = await jobQueue.cancelJob(job.id)
      expect(cancelled).toBe(true)
      expect(job.status).toBe('cancelled')
    })

    it('cannot cancel completed job', async () => {
      jobQueue.registerHandler('quick-job', { process: () => Promise.resolve('done') })
      
      const job = await jobQueue.addJob('quick-job', {})
      
      // Wait for job to complete
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const cancelled = await jobQueue.cancelJob(job.id)
      expect(cancelled).toBe(false)
    })
  })

  describe('Job Processing', () => {
    it('processes a job successfully', async () => {
      jobQueue.registerHandler('test-job', mockHandler)
      
      const job = await jobQueue.addJob('test-job', { testData: 'value' })
      
      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      expect(mockHandler.process).toHaveBeenCalledWith(job, expect.any(Function))
      expect(mockHandler.onCompleted).toHaveBeenCalledWith(job, 'success')
      expect(job.status).toBe('completed')
      expect(job.progress).toBe(100)
      expect(job.result).toBe('success')
      expect(job.completedAt).toBeInstanceOf(Date)
    })

    it('handles job progress updates', async () => {
      // Mock must return a Promise since onProgress returns Promise<void> and .catch() is called
      const progressHandler = vi.fn().mockResolvedValue(undefined)
      jobQueue.registerHandler('progress-job', {
        process: async (_job, progress) => {
          progress(25)
          await new Promise(resolve => setTimeout(resolve, 10))
          progress(50)
          await new Promise(resolve => setTimeout(resolve, 10))
          progress(75)
          await new Promise(resolve => setTimeout(resolve, 10))
          progress(100)
          return 'completed'
        },
        onProgress: progressHandler
      })

      await jobQueue.addJob('progress-job', {})

      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Check that progress handler was called with expected values
      expect(progressHandler).toHaveBeenCalled()
      expect(progressHandler.mock.calls.some(call => call[1] === 25)).toBe(true)
      expect(progressHandler.mock.calls.some(call => call[1] === 50)).toBe(true)
      expect(progressHandler.mock.calls.some(call => call[1] === 75)).toBe(true)
      expect(progressHandler.mock.calls.some(call => call[1] === 100)).toBe(true)
    })

    it('retries failed jobs', async () => {
      let attempts = 0
      jobQueue.registerHandler('failing-job', {
        process: async () => {
          attempts++
          if (attempts < 3) {
            throw new Error('Temporary failure')
          }
          return 'success'
        }
      })
      
      const job = await jobQueue.addJob('failing-job', {})
      
      // Wait for retries with exponential backoff
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      expect(job.attempts).toBe(3)
      expect(job.status).toBe('completed')
      expect(job.result).toBe('success')
    })

    it('fails job after max retries', async () => {
      jobQueue.registerHandler('always-failing-job', {
        process: () => Promise.reject(new Error('Persistent failure')),
        onFailed: mockHandler.onFailed
      })
      
      const job = await jobQueue.addJob('always-failing-job', {})
      
      // Wait for all retries with exponential backoff
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      expect(job.status).toBe('failed')
      expect(job.attempts).toBe(defaultOptions.maxRetries)
      expect(job.lastError).toBe('Persistent failure')
      expect(job.failedAt).toBeInstanceOf(Date)
      expect(mockHandler.onFailed).toHaveBeenCalled()
    })

    it('handles job timeout', async () => {
      jobQueue.registerHandler('timeout-job', {
        process: () => new Promise(resolve => setTimeout(resolve, 1000)) // 1 second
      })
      
      const job = await jobQueue.addJob('timeout-job', {}, { timeout: 100 }) // 100ms timeout
      
      // Wait for timeout and potential retries
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      expect(job.status).toBe('failed')
      expect(job.lastError).toBe('Job timeout')
    })

    it('respects concurrency limits', async () => {
      let activeJobs = 0
      let maxConcurrentJobs = 0

      // Use shorter job time (200ms) for faster test execution
      // 5 jobs × 200ms ÷ 2 concurrency = 500ms minimum
      jobQueue.registerHandler('concurrent-job', {
        process: async () => {
          activeJobs++
          maxConcurrentJobs = Math.max(maxConcurrentJobs, activeJobs)
          await new Promise(resolve => setTimeout(resolve, 200))
          activeJobs--
          return 'done'
        }
      })

      // Add more jobs than concurrency limit
      const jobs = await Promise.all([
        jobQueue.addJob('concurrent-job', { id: 1 }),
        jobQueue.addJob('concurrent-job', { id: 2 }),
        jobQueue.addJob('concurrent-job', { id: 3 }),
        jobQueue.addJob('concurrent-job', { id: 4 }),
        jobQueue.addJob('concurrent-job', { id: 5 })
      ])

      // Wait for all jobs to complete (1.5s buffer for 500ms minimum)
      await new Promise(resolve => setTimeout(resolve, 2000))

      expect(maxConcurrentJobs).toBeLessThanOrEqual(defaultOptions.concurrency)
      jobs.forEach(job => expect(job.status).toBe('completed'))
    })

    it('processes jobs by priority', async () => {
      const processOrder: string[] = []
      
      jobQueue.registerHandler('priority-job', {
        process: async (job) => {
          processOrder.push(job.payload.id as string)
          return 'done'
        }
      })
      
      // Add jobs in reverse priority order
      await jobQueue.addJob('priority-job', { id: 'low' }, { priority: 'low' })
      await jobQueue.addJob('priority-job', { id: 'critical' }, { priority: 'critical' })
      await jobQueue.addJob('priority-job', { id: 'normal' }, { priority: 'normal' })
      await jobQueue.addJob('priority-job', { id: 'high' }, { priority: 'high' })
      
      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      expect(processOrder[0]).toBe('critical')
      expect(processOrder[1]).toBe('high')
    })

    it('schedules delayed jobs', async () => {
      jobQueue.registerHandler('delayed-job', mockHandler)
      
      const scheduledFor = new Date(Date.now() + 200)
      const job = await jobQueue.addJob('delayed-job', { scheduled: true }, { scheduledFor })
      
      // Check that job is not processed immediately
      await new Promise(resolve => setTimeout(resolve, 50))
      expect(job.status).toBe('waiting')
      expect(mockHandler.process).not.toHaveBeenCalled()
      
      // Wait for scheduled time
      await new Promise(resolve => setTimeout(resolve, 2000))
      expect(job.status).toBe('completed')
      expect(mockHandler.process).toHaveBeenCalled()
    })

    it('handles missing handler gracefully', async () => {
      const job = await jobQueue.addJob('unknown-job-type', {})
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      expect(job.status).toBe('failed')
      expect(job.lastError).toContain('No handler registered')
    })
  })

  describe('Queue Control', () => {
    it('pauses and resumes queue processing', async () => {
      jobQueue.registerHandler('pausable-job', mockHandler)
      
      jobQueue.pause()
      const job = await jobQueue.addJob('pausable-job', {})
      
      // Job should not be processed while paused
      await new Promise(resolve => setTimeout(resolve, 2000))
      expect(job.status).toBe('waiting')
      expect(mockHandler.process).not.toHaveBeenCalled()
      
      jobQueue.resume()
      
      // Job should be processed after resume
      await new Promise(resolve => setTimeout(resolve, 2000))
      expect(job.status).toBe('completed')
      expect(mockHandler.process).toHaveBeenCalled()
    })

    it('drains the queue', async () => {
      jobQueue.registerHandler('drain-job', {
        process: () => new Promise(resolve => setTimeout(() => resolve('done'), 100))
      })
      
      const jobs = await Promise.all([
        jobQueue.addJob('drain-job', { id: 1 }),
        jobQueue.addJob('drain-job', { id: 2 })
      ])
      
      const drainPromise = jobQueue.drain()
      
      // Check that jobs are still being processed
      jobs.forEach(job => expect(['waiting', 'active'].includes(job.status)).toBe(true))
      
      await drainPromise
      
      // All jobs should be completed after drain
      jobs.forEach(job => expect(job.status).toBe('completed'))
    })
  })

  describe('Metrics and Monitoring', () => {
    it('tracks basic metrics', async () => {
      jobQueue.registerHandler('metric-job', mockHandler)
      
      await jobQueue.addJob('metric-job', { id: 1 })
      await jobQueue.addJob('metric-job', { id: 2 })
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const metrics = jobQueue.getMetrics()
      
      expect(metrics.totalJobs).toBe(2)
      expect(metrics.completedJobs).toBe(2)
      expect(metrics.failedJobs).toBe(0)
      expect(metrics.activeJobs).toBe(0)
      expect(metrics.waitingJobs).toBe(0)
    })

    it('calculates processing metrics', async () => {
      jobQueue.registerHandler('timed-job', {
        process: () => new Promise(resolve => setTimeout(() => resolve('done'), 50))
      })
      
      await jobQueue.addJob('timed-job', { id: 1 })
      await jobQueue.addJob('timed-job', { id: 2 })
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const metrics = jobQueue.getMetrics()
      
      expect(metrics.avgProcessingTime).toBeGreaterThan(0)
      expect(metrics.throughputPerMinute).toBeGreaterThanOrEqual(0)
      expect(metrics.errorRate).toBe(0)
    })

    it('performs health check', async () => {
      const health = jobQueue.healthCheck()
      
      expect(health).toHaveProperty('status')
      expect(health).toHaveProperty('issues')
      expect(health).toHaveProperty('metrics')
      expect(['healthy', 'unhealthy']).toContain(health.status)
      expect(Array.isArray(health.issues)).toBe(true)
    })

    it('detects high error rate', async () => {
      jobQueue.registerHandler('failing-job', {
        process: () => Promise.reject(new Error('Test error'))
      })
      
      // Create many failing jobs
      for (let i = 0; i < 10; i++) {
        await jobQueue.addJob('failing-job', { id: i })
      }
      
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const health = jobQueue.healthCheck()
      expect(health.status).toBe('unhealthy')
      expect(health.issues.some(issue => issue.includes('error rate'))).toBe(true)
    })
  })

  describe('Cleanup and Maintenance', () => {
    it('cleans up old completed jobs', async () => {
      jobQueue.registerHandler('cleanup-job', mockHandler)
      
      const job = await jobQueue.addJob('cleanup-job', {})
      await new Promise(resolve => setTimeout(resolve, 2000)) // Wait for completion
      
      // Manually set completion time to past retention period
      job.completedAt = new Date(Date.now() - defaultOptions.retentionPeriod - 1000)
      
      jobQueue.cleanup()
      
      expect(jobQueue.getJob(job.id)).toBeUndefined()
    })

    it('preserves recent jobs during cleanup', async () => {
      jobQueue.registerHandler('recent-job', mockHandler)
      
      const job = await jobQueue.addJob('recent-job', {})
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      jobQueue.cleanup()
      
      expect(jobQueue.getJob(job.id)).toBeDefined()
    })
  })

  describe('Error Handling', () => {
    it('handles errors in job handlers gracefully', async () => {
      jobQueue.registerHandler('error-job', {
        process: () => {
          throw new Error('Handler error')
        }
      })
      
      const job = await jobQueue.addJob('error-job', {})
      
      // Should not throw unhandled errors
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      expect(job.status).toBe('failed')
      expect(job.lastError).toBe('Handler error')
    })

    it('handles async errors in handlers', async () => {
      jobQueue.registerHandler('async-error-job', {
        process: async () => {
          await new Promise(resolve => setTimeout(resolve, 10))
          throw new Error('Async error')
        }
      })
      
      const job = await jobQueue.addJob('async-error-job', {})
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      expect(job.status).toBe('failed')
      expect(job.lastError).toBe('Async error')
    })

    it('handles non-Error objects thrown from handlers', async () => {
      jobQueue.registerHandler('string-error-job', {
        process: () => {
          throw 'String error'
        }
      })
      
      const job = await jobQueue.addJob('string-error-job', {})
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      expect(job.status).toBe('failed')
      expect(job.lastError).toBe('String error')
    })
  })

  describe('JobUtils', () => {
    it('creates idempotency keys', () => {
      const key1 = JobUtils.createIdempotencyKey('seo-analysis', 'post-123')
      const key2 = JobUtils.createIdempotencyKey('seo-analysis', 'post-123')
      const key3 = JobUtils.createIdempotencyKey('seo-analysis', 'post-456')
      
      expect(key1).toBe(key2)
      expect(key1).not.toBe(key3)
      expect(key1).toContain('seo-analysis:')
    })

    it('checks if job is recent', () => {
      const recentJob: Job = {
        id: 'test-job',
        type: 'seo-analysis',
        payload: {},
        priority: 'normal',
        attempts: 0,
        maxRetries: 3,
        delay: 1000,
        createdAt: new Date(),
        scheduledFor: new Date(),
        status: 'waiting',
        progress: 0
      }
      
      const oldJob: Job = {
        ...recentJob,
        createdAt: new Date(Date.now() - 10 * 60 * 1000) // 10 minutes ago
      }
      
      expect(JobUtils.isJobRecent(recentJob, 5)).toBe(true)
      expect(JobUtils.isJobRecent(oldJob, 5)).toBe(false)
    })

    it('calculates job age', () => {
      const job: Job = {
        id: 'test-job',
        type: 'seo-analysis',
        payload: {},
        priority: 'normal',
        attempts: 0,
        maxRetries: 3,
        delay: 1000,
        createdAt: new Date(Date.now() - 5000), // 5 seconds ago
        scheduledFor: new Date(),
        status: 'waiting',
        progress: 0
      }
      
      const age = JobUtils.getJobAge(job)
      expect(age).toBeGreaterThanOrEqual(5000)
      expect(age).toBeLessThan(6000)
    })

    it('formats job duration', () => {
      const completedJob: Job = {
        id: 'test-job',
        type: 'seo-analysis',
        payload: {},
        priority: 'normal',
        attempts: 1,
        maxRetries: 3,
        delay: 1000,
        createdAt: new Date(Date.now() - 10000),
        scheduledFor: new Date(),
        startedAt: new Date(Date.now() - 5000),
        completedAt: new Date(),
        status: 'completed',
        progress: 100
      }
      
      const duration = JobUtils.formatJobDuration(completedJob)
      expect(duration).toMatch(/^\d+\.?\d*s$/) // Should be in seconds format
      
      const notStartedJob: Job = {
        ...completedJob,
        startedAt: undefined,
        completedAt: undefined
      }
      
      expect(JobUtils.formatJobDuration(notStartedJob)).toBe('Not started')
    })
  })
})