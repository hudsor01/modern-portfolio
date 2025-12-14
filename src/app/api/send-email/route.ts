import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail } from './action'
import { ContactFormSchema } from '@/lib/email/email-service'
import {
  validateRequest,
  ValidationError,
  createApiError,
} from '@/lib/api/validation'
import {
  getClientIdentifier,
  getRequestMetadata,
  parseRequestBody,
  logApiRequest,
  logApiResponse,
} from '@/lib/api/utils'
import { EnhancedRateLimiter } from '@/lib/security/enhanced-rate-limiter'
import { validateCSRFToken } from '@/lib/security/csrf-protection'
import { createContextLogger } from '@/lib/monitoring/logger'
import { z } from 'zod'

const logger = createContextLogger('SendEmailAPI')

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const clientId = getClientIdentifier(request)
  const metadata = getRequestMetadata(request)

  logApiRequest('POST', '/api/send-email', clientId, metadata)

  // Rate limiting: 5 emails per hour per client to prevent spam
  using rateLimiter = new EnhancedRateLimiter()

  const rateLimitResult = rateLimiter.checkLimit(clientId, {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxAttempts: 5,
    progressivePenalty: true,
    blockDuration: 10 * 60 * 1000, // 10 minutes
    adaptiveThreshold: true,
    antiAbuse: true,
    burstProtection: {
      enabled: false,
      burstWindow: 10 * 1000,
      maxBurstRequests: 5
    }
  }, {
    path: '/api/send-email',
    method: 'POST'
  })

  if (!rateLimitResult.allowed) {
    logApiResponse('POST', '/api/send-email', clientId, 429, false, Date.now() - startTime, {
      error: 'Rate limit exceeded',
      retryAfter: rateLimitResult.retryAfter
    })

    return NextResponse.json(
      createApiError(
        'Too many email requests. Please try again later.',
        'RATE_LIMIT_EXCEEDED'
      ),
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((rateLimitResult.retryAfter || 0) / 1000)),
          'X-RateLimit-Remaining': String(rateLimitResult.remaining || 0),
          'X-RateLimit-Reset': String(rateLimitResult.resetTime || 0),
        }
      }
    )
  }

  try {
    // CSRF token validation
    const csrfToken = request.headers.get('x-csrf-token')
    const isCSRFValid = await validateCSRFToken(csrfToken ?? undefined)

    if (!isCSRFValid) {
      logger.warn('CSRF validation failed for send-email', { clientId })
      const response = createApiError(
        'Security validation failed. Please refresh and try again.',
        'CSRF_VALIDATION_FAILED',
        undefined
      )

      logApiResponse('POST', '/api/send-email', clientId, 403, false, Date.now() - startTime)
      return NextResponse.json(response, { status: 403 })
    }

    // Parse and validate request body
    const body = await parseRequestBody(request)
    const validatedData = validateRequest(ContactFormSchema, body)
    
    const result = await sendContactEmail(validatedData)

    logApiResponse('POST', '/api/send-email', clientId, 200, true, Date.now() - startTime)
    return NextResponse.json(result)
    
  } catch (error) {
    const isValidationError = error instanceof ValidationError || error instanceof z.ZodError
    const status = isValidationError ? 400 : 500
    
    const response = createApiError(
      isValidationError ? 'Validation failed' : 'Failed to process request',
      isValidationError ? 'VALIDATION_ERROR' : 'INTERNAL_ERROR',
      isValidationError && error instanceof ValidationError ? error.details : undefined
    )

    logApiResponse('POST', '/api/send-email', clientId, status, false, Date.now() - startTime, {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    
    return NextResponse.json(response, { status })
  }
}
