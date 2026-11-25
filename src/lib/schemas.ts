/**
 * Unified Validation Schemas
 * Centralized validation logic to eliminate duplication across the application.
 * Enum schemas derive from the Drizzle pgEnums (src/db/schema.ts), which are the
 * single source of truth for PostStatus / ContentType values.
 */

import { z } from 'zod'
import { postStatus, contentType } from '@/db/schema'
import { FEATURED_IMAGE_ALLOWED_HOSTS } from './featured-image-hosts'

// Zod 4 probes `new Function('')` at schema construction to decide whether to
// JIT-compile validators. In the browser the CSP forbids 'unsafe-eval' (and must
// stay that way), so the probe is a reported script-src violation on every page
// that loads these schemas (/contact). Turn the JIT off client-side so the probe
// never runs; the server keeps the JIT.
if (typeof window !== 'undefined') {
  z.config({ jitless: true })
}

// =======================
// BASE PRIMITIVE SCHEMAS
// =======================

/** The one source for contactFormSchema, every contact field's maxLength and the message counter. */
export const CONTACT_LIMITS = {
  name: 50,
  email: 254,
  company: 100,
  phone: 20,
  subject: 100,
  message: 1000,
} as const

/**
 * Contact form minima. The schema checks them in code points on the trimmed value; the native
 * minLength mirrors them in UTF-16 units on the raw value, so it is never stricter than the
 * server (it never blocks a valid submission) but can be looser: one emoji is 2 units and
 * padding counts, so '😀' or '  a  ' pass minLength={2} and the schema rejects them. The
 * hydrated path's TanStack validator (this same schema) catches that before any request; the
 * no-JS path gets a server round trip with the field error. Parity is claimed for maxima only.
 */
export const CONTACT_MINIMUMS = {
  name: 2,
  subject: 1,
  message: 10,
} as const

/**
 * multipart/form-data encoding sends textarea newlines as CRLF while the textarea value and
 * maxlength count LF; normalising before the length check makes server acceptance equal the
 * client count.
 */
export function normalizeNewlines(value: string): string {
  return value.replace(/\r\n?/g, '\n')
}

/**
 * Message length in UTF-16 units, the same measure maxlength enforces. Never count code points
 * here: for the maximum, Zod's code-point count is equal or looser, so anything the UI allows
 * is accepted. That holds for maxima only; see CONTACT_MINIMUMS for the minimum.
 */
export function contactMessageLength(value: string): number {
  return normalizeNewlines(value).length
}

// Email validation - single source of truth
export const emailSchema = z
  .email('Please enter a valid email address')
  .max(CONTACT_LIMITS.email, 'Email address is too long')

// URL validation. `protocol: /^https?$/` is the Zod 4 documented idiom
// for rejecting `javascript:` / `data:` / `vbscript:` etc. at the schema
// boundary — bare `z.url()` accepts any WHATWG-valid URL including
// `javascript:alert(1)`. The runtime `isSafeUrl` helper in
// `src/lib/sanitization.ts` is the matching defense for non-schema sinks
// (and additionally rejects whitespace-injection bypasses per
// CVE-2026-31809). See SECURITY.md → Application → Input validation.
export const urlSchema = z
  .url({ protocol: /^https?$/, error: 'Please enter a valid http(s) URL' })
  .max(2048, 'URL is too long')

// Coerce empty string → null on parse. Lets HTML form submissions
// (where missing fields become '') land in the canonical "cleared"
// state without every handler call site needing to remember the
// `body.X || null` dance. Critically: the partial unique index on
// blog_posts.featuredImage treats multiple NULLs as distinct but two
// empty strings as equal, so '' → null at the schema layer prevents
// 23505 collisions regardless of writer discipline.
//
// Exported so any future schema with a nullable text column (admin
// projects, contact-submission overrides, etc.) inherits the same
// `'' → null` contract by composition rather than each schema
// re-inventing the union.
export const nullishText = (max: number, message?: string) =>
  z
    .union([
      z.literal('').transform(() => null),
      // Zod's .max accepts `undefined` for `message`, so the explicit
      // ternary was dead weight — pass `message` through unchanged.
      z.string().max(max, message),
      z.null(),
    ])
    .optional()

