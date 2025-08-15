/**
 * Job Queue System for Blog Automation
 * Implements reliable background job processing with retry logic and monitoring
 */

import { v4 as uuidv4 } from 'uuid';

export interface JobPayload {
  [key: string]: unknown;
}

export interface Job<T extends JobPayload = JobPayload> {
  id: string;
  type: JobType;
  payload: T;
  priority: JobPriority;
  attempts: number;
  maxRetries: number;
  delay: number;
  createdAt: Date;
  scheduledFor: Date;
  startedAt?: Date;
  completedAt?: Date;
  failedAt?: Date;
  lastError?: string;
  status: JobStatus;
  progress: number;
  result?: unknown;
  tags?: string[];
  timeout?: number;
  idempotencyKey?: string;
}

export type JobType =
  | 'seo-analysis'
  | 'content-optimization'
  | 'sitemap-generation'
  | 'social-media-posting'
  | 'email-notification'
  | 'analytics-processing'
  | 'content-backup'
  | 'link-checking'
  | 'image-optimization'
  | 'rss-feed-generation'
  | 'webhook-delivery'
  | 'content-scheduling'
  | 'keyword-ranking-check'
  | 'performance-audit'
  | 'duplicate-content-detection';

export type JobPriority = 'critical' | 'high' | 'normal' | 'low';

export type JobStatus =
  | 'waiting'
  | 'active'
  | 'completed'
  | 'failed'
  | 'delayed'
  | 'paused'
  | 'cancelled';

export interface JobHandler<T extends JobPayload = JobPayload> {
  process(job: Job<T>, progress: ProgressCallback): Promise<unknown>;
  onCompleted?(job: Job<T>, result: unknown): Promise<void>;
  onFailed?(job: Job<T>, error: Error): Promise<void>;
  onProgress?(job: Job<T>, progress: number): Promise<void>;
}

export type ProgressCallback = (progress: number) => void;

export interface JobQueueOptions {
  concurrency: number;
  maxRetries: number;
  defaultDelay: number;
  cleanupInterval: number;
  retentionPeriod: number;
  enableMetrics: boolean;
  enableHealthCheck: boolean;
}

export interface JobMetrics {
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
  activeJobs: number;
  waitingJobs: number;
  avgProcessingTime: number;
  throughputPerMinute: number;
  errorRate: number;
  queueLatency: number;
}

export interface RetryConfig {
  maxRetries: number;
  backoffType: 'fixed' | 'exponential' | 'linear';
  backoffDelay: number;
  maxDelay: number;
  jitter: boolean;
}

export class JobQueue {
  private readonly jobs = new Map<string, Job>();
  private readonly handlers = new Map<JobType, JobHandler>();
  private readonly activeJobs = new Set<string>();
  private readonly metrics: JobMetrics;
  private cleanupTimer?: NodeJS.Timeout;
  private processTimer?: NodeJS.Timeout;
  private isProcessing = false;
  private isPaused = false;

  constructor(private readonly options: JobQueueOptions) {
    this.metrics = {
      totalJobs: 0,
      completedJobs: 0,
      failedJobs: 0,
      activeJobs: 0,
      waitingJobs: 0,
      avgProcessingTime: 0,
      throughputPerMinute: 0,
      errorRate: 0,
      queueLatency: 0
    };

    this.startProcessing();
    this.startCleanup();
  }

  /**
   * Get all jobs in the queue
   */
  getAllJobs(): Job[] {
    return Array.from(this.jobs.values());
  }

  /**
   * Register a job handler for a specific job type
   */
  registerHandler<T extends JobPayload>(
    type: JobType,
    handler: JobHandler<T>
  ): void {
    this.handlers.set(type, handler as JobHandler);
  }

