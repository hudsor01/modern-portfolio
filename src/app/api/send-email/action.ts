import { headers } from 'next/headers'
import { emailService, type ContactFormData } from '@/lib/email/email-service'
import { getClientIdentifier } from '@/lib/security/rate-limiter'

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
    // Get client IP for rate limiting using enhanced identifier
    const headersList = await headers()
    
    // Create a mock request object to use with getClientIdentifier
    const mockRequest = {
      headers: {
        get: (name: string) => headersList.get(name)
      }
    } as Request
    
    const clientIdentifier = getClientIdentifier(mockRequest)

    // Use the production-ready email service
    const result = await emailService.sendContactEmail(formData, clientIdentifier)

    return result
  } catch (error) {
    console.error('Contact form server action error:', error)
    
    return {
      success: false,
      error: 'An unexpected error occurred while processing your request'
    }
  }
}
