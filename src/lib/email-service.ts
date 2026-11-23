/**
 * Production-Ready Email Service
 * Handles email sending with proper error handling, rate limiting, and monitoring
 */

import { DrizzleQueryError } from 'drizzle-orm'
import { Resend } from 'resend'
import { z } from 'zod'
import { checkContactFormRateLimit } from './rate-limiter/helpers'
import { logger, createContextLogger } from '@/lib/logger'
import { stripCrlf } from '@/lib/sanitization'
import type { ContactFormData } from '@/types/api'
import { contactFormSchema } from '@/lib/schemas'
import { db } from '@/lib/db'
import { contactSubmissions } from '@/db/schema'
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

interface DeliveryStatus {
  emailSent: boolean
  emailId?: string
  emailError?: string
}

/** Row for contact_submissions: form fields + delivery status only (data minimization). */
export function buildContactSubmissionRow(data: ContactFormData, delivery: DeliveryStatus) {
  return {
    name: data.name,
    email: data.email,
    company: data.company || null,
    phone: data.phone || null,
    message: data.message,
    emailSent: delivery.emailSent,
    emailId: delivery.emailId ?? null,
    emailError: delivery.emailError ?? null,
  }
}

/**
 * Builds a PII-free Error from a DB failure. DrizzleQueryError messages embed
 * the bound params (the submission), so only SQLSTATE / class name is kept.
 */
export function toSafeStorageError(error: unknown): Error {
  let code: string | undefined
  if (error instanceof DrizzleQueryError) {
    const causeCode = (error.cause as { code?: unknown } | undefined)?.code
    if (typeof causeCode === 'string') code = causeCode
  }
  if (!code) {
    code = error instanceof Error ? error.constructor.name || 'unknown' : 'unknown'
  }
  return new Error(`contact_submissions insert failed (${code})`)
}

async function persistSubmission(data: ContactFormData, delivery: DeliveryStatus): Promise<void> {
  try {
    await db.insert(contactSubmissions).values(buildContactSubmissionRow(data, delivery))
  } catch (error) {
    emailLogger.error('Failed to store contact submission', toSafeStorageError(error))
  }
}

function describeSendError(e: unknown): string {
  const msg =
    typeof e === 'string'
      ? e
      : typeof (e as { message?: unknown })?.message === 'string'
        ? (e as { message: string }).message
        : 'unknown'
  return msg.slice(0, 500)
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
    options: { autoReply?: boolean; userAgent?: string } = {}
  ): Promise<EmailServiceResult> {
    const { autoReply = true, userAgent } = options

    try {
      // Rate limiting (cheap; runs before any validation work)
      const identifier = clientIP || 'unknown'
      // userAgent feeds suspicion scoring only. It must never reach the bucket
      // key: it is client-controlled, so varying it would hand out fresh 3/hr
      // allowances on demand. See getClientIdentifierFromHeaders.
      const rateCheck = checkContactFormRateLimit(identifier, { userAgent })

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

      let contactResult: Awaited<ReturnType<Resend['emails']['send']>> | undefined
      let sendError: string | undefined
      try {
        contactResult = await this.resend.emails.send({
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
      } catch (thrown) {
        emailLogger.error(
          'Failed to send contact notification',
          thrown instanceof Error ? thrown : new Error(String(thrown))
        )
        sendError = describeSendError(thrown)
      }

      if (contactResult?.error) {
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
        sendError = describeSendError(contactResult.error)
      }

      if (sendError !== undefined || !contactResult) {
        await persistSubmission(validatedData, {
          emailSent: false,
          emailError: sendError ?? 'unknown',
        })
        return {
          success: false,
          error: 'Failed to send notification email',
        }
      }

      const contactEmailId = contactResult.data?.id
      const resend = this.resend

      // DB latency overlaps the auto-reply; persistSubmission never rejects.
      const persisted = persistSubmission(validatedData, {
        emailSent: true,
        emailId: contactEmailId,
      })

      let autoReplyEmailId: string | undefined
      const sendAutoReply = async () => {
        if (!autoReply) return
        const autoReplyResult = await resend.emails.send({
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
      await Promise.all([persisted, sendAutoReply()])

      return {
        success: true,
        data: {
          contactEmailId,
          autoReplyEmailId,
        },
      }
    } catch (error) {
      emailLogger.error(
        'Email service error',
        error instanceof Error ? error : new Error(String(error))
      )

      if (error instanceof z.ZodError) {
        const rawFieldErrors = z.flattenError(error).fieldErrors
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
