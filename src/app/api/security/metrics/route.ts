import { type NextRequest, NextResponse } from 'next/server'
import { getRateLimiter } from '@/lib/rate-limiter/store'
import { env } from '@/lib/env-validation'
import { timingSafeEqualString } from '@/lib/timing-safe-equal'

export async function GET(request: NextRequest) {
  // If METRICS_API_TOKEN is not configured, endpoint is disabled
  if (!env.METRICS_API_TOKEN) {
    return NextResponse.json({ error: 'Metrics endpoint not configured' }, { status: 403 })
  }

  const token = request.headers.get('X-Metrics-Token')

  if (!token || !timingSafeEqualString(token, env.METRICS_API_TOKEN)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const metrics = getRateLimiter().exportMetrics()

  return NextResponse.json(metrics, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  })
}
