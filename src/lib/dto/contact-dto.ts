/**
 * Contact Form Data Transfer Objects (DTOs)
 * Controls exactly what contact data is exposed and validated
 */
import 'server-only'
import { z } from 'zod'

// ============================================================================
// Validation Schema - Single source of truth
// ============================================================================

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(254, 'Email must be less than 254 characters')
    .trim()
    .toLowerCase(),
  subject: z
    .string()
    .min(1, 'Please select a subject')
    .max(200, 'Subject must be less than 200 characters')
    .trim(),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be less than 5000 characters')
    .trim(),
  company: z
    .string()
    .max(200, 'Company name must be less than 200 characters')
    .trim()
    .optional(),
  phone: z
    .string()
    .max(30, 'Phone number must be less than 30 characters')
    .regex(/^[\d\s+()-]*$/, 'Please enter a valid phone number')
    .trim()
    .optional()
    .or(z.literal('')),
  budget: z
    .string()
    .max(50, 'Budget selection invalid')
    .optional(),
  timeline: z
    .string()
    .max(50, 'Timeline selection invalid')
    .optional(),
})

export type ContactFormInput = z.infer<typeof contactFormSchema>

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

// ============================================================================
// Validation Helper
// ============================================================================

/**
 * Validate contact form input
 * Returns validated data or throws with validation errors
 */
export function validateContactForm(data: unknown): ContactFormInput {
  return contactFormSchema.parse(data)
}

/**
 * Safe validation that returns result instead of throwing
 */
export function safeValidateContactForm(data: unknown): {
  success: boolean
  data?: ContactFormInput
  errors?: z.ZodIssue[]
} {
  const result = contactFormSchema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  return { success: false, errors: result.error.issues }
}
