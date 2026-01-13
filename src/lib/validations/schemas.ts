/**
 * Unified Validation Schemas
 * Centralized validation logic to eliminate duplication across the application
 * All schemas are consistent with Prisma models and types directory
 */

import { z } from 'zod'

// Define enums as literals to avoid importing Prisma client in browser bundles
export enum PostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  SCHEDULED = 'SCHEDULED',
  ARCHIVED = 'ARCHIVED',
}

export enum ContentType {
  MARKDOWN = 'MARKDOWN',
  HTML = 'HTML',
  RICH_TEXT = 'RICH_TEXT',
}

export enum InteractionType {
  LIKE = 'LIKE',
  SHARE = 'SHARE',
  COMMENT = 'COMMENT',
  BOOKMARK = 'BOOKMARK',
  SUBSCRIBE = 'SUBSCRIBE',
  DOWNLOAD = 'DOWNLOAD',
}

// =======================
// BASE PRIMITIVE SCHEMAS
// =======================

// Email validation - single source of truth
export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .max(254, 'Email address is too long')

// URL validation
export const urlSchema = z.string().url('Please enter a valid URL').max(2048, 'URL is too long')

// Optional URL that can be empty string
export const optionalUrlSchema = z
  .string()
  .url('Please enter a valid URL')
  .max(2048, 'URL is too long')
  .optional()
  .or(z.literal(''))

// Slug validation - consistent format across all entities
export const slugSchema = z
  .string()
  .min(1, 'Slug is required')
  .max(100, 'Slug cannot exceed 100 characters')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens',
  })

// CUID validation for database IDs
export const cuidSchema = z.string().regex(/^c[^\s-]{8,}$/, 'Must be a valid CUID')

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
export const datetimeSchema = z
  .string()
  .datetime('Must be a valid ISO datetime string')
  .or(z.date())

// =======================
// PRISMA ENUM SCHEMAS
// =======================

export const PostStatusSchema = z.nativeEnum(PostStatus)
export const ContentTypeSchema = z.nativeEnum(ContentType)
export const InteractionTypeSchema = z.nativeEnum(InteractionType)

// SEO-related enums - defined locally since they were removed from Prisma schema
export const SEOEventTypeSchema = z.enum([
  'TITLE_CHANGE',
  'META_DESCRIPTION_CHANGE',
  'KEYWORD_UPDATE',
  'CONTENT_ANALYSIS',
  'PERFORMANCE_ALERT',
  'RANKING_CHANGE',
  'TECHNICAL_ISSUE',
  'OPPORTUNITY',
])

export const SEOSeveritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'INFO'])

export const ChangeFrequencySchema = z.enum([
  'ALWAYS',
  'HOURLY',
  'DAILY',
  'WEEKLY',
  'MONTHLY',
  'YEARLY',
  'NEVER',
])

// Enums are already exported above, no need to re-export

// Export inferred types for SEO enums
export type SEOEventType = z.infer<typeof SEOEventTypeSchema>
export type SEOSeverity = z.infer<typeof SEOSeveritySchema>
export type ChangeFrequency = z.infer<typeof ChangeFrequencySchema>

// =======================
// CONTACT FORM SCHEMAS
// =======================

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name cannot exceed 50 characters')
    .trim(),
  email: emailSchema,
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
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters long')
    .max(1000, 'Message cannot exceed 1000 characters')
    .trim(),
  honeypot: z.string().optional(), // Bot detection field
})

export type ContactFormValues = z.infer<typeof contactFormSchema>

// =======================
// PROJECT SCHEMAS
// =======================

export const projectInteractionSchema = z.object({
  type: z.enum(['LIKE', 'SHARE', 'BOOKMARK', 'DOWNLOAD']),
  value: z.string().max(200).optional(),
  metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
})

export const projectFilterSchema = z.object({
  category: z.string().optional(),
  technology: z.string().optional(),
  featured: z.boolean().optional(),
  search: z.string().max(200).optional(),
  tags: z.array(z.string()).optional(),
})

// =======================
// BLOG SCHEMAS
// =======================

