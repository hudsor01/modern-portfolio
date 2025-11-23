/**
 * Job Retry API Endpoint
 * Allows manual retry of failed jobs and bulk retry operations
 */

import { NextRequest, NextResponse } from 'next/server';
import { jobQueue, type Job } from '@/lib/automation/job-queue';
import { z } from 'zod';
import { createContextLogger } from '@/lib/logging/logger';
import type { ApiResponse } from '@/types/shared-api';

const logger = createContextLogger('JobRetryAPI');

// Request body validation schemas
const SingleRetrySchema = z.object({
  jobId: z.string(),
  resetAttempts: z.boolean().default(false),
  newDelay: z.number().min(0).optional(),
  newPriority: z.enum(['critical', 'high', 'normal', 'low']).optional()
});

const BulkRetrySchema = z.object({
  filter: z.object({
    status: z.enum(['failed', 'cancelled']).optional(),
    jobType: z.string().optional(),
    tags: z.array(z.string()).optional(),
    failedBefore: z.string().datetime().optional(),
    maxAttempts: z.number().min(0).optional()
  }),
  options: z.object({
    resetAttempts: z.boolean().default(false),
    newDelay: z.number().min(0).optional(),
    newPriority: z.enum(['critical', 'high', 'normal', 'low']).optional(),
    maxJobs: z.number().min(1).max(1000).default(100)
  })
});

