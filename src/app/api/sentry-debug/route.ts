import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'

/**
 * Debug endpoint to check Sentry configuration
 */
export async function GET() {
  const client = Sentry.getClient()
  const options = client?.getOptions()

  return NextResponse.json({
    sentryConfigured: Boolean(client),
    dsn: options?.dsn ? 'SET (hidden for security)' : 'NOT SET',
    dsnHost: options?.dsn ? new URL(options.dsn).host : null,
    enabled: options?.enabled ?? false,
    environment: options?.environment,
    tracesSampleRate: options?.tracesSampleRate,
    replaysSessionSampleRate: options?.replaysSessionSampleRate,
    replaysOnErrorSampleRate: options?.replaysOnErrorSampleRate,
    integrations: options?.integrations?.length ?? 0,
    envVars: {
      NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN ? 'SET' : 'NOT SET',
      SENTRY_DSN: process.env.SENTRY_DSN ? 'SET' : 'NOT SET',
      NEXT_PUBLIC_SENTRY_ENVIRONMENT: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || 'not set',
      NODE_ENV: process.env.NODE_ENV,
    },
  })
}
