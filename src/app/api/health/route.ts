import { NextResponse } from 'next/server'
import { sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { logger } from '@/lib/logger'

// Public endpoint, so the body states only liveness; the DB error goes to the logger.
export async function GET() {
  try {
    await db.execute(sql`SELECT 1`)

    logger.info('Health check performed', { status: 'ok' })

    return NextResponse.json({ status: 'ok' }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    logger.error('Health check failed', error instanceof Error ? error : new Error(String(error)))

    return NextResponse.json(
      { status: 'error' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    )
  }
}