  /**
   * Add a job to the queue with idempotency support
   */
  async addJob<T extends JobPayload>(
    type: JobType,
    payload: T,
    options: Partial<{
      priority: JobPriority;
      delay: number;
      maxRetries: number;
      timeout: number;
      idempotencyKey: string;
      tags: string[];
      scheduledFor: Date;
    }> = {}
  ): Promise<Job<T>> {
    // Check for duplicate job with same idempotency key
    if (options.idempotencyKey) {
      const existingJob = this.findJobByIdempotencyKey(options.idempotencyKey);
      if (existingJob) {
        return existingJob as Job<T>;
      }
    }

    const job: Job<T> = {
      id: uuidv4(),
      type,
      payload,
      priority: options.priority || 'normal',
      attempts: 0,
      maxRetries: options.maxRetries || this.options.maxRetries,
      delay: options.delay || this.options.defaultDelay,
      createdAt: new Date(),
      scheduledFor: options.scheduledFor || new Date(),
      status: 'waiting',
      progress: 0,
      idempotencyKey: options.idempotencyKey,
      tags: options.tags || [],
      timeout: options.timeout
    };

    this.jobs.set(job.id, job);
    this.metrics.totalJobs++;
    this.metrics.waitingJobs++;

    this.triggerProcessing();

    return job;
  }

  /**
   * Get job by ID
   */
  getJob(jobId: string): Job | undefined {
    return this.jobs.get(jobId);
  }

  /**
   * Get jobs by status
   */
  getJobsByStatus(status: JobStatus): Job[] {
    return Array.from(this.jobs.values()).filter(job => job.status === status);
  }

  /**
   * Get jobs by type
   */
  getJobsByType(type: JobType): Job[] {
    return Array.from(this.jobs.values()).filter(job => job.type === type);
  }

  /**
   * Cancel a job
   */
  async cancelJob(jobId: string): Promise<boolean> {
    const job = this.jobs.get(jobId);
    if (!job) return false;

    if (job.status === 'active') {
      // Job is currently processing, mark for cancellation
      job.status = 'cancelled';
      return true;
    }

    if (['waiting', 'delayed'].includes(job.status)) {
      job.status = 'cancelled';
      return true;
    }

    return false;
  }

  /**
   * Pause the queue
   */
  pause(): void {
    this.isPaused = true;
  }

  /**
   * Resume the queue
   */
  resume(): void {
    this.isPaused = false;
    this.triggerProcessing();
  }

  /**
   * Get current metrics
   */
  getMetrics(): JobMetrics {
    this.updateMetrics();
    return { ...this.metrics };
  }

  /**
   * Get queue configuration
   */
  getOptions(): JobQueueOptions {
    return { ...this.options };
  }

  /**
   * Clean up completed and failed jobs
   */
  cleanup(): void {
    const now = new Date();
    const cutoff = new Date(now.getTime() - this.options.retentionPeriod);

    for (const [jobId, job] of this.jobs) {
      if (['completed', 'failed', 'cancelled'].includes(job.status)) {
        const relevantDate = job.completedAt || job.failedAt || job.createdAt;
        if (relevantDate < cutoff) {
          this.jobs.delete(jobId);
        }
      }
    }
  }

