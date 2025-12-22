import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { db } from '@/lib/db'
import {
  checkEnhancedContactFormRateLimit
} from '@/lib/security/enhanced-rate-limiter'
import { escapeHtml } from '@/lib/security/html-escape'
import { validateCSRFToken } from '@/lib/security/csrf-protection'
import {
  logRateLimitExceeded,
  logCSRFFailure,
} from '@/lib/security/security-event-logger'
import { createContextLogger } from '@/lib/monitoring/logger'
import {
  validateRequest,
  ValidationError,
  createApiError,
  createApiSuccess,
  contactFormSchema,
} from '@/lib/validations/unified-schemas'
import {
  getClientIdentifier,
  getRequestMetadata,
  parseRequestBody,
  createResponseHeaders,
  logApiRequest,
  logApiResponse,
} from '@/lib/api/utils'

const logger = createContextLogger('ContactAPI')

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

// Using singleton Prisma client from @/lib/db

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const clientId = getClientIdentifier(request)
  const metadata = getRequestMetadata(request)

  logApiRequest('POST', '/api/contact', clientId, metadata)

  let submission: { id: string; email: string } | undefined

  try {
    // CSRF token validation
    const csrfToken = request.headers.get('x-csrf-token')
    const isCSRFValid = await validateCSRFToken(csrfToken ?? undefined)

    if (!isCSRFValid) {
      logger.warn('CSRF validation failed for contact form', { clientId })

      // Log security event (non-blocking)
      void logCSRFFailure(clientId, '/api/contact', {
        ipAddress: clientId,
        userAgent: metadata.userAgent,
      })

      const response = createApiError(
        'Security validation failed. Please refresh and try again.',
        'CSRF_VALIDATION_FAILED',
        undefined
      )

      logApiResponse('POST', '/api/contact', clientId, 403, false, Date.now() - startTime)
      return NextResponse.json(response, { status: 403 })
    }

    // Enhanced rate limiting check
    const rateLimitResult = checkEnhancedContactFormRateLimit(clientId, {
      userAgent: metadata.userAgent,
      path: '/api/contact'
    })

    if (!rateLimitResult.allowed) {
      // Log security event (non-blocking)
      void logRateLimitExceeded(clientId, '/api/contact', {
        ipAddress: clientId,
        userAgent: metadata.userAgent,
        retryAfter: rateLimitResult.retryAfter,
        reason: rateLimitResult.reason,
      })

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

    // Extract form data
    const { name, email, subject, message } = formData

    // Save to database first (fail fast on DB errors)
    submission = await db.contactSubmission.create({
      data: {
        name,
        email,
        subject,
        message,
        ipAddress: clientId,
        userAgent: metadata.userAgent,
        referer: request.headers.get('referer'),
      }
    })

    logger.info('Contact form submission saved to database', {
      submissionId: submission.id,
      email: submission.email
    })

    // Validate that CONTACT_EMAIL is configured
    const contactEmail = process.env.CONTACT_EMAIL
    if (!contactEmail) {
      logger.error('CONTACT_EMAIL environment variable not configured')

      // Update submission with error
      await db.contactSubmission.update({
        where: { id: submission.id },
        data: {
          emailSent: false,
          emailError: 'CONTACT_EMAIL not configured'
        }
      })

      return NextResponse.json(
        createApiError(
          'Email service misconfigured. Please try again later.',
          'SERVICE_ERROR',
          undefined
        ),
        { status: 500 }
      )
    }

    // Send email using Resend
    const emailResult = await getResendClient().emails.send({
      from: 'Portfolio Contact <hello@richardwhudsonjr.com>',
      to: contactEmail,
      subject: `${escapeHtml(subject)} - from ${escapeHtml(name)}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
      html: `
        <div>
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
        </div>
      `,
    })

    // Update submission with email result
    await db.contactSubmission.update({
      where: { id: submission.id },
      data: {
        emailSent: true,
        emailId: emailResult.data?.id || null,
      }
    })

    logger.info('Email sent successfully', {
      submissionId: submission.id,
      emailId: emailResult.data?.id
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

    // If submission was created but email failed, update the database with error
    if (!isValidationError && typeof submission !== 'undefined') {
      try {
        await db.contactSubmission.update({
          where: { id: submission.id },
          data: {
            emailSent: false,
            emailError: error instanceof Error ? error.message : 'Unknown error sending email'
          }
        })
        logger.warn('Email send failed but submission saved to database', {
          submissionId: submission.id,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      } catch (dbError) {
        logger.error('Failed to update submission with email error', {
          error: dbError instanceof Error ? dbError.message : 'Unknown DB error'
        })
      }
    }

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
