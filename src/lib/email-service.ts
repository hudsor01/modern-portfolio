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

/**
 * Non-PII summary of a send failure for contact_submissions.emailError. Resend
 * messages can echo the submitted addresses, so only the error name, HTTP
 * status and error code are kept, never the message text. Capped at 100 chars.
 */
function describeSendError(e: unknown): string {
  if (typeof e !== 'object' || e === null) return 'unknown'
  const { name, statusCode, code } = e as { name?: unknown; statusCode?: unknown; code?: unknown }
  const parts: string[] = []
  if (typeof name === 'string' && name) parts.push(name)
  if (typeof statusCode === 'number') parts.push(String(statusCode))
  if (typeof code === 'string' && code) parts.push(code)
  return (parts.join(' ') || 'unknown').slice(0, 100)
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

      // Honeypot: a filled trap field means a bot. The success response gives it no signal;
      // nothing is sent or stored. This sits on the single canonical send path so the server
      // action, the progressive action and POST /api/contact share it. The rate limit runs
      // first, so a bot still spends its allowance.
      if (typeof validatedData.honeypot === 'string' && validatedData.honeypot.length > 0) {
        emailLogger.warn('Contact form honeypot tripped; submission discarded')
        return { success: true }
      }

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
        sendError = describeSendError(thrown)
        // Summary only (name/statusCode/code): a Resend or network message can
        // echo the visitor's address, which must never reach Sentry.
        emailLogger.error(
          'Failed to send contact notification',
          new Error(`contact notification failed (${sendError})`)
        )
      }

      if (contactResult?.error) {
        sendError = describeSendError(contactResult.error)
        logger.error(
          'Failed to send contact notification',
          new Error(`contact notification failed (${sendError})`)
        )
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
      // The owner email is already delivered and the row is being stored, so an
      // auto-reply failure (a returned `{ error }` or a thrown network error)
      // must never fail the submission: the visitor would resubmit and create
      // duplicate emails and rows.
      const sendAutoReply = async () => {
        if (!autoReply) return
        try {
          const autoReplyResult = await resend.emails.send({
            from: `Richard Hudson <${FROM_EMAIL}>`,
            to: [validatedData.email],
            subject: 'Thank you for contacting Richard Hudson',
            react: AutoReplyEmail({ data: validatedData }),
            headers: { 'X-Auto-Reply': 'true' },
          })

          if (autoReplyResult.error) {
            emailLogger.warn('Failed to send auto-reply', {
              error: describeSendError(autoReplyResult.error),
            })
          } else {
            autoReplyEmailId = autoReplyResult.data?.id
          }
        } catch (thrown) {
          // Summary only: a thrown message could echo the visitor's address.
          emailLogger.warn('Failed to send auto-reply', {
            error: thrown instanceof Error ? thrown.name : 'unknown',
          })
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
