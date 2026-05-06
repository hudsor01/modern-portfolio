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
  const isValid = await validateCSRFToken(csrfToken ?? undefined)

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
