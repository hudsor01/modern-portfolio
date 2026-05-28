// @vitest-environment node
import { describe, it, expect } from 'vitest'
import {
  emailSchema,
  urlSchema,
  slugSchema,
  cuidSchema,
  phoneSchema,
  colorSchema,
  metaDescriptionSchema,
  keywordsSchema,
  dateSchema,
  datetimeSchema,
  PostStatusSchema,
  ContentTypeSchema,
  contactFormSchema,
  createBlogPostSchema,
  projectFilterSchema,
  viewTrackingSchema,
  paginationSchema,
  apiResponseSchema,
  paginatedResponseSchema,
  ValidationError,
  validate,
  safeValidate,
  nullishText,
  nullishUrl,
} from '@/lib/schemas'
import { z } from 'zod'
import { createId as createCuid2 } from '@paralleldrive/cuid2'

// Sample cuid v1 (Prisma-style). The project's `cuidSchema` is `z.cuid()`,
// which is Zod v4's legacy cuid (v1) validator. New IDs written by Drizzle
// use cuid2, which `z.cuid()` does NOT accept — see schemas.ts:38 BUG note in
// the test backfill report.
const validCuid = 'cmkdsj5vh000sl8br1ibux8w6'
const validCuid2 = createCuid2()

// ============================================================================
// Primitive schemas
// ============================================================================

describe('emailSchema', () => {
  it('accepts a valid email address', () => {
    expect(emailSchema.safeParse('user@example.com').success).toBe(true)
  })

  it('rejects malformed emails', () => {
    expect(emailSchema.safeParse('not-an-email').success).toBe(false)
    expect(emailSchema.safeParse('@example.com').success).toBe(false)
  })

  it('rejects emails over 254 characters', () => {
    const long = `${'a'.repeat(250)}@x.com`
    expect(emailSchema.safeParse(long).success).toBe(false)
  })
})

describe('urlSchema', () => {
  it('accepts an https URL', () => {
    expect(urlSchema.safeParse('https://example.com/path').success).toBe(true)
  })

  it('accepts an http URL', () => {
    expect(urlSchema.safeParse('http://example.com').success).toBe(true)
  })

  it('rejects non-URLs', () => {
    expect(urlSchema.safeParse('not a url').success).toBe(false)
  })

  it('rejects URLs over 2048 chars', () => {
    const long = `https://example.com/${'a'.repeat(2050)}`
    expect(urlSchema.safeParse(long).success).toBe(false)
  })

  // Protocol allowlist — bare z.url() accepts these because they are
  // WHATWG-valid URLs. The `protocol: /^https?$/` option rejects them
  // at the schema boundary. See SECURITY.md → Application.
  it('rejects javascript: URLs (XSS vector)', () => {
    expect(urlSchema.safeParse('javascript:alert(1)').success).toBe(false)
  })

  it('rejects data: URLs', () => {
    expect(urlSchema.safeParse('data:text/html,<script>evil</script>').success).toBe(false)
  })

  it('rejects vbscript: URLs', () => {
    expect(urlSchema.safeParse('vbscript:msgbox(1)').success).toBe(false)
  })

  it('rejects non-http(s) protocols (ftp, file)', () => {
    expect(urlSchema.safeParse('ftp://example.com').success).toBe(false)
    expect(urlSchema.safeParse('file:///etc/passwd').success).toBe(false)
  })
})

describe('nullishText', () => {
  const schema = nullishText(50)

  // `.optional()` wraps the union, so undefined short-circuits before
  // the transform branch fires. That's the right shape: PATCH clients
  // can OMIT a field (undefined) and the spread `body.X !== undefined`
  // distinguishes that from explicit clear (null).
  it('preserves undefined for omitted fields (does not coerce)', () => {
    expect(schema.parse(undefined)).toBeUndefined()
  })

  it('returns null for explicit null input (PATCH-clear semantics)', () => {
    expect(schema.parse(null)).toBeNull()
  })

  it('coerces empty string to null (HTML form clear)', () => {
    expect(schema.parse('')).toBeNull()
  })

  it('passes through a real string value unchanged (no trimming)', () => {
    expect(schema.parse('hello')).toBe('hello')
  })

  it('rejects strings over the max length', () => {
    expect(schema.safeParse('a'.repeat(51)).success).toBe(false)
  })

  it('honours a custom error message when provided', () => {
    const custom = nullishText(10, 'Too long, sorry')
    const result = custom.safeParse('a'.repeat(20))
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Too long, sorry')
    }
  })
})