export const blogInteractionSchema = z.object({
  type: InteractionTypeSchema,
  value: z.string().max(200).optional(),
  metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
})

export const blogPostFilterSchema = z.object({
  status: z.union([PostStatusSchema, z.array(PostStatusSchema)]).optional(),
  authorId: cuidSchema.optional(),
  categoryId: cuidSchema.optional(),
  tagIds: z.array(cuidSchema).optional(),
  search: z.string().max(200).optional(),
  dateRange: z
    .object({
      from: z.date(),
      to: z.date(),
    })
    .optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
})

export const blogPostSortSchema = z.object({
  field: z.enum(['title', 'createdAt', 'updatedAt', 'publishedAt', 'viewCount', 'likeCount']),
  order: z.enum(['asc', 'desc']).default('desc'),
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

export const postViewCreateSchema = z.object({
  postId: cuidSchema,
  visitorId: z.string().max(100).optional(),
  sessionId: z.string().max(100).optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().max(500).optional(),
  referer: urlSchema.optional(),
  country: z.string().max(50).optional(),
  region: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  readingTime: z.number().int().min(0).max(3600).optional(),
  scrollDepth: z.number().min(0).max(1).optional(),
})

export const postInteractionCreateSchema = z.object({
  postId: cuidSchema,
  type: InteractionTypeSchema,
  visitorId: z.string().max(100).optional(),
  sessionId: z.string().max(100).optional(),
  value: z.string().max(200).optional(),
  metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
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

export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema,
    message: z.string().optional(),
    error: z.string().optional(),
  })

export const paginatedResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
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

export type ProjectInteractionInput = z.infer<typeof projectInteractionSchema>
export type ProjectFilterInput = z.infer<typeof projectFilterSchema>
export type BlogInteractionInput = z.infer<typeof blogInteractionSchema>
export type BlogPostFilterInput = z.infer<typeof blogPostFilterSchema>
export type BlogPostSortInput = z.infer<typeof blogPostSortSchema>
export type ViewTrackingInput = z.infer<typeof viewTrackingSchema>
export type PostViewCreateInput = z.infer<typeof postViewCreateSchema>
export type PostInteractionCreateInput = z.infer<typeof postInteractionCreateSchema>
export type PaginationInput = z.infer<typeof paginationSchema>

// =======================
// API RESPONSE UTILITIES
// =======================

// API Error/Success types
export interface ApiError {
  success: false
  message: string
  error: string
  code?: string
  details?: Record<string, string[]>
  metadata?: Record<string, unknown>
  rateLimitInfo?: {
    remaining?: number
    resetTime?: number
    retryAfter?: number
    blocked?: boolean
  }
}

export interface ApiSuccess {
  success: true
  message: string
  data?: Record<string, unknown> | string | number | boolean
  metadata?: Record<string, unknown>
  rateLimitInfo?: {
    remaining?: number
    resetTime?: number
  }
}

export type ApiResponse = ApiError | ApiSuccess

// Validation helper - alias for validate for backward compatibility
export const validateRequest = validate

// API response factory functions
export function createApiError(
  message: string,
  code?: string,
  details?: Record<string, string[]>,
  metadata?: Record<string, unknown>
): ApiError {
  return {
    success: false,
    message,
    error: message,
    code,
    details,
    ...(metadata && { metadata }),
  }
}

export function createApiSuccess(
  message: string,
  data?: ApiSuccess['data'],
  metadata?: Record<string, unknown>
): ApiSuccess {
  return {
    success: true,
    message,
    data,
    ...(metadata && { metadata }),
  }
}

// =======================
// INTERACTION VALIDATORS
// =======================

/**
 * Validate blog interaction input, throwing ValidationError on failure
 */
export function validateBlogInteraction(data: unknown): BlogInteractionInput {
  return validate(blogInteractionSchema, data)
}

/**
 * Validate project interaction input, throwing ValidationError on failure
 */
export function validateProjectInteraction(data: unknown): ProjectInteractionInput {
  return validate(projectInteractionSchema, data)
}

