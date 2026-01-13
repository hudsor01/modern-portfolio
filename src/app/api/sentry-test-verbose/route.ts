import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'

/**
 * Verbose Sentry test - captures error and waits for confirmation
 */
export async function POST() {
  try {
    // Capture an error with explicit details
    const eventId = Sentry.captureException(
      new Error('VERBOSE TEST ERROR - If you see this in Sentry, everything works!'),
      {
        level: 'error',
        tags: {
          test: 'verbose',
          endpoint: '/api/sentry-test-verbose',
          timestamp: Date.now().toString(),
        },
        extra: {
          message: 'This is a test error to verify Sentry integration',
          project: 'modern-portfolio',
          environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT,
        },
      }
    )

    // Wait for Sentry to flush events (ensure they're sent before responding)
    await Sentry.flush(2000)

    return NextResponse.json({
      success: true,
      message: 'Error captured and sent to Sentry',
      eventId,
      nextSteps: [
        'Wait 30-60 seconds',
        'Go to https://sentry.thehudsonfam.com/organizations/sentry/issues/',
        'Look for: "VERBOSE TEST ERROR"',
        'Event ID: ' + eventId,
      ],
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send to Sentry',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