describe('nullishUrl', () => {
  const schema = nullishUrl()

  // Same shape as nullishText: undefined preserved (omit), null
  // preserved (PATCH-clear), empty string coerced to null
  // (HTML form clear).
  it('preserves undefined for omitted fields', () => {
    expect(schema.parse(undefined)).toBeUndefined()
  })

  it('returns null for explicit null and empty string inputs', () => {
    expect(schema.parse(null)).toBeNull()
    expect(schema.parse('')).toBeNull()
  })

  it('accepts a valid URL', () => {
    expect(schema.parse('https://example.com')).toBe('https://example.com')
  })

  it('rejects non-URL strings', () => {
    expect(schema.safeParse('not-a-url').success).toBe(false)
  })

  it('rejects URLs over the max length', () => {
    const tiny = nullishUrl(20)
    expect(tiny.safeParse('https://example.com/this-is-too-long').success).toBe(false)
  })

  // Protocol allowlist — `canonicalUrl` flows through this helper and
  // is stored to blogPosts. Even though no current render path emits it,
  // a `javascript:` value in the DB is a footgun for any future consumer.
  it('rejects javascript: URLs (XSS vector for any future render path)', () => {
    expect(schema.safeParse('javascript:alert(1)').success).toBe(false)
  })

  it('rejects data: URLs', () => {
    expect(schema.safeParse('data:text/html,<script>evil</script>').success).toBe(false)
  })

  it('rejects vbscript: URLs', () => {
    expect(schema.safeParse('vbscript:msgbox(1)').success).toBe(false)
  })

  it('accepts http URLs in addition to https', () => {
    expect(schema.safeParse('http://example.com').success).toBe(true)
  })
})

describe('slugSchema', () => {
  it('accepts a kebab-case slug', () => {
    expect(slugSchema.safeParse('my-blog-post').success).toBe(true)
    expect(slugSchema.safeParse('post-123').success).toBe(true)
  })

  it('rejects slugs with uppercase letters', () => {
    expect(slugSchema.safeParse('My-Post').success).toBe(false)
  })

  it('rejects slugs with spaces', () => {
    expect(slugSchema.safeParse('my post').success).toBe(false)
  })

  it('rejects slugs with special chars', () => {
    expect(slugSchema.safeParse('my_post').success).toBe(false)
    expect(slugSchema.safeParse('post!').success).toBe(false)
  })

  it('rejects empty slug', () => {
    expect(slugSchema.safeParse('').success).toBe(false)
  })

  it('rejects slugs over 100 chars', () => {
    expect(slugSchema.safeParse('a'.repeat(101)).success).toBe(false)
  })
})

