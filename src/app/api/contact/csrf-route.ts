import { NextRequest, NextResponse } from 'next/server'
import { createContextLogger } from '@/lib/logging/logger'
import { createNewCSRFToken, csrfProtectionMiddleware } from '@/lib/security/csrf-protection'

const logger = createContextLogger('ContactCSRFRoute')

/**
 * GET /api/contact/csrf
 * Get a new CSRF token for the contact form
 */
export async function GET(request: NextRequest) {
  try {
    logger.info('CSRF token requested')

    // Apply CSRF middleware (generates new token for GET)
    const { valid, token: _token, error } = await csrfProtectionMiddleware(request, [])

    if (!valid) {
      logger.warn('CSRF protection validation failed', { error })
      return NextResponse.json(
        { error: 'CSRF protection validation failed' },
        { status: 403 }
      )
    }

    // Generate a fresh token
    const newToken = await createNewCSRFToken()

    logger.info('CSRF token generated successfully')

    return NextResponse.json(
      { token: newToken },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    )
  } catch (error) {
    logger.error('CSRF token generation error', error instanceof Error ? error : new Error(String(error)))
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    )
  }
}
