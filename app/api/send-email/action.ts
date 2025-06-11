import { headers } from 'next/headers'
import { emailService, type ContactFormData } from '@/lib/email/email-service'

/**
 * Production-Ready Contact Email Server Action
 * Handles contact form submissions with proper validation, rate limiting, and error handling
 */
export async function sendContactEmail(formData: ContactFormData) {
  try {
    // Get client IP for rate limiting
    const headersList = headers()
    const clientIP = headersList.get('x-forwarded-for') || 
                     headersList.get('x-real-ip') || 
                     'unknown'

    // Use the production-ready email service
    const result = await emailService.sendContactEmail(formData, clientIP)

    return result
  } catch (error) {
    console.error('Contact form server action error:', error)
    
    return {
      success: false,
      error: 'An unexpected error occurred while processing your request'
    }
  }
}