describe('cuidSchema', () => {
  it('accepts a legacy cuid v1 (Prisma-style)', () => {
    expect(cuidSchema.safeParse(validCuid).success).toBe(true)
  })

  it('accepts a cuid2 ID (new rows from src/db/cuid.ts)', () => {
    expect(cuidSchema.safeParse(validCuid2).success).toBe(true)
  })

  it('rejects a uuid', () => {
    expect(cuidSchema.safeParse('123e4567-e89b-12d3-a456-426614174000').success).toBe(false)
  })

  it('rejects empty string', () => {
    expect(cuidSchema.safeParse('').success).toBe(false)
  })

  it('rejects uppercase letters (cuid2 must be lowercase)', () => {
    expect(cuidSchema.safeParse('TZ4A98XXAT96IWS9ZMBRGJ3A').success).toBe(false)
  })

  it('rejects special characters', () => {
    expect(cuidSchema.safeParse('tz4a98xxat96iws9zmbrg-j3').success).toBe(false)
    expect(cuidSchema.safeParse('tz4a98xxat96iws9zmbrg_j3').success).toBe(false)
  })

  it('accepts short lowercase-alphanumeric strings (z.cuid2 has no min length)', () => {
    // z.cuid2() validates format only (must start with a letter, lowercase
    // alphanumeric); it does not enforce the spec's default 24-char length.
    // Document this so a future regression toward stricter validation is caught.
    expect(cuidSchema.safeParse('abc123').success).toBe(true)
  })

  it('surfaces the custom error message on rejection', () => {
    const result = cuidSchema.safeParse('not-a-cuid')
    expect(result.success).toBe(false)
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message)
      expect(messages.some((m) => m.includes('valid CUID'))).toBe(true)
    }
  })
})

describe('phoneSchema', () => {
  it('accepts a phone with optional plus prefix', () => {
    expect(phoneSchema.safeParse('+12025551234').success).toBe(true)
    expect(phoneSchema.safeParse('2025551234').success).toBe(true)
  })

  it('accepts undefined', () => {
    expect(phoneSchema.safeParse(undefined).success).toBe(true)
  })

  it('rejects letters', () => {
    expect(phoneSchema.safeParse('not-a-phone').success).toBe(false)
  })

  it('rejects too-short numbers', () => {
    expect(phoneSchema.safeParse('123').success).toBe(false)
  })
})

describe('colorSchema', () => {
  it('accepts 6-digit hex', () => {
    expect(colorSchema.safeParse('#aabbcc').success).toBe(true)
    expect(colorSchema.safeParse('#FFFFFF').success).toBe(true)
  })

  it('accepts 3-digit hex', () => {
    expect(colorSchema.safeParse('#abc').success).toBe(true)
  })

  it('accepts undefined', () => {
    expect(colorSchema.safeParse(undefined).success).toBe(true)
  })

  it('rejects without #', () => {
    expect(colorSchema.safeParse('aabbcc').success).toBe(false)
  })
})

describe('metaDescriptionSchema', () => {
  it('accepts strings up to 160 chars', () => {
    expect(metaDescriptionSchema.safeParse('a'.repeat(160)).success).toBe(true)
  })

  it('rejects strings over 160 chars', () => {
    expect(metaDescriptionSchema.safeParse('a'.repeat(161)).success).toBe(false)
  })

  it('accepts undefined', () => {
    expect(metaDescriptionSchema.safeParse(undefined).success).toBe(true)
  })
})

describe('keywordsSchema', () => {
  it('defaults to []', () => {
    const r = keywordsSchema.safeParse(undefined)
    expect(r.success).toBe(true)
    if (r.success) expect(r.data).toEqual([])
  })

  it('accepts up to 10 keywords', () => {
    expect(keywordsSchema.safeParse(['a', 'b', 'c']).success).toBe(true)
    expect(keywordsSchema.safeParse(Array(10).fill('kw')).success).toBe(true)
  })

  it('rejects more than 10 keywords', () => {
    expect(keywordsSchema.safeParse(Array(11).fill('kw')).success).toBe(false)
  })

  it('rejects keyword over 50 chars', () => {
    expect(keywordsSchema.safeParse(['a'.repeat(51)]).success).toBe(false)
  })
})

describe('dateSchema', () => {
  it('accepts YYYY-MM-DD strings', () => {
    expect(dateSchema.safeParse('2026-01-15').success).toBe(true)
  })

  it('accepts Date objects', () => {
    expect(dateSchema.safeParse(new Date()).success).toBe(true)
  })

  it('rejects malformed date strings', () => {
    expect(dateSchema.safeParse('15-01-2026').success).toBe(false)
    expect(dateSchema.safeParse('not-a-date').success).toBe(false)
  })
})