/**
 * URL-flavoured sibling of `nullishText`. Accepts undefined / null /
 * '' / a valid URL up to 2048 chars. Empty string transforms to null
 * at parse so the column lands in the canonical cleared state.
 *
 * Used for nullable URL columns (canonicalUrl, etc.). For featured
 * images, use `featuredImageSchema` which adds the host allowlist.
 *
 * The `protocol: /^https?$/` constraint blocks `javascript:` / `data:` /
 * `vbscript:` / etc. at the schema boundary — these would otherwise pass
 * bare `z.url()` because Zod 4's URL validator delegates to WHATWG's
 * `new URL()` which accepts any well-formed scheme. Hostname is left
 * unconstrained on purpose: `canonicalUrl` legitimately points to
 * arbitrary external domains.
 */
export const nullishUrl = (max = 2048) =>
  z
    .union([
      z.literal('').transform(() => null),
      z.url({ protocol: /^https?$/, error: 'Please enter a valid http(s) URL' }).max(max),
      z.null(),
    ])
    .optional()

// Featured-image / OG / Twitter image URL validator. Accepts:
//   - null, undefined, or '' (all coalesce to null — column is nullable)
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
    // Empty string is the canonical HTML-form-cleared sentinel —
    // transform to null at parse so handlers never see '' for this
    // column and the partial unique index can't be tripped by two
    // empty-string PUBLISHED rows.
    z.literal('').transform(() => null),
    z.string().regex(
      // Two lookaheads then the body:
      //   (?!.*\/\.)   — block any segment starting with `.` (this
      //                  subsumes `.` and `..` traversal AND any
      //                  dotfile like `/foo/.env`)
      //   (?!.*\/\/)   — block `//` (protocol-relative or doubled-slash)
      /^(?!.*\/\.)(?!.*\/\/)\/[A-Za-z0-9_-][A-Za-z0-9._/-]*$/,
      'Relative paths must point under /public (no dotfile segments, no "//")'
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

// Meta description with proper character limits. Used by blog post
// schemas (where it's wrapped as `.nullish()` to support PATCH-clear)
// and by SEO event schemas elsewhere. Keep the `.optional()` form
// here as the leaf primitive; nullability is composed at the use site.
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
// ENUM SCHEMAS (derived from the Drizzle pgEnums — single source of truth)
// =======================

export const PostStatusSchema = z.enum(postStatus.enumValues)
export const ContentTypeSchema = z.enum(contentType.enumValues)

// =======================
// CONTACT FORM SCHEMA
// =======================

export const contactFormSchema = z
  .object({
    // Zod 4 runs checks and overwrites in chain order: max on the raw value (what maxLength
    // counts), then trim, then min on the trimmed value so whitespace alone never passes.
    name: z
      .string()
      .max(CONTACT_LIMITS.name, `Name cannot exceed ${CONTACT_LIMITS.name} characters`)
      .trim()
      .min(CONTACT_MINIMUMS.name, `Name must be at least ${CONTACT_MINIMUMS.name} characters long`),
    email: z
      .email('Please enter a valid email address')
      .max(CONTACT_LIMITS.email, 'Email address is too long'),
    company: z
      .string()
      .max(
        CONTACT_LIMITS.company,
        `Company name cannot exceed ${CONTACT_LIMITS.company} characters`
      )
      .trim()
      .optional()
      .or(z.literal('')),
    phone: z
      .string()
      .max(CONTACT_LIMITS.phone, `Phone number cannot exceed ${CONTACT_LIMITS.phone} characters`)
      .regex(/^[\d\s+()-]*$/, 'Please enter a valid phone number')
      .optional()
      .or(z.literal('')),
    subject: z
      .string()
      .max(CONTACT_LIMITS.subject, `Subject must not exceed ${CONTACT_LIMITS.subject} characters`)
      .trim()
      .min(
        CONTACT_MINIMUMS.subject,
        `Subject must be at least ${CONTACT_MINIMUMS.subject} character`
      )
      .optional(),
    message: z
      .string()
      .overwrite(normalizeNewlines)
      .max(CONTACT_LIMITS.message, `Message cannot exceed ${CONTACT_LIMITS.message} characters`)
      .trim()
      .min(
        CONTACT_MINIMUMS.message,
        `Message must be at least ${CONTACT_MINIMUMS.message} characters long`
      ),
    honeypot: z.string().optional(),
  })
  .strict()

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
// Nullable text columns use `nullishText`/`nullishUrl` (which return
// `z.union([literal(''→null), validator, null]).optional()`). Three
// inputs all collapse to null at parse: `undefined` (omit), `null`
// (explicit clear), `''` (HTML form clear). The `body.X !== undefined`
// spread in the PUT handler distinguishes omit from clear; once past
// the schema, an empty string never reaches the DB.
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
  // Nullable text columns use `nullishText` so empty strings from HTML
  // form submissions are coerced to null at the schema layer (rather
  // than each handler call site doing its own `|| null` dance). See
  // `nullishText` definition above for the partial-unique-index
  // collision rationale.
  excerpt: nullishText(500),
  contentType: ContentTypeSchema,
  status: PostStatusSchema,
  metaTitle: nullishText(100),
  metaDescription: nullishText(160, 'Meta description cannot exceed 160 characters'),
  keywords: z.array(z.string().min(1).max(50)).max(10, 'Cannot have more than 10 keywords'),
  canonicalUrl: nullishUrl(),
  // Social card image fields reuse featuredImageSchema — same host
  // allowlist applies because these get scraped by Twitter/Facebook
  // unfurlers and would render broken if pointed at unwhitelisted CDNs.
  ogTitle: nullishText(100),
  ogDescription: nullishText(300),
  ogImage: featuredImageSchema,
  twitterTitle: nullishText(100),
  twitterDescription: nullishText(200),
  twitterImage: featuredImageSchema,
  featuredImage: featuredImageSchema,
  featuredImageAlt: nullishText(200),
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
    contentType: ContentTypeSchema.default('MARKDOWN'),
    status: PostStatusSchema.default('DRAFT'),
    keywords: z.array(z.string().min(1).max(50)).max(10).default([]),
  })
  .strict()

