import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { env } from '@/lib/env-validation'
import { checkRateLimitOrRespond, RateLimitPresets } from '@/lib/api-rate-limit'

/**
 * Debug endpoint to check Sentry configuration.
 * Hidden in production (returns 404) so DSN host and env-var presence flags
 * aren't exposed to the public internet.
 */
export async function GET(request: NextRequest) {
  if (env.NODE_ENV === 'production') {
    return NextResponse.json(
      { success: false, error: 'Not found' },
      { status: 404 }
    )
  }

  const rateLimitResponse = checkRateLimitOrRespond(
    request,
    RateLimitPresets.read,
    '/api/sentry-debug',
    'GET'
  )
  if (rateLimitResponse) return rateLimitResponse

  const client = Sentry.getClient()
  const options = client?.getOptions()

  return NextResponse.json({
    sentryConfigured: Boolean(client),
    dsn: options?.dsn ? 'SET (hidden for security)' : 'NOT SET',
    dsnHost: options?.dsn ? new URL(options.dsn).host : null,
    enabled: options?.enabled ?? false,
    environment: options?.environment,
    tracesSampleRate: options?.tracesSampleRate,
    integrations: options?.integrations?.length ?? 0,
    envVars: {
      NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN ? 'SET' : 'NOT SET',
      SENTRY_DSN: process.env.SENTRY_DSN ? 'SET' : 'NOT SET',
      NEXT_PUBLIC_SENTRY_ENVIRONMENT: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || 'not set',
      NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE: process.env.NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE || 'not set',
      NEXT_PUBLIC_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE: process.env.NEXT_PUBLIC_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE || 'not set',
      NODE_ENV: process.env.NODE_ENV,
    },
  })
}
