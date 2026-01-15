import { headers } from 'next/headers'
import { emailService } from '@/lib/email-service'
import type { ContactFormData } from '@/types/api'
import { getClientIdentifier } from '@/lib/rate-limiter'
import { createContextLogger } from '@/lib/logger';

const logger = createContextLogger('SendemailAPI');

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
    logger.error('Contact form server action error:', error instanceof Error ? error : new Error(String(error)))
    
    return {
      success: false,
      error: 'An unexpected error occurred while processing your request'
    }
  }
}