describe('datetimeSchema', () => {
  it('accepts ISO datetime', () => {
    expect(datetimeSchema.safeParse('2026-01-15T12:00:00Z').success).toBe(true)
  })

  it('accepts Date object', () => {
    expect(datetimeSchema.safeParse(new Date()).success).toBe(true)
  })

  it('rejects malformed strings', () => {
    expect(datetimeSchema.safeParse('not-a-datetime').success).toBe(false)
  })
})

describe('PostStatusSchema / ContentTypeSchema', () => {
  it('accepts known PostStatus values', () => {
    expect(PostStatusSchema.safeParse('PUBLISHED').success).toBe(true)
    expect(PostStatusSchema.safeParse('DRAFT').success).toBe(true)
  })

  it('rejects unknown PostStatus', () => {
    expect(PostStatusSchema.safeParse('NOT_A_STATUS').success).toBe(false)
  })

  it('accepts known ContentType values', () => {
    expect(ContentTypeSchema.safeParse('MARKDOWN').success).toBe(true)
  })

  it('rejects unknown ContentType', () => {
    expect(ContentTypeSchema.safeParse('PDF').success).toBe(false)
  })
})

// ============================================================================
// contactFormSchema
// ============================================================================

describe('contactFormSchema', () => {
  const valid = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    message: 'Hello, I would like to discuss a project.',
  }

  it('accepts a minimal valid submission', () => {
    expect(contactFormSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects name shorter than 2 chars', () => {
    expect(contactFormSchema.safeParse({ ...valid, name: 'A' }).success).toBe(false)
  })

  it('rejects name over 50 chars', () => {
    expect(contactFormSchema.safeParse({ ...valid, name: 'a'.repeat(51) }).success).toBe(false)
  })

  it('rejects message shorter than 10 chars', () => {
    expect(contactFormSchema.safeParse({ ...valid, message: 'short' }).success).toBe(false)
  })

  it('rejects message over 1000 chars', () => {
    expect(contactFormSchema.safeParse({ ...valid, message: 'a'.repeat(1001) }).success).toBe(false)
  })

  it('rejects malformed email', () => {
    expect(contactFormSchema.safeParse({ ...valid, email: 'nope' }).success).toBe(false)
  })

  it('accepts optional company and phone as empty strings', () => {
    expect(contactFormSchema.safeParse({ ...valid, company: '', phone: '' }).success).toBe(true)
  })

  it('accepts honeypot field (used for spam detection)', () => {
    expect(contactFormSchema.safeParse({ ...valid, honeypot: 'bot' }).success).toBe(true)
  })

  it('rejects unknown fields (.strict mode)', () => {
    expect(contactFormSchema.safeParse({ ...valid, evil: 'payload' }).success).toBe(false)
  })

  it('rejects phone with letters', () => {
    expect(contactFormSchema.safeParse({ ...valid, phone: 'abc' }).success).toBe(false)
  })
})

// ============================================================================
// createBlogPostSchema
// ============================================================================

describe('createBlogPostSchema', () => {
  const valid = {
    title: 'Test post',
    content: 'Some content',
    authorId: validCuid,
  }

  it('accepts a minimal valid post', () => {
    const r = createBlogPostSchema.safeParse(valid)
    expect(r.success).toBe(true)
    if (r.success) {
      expect(r.data.contentType).toBe('MARKDOWN')
      expect(r.data.status).toBe('DRAFT')
    }
  })

  it('rejects missing title', () => {
    const { title: _t, ...rest } = valid
    void _t
    expect(createBlogPostSchema.safeParse(rest).success).toBe(false)
  })

  it('rejects empty title', () => {
    expect(createBlogPostSchema.safeParse({ ...valid, title: '' }).success).toBe(false)
  })

  it('rejects title over 200 chars', () => {
    expect(createBlogPostSchema.safeParse({ ...valid, title: 'a'.repeat(201) }).success).toBe(false)
  })

  it('rejects empty content', () => {
    expect(createBlogPostSchema.safeParse({ ...valid, content: '' }).success).toBe(false)
  })

  it('rejects content over 100k chars', () => {
    expect(createBlogPostSchema.safeParse({ ...valid, content: 'a'.repeat(100_001) }).success).toBe(
      false
    )
  })

  it('rejects invalid cuid for authorId', () => {
    expect(createBlogPostSchema.safeParse({ ...valid, authorId: 'not-a-cuid' }).success).toBe(false)
  })

  it('rejects unknown fields (.strict mode)', () => {
    expect(createBlogPostSchema.safeParse({ ...valid, isAdmin: true }).success).toBe(false)
  })

  it('rejects more than 10 tagIds', () => {
    expect(
      createBlogPostSchema.safeParse({
        ...valid,
        tagIds: Array.from({ length: 11 }, () => validCuid),
      }).success
    ).toBe(false)
  })
})

