/**
 * Unified Validation Schemas
 * Centralized validation logic to eliminate duplication across the application
 * All schemas are consistent with Prisma models and types directory
 */

import { z } from 'zod'
import {
  PostStatus,
  ContentType,
  InteractionType,
  SEOEventType,
  SEOSeverity,
  ChangeFrequency
} from '@prisma/client'

// =======================
// BASE PRIMITIVE SCHEMAS
// =======================

// Email validation - single source of truth
export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .max(254, 'Email address is too long')

// URL validation
export const urlSchema = z
  .string()
  .url('Please enter a valid URL')
  .max(2048, 'URL is too long')

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
export const cuidSchema = z
  .string()
  .regex(/^c[^\s-]{8,}$/, 'Must be a valid CUID')

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
export const SEOEventTypeSchema = z.nativeEnum(SEOEventType)
export const SEOSeveritySchema = z.nativeEnum(SEOSeverity)
export const ChangeFrequencySchema = z.nativeEnum(ChangeFrequency)

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
  subject: z
    .string()
    .min(5, 'Subject must be at least 5 characters long')
    .max(100, 'Subject cannot exceed 100 characters')
    .trim(),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters long')
    .max(1000, 'Message cannot exceed 1000 characters')
    .trim(),
  company: z
    .string()
    .max(100, 'Company name cannot exceed 100 characters')
    .optional(),
  phone: phoneSchema,
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
  status: z.union([
    PostStatusSchema,
    z.array(PostStatusSchema)
  ]).optional(),
  authorId: cuidSchema.optional(),
  categoryId: cuidSchema.optional(),
  tagIds: z.array(cuidSchema).optional(),
  search: z.string().max(200).optional(),
  dateRange: z.object({
    from: z.date(),
    to: z.date()
  }).optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional()
})

export const blogPostSortSchema = z.object({
  field: z.enum(['title', 'createdAt', 'updatedAt', 'publishedAt', 'viewCount', 'likeCount']),
  order: z.enum(['asc', 'desc']).default('desc')
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
  scrollDepth: z.number().min(0).max(1).optional()
})

export const postInteractionCreateSchema = z.object({
  postId: cuidSchema,
  type: InteractionTypeSchema,
  visitorId: z.string().max(100).optional(),
  sessionId: z.string().max(100).optional(),
  value: z.string().max(200).optional(),
  metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional()
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
  constructor(
    message: string,
    public details?: z.ZodError
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}

// Generic validation function with proper error handling
export function validate<T>(schema: z.ZodType<T>, data: unknown): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Validation failed', error)
    }
    throw new ValidationError('Invalid data')
  }
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

// Validation helpers for common types
export const validateEmail = (email: unknown) => validate(emailSchema, email)
export const validateUrl = (url: unknown) => validate(urlSchema, url)
export const validateSlug = (slug: unknown) => validate(slugSchema, slug)
export const validateCuid = (id: unknown) => validate(cuidSchema, id)
export const validateContactForm = (data: unknown) => validate(contactFormSchema, data)
export const validateProjectInteraction = (data: unknown) => validate(projectInteractionSchema, data)
export const validateBlogInteraction = (data: unknown) => validate(blogInteractionSchema, data)
export const validateViewTracking = (data: unknown) => validate(viewTrackingSchema, data)
export const validatePagination = (data: unknown) => validate(paginationSchema, data)

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

