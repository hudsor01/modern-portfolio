/**
 * Job Metrics API Endpoint
 * Provides comprehensive metrics and monitoring data for the job queue
 */

import { NextRequest, NextResponse } from 'next/server';
import { jobQueue, type Job } from '@/lib/automation/job-queue';
import { z } from 'zod';
import { createContextLogger } from '@/lib/logging/logger';
import type { ApiResponse } from '@/types/shared-api';

const logger = createContextLogger('JobMetricsAPI');

// Query parameters validation
const MetricsQuerySchema = z.object({
  timeRange: z.enum(['1h', '24h', '7d', '30d']).default('24h'),
  jobTypes: z.string().optional(), // Comma-separated job types
  includeHistogram: z.enum(['true', 'false']).default('false').transform(val => val === 'true')
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const queryParams = MetricsQuerySchema.parse({
      timeRange: searchParams.get('timeRange'),
      jobTypes: searchParams.get('jobTypes'),
      includeHistogram: searchParams.get('includeHistogram')
    });

    // Get current metrics from job queue
    const currentMetrics = jobQueue.getMetrics();
    
    // Calculate time range for historical data
    const timeRangeMs = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    }[queryParams.timeRange];

    const cutoffTime = new Date(Date.now() - timeRangeMs);

    // Get all jobs for analysis
    const allJobs = jobQueue.getAllJobs();

    // Filter jobs by time range
    const recentJobs = allJobs.filter((job: Job) =>
      job.createdAt >= cutoffTime
    );

    // Filter by job types if specified
    const filteredJobs = queryParams.jobTypes ? 
      recentJobs.filter((job: Job) => 
        queryParams.jobTypes!.split(',').map(t => t.trim()).includes(job.type)
      ) : recentJobs;

    // Calculate detailed metrics
    const jobsByStatus = {
      waiting: filteredJobs.filter((j: Job) => j.status === 'waiting').length,
      active: filteredJobs.filter((j: Job) => j.status === 'active').length,
      completed: filteredJobs.filter((j: Job) => j.status === 'completed').length,
      failed: filteredJobs.filter((j: Job) => j.status === 'failed').length,
      delayed: filteredJobs.filter((j: Job) => j.status === 'delayed').length,
      paused: filteredJobs.filter((j: Job) => j.status === 'paused').length,
      cancelled: filteredJobs.filter((j: Job) => j.status === 'cancelled').length
    };

    const jobsByType = filteredJobs.reduce((acc: Record<string, number>, job: Job) => {
      acc[job.type] = (acc[job.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const jobsByPriority = {
      critical: filteredJobs.filter((j: Job) => j.priority === 'critical').length,
      high: filteredJobs.filter((j: Job) => j.priority === 'high').length,
      normal: filteredJobs.filter((j: Job) => j.priority === 'normal').length,
      low: filteredJobs.filter((j: Job) => j.priority === 'low').length
    };

    // Performance metrics
    const completedJobs = filteredJobs.filter((j: Job) => j.status === 'completed');
    const failedJobs = filteredJobs.filter((j: Job) => j.status === 'failed');
    
    const avgProcessingTime = completedJobs.length > 0 ? 
      completedJobs.reduce((sum: number, job: Job) => {
        if (job.startedAt && job.completedAt) {
          return sum + (job.completedAt.getTime() - job.startedAt.getTime());
        }
        return sum;
      }, 0) / completedJobs.length : 0;

    const avgWaitTime = completedJobs.length > 0 ? 
      completedJobs.reduce((sum: number, job: Job) => {
        if (job.startedAt) {
          return sum + (job.startedAt.getTime() - job.createdAt.getTime());
        }
        return sum;
      }, 0) / completedJobs.length : 0;

    const successRate = (completedJobs.length + failedJobs.length) > 0 ?
      completedJobs.length / (completedJobs.length + failedJobs.length) : 0;

    // Retry analysis
    const jobsWithRetries = filteredJobs.filter((j: Job) => j.attempts > 1);
    const avgRetries = filteredJobs.length > 0 ?
      filteredJobs.reduce((sum: number, job: Job) => sum + (job.attempts - 1), 0) / filteredJobs.length : 0;

    // Error analysis
    const errorsByType = failedJobs.reduce((acc: Record<string, number>, job: Job) => {
      const errorType = job.lastError?.split(':')[0] || 'Unknown';
      acc[errorType] = (acc[errorType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Queue health indicators
    const healthIndicators = {
      queueBacklog: jobsByStatus.waiting + jobsByStatus.delayed,
      stuckJobs: filteredJobs.filter((job: Job) => 
        job.status === 'active' && 
        job.startedAt && 
        (Date.now() - job.startedAt.getTime()) > 3600000
      ).length,
      highErrorRate: (failedJobs.length / Math.max(1, filteredJobs.length)) > 0.1,
      highLatency: avgWaitTime > 300000 // 5 minutes
    };

    // Optional histogram data
    let histogram = null;
    if (queryParams.includeHistogram) {
      const buckets = 24; // Hours or other time divisions
      const bucketSize = timeRangeMs / buckets;
      
      histogram = Array.from({ length: buckets }, (_, i) => {
        const bucketStart = new Date(cutoffTime.getTime() + i * bucketSize);
        const bucketEnd = new Date(bucketStart.getTime() + bucketSize);
        
        const bucketJobs = filteredJobs.filter((job: Job) => 
          job.createdAt >= bucketStart && job.createdAt < bucketEnd
        );
        
        return {
          timestamp: bucketStart.toISOString(),
          total: bucketJobs.length,
          completed: bucketJobs.filter((j: Job) => j.status === 'completed').length,
          failed: bucketJobs.filter((j: Job) => j.status === 'failed').length,
          avgProcessingTime: bucketJobs.length > 0 ?
            bucketJobs.filter((j: Job) => j.startedAt && j.completedAt)
              .reduce((sum: number, job: Job) => {
                return sum + (job.completedAt!.getTime() - job.startedAt!.getTime());
              }, 0) / Math.max(1, bucketJobs.filter((j: Job) => j.startedAt && j.completedAt).length) : 0
        };
      });
    }

    // Compile comprehensive metrics response
    const metricsResponse = {
      current: currentMetrics,
      period: {
        timeRange: queryParams.timeRange,
        startTime: cutoffTime.toISOString(),
        endTime: new Date().toISOString(),
        totalJobs: filteredJobs.length
      },
      breakdown: {
        byStatus: jobsByStatus,
        byType: jobsByType,
        byPriority: jobsByPriority
      },
      performance: {
        avgProcessingTime: Math.round(avgProcessingTime),
        avgWaitTime: Math.round(avgWaitTime),
        successRate: Math.round(successRate * 1000) / 10, // Percentage with 1 decimal
        throughput: completedJobs.length / (timeRangeMs / (60 * 60 * 1000)), // Jobs per hour
        avgRetries: Math.round(avgRetries * 100) / 100
      },
      errors: {
        totalFailed: failedJobs.length,
        failureRate: Math.round((failedJobs.length / Math.max(1, filteredJobs.length)) * 1000) / 10,
        errorsByType,
        jobsWithRetries: jobsWithRetries.length
      },
      health: {
        status: Object.values(healthIndicators).some(Boolean) ? 'warning' : 'healthy',
        indicators: healthIndicators,
        recommendations: [
          ...(healthIndicators.queueBacklog > 100 ? ['Consider increasing concurrency'] : []),
          ...(healthIndicators.stuckJobs > 0 ? [`${healthIndicators.stuckJobs} jobs appear stuck`] : []),
          ...(healthIndicators.highErrorRate ? ['High error rate detected - investigate failing jobs'] : []),
          ...(healthIndicators.highLatency ? ['High queue latency - consider optimizing job handlers'] : [])
        ]
      },
      ...(histogram && { histogram })
    };

    return NextResponse.json<ApiResponse<typeof metricsResponse>>({
      success: true,
      data: metricsResponse
    });

  } catch (error) {
    logger.error('Job metrics API error', error instanceof Error ? error : new Error(String(error)));

    if (error instanceof z.ZodError) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: `Invalid query parameters: ${error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
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