// ============================================================================
// projectFilterSchema
// ============================================================================

describe('projectFilterSchema', () => {
  it('accepts an empty object', () => {
    expect(projectFilterSchema.safeParse({}).success).toBe(true)
  })

  it('accepts all known fields', () => {
    expect(
      projectFilterSchema.safeParse({
        category: 'analytics',
        technology: 'react',
        featured: true,
        search: 'foo',
        tags: ['a', 'b'],
      }).success
    ).toBe(true)
  })

  it('rejects unknown fields (.strict mode)', () => {
    expect(projectFilterSchema.safeParse({ rogue: 'bad' }).success).toBe(false)
  })

  it('rejects search over 200 chars', () => {
    expect(projectFilterSchema.safeParse({ search: 'a'.repeat(201) }).success).toBe(false)
  })
})

// ============================================================================
// viewTrackingSchema
// ============================================================================

describe('viewTrackingSchema', () => {
  it('accepts a project view', () => {
    expect(viewTrackingSchema.safeParse({ type: 'project', slug: 'my-proj' }).success).toBe(true)
  })

  it('accepts a blog view with optional fields', () => {
    expect(
      viewTrackingSchema.safeParse({
        type: 'blog',
        slug: 'my-post',
        readingTime: 120,
        scrollDepth: 75,
      }).success
    ).toBe(true)
  })

  it('rejects unknown type', () => {
    expect(viewTrackingSchema.safeParse({ type: 'video', slug: 'x' }).success).toBe(false)
  })

  it('rejects scrollDepth over 100', () => {
    expect(
      viewTrackingSchema.safeParse({ type: 'blog', slug: 'x', scrollDepth: 101 }).success
    ).toBe(false)
  })

  it('rejects unknown fields (.strict mode)', () => {
    expect(viewTrackingSchema.safeParse({ type: 'blog', slug: 'x', evil: true }).success).toBe(
      false
    )
  })

  // Referrer is informational, not a security boundary. The field accepts
  // any string up to 2048 chars — including the empty-string default for
  // direct navigation and non-http(s) schemes Chrome uses on Android
  // (android-app://, intent://, chrome-extension://, etc.) — because the
  // value is stored for aggregation and never rendered as an href.
  it('accepts empty-string referrer (document.referrer default)', () => {
    expect(viewTrackingSchema.safeParse({ type: 'blog', slug: 'x', referrer: '' }).success).toBe(
      true
    )
  })

  it('accepts non-http(s) referrer schemes (Android app, browser extension)', () => {
    expect(
      viewTrackingSchema.safeParse({
        type: 'blog',
        slug: 'x',
        referrer: 'android-app://com.google.android.googlequicksearchbox/',
      }).success
    ).toBe(true)
    expect(
      viewTrackingSchema.safeParse({
        type: 'blog',
        slug: 'x',
        referrer: 'chrome-extension://abcdefghijklmnop/popup.html',
      }).success
    ).toBe(true)
  })

  it('rejects referrer over 2048 chars (DoS cap)', () => {
    expect(
      viewTrackingSchema.safeParse({ type: 'blog', slug: 'x', referrer: 'a'.repeat(2049) }).success
    ).toBe(false)
  })
})

