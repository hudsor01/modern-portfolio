/**
 * Contact Form Data Transfer Objects (DTOs)
 * Controls exactly what contact data is exposed and validated
 */
import 'server-only'
import { z } from 'zod'
import { contactFormSchema as baseContactFormSchema } from '@/lib/schemas'

// ============================================================================
// Validation Schema - Single source of truth
// ============================================================================

export const contactSubmissionSchema = baseContactFormSchema
  .extend({
    subject: z
      .string()
      .min(1, 'Please select a subject')
      .max(100, 'Subject must be less than 100 characters')
      .trim(),
    budget: z.string().max(50, 'Budget selection invalid').optional(),
    timeline: z.string().max(50, 'Timeline selection invalid').optional(),
  })
  .transform((data) => ({
    ...data,
    email: data.email.toLowerCase(),
  }))

export type ContactFormInput = z.infer<typeof contactSubmissionSchema>

// ============================================================================
// DTOs
// ============================================================================

/**
 * Validated contact form data ready for processing
 */
export interface ContactSubmissionDTO {
  name: string
  email: string
  subject: string
  message: string
  company: string | null
  phone: string | null
  budget: string | null
  timeline: string | null
  submittedAt: string
  clientIP: string | null
}

/**
 * Response DTO for contact form submission
 */
export interface ContactResponseDTO {
  success: boolean
  message: string
  submissionId?: string
}

// ============================================================================
// Transformation Functions
// ============================================================================

/**
 * Transform validated input to submission DTO
 */
export function toContactSubmissionDTO(
  input: ContactFormInput,
  clientIP: string | null = null
): ContactSubmissionDTO {
  return {
    name: input.name,
    email: input.email,
    subject: input.subject,
    message: input.message,
    company: input.company || null,
    phone: input.phone || null,
    budget: input.budget || null,
    timeline: input.timeline || null,
    submittedAt: new Date().toISOString(),
    clientIP,
  }
}

/**
 * Create success response DTO
 */
export function createSuccessResponse(submissionId?: string): ContactResponseDTO {
  return {
    success: true,
    message: 'Thank you for your message. I will get back to you within 24 hours.',
    submissionId,
  }
}

/**
 * Create error response DTO
 */
export function createErrorResponse(message: string): ContactResponseDTO {
  return {
    success: false,
    message,
  }
}