// PUT /api/blog/[slug] — every field optional, NO defaults (PATCH
// semantics). The base shape has no defaults, so `.partial()` produces
// the right thing: missing fields stay `undefined` instead of being
// filled in.
export const updateBlogPostSchema = z.object(blogPostBaseShape).partial().strict()

// =======================
// TAG / CATEGORY SCHEMAS
// =======================

// Hex color with a slate default, matching the DB column default (#6B7280).
const hexColor = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, 'Color must be a 6-digit hex value (e.g. #6B7280)')

export const createTagSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(60),
    description: nullishText(500),
    metaDescription: nullishText(160, 'Meta description cannot exceed 160 characters'),
    color: hexColor.default('#6B7280'),
  })
  .strict()

export const createCategorySchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(60),
    description: nullishText(500),
    metaTitle: nullishText(100),
    metaDescription: nullishText(160, 'Meta description cannot exceed 160 characters'),
    color: hexColor.default('#6B7280'),
    icon: nullishText(50),
    keywords: z.array(z.string().min(1).max(50)).max(10).default([]),
  })
  .strict()

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
    // Analytics-only field. Per WHATWG HTML
    // (html.spec.whatwg.org/multipage/dom.html#dom-document-referrer),
    // `document.referrer` is "a string (representing a URL)" with no
    // scheme guarantee, and is the empty string when not set. Real-world
    // values include '', http(s) URLs (often with fragments),
    // `android-app://com.foo.bar/` (Chrome Android app-to-web), and
    // extension URIs (`chrome-extension://`, `moz-extension://`). The
    // value is stored in postViews.referrer for aggregation only — never
    // rendered as href — so urlSchema's `/^https?$/` gate (designed to
    // block javascript:/data:/vbscript: in user-typed URL fields) is
    // inappropriate here. Length cap is the DoS guard; treat the stored
    // value as untrusted when surfacing in any admin UI (escape, never
    // use as href).
    referrer: z.string().max(2048).optional(),
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
