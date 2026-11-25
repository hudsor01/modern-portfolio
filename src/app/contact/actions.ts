'use server'

// Every export of a 'use server' file is a public endpoint, so helpers stay unexported.

import { headers } from 'next/headers'
import * as Sentry from '@sentry/nextjs'
import { emailService } from '@/lib/email-service'
import { getClientIdentifierFromHeaders, getClientUserAgent } from '@/lib/api-request'
import { createContextLogger } from '@/lib/logger'
import type { SubmitContactFormResult } from '@/types/forms'

const logger = createContextLogger('ContactAction')

/**
 * Shared submission path for the hydrated and progressive entry points.
 * Delegates rate limiting, validation, and email rendering to emailService.
 * Uses the same identifier helper as the API route so rate-limit buckets
 * stay aligned across both entry points.
 */
async function runSubmission(formData: unknown): Promise<SubmitContactFormResult> {
  return Sentry.withServerActionInstrumentation(
    'submitContactForm',
    { recordResponse: true },
    async () => {
      try {
        const headersList = await headers()
        const clientId = getClientIdentifierFromHeaders(headersList)

        const result = await emailService.sendContactEmail(formData, clientId, {
          userAgent: getClientUserAgent(headersList),
        })

        if (result.success) {
          return {
            success: true,
            message: 'Form submitted successfully! I will get back to you soon.',
          }
        }

        if (result.validationErrors) {
          return {
            success: false,
            error: 'Please check your form and try again.',
            validationErrors: result.validationErrors,
          }
        }

        if (result.retryAfter !== undefined) {
          return {
            success: false,
            error: result.error ?? 'Too many submissions. Please try again later.',
            retryAfter: result.retryAfter,
          }
        }

        return { success: false, error: result.error ?? 'Submission failed' }
      } catch (error) {
        logger.error(
          'Contact form server action failed',
          error instanceof Error ? error : new Error(String(error))
        )
        return {
          success: false,
          error: 'An unexpected error occurred. Please try again later.',
        }
      }
    }
  )
}

/**
 * Server Action for contact form submission (hydrated path).
 * Delegates to the shared runSubmission.
 */
export async function submitContactForm(data: unknown): Promise<SubmitContactFormResult> {
  return runSubmission(data)
}