  /**
   * Drain the queue - wait for all active jobs to complete
   */
  async drain(): Promise<void> {
    this.isPaused = true;

    while (this.activeJobs.size > 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  /**
   * Shutdown the queue
   */
  async shutdown(): Promise<void> {
    this.isPaused = true;

    if (this.processTimer) {
      clearInterval(this.processTimer);
    }

    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }

    await this.drain();
  }

  /**
   * Health check
   */
  healthCheck(): {
    status: 'healthy' | 'unhealthy';
    issues: string[];
    metrics: JobMetrics;
  } {
    const issues: string[] = [];
    const metrics = this.getMetrics();

    // Check error rate
    if (metrics.errorRate > 0.1) { // 10% error rate threshold
      issues.push(`High error rate: ${(metrics.errorRate * 100).toFixed(1)}%`);
    }

    // Check queue latency
    if (metrics.queueLatency > 30000) { // 30 second threshold
      issues.push(`High queue latency: ${metrics.queueLatency}ms`);
    }

    // Check for stuck jobs
    const stuckJobs = this.findStuckJobs();
    if (stuckJobs.length > 0) {
      issues.push(`${stuckJobs.length} jobs appear to be stuck`);
    }

    return {
      status: issues.length > 0 ? 'unhealthy' : 'healthy',
      issues,
      metrics
    };
  }

  private findJobByIdempotencyKey(key: string): Job | undefined {
    return Array.from(this.jobs.values()).find(job => job.idempotencyKey === key);
  }

  private startProcessing(): void {
    this.processTimer = setInterval(() => {
      if (!this.isPaused && !this.isProcessing) {
        this.processJobs();
      }
    }, 1000);
  }

  private startCleanup(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.options.cleanupInterval);
  }

  private triggerProcessing(): void {
    if (!this.isPaused && !this.isProcessing) {
      // Use setTimeout to avoid blocking
      setTimeout(() => this.processJobs(), 0);
    }
  }

  private async processJobs(): Promise<void> {
    if (this.isPaused || this.isProcessing) return;

    this.isProcessing = true;

    try {
      const availableSlots = this.options.concurrency - this.activeJobs.size;
      if (availableSlots <= 0) return;

      const readyJobs = this.getReadyJobs(availableSlots);

      for (const job of readyJobs) {
        this.processJob(job).catch(error => {
          console.error(`Unexpected error processing job ${job.id}:`, error);
        });
      }
    } finally {
      this.isProcessing = false;
    }
  }

  private getReadyJobs(limit: number): Job[] {
    const now = new Date();

    return Array.from(this.jobs.values())
      .filter(job =>
        job.status === 'waiting' &&
        job.scheduledFor <= now
      )
      .sort((a, b) => {
        // Sort by priority first, then by creation time
        const priorityOrder = { critical: 4, high: 3, normal: 2, low: 1 };
        const aPriority = priorityOrder[a.priority];
        const bPriority = priorityOrder[b.priority];

        if (aPriority !== bPriority) {
          return bPriority - aPriority;
        }

        return a.createdAt.getTime() - b.createdAt.getTime();
      })
      .slice(0, limit);
  }

