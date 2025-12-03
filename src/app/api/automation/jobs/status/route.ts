/**
 * Job Status API Endpoint
 * Provides job monitoring, status checking, and metrics
 */

import { NextRequest, NextResponse } from 'next/server';
import { jobQueue, type Job, type JobType } from '@/lib/automation/job-queue';
import { z } from 'zod';
import { createContextLogger } from '@/lib/monitoring/logger';
import type { ApiResponse } from '@/types/shared-api';

const logger = createContextLogger('JobStatusAPI');

// Query parameters validation
const JobStatusQuerySchema = z.object({
  jobId: z.string().optional(),
  status: z.enum(['waiting', 'active', 'completed', 'failed', 'delayed', 'paused', 'cancelled']).optional(),
  type: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(50),
  offset: z.coerce.number().min(0).default(0),
  tags: z.string().optional() // Comma-separated tags
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const queryParams = JobStatusQuerySchema.parse({
      jobId: searchParams.get('jobId'),
      status: searchParams.get('status'),
      type: searchParams.get('type'),
      limit: searchParams.get('limit'),
      offset: searchParams.get('offset'),
      tags: searchParams.get('tags')
    });

    // If specific job ID requested, return single job
    if (queryParams.jobId) {
      const job = jobQueue.getJob(queryParams.jobId);
      
      if (!job) {
        return NextResponse.json<ApiResponse<null>>({
          success: false,
          error: `Job ${queryParams.jobId} not found`,
          data: null
        }, { status: 404 });
      }

      return NextResponse.json<ApiResponse<typeof job>>({
        success: true,
        data: job
      });
    }

    // Get jobs based on filters
    let jobs: Job[] = [];

    if (queryParams.status) {
      jobs = jobQueue.getJobsByStatus(queryParams.status) as Job[];
    } else if (queryParams.type) {
      jobs = jobQueue.getJobsByType(queryParams.type as JobType) as Job[];
    } else {
      // Get all jobs (this would need pagination in a real app)
      jobs = jobQueue.getAllJobs();
    }

    // Filter by tags if provided
    if (queryParams.tags) {
      const filterTags = queryParams.tags.split(',').map(tag => tag.trim());
      jobs = jobs.filter((job: Job) => 
        job.tags && job.tags.some((tag: string) => filterTags.includes(tag))
      );
    }

    // Apply pagination
    const total = jobs.length;
    const paginatedJobs = jobs
      .slice(queryParams.offset, queryParams.offset + queryParams.limit);

    // Enhance job data with additional computed fields
    const enhancedJobs = paginatedJobs.map((job: Job) => ({
      ...job,
      duration: job.startedAt && job.completedAt ? 
        job.completedAt.getTime() - job.startedAt.getTime() : null,
      waitTime: job.startedAt ? 
        job.startedAt.getTime() - job.createdAt.getTime() : 
        Date.now() - job.createdAt.getTime(),
      isStuck: job.status === 'active' && job.startedAt && 
        (Date.now() - job.startedAt.getTime()) > 3600000, // 1 hour
      nextRetry: job.status === 'delayed' ? job.scheduledFor : null
    }));

    return NextResponse.json<ApiResponse<{
      jobs: typeof enhancedJobs;
      pagination: {
        total: number;
        limit: number;
        offset: number;
        hasMore: boolean;
      };
    }>>({
      success: true,
      data: {
        jobs: enhancedJobs,
        pagination: {
          total,
          limit: queryParams.limit,
          offset: queryParams.offset,
          hasMore: (queryParams.offset + queryParams.limit) < total
        }
      }
    });

  } catch (error) {
    logger.error('Job status API error', error instanceof Error ? error : new Error(String(error)));

    if (error instanceof z.ZodError) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: `Invalid query parameters: ${error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
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