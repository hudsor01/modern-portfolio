'use server'

import { z } from 'zod'
import { headers } from 'next/headers'
import { contactFormSchema } from '@/lib/validations/schemas'
import { emailService, type ContactFormData } from '@/lib/email/email-service'

type ContactFormResponse = {
  success: boolean
  message: string
  error?: string
  retryAfter?: number
}

export async function submitContactForm(
  formData: z.infer<typeof contactFormSchema>
): Promise<ContactFormResponse> {
  try {
    const headersList = await headers()
    const clientIP = headersList.get('x-forwarded-for') || 
                    headersList.get('x-real-ip') || 
                    'unknown'

    const validatedData = contactFormSchema.parse(formData)

    const emailData: ContactFormData = {
      name: validatedData.name,
      email: validatedData.email,
      message: validatedData.message,
    }

    const result = await emailService.sendContactEmail(emailData, clientIP)

    if (!result.success) {
      if (result.error === 'Rate limit exceeded') {
        return {
          success: false,
          message: 'Too many requests. Please try again later.',
          error: result.error,
          retryAfter: result.retryAfter
        }
      }

      if (result.validationErrors) {
        const errorMessages = Object.values(result.validationErrors).flat()
        return {
          success: false,
          message: 'Please check your form data',
          error: errorMessages.join(', ')
        }
      }

      return {
        success: false,
        message: 'Failed to send your message. Please try again.',
        error: result.error
      }
    }

    return {
      success: true,
      message: 'Your message has been sent successfully! I\'ll get back to you soon.',
    }

  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.issues.map((e: z.ZodIssue) => e.message).join(', ')
      
      return {
        success: false,
        message: 'Please check your form data',
        error: errorMessage,
      }
    }

    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      error: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
    }
  }
}