  private async processJob(job: Job): Promise<void> {
    const handler = this.handlers.get(job.type);
    if (!handler) {
      await this.failJob(job, new Error(`No handler registered for job type: ${job.type}`));
      return;
    }

    this.activeJobs.add(job.id);
    job.status = 'active';
    job.startedAt = new Date();
    job.attempts++;
    this.metrics.activeJobs++;
    this.metrics.waitingJobs--;

    const progressCallback: ProgressCallback = (progress: number) => {
      job.progress = Math.max(0, Math.min(100, progress));
      handler.onProgress?.(job, job.progress).catch(console.error);
    };

    try {
      // Set timeout if specified
      const processPromise = handler.process(job, progressCallback);
      const timeoutPromise = job.timeout ?
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Job timeout')), job.timeout)
        ) :
        null;

      const result = timeoutPromise ?
        await Promise.race([processPromise, timeoutPromise]) :
        await processPromise;

      await this.completeJob(job, result);
      await handler.onCompleted?.(job, result);

    } catch (error) {
      const jobError = error instanceof Error ? error : new Error(String(error));
      await this.handleJobError(job, jobError);
      await handler.onFailed?.(job, jobError);
    } finally {
      this.activeJobs.delete(job.id);
      this.metrics.activeJobs--;
    }
  }

  private async completeJob(job: Job, result: unknown): Promise<void> {
    job.status = 'completed';
    job.completedAt = new Date();
    job.progress = 100;
    job.result = result;
    this.metrics.completedJobs++;
  }

  private async handleJobError(job: Job, error: Error): Promise<void> {
    job.lastError = error.message;

    if (job.attempts < job.maxRetries) {
      // Schedule retry with backoff
      const retryDelay = this.calculateRetryDelay(job.attempts, job.delay);
      job.scheduledFor = new Date(Date.now() + retryDelay);
      job.status = 'delayed';
    } else {
      await this.failJob(job, error);
    }
  }

  private async failJob(job: Job, error: Error): Promise<void> {
    job.status = 'failed';
    job.failedAt = new Date();
    job.lastError = error.message;
    this.metrics.failedJobs++;
  }

  private calculateRetryDelay(attempt: number, baseDelay: number): number {
    // Exponential backoff with jitter
    const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);
    const jitter = Math.random() * 0.1 * exponentialDelay; // 10% jitter
    return Math.min(exponentialDelay + jitter, 300000); // Max 5 minutes
  }

  private updateMetrics(): void {
    const allJobs = Array.from(this.jobs.values());
    const completedJobs = allJobs.filter(job => job.status === 'completed');

    if (completedJobs.length > 0) {
      const totalProcessingTime = completedJobs.reduce((sum, job) => {
        if (job.startedAt && job.completedAt) {
          return sum + (job.completedAt.getTime() - job.startedAt.getTime());
        }
        return sum;
      }, 0);

      this.metrics.avgProcessingTime = totalProcessingTime / completedJobs.length;
    }

    // Calculate throughput (completed jobs in last minute)
    const oneMinuteAgo = new Date(Date.now() - 60000);
    const recentCompletedJobs = completedJobs.filter(job =>
      job.completedAt && job.completedAt > oneMinuteAgo
    );
    this.metrics.throughputPerMinute = recentCompletedJobs.length;

    // Calculate error rate
    const totalProcessedJobs = this.metrics.completedJobs + this.metrics.failedJobs;
    this.metrics.errorRate = totalProcessedJobs > 0 ?
      this.metrics.failedJobs / totalProcessedJobs : 0;

    // Calculate queue latency (average time waiting)
    const waitingJobs = allJobs.filter(job => job.status === 'waiting');
    if (waitingJobs.length > 0) {
      const totalWaitTime = waitingJobs.reduce((sum, job) =>
        sum + (Date.now() - job.createdAt.getTime()), 0
      );
      this.metrics.queueLatency = totalWaitTime / waitingJobs.length;
    }

    this.metrics.waitingJobs = waitingJobs.length;
  }

  private findStuckJobs(): Job[] {
    const oneHourAgo = new Date(Date.now() - 3600000);
    return Array.from(this.jobs.values()).filter(job =>
      job.status === 'active' &&
      job.startedAt &&
      job.startedAt < oneHourAgo
    );
  }
}

// Singleton instance
export const jobQueue = new JobQueue({
  concurrency: 5,
  maxRetries: 3,
  defaultDelay: 1000,
  cleanupInterval: 300000, // 5 minutes
  retentionPeriod: 86400000, // 24 hours
  enableMetrics: true,
  enableHealthCheck: true
});

// Job utilities
export class JobUtils {
  static createIdempotencyKey(type: JobType, data: string): string {
    return `${type}:${Buffer.from(data).toString('base64')}`;
  }

  static isJobRecent(job: Job, minutes: number): boolean {
    const cutoff = new Date(Date.now() - minutes * 60000);
    return job.createdAt > cutoff;
  }

  static getJobAge(job: Job): number {
    return Date.now() - job.createdAt.getTime();
  }

  static formatJobDuration(job: Job): string {
    if (!job.startedAt) return 'Not started';

    const endTime = job.completedAt || job.failedAt || new Date();
    const duration = endTime.getTime() - job.startedAt.getTime();

    if (duration < 1000) return `${duration}ms`;
    if (duration < 60000) return `${(duration / 1000).toFixed(1)}s`;
    return `${(duration / 60000).toFixed(1)}m`;
  }
}
