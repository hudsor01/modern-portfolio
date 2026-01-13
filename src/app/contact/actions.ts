'use server'

import { headers } from 'next/headers'
import { Resend } from 'resend'
import { revalidatePath } from 'next/cache'
import { checkEnhancedContactFormRateLimit } from '@/lib/security/rate-limiter'
import { createContextLogger } from '@/lib/monitoring/logger'
import { contactFormSchema } from '@/lib/validations/schemas'
import { generateVisitorId } from '@/lib/interactions-helper'
import { escapeHtml } from '@/lib/security/sanitization'

const logger = createContextLogger('ContactFormAction')

// Initialize Resend
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

/**
 * Server Action for contact form submission
 * Handles validation, rate limiting, and email sending
 *
 * @param formData - Contact form data to submit
 * @returns Success or error response
 */
export async function submitContactForm(formData: unknown) {
  try {
    // Validate form data with Zod schema
    const validatedData = contactFormSchema.parse(formData)

    // Rate limiting check using IP-based identification
    const headersList = await headers()
    const forwarded = headersList.get('x-forwarded-for')
    const ip = (forwarded ? forwarded.split(/, /)[0] : headersList.get('x-real-ip')) || 'unknown'
    const userAgent = headersList.get('user-agent') || 'unknown'
    
    // Generate visitor ID from IP + user agent (same pattern as interactions)
    const clientId = await generateVisitorId(ip, userAgent)
    const rateLimitResult = checkEnhancedContactFormRateLimit(clientId, {
      userAgent,
      path: '/contact'
    })

    if (!rateLimitResult.allowed) {
      logger.warn('Rate limit exceeded for contact form', {
        email: validatedData.email,
        remaining: rateLimitResult.remaining
      })

      return {
        success: false,
        error: rateLimitResult.reason === 'penalty_block'
          ? 'Account temporarily blocked due to excessive attempts'
          : 'Too many contact form submissions. Please try again later.',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: rateLimitResult.retryAfter,
      }
    }

    // Validate that CONTACT_EMAIL is configured
    const contactEmail = process.env.CONTACT_EMAIL
    if (!contactEmail) {
      logger.error('CONTACT_EMAIL environment variable not configured')
      return {
        success: false,
        error: 'Email service misconfigured. Please try again later.',
        code: 'SERVICE_ERROR',
      }
    }

    // Send email using Resend
    const { name, email, message } = validatedData

    try {
      await getResendClient().emails.send({
        from: 'Portfolio Contact <hello@richardwhudsonjr.com>',
        to: contactEmail,
        replyTo: email,
        subject: `New Contact from ${escapeHtml(name)}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1e293b; border-bottom: 2px solid #3b82f6; padding-bottom: 8px;">New Contact Form Submission</h2>
            <p><strong>From:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
            <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin-top: 16px;">
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap;">${escapeHtml(message).replace(/\n/g, '<br>')}</p>
            </div>
          </div>
        `,
      })
    } catch (emailError) {
      logger.error('Failed to send email', emailError instanceof Error ? emailError : new Error(String(emailError)))
      return {
        success: false,
        error: 'Failed to send email. Please try again later.',
        code: 'EMAIL_SEND_ERROR',
      }
    }

    // Log successful submission
    logger.info('Contact form submitted successfully', {
      email: validatedData.email
    })

    // Revalidate contact page to clear any caches
    revalidatePath('/contact')

    return {
      success: true,
      message: 'Form submitted successfully! I will get back to you soon.',
      remaining: rateLimitResult.remaining,
    }
  } catch (error) {
    // Handle validation errors
    if (error instanceof Error && error.name === 'ZodError') {
      logger.warn('Form validation failed', { error: error.message })
      return {
        success: false,
        error: 'Please check your form and try again.',
        code: 'VALIDATION_ERROR',
      }
    }

    // Handle other errors
    logger.error('Unexpected error in contact form submission', error instanceof Error ? error : new Error(String(error)))
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again later.',
      code: 'INTERNAL_ERROR',
    }
  }
}
