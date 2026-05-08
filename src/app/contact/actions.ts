'use server'

import { headers } from 'next/headers'
import * as Sentry from '@sentry/nextjs'
import { z } from 'zod'
import { contactFormSchema } from '@/lib/schemas'
import { emailService } from '@/lib/email-service'
import { createContextLogger } from '@/lib/logger'

const logger = createContextLogger('ContactAction')

/**
 * Server Action for contact form submission.
 * Delegates rate limiting, validation, and email rendering to emailService.
 */
export async function submitContactForm(formData: unknown) {
  return Sentry.withServerActionInstrumentation(
    'submitContactForm',
    { recordResponse: true },
    async () => {
      try {
        const validatedData = contactFormSchema.parse(formData)

        const headersList = await headers()
        const forwarded = headersList.get('x-forwarded-for')
        const ip =
          (forwarded ? forwarded.split(/, /)[0] : headersList.get('x-real-ip')) || 'unknown'

        const result = await emailService.sendContactEmail(validatedData, ip)

        if (!result.success) {
          return { success: false, error: result.error ?? 'Submission failed' }
        }

        return {
          success: true,
          message: 'Form submitted successfully! I will get back to you soon.',
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          return { success: false, error: 'Please check your form and try again.' }
        }

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
