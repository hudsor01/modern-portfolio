'use server'

// Every export of a 'use server' file is a public endpoint, so helpers stay unexported.

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import * as Sentry from '@sentry/nextjs'
import { emailService } from '@/lib/email-service'
import { getClientIdentifierFromHeaders, getClientUserAgent } from '@/lib/api-request'
import { createContextLogger } from '@/lib/logger'
import type { ContactActionState, SubmitContactFormResult } from '@/types/forms'

const logger = createContextLogger('ContactAction')

const CONTACT_SENT_PATH = '/contact/sent'

const CONTACT_FIELDS = ['name', 'email', 'company', 'phone', 'message', 'honeypot'] as const

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

/**
 * Server Action for the progressive (no-JS / pre-hydration) contact form.
 * Bound via useActionState so React SSR renders a POST multipart form; the
 * hydrated path still calls submitContactForm.
 *
 * Success redirects (Post/Redirect/Get) to the static /contact/sent page. For a
 * progressive form submission Next answers redirect() with a 303, so the browser
 * follows with a GET and a refresh or Back/Forward can never re-POST (and resend)
 * the message. Errors still return state so /contact re-renders with them.
 */
export async function submitContactFormAction(
  _prevState: ContactActionState,
  formData: FormData
): Promise<ContactActionState> {
  if (!(formData instanceof FormData)) {
    return { status: 'error', success: false, error: 'Submission failed' }
  }

  // Pick known keys only: React adds $ACTION_* keys and the schema is strict.
  const data: Record<string, string> = {}
  for (const key of CONTACT_FIELDS) {
    const value = formData.get(key)
    if (typeof value === 'string') data[key] = value
  }

  const result = await runSubmission(data)
  if (result.success) {
    // redirect() throws, so it stays outside runSubmission's try/catch and its
    // Sentry wrapper.
    redirect(CONTACT_SENT_PATH)
  }

  // Echoed after runSubmission returns, outside withServerActionInstrumentation:
  // recordResponse:true would otherwise attach the typed values to Sentry events.
  const { honeypot: _honeypot, ...values } = data
  return { status: 'error', ...result, values }
}
