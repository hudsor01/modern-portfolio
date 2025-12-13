/**
 * Centralized API validation using Zod
 * Replaces all custom validation patterns
 */

import { z } from 'zod'

// Contact form validation schema
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters')
    .trim(),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(254, 'Email address is too long')
    .trim(),
  subject: z
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject cannot exceed 200 characters')
    .trim(),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message cannot exceed 2000 characters')
    .trim(),
  company: z
    .string()
    .max(100, 'Company name cannot exceed 100 characters')
    .optional()
    .nullable()
    .transform((val) => val || null),
  phone: z
    .string()
    .max(20, 'Phone number is too long')
    .optional()
    .nullable()
    .transform((val) => val || null),
  consentToTerms: z
    .boolean()
    .optional()
    .default(false),
  howDidYouHear: z
    .string()
    .max(200, 'How you heard about us is too long')
    .optional()
    .nullable()
    .transform((val) => val || null),
  // Bot prevention
  honeypot: z.string().optional().nullable()
}).superRefine((data, ctx) => {
  // Check honeypot field to detect bots
  if (data.honeypot && data.honeypot.trim() !== '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Bot detection triggered',
      path: ['honeypot'],
    })
  }
})

export type ContactFormData = z.infer<typeof contactFormSchema>

// Email validation schema
export const emailSchema = z.object({
  to: z
    .string()
    .email('Valid recipient email is required')
    .max(254, 'Recipient email is too long'),
  subject: z
    .string()
    .min(1, 'Subject is required')
    .max(200, 'Subject cannot exceed 200 characters'),
  html: z
    .string()
    .min(1, 'Email content is required')
    .max(10000, 'Email content is too long'),
  text: z
    .string()
    .max(5000, 'Text content is too long')
    .optional(),
  from: z
    .string()
    .email('Valid sender email is required')
    .max(254, 'Sender email is too long')
    .optional(),
})

export type EmailData = z.infer<typeof emailSchema>

// Blog post validation schema
export const blogPostSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title cannot exceed 200 characters'),
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .max(100, 'Slug cannot exceed 100 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be alphanumeric with hyphens only'),
  excerpt: z
    .string()
    .max(300, 'Excerpt cannot exceed 300 characters')
    .optional(),
  content: z
    .string()
    .min(50, 'Content must be at least 50 characters')
    .max(50000, 'Content cannot exceed 50,000 characters'),
  contentType: z.enum(['MARKDOWN', 'HTML', 'RICH_TEXT']),
  status: z.enum(['DRAFT', 'REVIEW', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED', 'DELETED']),
  metaTitle: z
    .string()
    .max(60, 'Meta title cannot exceed 60 characters')
    .optional(),
  metaDescription: z
    .string()
    .max(160, 'Meta description cannot exceed 160 characters')
    .optional(),
  keywords: z
    .array(z
      .string()
      .min(1, 'Keyword must be at least 1 character')
      .max(50, 'Keyword cannot exceed 50 characters'))
    .max(10, 'Cannot have more than 10 keywords')
    .optional(),
  authorId: z
    .string()
    .regex(/^c[^\s-]{8,}$/, 'Must be a valid author ID'),
  categoryId: z
    .string()
    .regex(/^c[^\s-]{8,}$/, 'Must be a valid category ID')
    .optional(),
  tagIds: z
    .array(z.string().regex(/^c[^\s-]{8,}$/, 'Must be a valid tag ID'))
    .optional(),
  publishedAt: z
    .string()
    .datetime('Must be a valid date')
    .optional(),
  featuredImage: z
    .string()
    .url('Featured image must be a valid URL')
    .optional()
})

export type BlogPostData = z.infer<typeof blogPostSchema>

// Generic request validation
export const requestMetadataSchema = z.object({
  userAgent: z.string().max(500).optional(),
  ip: z.string().max(45).optional(), // IPv6 can be up to 39 chars, plus some padding
  path: z.string().max(2048).optional(),
  timestamp: z.number().optional(),
})

export type RequestMetadata = z.infer<typeof requestMetadataSchema>

// API response schemas
export const apiErrorSchema = z.object({
  success: z.literal(false),
  message: z.string().max(500),
  error: z.string().max(1000),
  details: z.record(z.string(), z.array(z.string())).optional(),
  rateLimitInfo: z.object({
    remaining: z.number().optional(),
    resetTime: z.number().optional(),
    retryAfter: z.number().optional(),
    blocked: z.boolean().optional(),
  }).optional(),
})

export const apiSuccessSchema = z.object({
  success: z.literal(true),
  message: z.string().max(500),
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
  details: Record<string, string[]>

  constructor(message: string, details: Record<string, string[]>) {
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
      const details: Record<string, string[]> = {}
      error.issues.forEach((err: z.ZodIssue) => {
        const path = err.path.join('.')

        if (!details[path]) {
          details[path] = []
        }

        details[path].push(err.message)
      })
      throw new ValidationError('Validation failed', details)
    }
    throw error
  }
}

export function createApiError(
  message: string,
  error: string,
  details?: Record<string, string[]>,
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

// Input sanitization utilities
export function sanitizeUserInput(input: string): string {
  // Remove potentially dangerous characters while allowing legitimate punctuation
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript protocol
    .replace(/vbscript:/gi, '') // Remove vbscript protocol
    .replace(/data:/gi, '') // Remove data protocol
    .replace(/on\w+="[^"]*"/gi, '') // Remove inline event handlers
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags
    .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '') // Remove form tags
    .substring(0, 10000) // Limit length
}

export function sanitizeHtml(html: string): string {
  // Basic HTML sanitization for server-side only
  // In practice, use DOMPurify on the client and server
  return html
    .substring(0, 50000) // Limit length
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<meta[^>]*>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
}

// Rate limiting validation schema
export const rateLimitCheckSchema = z.object({
  identifier: z
    .string()
    .min(1, 'Identifier is required')
    .max(200, 'Identifier is too long'),
  config: z.object({
    windowMs: z.number().positive('Window must be positive'),
    maxAttempts: z.number().positive('Max attempts must be positive'),
    progressivePenalty: z.boolean().optional(),
    blockDuration: z.number().nonnegative().optional()
  })
})

export type RateLimitConfig = z.infer<typeof rateLimitCheckSchema.shape.config>