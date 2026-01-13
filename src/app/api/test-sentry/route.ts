import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'

/**
 * Test endpoint to verify Sentry integration
 * GET /api/test-sentry - Returns success message and captures test event
 * POST /api/test-sentry - Triggers an error to test error tracking
 */
export async function GET() {
  // Capture a test message
  Sentry.captureMessage('Test message from modern-portfolio', 'info')

  return NextResponse.json({
    success: true,
    message: 'Test message sent to Sentry',
    timestamp: new Date().toISOString(),
  })
}

export async function POST() {
  try {
    // Intentionally throw an error to test error tracking
    throw new Error('Test error from modern-portfolio API')
  } catch (error) {
    // Capture the error with context
    Sentry.captureException(error, {
      tags: {
        endpoint: '/api/test-sentry',
        method: 'POST',
      },
      extra: {
        timestamp: new Date().toISOString(),
      },
    })

    return NextResponse.json(
      {
        success: false,
        error: 'Test error captured by Sentry',
        message: 'Check your Sentry dashboard for the error',
      },
      { status: 500 }
    )
  }
}
