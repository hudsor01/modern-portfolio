import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { logger } from '@/lib/monitoring/logger'

export async function GET() {
  try {
    // Check database connectivity
    await db.$queryRaw`SELECT 1`

    // Check basic system health
    const healthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.bun_package_version || 'unknown',
      environment: process.env.NODE_ENV || 'development',
    }

    logger.info('Health check performed', { status: healthCheck.status })

    return NextResponse.json(healthCheck, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    logger.error('Health check failed', error instanceof Error ? error : new Error(String(error)))

    // Don't expose internal error details in production
    const errorResponse = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error:
        process.env.NODE_ENV === 'production'
          ? 'Health check failed'
          : error instanceof Error
            ? error.message
            : 'Unknown error',
      version: process.env.bun_package_version || 'unknown',
      environment: process.env.NODE_ENV || 'development',
    }

    return NextResponse.json(errorResponse, {
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json',
      },
    })
  }
}
