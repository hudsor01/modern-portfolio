import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { 
  checkEnhancedContactFormRateLimit
} from '@/lib/security/enhanced-rate-limiter'
import {
  contactFormSchema,
  validateRequest,
  ValidationError,
  createApiError,
  createApiSuccess,
  getClientIdentifier,
  getRequestMetadata,
  parseRequestBody,
  createResponseHeaders,
  logApiRequest,
  logApiResponse,
} from '@/lib/api'

// Using centralized ApiResponse type

// Using centralized ValidationError class

// Using centralized Zod validation

// Using centralized client identification

// Initialize Resend lazily to avoid build-time errors
let resend: Resend | null = null

function getResendClient(): Resend {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured')
    }
    resend = new Resend(process.env.RESEND_API_KEY)
  }
  return resend
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const clientId = getClientIdentifier(request)
  const metadata = getRequestMetadata(request)
  
  logApiRequest('POST', '/api/contact', clientId, metadata)
  
  try {
    // Enhanced rate limiting check first
    const rateLimitResult = checkEnhancedContactFormRateLimit(clientId, {
      userAgent: metadata.userAgent,
      path: '/api/contact'
    })

    if (!rateLimitResult.allowed) {
      const response = createApiError(
        rateLimitResult.reason === 'penalty_block' 
          ? 'Account temporarily blocked due to excessive attempts'
          : 'Too many contact form submissions. Please try again later.',
        'RATE_LIMIT_EXCEEDED',
        undefined,
        {
          retryAfter: rateLimitResult.retryAfter,
          resetTime: rateLimitResult.resetTime,
          blocked: rateLimitResult.blocked
        }
      )

      const headers = createResponseHeaders({
        limit: 3,
        remaining: 0,
        resetTime: rateLimitResult.resetTime,
        retryAfter: rateLimitResult.retryAfter,
      })

      logApiResponse('POST', '/api/contact', clientId, 429, false, Date.now() - startTime)
      return NextResponse.json(response, { status: 429, headers })
    }

    // Parse and validate request body
    const body = await parseRequestBody(request)
    const formData = validateRequest(contactFormSchema, body)

    // Send email using Resend
    const { name, email, subject, message } = formData

    await getResendClient().emails.send({
      from: 'Portfolio Contact <hello@richardwhudsonjr.com>',
      to: process.env.CONTACT_EMAIL || 'hudsor01@icloud.com',
      subject: `${subject} - from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
      html: `
        <div>
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
      `,
    })

    const response = createApiSuccess(
      'Form submitted successfully',
      undefined,
      {
        remaining: rateLimitResult.remaining,
        resetTime: rateLimitResult.resetTime
      }
    )

    const headers = createResponseHeaders({
      limit: 3,
      remaining: rateLimitResult.remaining,
      resetTime: rateLimitResult.resetTime,
    })

    logApiResponse('POST', '/api/contact', clientId, 200, true, Date.now() - startTime)
    return NextResponse.json(response, { status: 200, headers })
    
  } catch (error) {
    const isValidationError = error instanceof ValidationError
    const status = isValidationError ? 400 : 500
    
    const response = createApiError(
      isValidationError ? 'Validation failed' : 'Error processing form',
      isValidationError ? 'VALIDATION_ERROR' : 'INTERNAL_ERROR',
      isValidationError ? error.details : undefined
    )

    logApiResponse('POST', '/api/contact', clientId, status, false, Date.now() - startTime, {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    
    return NextResponse.json(response, { status })
  }
}
