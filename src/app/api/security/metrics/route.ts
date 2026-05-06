import { type NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { getRateLimiter } from '@/lib/rate-limiter/store'
import { env } from '@/lib/env-validation'

export async function GET(request: NextRequest) {
  // If METRICS_API_TOKEN is not configured, endpoint is disabled
  if (!env.METRICS_API_TOKEN) {
    return NextResponse.json({ error: 'Metrics endpoint not configured' }, { status: 403 })
  }

  const token = request.headers.get('X-Metrics-Token')

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  // Constant-time comparison to prevent timing attacks
  // timingSafeEqual throws if lengths differ, so check first
  const tokenBuffer = Buffer.from(token)
  const expectedBuffer = Buffer.from(env.METRICS_API_TOKEN)

  if (
    tokenBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(tokenBuffer, expectedBuffer)
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const metrics = getRateLimiter().exportMetrics()

  return NextResponse.json(metrics, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  })
}
