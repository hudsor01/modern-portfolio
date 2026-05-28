/**
 * API CSRF Validation — validateCSRFOrRespond
 * Integrates with csrf-protection token validation.
 */

import { type NextRequest, NextResponse } from 'next/server'
import { validateCSRFToken } from '@/lib/csrf-protection'
import { logger } from '@/lib/logger'
import { getClientIdentifier } from './api-request'

// ============================================================================
// CSRF GUARD
// ============================================================================

/**
 * Validate CSRF token and return error response if invalid.
 * Returns null if valid, NextResponse if invalid.
 */
export async function validateCSRFOrRespond(
  request: NextRequest,
  logContext?: string
): Promise<NextResponse | null> {
  const csrfToken = request.headers.get('x-csrf-token')

  // Belt-and-suspenders: any throw inside validateCSRFToken (e.g. cookies()
  // failing in a static-render context, or a future regression in the token
  // comparison) collapses to a clean 403 rather than escaping to a 500 across
  // all five mutation route handlers.
  let isValid = false
  try {
    isValid = await validateCSRFToken(csrfToken ?? undefined)
  } catch (error) {
    logger.warn(`CSRF validation threw${logContext ? `: ${logContext}` : ''}`, {
      clientId: getClientIdentifier(request),
      error: error instanceof Error ? error.message : String(error),
    })
  }

  if (!isValid) {
    if (logContext) {
      logger.warn(`CSRF validation failed: ${logContext}`, {
        clientId: getClientIdentifier(request),
      })
    }

    return NextResponse.json(
      {
        data: undefined as never,
        success: false,
        error: 'Security validation failed. Please refresh and try again.',
      },
      { status: 403 }
    )
  }

  return null
}
