'use server'

import { z } from 'zod'
import { headers } from 'next/headers'
import { contactFormSchema } from '@/lib/validation'
import { emailService, type ContactFormData } from '@/lib/email/email-service'
import { logger } from '@/lib/monitoring/logger'

// Define the response type
type ContactFormResponse = {
  success: boolean
  message: string
  error?: string
  retryAfter?: number
}

/**
 * Production-ready server action to handle contact form submissions
 * Integrates with email service, rate limiting, and monitoring
 */
export async function submitContactForm(
  formData: z.infer<typeof contactFormSchema>
): Promise<ContactFormResponse> {
  try {
    // Get client IP for rate limiting
    const headersList = await headers()
    const clientIP = headersList.get('x-forwarded-for') || 
                    headersList.get('x-real-ip') || 
                    'unknown'

    // Validate and transform form data to match email service schema
    const validatedData = contactFormSchema.parse(formData)
    
    const emailData: ContactFormData = {
      name: validatedData.name,
      email: validatedData.email,
      message: validatedData.message,
      subject: validatedData.subject,
      phone: validatedData.phone,
    }

    // Log submission attempt for monitoring
    logger.info('Contact form submission attempt', {
      email: validatedData.email,
      name: validatedData.name,
      clientIP,
      timestamp: new Date().toISOString()
    })

    // Send email using production-ready email service
    const result = await emailService.sendContactEmail(emailData, clientIP)

    if (!result.success) {
      logger.error('Contact form submission failed', undefined, {
        error: result.error,
        email: validatedData.email,
        clientIP
      })

      // Handle rate limiting
      if (result.error === 'Rate limit exceeded') {
        return {
          success: false,
          message: 'Too many requests. Please try again later.',
          error: result.error,
          retryAfter: result.retryAfter
        }
      }

      // Handle validation errors
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

    // Log successful submission
    logger.info('Contact form submission successful', {
      email: validatedData.email,
      emailIds: result.data,
      clientIP
    })

    return {
      success: true,
      message: 'Your message has been sent successfully! I\'ll get back to you soon.',
    }

  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map((e) => e.message).join(', ')
      logger.warn('Contact form validation error', {
        errors: error.errors,
        formData: JSON.stringify(formData)
      })
      
      return {
        success: false,
        message: 'Please check your form data',
        error: errorMessage,
      }
    }

    // Handle unexpected errors
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    
    logger.error('Contact form unexpected error', error instanceof Error ? error : undefined, {
      errorMessage,
      stack: error instanceof Error ? error.stack : undefined
    })

    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      error: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
    }
  }
}
