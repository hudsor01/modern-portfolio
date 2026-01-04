import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { db } from '@/lib/db'
import {
  checkEnhancedContactFormRateLimit
} from '@/lib/security/rate-limiter'
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

    // Extract form data (subject removed - using default)
    const { name, email, company, phone, message } = formData
    const subject = 'Contact Form Inquiry' // Default subject for simplified form

    // Save to database first (fail fast on DB errors)
    submission = await db.contactSubmission.create({
      data: {
        name,
        email,
        company: company || null,
        phone: phone || null,
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

    // Build optional fields for email
    const companyLine = company ? `Company: ${company}\n` : ''
    const phoneLine = phone ? `Phone: ${phone}\n` : ''
    const companyHtml = company ? `<p><strong>Company:</strong> ${escapeHtml(company)}</p>` : ''
    const phoneHtml = phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ''

    // Send email using Resend
    const emailResult = await getResendClient().emails.send({
      from: 'Portfolio Contact <hello@richardwhudsonjr.com>',
      to: contactEmail,
      replyTo: email,
      subject: `New Contact from ${escapeHtml(name)}`,
      text: `Name: ${name}\nEmail: ${email}\n${companyLine}${phoneLine}\nMessage:\n${message}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e293b; border-bottom: 2px solid #3b82f6; padding-bottom: 8px;">New Contact Form Submission</h2>
          <p><strong>From:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
          ${companyHtml}
          ${phoneHtml}
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin-top: 16px;">
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${escapeHtml(message).replace(/\n/g, '<br>')}</p>
          </div>
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
