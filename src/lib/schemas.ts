/**
 * Unified Validation Schemas
 * Centralized validation logic to eliminate duplication across the application
 * All schemas are consistent with Prisma models and types directory
 */

import { z } from 'zod'
import { PostStatus, ContentType } from '@/types/blog'
import { SEOEventType, SEOSeverity, ChangeFrequency } from '@/types/seo'

// =======================
// BASE PRIMITIVE SCHEMAS
// =======================

// Email validation - single source of truth
export const emailSchema = z.email('Please enter a valid email address').max(254, 'Email address is too long')

// URL validation
export const urlSchema = z.url('Please enter a valid URL').max(2048, 'URL is too long')

// Optional URL that can be empty string
export const optionalUrlSchema = z.union([
  z.url('Please enter a valid URL').max(2048, 'URL is too long'),
  z.literal('')
]).optional()

// Slug validation - consistent format across all entities
export const slugSchema = z
  .string()
  .min(1, 'Slug is required')
  .max(100, 'Slug cannot exceed 100 characters')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens',
  })

// CUID validation for database IDs
export const cuidSchema = z.cuid('Must be a valid CUID')

// Phone number validation
export const phoneSchema = z
  .string()
  .regex(/^\+?[0-9]{10,15}$/, 'Please enter a valid phone number')
  .optional()

// Color hex validation
export const colorSchema = z
  .string()
  .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex color')
  .optional()

// Meta description with proper character limits
export const metaDescriptionSchema = z
  .string()
  .max(160, 'Meta description cannot exceed 160 characters')
  .optional()

// Keywords array validation
export const keywordsSchema = z
  .array(z.string().min(1).max(50))
  .max(10, 'Cannot have more than 10 keywords')
  .default([])

// Date validation - flexible to handle strings and Date objects
export const dateSchema = z.union([
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  z.date(),
])

// ISO datetime string validation
export const datetimeSchema = z.string().datetime('Must be a valid ISO datetime string').or(z.date())

// =======================
// PRISMA ENUM SCHEMAS
// =======================

export const PostStatusSchema = z.enum(PostStatus)
export const ContentTypeSchema = z.enum(ContentType)

// SEO-related enums - defined locally since they were removed from Prisma schema
export const SEOEventTypeSchema = z.enum(SEOEventType)
export const SEOSeveritySchema = z.enum(SEOSeverity)
export const ChangeFrequencySchema = z.enum(ChangeFrequency)

// =======================
// CONTACT FORM SCHEMA
// =======================

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name cannot exceed 50 characters')
    .trim(),
  email: z.email('Please enter a valid email address').max(254, 'Email address is too long'),
  company: z
    .string()
    .max(100, 'Company name cannot exceed 100 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .max(20, 'Phone number cannot exceed 20 characters')
    .regex(/^[\d\s+()-]*$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
  subject: z
    .string()
    .min(1, 'Subject must be at least 1 character')
    .max(100, 'Subject must not exceed 100 characters')
    .trim()
    .optional(),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters long')
    .max(1000, 'Message cannot exceed 1000 characters')
    .trim(),
  honeypot: z.string().optional(),
})

export type ContactFormValues = z.infer<typeof contactFormSchema>

// =======================
// PROJECT SCHEMAS
// =======================

export const projectFilterSchema = z.object({
  category: z.string().optional(),
  technology: z.string().optional(),
  featured: z.boolean().optional(),
  search: z.string().max(200).optional(),
  tags: z.array(z.string()).optional(),
})

// =======================
// ANALYTICS SCHEMAS
// =======================

export const viewTrackingSchema = z.object({
  type: z.enum(['project', 'blog']),
  slug: z.string().min(1, 'Slug is required'),
  readingTime: z.number().int().min(0).max(3600).optional(),
  scrollDepth: z.number().min(0).max(100).optional(),
  referrer: urlSchema.optional(),
})

// =======================
// PAGINATION SCHEMAS
// =======================

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  offset: z.number().int().min(0).optional(),
})

// =======================
// API RESPONSE SCHEMAS
// =======================

export function apiResponseSchema<T extends z.ZodTypeAny>(
  dataSchema: T
) {
  return z.object({
    success: z.boolean(),
    data: dataSchema,
    message: z.string().optional(),
    error: z.string().optional(),
  })
}

export function paginatedResponseSchema<T extends z.ZodTypeAny>(
  dataSchema: T
) {
  return z.object({
    success: z.boolean(),
    data: z.array(dataSchema),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      totalPages: z.number(),
      hasNext: z.boolean(),
      hasPrev: z.boolean(),
    }),
    message: z.string().optional(),
    error: z.string().optional(),
  })
}

// =======================
// VALIDATION UTILITIES
// =======================

export class ValidationError extends Error {
  public details?: Record<string, string[]>

  constructor(message: string, details?: Record<string, string[]>) {
    super(message)
    this.name = 'ValidationError'
    this.details = details
  }

  static fromZodError(error: z.ZodError): ValidationError {
    const details: Record<string, string[]> = {}

    for (const issue of error.issues) {
      const path = issue.path.join('.') || 'root'
      details[path] = details[path] || []
      details[path].push(issue.message)
    }

    return new ValidationError('Validation failed', details)
  }
}

// Generic validation function with proper error handling
export function validate<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data)
  if (result.success) {
    return result.data
  }
  throw ValidationError.fromZodError(result.error)
}

// Safe validation that returns success/error results
export function safeValidate<T>(
  schema: z.ZodType<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, error: result.error }
}

// =======================
// TYPE EXPORTS
// =======================

export type ProjectFilterInput = z.infer<typeof projectFilterSchema>
export type ViewTrackingInput = z.infer<typeof viewTrackingSchema>
export type PaginationInput = z.infer<typeof paginationSchema>


