/**
 * Error Monitoring API Endpoint
 * Provides access to error logs, metrics, and monitoring data
 */

import { NextRequest, NextResponse } from 'next/server';
import { errorMonitor } from '@/lib/automation/error-monitoring';
import { z, ZodError } from 'zod';
import { createContextLogger } from '@/lib/monitoring/logger';
import type { ApiResponse } from '@/types/shared-api';

const logger = createContextLogger('ErrorMonitoringAPI');

// Query parameters validation
const ErrorQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(1000).default(50),
  offset: z.coerce.number().min(0).default(0),
  level: z.enum(['info', 'warn', 'error', 'critical']).optional(),
  category: z.enum(['job', 'api', 'webhook', 'system']).optional(),
  source: z.string().optional(),
  timeWindow: z.coerce.number().min(60000).max(7 * 24 * 60 * 60 * 1000).optional(), // 1 minute to 7 days
  search: z.string().optional(),
  format: z.enum(['json', 'csv']).default('json')
});

export async function GET(request: NextRequest) {
  try {
    // Check authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !isAuthorized(authHeader)) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Unauthorized - admin access required',
        data: null
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const queryParams = ErrorQuerySchema.parse({
      limit: searchParams.get('limit'),
      offset: searchParams.get('offset'),
      level: searchParams.get('level'),
      category: searchParams.get('category'),
      source: searchParams.get('source'),
      timeWindow: searchParams.get('timeWindow'),
      search: searchParams.get('search'),
      format: searchParams.get('format')
    });

    // Get errors with filtering
    const errorResult = errorMonitor.getErrors({
      limit: queryParams.limit,
      offset: queryParams.offset,
      level: queryParams.level,
      category: queryParams.category,
      source: queryParams.source,
      timeWindow: queryParams.timeWindow,
      search: queryParams.search
    });

    // Get metrics for the same time window
    const metrics = errorMonitor.getMetrics(queryParams.timeWindow);

    // Get health status
    const health = errorMonitor.getHealthStatus();

    // Handle CSV format
    if (queryParams.format === 'csv') {
      const csv = formatErrorsAsCSV(errorResult.events);
      return new Response(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="errors-${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    }

    // JSON response
    return NextResponse.json<ApiResponse<{
      errors: typeof errorResult;
      metrics: typeof metrics;
      health: typeof health;
      query: typeof queryParams;
    }>>({
      success: true,
      data: {
        errors: errorResult,
        metrics,
        health,
        query: queryParams
      }
    });

  } catch (error) {
    logger.error('Error monitoring API error', error instanceof Error ? error : new Error(String(error)));

    if (error instanceof ZodError) {
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

// POST endpoint for manual error reporting
const ManualErrorSchema = z.object({
  level: z.enum(['info', 'warn', 'error', 'critical']).default('error'),
  category: z.enum(['job', 'api', 'webhook', 'system']).default('system'),
  source: z.string(),
  message: z.string(),
  details: z.record(z.string(), z.unknown()).optional(),
  stack: z.string().optional(),
  jobId: z.string().optional(),
  requestId: z.string().optional(),
  userId: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    // Check authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !isAuthorized(authHeader)) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Unauthorized - admin access required',
        data: null
      }, { status: 401 });
    }

    const body = await request.json();
    const errorData = ManualErrorSchema.parse(body);

    // Log the error
    const loggedError = errorMonitor.logError({
      ...errorData,
      metadata: errorData.details
    });

    return NextResponse.json<ApiResponse<{
      id: string;
      timestamp: string;
      logged: boolean;
    }>>({
      success: true,
      message: 'Error logged successfully',
      data: {
        id: loggedError.id,
        timestamp: loggedError.timestamp.toISOString(),
        logged: true
      }
    });

  } catch (error) {
    logger.error('Manual error logging failed', error instanceof Error ? error : new Error(String(error)));

    if (error instanceof ZodError) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: `Invalid error data: ${error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
        data: null
      }, { status: 400 });
    }

    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to log error',
      data: null
    }, { status: 500 });
  }
}

// DELETE endpoint for clearing errors (admin only)
export async function DELETE(request: NextRequest) {
  try {
    // Check authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !isAuthorized(authHeader)) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Unauthorized - admin access required',
        data: null
      }, { status: 401 });
    }

    // Get confirmation parameter
    const { searchParams } = new URL(request.url);
    const confirm = searchParams.get('confirm');
    
    if (confirm !== 'true') {
      return NextResponse.json<ApiResponse<{
        message: string;
        confirmationRequired: boolean;
      }>>({
        success: false,
        error: 'Confirmation required to clear all errors',
        data: {
          message: 'Add ?confirm=true to the request to clear all errors',
          confirmationRequired: true
        }
      }, { status: 400 });
    }

    // Clear all errors
    errorMonitor.clearErrors();

    return NextResponse.json<ApiResponse<{
      cleared: boolean;
      timestamp: string;
    }>>({
      success: true,
      message: 'All errors cleared successfully',
      data: {
        cleared: true,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Error clearing failed', error instanceof Error ? error : new Error(String(error)));

    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to clear errors',
      data: null
    }, { status: 500 });
  }
}

function isAuthorized(authHeader: string): boolean {
  // In production, implement proper admin authentication
  const expectedKey = process.env.ADMIN_API_KEY || 'admin-dev-key';
  const providedKey = authHeader.replace('Bearer ', '');
  return providedKey === expectedKey;
}

interface ErrorEvent {
  id: string;
  timestamp: Date;
  level: string;
  category: string;
  source: string;
  message: string;
  jobId?: string;
  requestId?: string;
  userId?: string;
}

function formatErrorsAsCSV(errors: ErrorEvent[]): string {
  if (errors.length === 0) {
    return 'No errors found';
  }

  // CSV headers
  const headers = [
    'id',
    'timestamp',
    'level',
    'category',
    'source',
    'message',
    'jobId',
    'requestId',
    'userId'
  ];

  // CSV rows
  const rows = errors.map(error => [
    error.id,
    error.timestamp.toISOString(),
    error.level,
    error.category,
    error.source,
    `"${error.message.replace(/"/g, '""')}"`, // Escape quotes
    error.jobId || '',
    error.requestId || '',
    error.userId || ''
  ]);

  // Combine headers and rows
  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  
  return csvContent;
}