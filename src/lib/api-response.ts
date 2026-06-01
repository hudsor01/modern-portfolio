import { NextResponse } from 'next/server'
import type { ZodError } from 'zod'
import { logger } from '@/lib/logger'

// Body shape specific to validationErrorResponse — the field-keyed {success,
// status, error, errors} envelope this helper returns. Local by design.
type ValidationErrorBody = {
  success: false
  status: number
  error: string
  errors: Record<string, string[]>
}

export function validationErrorResponse(error: ZodError): NextResponse<ValidationErrorBody> {
  const errors = error.issues.reduce(
    (acc: Record<string, string[]>, curr) => {
      // Get a safe string key from the path, defaulting to 'general'
      let key = 'general'

      if (curr.path.length > 0 && curr.path[0] !== undefined) {
        key = String(curr.path[0])
      }

      // Create a new object with the existing properties and the new array
      return {
        ...acc,
        [key]: [...(acc[key] || []), curr.message],
      }
    },
    {} as Record<string, string[]>
  )

  return NextResponse.json(
    {
      success: false,
      status: 400,
      error: 'Validation error',
      errors,
    },
    { status: 400 }
  )
}

/**
 * Generic error messages for production
 * Maps error types to user-friendly messages
 */
const PRODUCTION_ERROR_MESSAGES: Record<string, string> = {
  VALIDATION_ERROR: 'Invalid request data',
  DATABASE_ERROR: 'Service temporarily unavailable',
  EMAIL_ERROR: 'Failed to send email. Please try again later.',
  NETWORK_ERROR: 'Network error occurred',
  AUTH_ERROR: 'Authentication failed',
  DEFAULT: 'An unexpected error occurred',
}

/**
 * Log and sanitize error - combines logging with sanitization
 * Returns sanitized message for client while logging full error internally
 */
export function logAndSanitizeError(
  context: string,
  error: unknown,
  errorType: keyof typeof PRODUCTION_ERROR_MESSAGES = 'DEFAULT',
  additionalInfo?: Record<string, unknown>
): string {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error'

  // Always log full error internally
  logger.error(context, new Error(errorMessage), additionalInfo)

  // Return sanitized message for client
  const isDev = process.env.NODE_ENV === 'development'
  if (isDev) {
    return errorMessage
  }

  return PRODUCTION_ERROR_MESSAGES[errorType] ?? (PRODUCTION_ERROR_MESSAGES.DEFAULT as string)
}
