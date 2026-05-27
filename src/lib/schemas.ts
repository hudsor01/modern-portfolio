/**
 * Unified Validation Schemas
 * Centralized validation logic to eliminate duplication across the application
 * All schemas are consistent with Prisma models and types directory
 */

import { z } from 'zod'
import { PostStatus, ContentType } from '@/types/blog'
import { SEOEventType, SEOSeverity, ChangeFrequency } from '@/types/seo'
import { FEATURED_IMAGE_ALLOWED_HOSTS } from './featured-image-hosts'

// =======================
// BASE PRIMITIVE SCHEMAS
// =======================

// Email validation - single source of truth
export const emailSchema = z
  .email('Please enter a valid email address')
  .max(254, 'Email address is too long')

// URL validation
export const urlSchema = z.url('Please enter a valid URL').max(2048, 'URL is too long')

// Optional URL that can be empty string
export const optionalUrlSchema = z
  .union([z.url('Please enter a valid URL').max(2048, 'URL is too long'), z.literal('')])
  .optional()

// Featured-image / OG / Twitter image URL validator. Accepts:
//   - null or '' (canonical "no image" — column is nullable)
//   - Relative path under /public, with `..`, `.`, `//`, and ANY dotfile
//     segment blocked (lookaheads reject `/.x` at start AND `/.x` mid-path
//     like `/foo/.env`, `/images/.git/HEAD`). Path traversal tokens
//     smuggled into the DB would end up in JSON-LD `image` and sitemap
//     `<image:loc>` output, so we block at the entry point.
//   - Absolute HTTPS URL whose host is in FEATURED_IMAGE_ALLOWED_HOSTS
//
// The host allowlist lives in `featured-image-hosts.ts` (a leaf module)
// rather than being derived from `next.config.js` here, because this
// module is reachable from a 'use client' boundary via contactFormSchema.
// Drift between the two lists is enforced at test time — see
// `__tests__/featured-image-hosts.test.ts`.
export const featuredImageSchema = z
  .union([
    z.literal(''),
    z.string().regex(
      // Three lookaheads then the body:
      //   (?!.*\/\.{1,2}(?:\/|$))   — block `/.` and `/..` segments anywhere
      //   (?!.*\/\.)                — block any dotfile segment (`/foo/.env`)
      //   (?!.*\/\/)                — block `//`
      /^(?!.*\/\.{1,2}(?:\/|$))(?!.*\/\.)(?!.*\/\/)\/[A-Za-z0-9_-][A-Za-z0-9._/-]*$/,
      'Relative paths must point under /public (no "..", no dotfile segments, no "//")'
    ),
    z
      .url('Please enter a valid URL')
      .max(2048, 'URL is too long')
      .refine(
        (url) => {
          try {
            const u = new URL(url)
            return (
              u.protocol === 'https:' &&
              (FEATURED_IMAGE_ALLOWED_HOSTS as readonly string[]).includes(u.host)
            )
          } catch {
            return false
          }
        },
        `Must be an https URL whose host is one of: ${FEATURED_IMAGE_ALLOWED_HOSTS.join(', ')}`
      ),
  ])
  .nullable()
  .optional()

// Slug validation - consistent format across all entities
export const slugSchema = z
  .string()
  .min(1, 'Slug is required')
  .max(100, 'Slug cannot exceed 100 characters')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens',
  })

// CUID validation for database IDs.
// Accepts both legacy cuid v1 (Prisma-era rows) and cuid2 (new rows from src/db/cuid.ts).
export const cuidSchema = z.union([z.cuid(), z.cuid2()], { error: 'Must be a valid CUID' })

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

export const PostStatusSchema = z.enum(PostStatus)
export const ContentTypeSchema = z.enum(ContentType)

// SEO-related enums - defined locally since they were removed from Prisma schema
export const SEOEventTypeSchema = z.enum(SEOEventType)
export const SEOSeveritySchema = z.enum(SEOSeverity)
export const ChangeFrequencySchema = z.enum(ChangeFrequency)

// =======================
// CONTACT FORM SCHEMA
// =======================

