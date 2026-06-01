import { type NextRequest, NextResponse } from 'next/server'
import { createContextLogger } from '@/lib/logger'
import { csrfProtectionMiddleware } from '@/lib/csrf-protection'

const logger = createContextLogger('ContactCSRFRoute')

/**
 * GET /api/contact/csrf
 * Issue (or reuse) a CSRF token for the contact form.
 */
export async function GET(request: NextRequest) {
  try {
    logger.info('CSRF token requested')

    // The middleware issues a token for safe (GET) requests — minting + setting
    // the cookie only when absent, reusing the existing one otherwise (its
    // anti-rotation contract). Return that same token rather than minting a
    // second one, so each request generates and sets at most one token.
    const { valid, token, error } = await csrfProtectionMiddleware(request, [])

    if (!valid || !token) {
      logger.warn('CSRF protection validation failed', { error })
      return NextResponse.json({ error: 'CSRF protection validation failed' }, { status: 403 })
    }

    logger.info('CSRF token issued successfully')

    return NextResponse.json(
      { token },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    )
  } catch (error) {
    logger.error(
      'CSRF token generation error',
      error instanceof Error ? error : new Error(String(error))
    )
    return NextResponse.json({ error: 'Failed to generate CSRF token' }, { status: 500 })
  }
}
