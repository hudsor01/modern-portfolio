/**
 * Production-Ready Email Service
 * Handles email sending with proper error handling, rate limiting, and monitoring
 */

import { Resend } from 'resend'
import { z } from 'zod'
import { checkContactFormRateLimit } from './rate-limiter/helpers'
import { logger, createContextLogger } from '@/lib/logger'
import { stripCrlf } from '@/lib/sanitization'
import type { ContactFormData } from '@/types/api'
import { contactFormSchema } from '@/lib/schemas'
import { env } from '@/lib/env-validation'
import { ContactNotificationEmail } from '@/emails/contact-notification'
import { AutoReplyEmail } from '@/emails/auto-reply'

const emailLogger = createContextLogger('EmailService')

// Environment configuration
const RESEND_API_KEY = env.RESEND_API_KEY
const FROM_EMAIL = env.FROM_EMAIL
const TO_EMAIL = env.TO_EMAIL
const NODE_ENV = env.NODE_ENV

function buildContactSubject(data: ContactFormData): string {
  return data.subject
    ? `Portfolio Contact: ${stripCrlf(data.subject)}`
    : `Portfolio Contact from ${stripCrlf(data.name)}`
}

// Email service class
export class EmailService {
  private resend: Resend | null = null
  private isProduction: boolean

  constructor() {
    this.isProduction = NODE_ENV === 'production'

    if (RESEND_API_KEY && RESEND_API_KEY !== 'mock_api_key_for_development') {
      this.resend = new Resend(RESEND_API_KEY)
    }
  }

  async validateData(data: unknown): Promise<ContactFormData> {
    return contactFormSchema.parse(data)
  }

  async sendContactEmail(
    data: unknown,
    clientIP?: string,
    options: { autoReply?: boolean } = {}
  ): Promise<EmailServiceResult> {
    const { autoReply = true } = options

    try {
      // Rate limiting (cheap; runs before any validation work)
      const identifier = clientIP || 'unknown'
      const rateCheck = checkContactFormRateLimit(identifier)

      if (!rateCheck.allowed) {
        return {
          success: false,
          error: rateCheck.blocked
            ? 'Account temporarily blocked due to excessive attempts'
            : 'Rate limit exceeded',
          retryAfter: rateCheck.retryAfter,
        }
      }

      // Validate data
      const validatedData = await this.validateData(data)

      if (!this.resend) {
        return this.handleMockEmail(validatedData)
      }

      const submittedAt = new Date().toISOString()

      const contactResult = await this.resend.emails.send({
        from: `Portfolio Contact <${FROM_EMAIL}>`,
        to: [TO_EMAIL],
        subject: buildContactSubject(validatedData),
        react: ContactNotificationEmail({ data: validatedData, submittedAt }),
        replyTo: validatedData.email,
        headers: {
          'X-Contact-Form': 'portfolio',
          'X-Contact-Name': stripCrlf(validatedData.name),
        },
      })

      if (contactResult.error) {
        // Resend's error is an object ({ message, name, statusCode }); String()
        // would stringify it to "[object Object]" and lose the reason. Keep the
        // human-readable message on the Error and the full object as context.
        logger.error(
          'Failed to send contact notification',
          new Error(contactResult.error.message),
          {
            resendError: contactResult.error,
          }
        )
        return {
          success: false,
          error: 'Failed to send notification email',
        }
      }

      let autoReplyEmailId: string | undefined
      if (autoReply) {
        const autoReplyResult = await this.resend.emails.send({
          from: `Richard Hudson <${FROM_EMAIL}>`,
          to: [validatedData.email],
          subject: 'Thank you for contacting Richard Hudson',
          react: AutoReplyEmail({ data: validatedData }),
          headers: { 'X-Auto-Reply': 'true' },
        })

        // Auto-reply failure is not critical
        if (autoReplyResult.error) {
          emailLogger.warn('Failed to send auto-reply', { resendError: autoReplyResult.error })
        } else {
          autoReplyEmailId = autoReplyResult.data?.id
        }
      }

      return {
        success: true,
        data: {
          contactEmailId: contactResult.data?.id,
          autoReplyEmailId,
        },
      }
    } catch (error) {
      emailLogger.error(
        'Email service error',
        error instanceof Error ? error : new Error(String(error))
      )

      if (error instanceof z.ZodError) {
        const rawFieldErrors = error.flatten().fieldErrors
        const validationErrors: Record<string, string[]> = {}

        for (const key in rawFieldErrors) {
          if (Object.hasOwn(rawFieldErrors, key)) {
            const errorMessages = rawFieldErrors[key as keyof typeof rawFieldErrors]
            if (errorMessages && Array.isArray(errorMessages)) {
              validationErrors[key] = errorMessages
            }
          }
        }

        return {
          success: false,
          error: 'Validation error',
          validationErrors,
        }
      }

      return {
        success: false,
        error: 'An unexpected error occurred',
      }
    }
  }

  private async handleMockEmail(_data: ContactFormData): Promise<EmailServiceResult> {
    if (this.isProduction) {
      emailLogger.error(
        'Email service not configured in production',
        new Error('Resend API key not configured')
      )
      return {
        success: false,
        error: 'Email service not available',
      }
    }

    return {
      success: true,
      data: {
        contactEmailId: 'mock-contact-id',
        autoReplyEmailId: 'mock-autoreply-id',
      },
    }
  }
}

// Export types
export interface EmailServiceResult {
  success: boolean
  error?: string
  retryAfter?: number
  validationErrors?: Record<string, string[]>
  data?: {
    contactEmailId?: string
    autoReplyEmailId?: string
  }
}

// Singleton instance
export const emailService = new EmailService()
