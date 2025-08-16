/**
 * Centralized API validation using Zod
 * Replaces all custom validation patterns
 */

import { z } from 'zod'

// Contact form validation schema
export const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  email: z.string().email('Valid email is required').trim(),
  subject: z.string().min(1, 'Subject is required').trim(),
  message: z.string().min(1, 'Message is required').trim(),
})

export type ContactFormData = z.infer<typeof contactFormSchema>

// Email validation schema  
export const emailSchema = z.object({
  to: z.string().email('Valid recipient email is required'),
  subject: z.string().min(1, 'Subject is required'),
  html: z.string().min(1, 'Email content is required'),
  text: z.string().optional(),
  from: z.string().email('Valid sender email is required').optional(),
})

export type EmailData = z.infer<typeof emailSchema>

// Generic request validation
export const requestMetadataSchema = z.object({
  userAgent: z.string().optional(),
  ip: z.string().optional(),
  path: z.string().optional(),
  timestamp: z.number().optional(),
})

export type RequestMetadata = z.infer<typeof requestMetadataSchema>

// API response schemas
export const apiErrorSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  error: z.string(),
  details: z.record(z.string(), z.string()).optional(),
  rateLimitInfo: z.object({
    remaining: z.number().optional(),
    resetTime: z.number().optional(),
    retryAfter: z.number().optional(),
    blocked: z.boolean().optional(),
  }).optional(),
})

export const apiSuccessSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: z.union([z.record(z.string(), z.unknown()), z.string(), z.number(), z.boolean()]).optional(),
  rateLimitInfo: z.object({
    remaining: z.number().optional(),
    resetTime: z.number().optional(),
  }).optional(),
})

export const apiResponseSchema = z.union([apiErrorSchema, apiSuccessSchema])

export type ApiError = z.infer<typeof apiErrorSchema>
export type ApiSuccess = z.infer<typeof apiSuccessSchema>
export type ApiResponse = z.infer<typeof apiResponseSchema>

// Validation error class
export class ValidationError extends Error {
  details: Record<string, string>

  constructor(message: string, details: Record<string, string>) {
    super(message)
    this.name = 'ValidationError'
    this.details = details
  }
}

// Validation helper functions
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const details: Record<string, string> = {}
      error.issues.forEach((err: z.ZodIssue) => {
        const path = err.path.join('.')
        details[path] = err.message
      })
      throw new ValidationError('Validation failed', details)
    }
    throw error
  }
}

export function createApiError(
  message: string, 
  error: string, 
  details?: Record<string, string>,
  rateLimitInfo?: ApiError['rateLimitInfo']
): ApiError {
  return {
    success: false,
    message,
    error,
    ...(details && { details }),
    ...(rateLimitInfo && { rateLimitInfo }),
  }
}

export function createApiSuccess(
  message: string,
  data?: Record<string, unknown> | string | number | boolean,
  rateLimitInfo?: ApiSuccess['rateLimitInfo']
): ApiSuccess {
  return {
    success: true,
    message,
    ...(data && { data }),
    ...(rateLimitInfo && { rateLimitInfo }),
  }
}