export const contactFormSchema = z
  .object({
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
  .strict()

export type ContactFormValues = z.infer<typeof contactFormSchema>

// =======================
// BLOG POST SCHEMAS
// =======================

// Base blog post field shape — NO defaults. Create and Update both
// derive from this. The canonical pattern for build-a-PATCH-schema in
// Zod is to keep defaults out of the base; `.partial()` doesn't strip
// them (verified empirically in Zod 4.4.3) and Zod 4 explicitly applies
// defaults inside optional fields, so deriving an update schema from a
// defaulted base would silently fill in DRAFT/MARKDOWN/[] on every PUT
// that omitted a field — downgrading PUBLISHED posts and stomping
// content types.
//
// Nullable text columns use `.nullish()` (accepts both `undefined` and
// `null`) so a PATCH client can send `{ featuredImageAlt: null }` to
// clear a field. With `.optional()` alone, null is rejected and a
// client has no way to express "clear this column" — they're stuck
// with empty string or leaving the column unchanged. The
// `body.X !== undefined && { X: body.X }` spread in the PUT handler
// honors both undefined-omit and null-write correctly.
//
// All shared validation rules (length caps, the host-allowlist on
// image URLs, slug/cuid formats) live in this base shape exactly once.
const blogPostBaseShape = {
  title: z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters'),
  content: z
    .string()
    .min(1, 'Content is required')
    .max(100_000, 'Content cannot exceed 100,000 characters'),
  authorId: cuidSchema,
  excerpt: z.string().max(500).nullish(),
  contentType: ContentTypeSchema,
  status: PostStatusSchema,
  metaTitle: z.string().max(100).nullish(),
  metaDescription: z.string().max(160).nullish(),
  keywords: z.array(z.string().min(1).max(50)).max(10, 'Cannot have more than 10 keywords'),
  canonicalUrl: z.union([z.url('Please enter a valid URL').max(2048), z.literal('')]).nullish(),
  // Social card image fields reuse featuredImageSchema — same host
  // allowlist applies because these get scraped by Twitter/Facebook
  // unfurlers and would render broken if pointed at unwhitelisted CDNs.
  ogTitle: z.string().max(100).nullish(),
  ogDescription: z.string().max(300).nullish(),
  ogImage: featuredImageSchema,
  twitterTitle: z.string().max(100).nullish(),
  twitterDescription: z.string().max(200).nullish(),
  twitterImage: featuredImageSchema,
  featuredImage: featuredImageSchema,
  featuredImageAlt: z.string().max(200).nullish(),
  categoryId: cuidSchema.nullish(),
  tagIds: z.array(cuidSchema).max(10, 'Cannot attach more than 10 tags').optional(),
  publishedAt: datetimeSchema.nullish(),
  scheduledAt: datetimeSchema.nullish(),
} as const

// POST /api/blog — derives from the base, then adds defaults where the
// create flow needs them. `.strict()` rejects unknown fields so
// mass-assignment attempts fail loudly.
export const createBlogPostSchema = z
  .object({
    ...blogPostBaseShape,
    contentType: ContentTypeSchema.default(ContentType.MARKDOWN),
    status: PostStatusSchema.default(PostStatus.DRAFT),
    keywords: z.array(z.string().min(1).max(50)).max(10).default([]),
  })
  .strict()
export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>

// PUT /api/blog/[slug] — every field optional, NO defaults (PATCH
// semantics). The base shape has no defaults, so `.partial()` produces
// the right thing: missing fields stay `undefined` instead of being
// filled in.
export const updateBlogPostSchema = z.object(blogPostBaseShape).partial().strict()
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>

// =======================
// PROJECT SCHEMAS
// =======================

export const projectFilterSchema = z
  .object({
    category: z.string().optional(),
    technology: z.string().optional(),
    featured: z.boolean().optional(),
    search: z.string().max(200).optional(),
    tags: z.array(z.string()).optional(),
  })
  .strict()

// =======================
// ANALYTICS SCHEMAS
// =======================

export const viewTrackingSchema = z
  .object({
    type: z.enum(['project', 'blog']),
    slug: z.string().min(1, 'Slug is required'),
    readingTime: z.number().int().min(0).max(3600).optional(),
    scrollDepth: z.number().min(0).max(100).optional(),
    referrer: urlSchema.optional(),
  })
  .strict()

// =======================
// PAGINATION SCHEMAS
// =======================

// Intentionally NOT .strict(): pagination is parsed from URL query strings,
// which routinely carry unrelated params (UTM, sort, filter). Strictness here
// would reject benign external traffic.
// Uses z.coerce.number() because URL query values arrive as strings.
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  offset: z.coerce.number().int().min(0).optional(),
})

// =======================
// API RESPONSE SCHEMAS
// =======================

export function apiResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    success: z.boolean(),
    data: dataSchema,
    message: z.string().optional(),
    error: z.string().optional(),
  })
}

export function paginatedResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
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
