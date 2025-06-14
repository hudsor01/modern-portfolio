import { headers } from 'next/headers'
import { emailService, type ContactFormData } from '@/lib/email/email-service'

/**
 * Production-Ready Contact Email Server Action
 * Handles contact form submissions with proper validation, rate limiting, and error handling
 */

interface SendContactEmailResult {
  success: boolean;
  error?: string;
  validationErrors?: Record<string, string[]>; // Added optional validationErrors
}

export async function sendContactEmail(formData: ContactFormData): Promise<SendContactEmailResult> {
  try {
    // Get client IP for rate limiting
    // Adding await based on typechecker feedback, though headers() from 'next/headers' is typically synchronous.
    // This suggests a potential issue with Next.js type definitions in this project.
    const headersList = await headers() 
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