const RetryRequestSchema = z.union([
  z.object({ type: z.literal('single'), payload: SingleRetrySchema }),
  z.object({ type: z.literal('bulk'), payload: BulkRetrySchema })
]);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const retryRequest = RetryRequestSchema.parse(body);

    if (retryRequest.type === 'single') {
      return await handleSingleRetry(retryRequest.payload);
    } else {
      return await handleBulkRetry(retryRequest.payload);
    }

  } catch (error) {
    logger.error('Job retry API error', error instanceof Error ? error : new Error(String(error)));

    if (error instanceof z.ZodError) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: `Invalid request body: ${error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
        data: null
      }, { status: 400 });
    }

    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error',
      data: null
    }, { status: 500 });
  }
}

async function handleSingleRetry(payload: z.infer<typeof SingleRetrySchema>) {
  const { jobId, resetAttempts, newDelay, newPriority } = payload;
  
  const job = jobQueue.getJob(jobId);
  if (!job) {
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: `Job ${jobId} not found`,
      data: null
    }, { status: 404 });
  }

  // Check if job can be retried
  if (!['failed', 'cancelled'].includes(job.status)) {
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: `Job ${jobId} cannot be retried. Current status: ${job.status}`,
      data: null
    }, { status: 400 });
  }

  // Apply retry modifications
  if (resetAttempts) {
    job.attempts = 0;
  }

  if (newDelay !== undefined) {
    job.delay = newDelay;
    job.scheduledFor = new Date(Date.now() + newDelay);
  } else {
    // Schedule for immediate retry
    job.scheduledFor = new Date();
  }

  if (newPriority) {
    job.priority = newPriority;
  }

  // Reset job state for retry
  job.status = 'waiting';
  job.startedAt = undefined;
  job.completedAt = undefined;
  job.failedAt = undefined;
  job.progress = 0;
  job.result = undefined;

  return NextResponse.json<ApiResponse<{
    jobId: string;
    newStatus: string;
    scheduledFor: string;
    attempts: number;
  }>>({
    success: true,
    message: `Job ${jobId} queued for retry`,
    data: {
      jobId: job.id,
      newStatus: job.status,
      scheduledFor: job.scheduledFor.toISOString(),
      attempts: job.attempts
    }
  });
}

async function handleBulkRetry(payload: z.infer<typeof BulkRetrySchema>) {
  const { filter, options } = payload;

  // Get all jobs that match the filter
  const allJobs = jobQueue.getAllJobs();
  let eligibleJobs = allJobs.filter((job: Job) =>
    ['failed', 'cancelled'].includes(job.status)
  );

  // Apply filters
  if (filter.status) {
    eligibleJobs = eligibleJobs.filter((job: Job) => job.status === filter.status);
  }

  if (filter.jobType) {
    eligibleJobs = eligibleJobs.filter((job: Job) => job.type === filter.jobType);
  }

  if (filter.tags && filter.tags.length > 0) {
    eligibleJobs = eligibleJobs.filter((job: Job) => 
      job.tags && job.tags.some((tag: string) => filter.tags!.includes(tag))
    );
  }

  if (filter.failedBefore) {
    const cutoffDate = new Date(filter.failedBefore);
    eligibleJobs = eligibleJobs.filter((job: Job) => 
      job.failedAt && job.failedAt < cutoffDate
    );
  }

  if (filter.maxAttempts !== undefined) {
    eligibleJobs = eligibleJobs.filter((job: Job) => 
      job.attempts <= filter.maxAttempts!
    );
  }

  // Limit the number of jobs to retry
  const jobsToRetry = eligibleJobs.slice(0, options.maxJobs);

  if (jobsToRetry.length === 0) {
    return NextResponse.json<ApiResponse<{
      retriedJobs: [];
      totalEligible: number;
      message: string;
    }>>({
      success: true,
      data: {
        retriedJobs: [],
        totalEligible: eligibleJobs.length,
        message: 'No jobs matched the retry criteria'
      }
    });
  }

  // Apply retry to each job
  const retriedJobs = [];
  const failedRetries = [];

  for (const job of jobsToRetry as Job[]) {
    try {
      // Apply retry modifications
      if (options.resetAttempts) {
        job.attempts = 0;
      }

      if (options.newDelay !== undefined) {
        job.delay = options.newDelay;
        job.scheduledFor = new Date(Date.now() + options.newDelay);
      } else {
        // Schedule for immediate retry with staggered delays to prevent thundering herd
        const staggerDelay = retriedJobs.length * 1000; // 1 second stagger
        job.scheduledFor = new Date(Date.now() + staggerDelay);
      }

      if (options.newPriority) {
        job.priority = options.newPriority;
      }

      // Reset job state for retry
      job.status = 'waiting';
      job.startedAt = undefined;
      job.completedAt = undefined;
      job.failedAt = undefined;
      job.progress = 0;
      job.result = undefined;

      retriedJobs.push({
        jobId: job.id,
        type: job.type,
        scheduledFor: job.scheduledFor.toISOString(),
        attempts: job.attempts
      });

    } catch (error) {
      failedRetries.push({
        jobId: job.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  return NextResponse.json<ApiResponse<{
    retriedJobs: typeof retriedJobs;
    failedRetries: typeof failedRetries;
    totalEligible: number;
    summary: {
      successful: number;
      failed: number;
      totalProcessed: number;
    };
  }>>({
    success: true,
    message: `Bulk retry completed: ${retriedJobs.length} jobs queued for retry, ${failedRetries.length} failed`,
    data: {
      retriedJobs,
      failedRetries,
      totalEligible: eligibleJobs.length,
      summary: {
        successful: retriedJobs.length,
        failed: failedRetries.length,
        totalProcessed: jobsToRetry.length
      }
    }
  });
}

// GET endpoint for retry eligibility check
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    if (jobId) {
      // Check specific job retry eligibility
      const job = jobQueue.getJob(jobId);
      if (!job) {
        return NextResponse.json<ApiResponse<null>>({
          success: false,
          error: `Job ${jobId} not found`,
          data: null
        }, { status: 404 });
      }

      const canRetry = ['failed', 'cancelled'].includes(job.status);
      const withinRetryLimit = job.attempts < job.maxRetries;

      return NextResponse.json<ApiResponse<{
        jobId: string;
        canRetry: boolean;
        status: string;
        attempts: number;
        maxRetries: number;
        withinRetryLimit: boolean;
        lastError?: string;
      }>>({
        success: true,
        data: {
          jobId: job.id,
          canRetry: canRetry && withinRetryLimit,
          status: job.status,
          attempts: job.attempts,
          maxRetries: job.maxRetries,
          withinRetryLimit,
          lastError: job.lastError
        }
      });
    }

    // Return general retry statistics
    const allJobs = jobQueue.getAllJobs();
    const failedJobs = allJobs.filter((job: Job) => job.status === 'failed');
    const cancelledJobs = allJobs.filter((job: Job) => job.status === 'cancelled');
    const retryableJobs = [...failedJobs, ...cancelledJobs].filter((job: Job) => 
      job.attempts < job.maxRetries
    );

    const retryStats = {
      total: allJobs.length,
      failed: failedJobs.length,
      cancelled: cancelledJobs.length,
      retryable: retryableJobs.length,
      byType: retryableJobs.reduce((acc: Record<string, number>, job: Job) => {
        acc[job.type] = (acc[job.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      avgAttempts: retryableJobs.length > 0 ? 
        retryableJobs.reduce((sum: number, job: Job) => sum + job.attempts, 0) / retryableJobs.length : 0
    };

    return NextResponse.json<ApiResponse<typeof retryStats>>({
      success: true,
      data: retryStats
    });

  } catch (error) {
    logger.error('Job retry eligibility check error', error instanceof Error ? error : new Error(String(error)));

    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error',
      data: null
    }, { status: 500 });
  }
}