// ============================================================================
// paginationSchema
// ============================================================================

describe('paginationSchema', () => {
  it('applies defaults when fields absent', () => {
    const r = paginationSchema.safeParse({})
    expect(r.success).toBe(true)
    if (r.success) expect(r.data).toEqual({ page: 1, limit: 10 })
  })

  it('coerces string values from URL params', () => {
    const r = paginationSchema.safeParse({ page: '5', limit: '25' })
    expect(r.success).toBe(true)
    if (r.success) expect(r.data.page).toBe(5)
  })

  it('rejects limit > 100', () => {
    expect(paginationSchema.safeParse({ limit: 101 }).success).toBe(false)
  })

  it('rejects page < 1', () => {
    expect(paginationSchema.safeParse({ page: 0 }).success).toBe(false)
  })

  it('does NOT reject extra unknown fields (not strict)', () => {
    expect(paginationSchema.safeParse({ utm_source: 'twitter' }).success).toBe(true)
  })
})

// ============================================================================
// Response wrapper schemas
// ============================================================================

describe('apiResponseSchema', () => {
  const wrapped = apiResponseSchema(z.object({ id: z.string() }))

  it('accepts a valid wrapped success', () => {
    expect(wrapped.safeParse({ success: true, data: { id: 'x' } }).success).toBe(true)
  })

  it('rejects when data fails inner schema', () => {
    expect(wrapped.safeParse({ success: true, data: { id: 123 } }).success).toBe(false)
  })

  it('rejects missing success', () => {
    expect(wrapped.safeParse({ data: { id: 'x' } }).success).toBe(false)
  })
})

describe('paginatedResponseSchema', () => {
  const wrapped = paginatedResponseSchema(z.object({ id: z.string() }))

  it('accepts a valid paginated response', () => {
    expect(
      wrapped.safeParse({
        success: true,
        data: [{ id: 'a' }],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      }).success
    ).toBe(true)
  })

  it('rejects missing pagination', () => {
    expect(wrapped.safeParse({ success: true, data: [] }).success).toBe(false)
  })
})

// ============================================================================
// ValidationError + validate + safeValidate
// ============================================================================

describe('ValidationError.fromZodError', () => {
  it('flattens issues into details record keyed by path', () => {
    const schema = z.object({ name: z.string().min(2), age: z.number() })
    const result = schema.safeParse({ name: 'A', age: 'oops' })
    expect(result.success).toBe(false)
    if (!result.success) {
      const ve = ValidationError.fromZodError(result.error)
      expect(ve).toBeInstanceOf(ValidationError)
      expect(ve.message).toBe('Validation failed')
      expect(ve.details?.name?.length).toBeGreaterThan(0)
      expect(ve.details?.age?.length).toBeGreaterThan(0)
    }
  })

  it('keys top-level issues as "root"', () => {
    const schema = z.string()
    const result = schema.safeParse(123)
    expect(result.success).toBe(false)
    if (!result.success) {
      const ve = ValidationError.fromZodError(result.error)
      expect(ve.details?.root?.length).toBeGreaterThan(0)
    }
  })
})

describe('validate', () => {
  it('returns parsed data on success', () => {
    const r = validate(z.string(), 'ok')
    expect(r).toBe('ok')
  })

  it('throws ValidationError on failure', () => {
    expect(() => validate(z.string(), 123)).toThrow(ValidationError)
  })
})

describe('safeValidate', () => {
  it('returns success result with data', () => {
    const r = safeValidate(z.string(), 'ok')
    expect(r).toEqual({ success: true, data: 'ok' })
  })

  it('returns failure result with ZodError', () => {
    const r = safeValidate(z.string(), 123)
    expect(r.success).toBe(false)
    if (!r.success) {
      expect(r.error).toBeInstanceOf(z.ZodError)
    }
  })
})
