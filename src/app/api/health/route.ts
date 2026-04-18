import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { logger } from '@/lib/logger'

export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`

    logger.info('Health check performed', { status: 'healthy' })

    return NextResponse.json(
      {
        status: 'healthy',
        database: 'up',
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    logger.error('Health check failed', error instanceof Error ? error : new Error(String(error)))

    return NextResponse.json(
      {
        status: 'unhealthy',
        database: 'down',
        timestamp: new Date().toISOString(),
      },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Content-Type': 'application/json',
        },
      }
    )
  }
}
