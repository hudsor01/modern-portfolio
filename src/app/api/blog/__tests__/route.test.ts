// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'
import { PgDialect } from 'drizzle-orm/pg-core'
import { normalizeStoredSeoText } from '@/lib/blog-excerpt'

// Disable rate limiting and CSRF guards by default — exercise them via
// explicit overrides per test.
vi.mock('@/lib/api-rate-limit', () => ({
  checkRateLimitOrRespond: vi.fn(() => null),
  RateLimitPresets: { read: {}, write: {}, sensitive: {} },
}))
vi.mock('@/lib/api-csrf', () => ({
  validateCSRFOrRespond: vi.fn(async () => null),
}))
vi.mock('@/lib/api-admin-auth', () => ({
  isAdminRequest: vi.fn(() => false),
}))

// Mock the db module — the route uses db.query.blogPosts.findMany / findFirst
// for relational reads, db.select(...).from() for counts, db.insert(...).values(...).returning()
// for writes, and db.update(...).set(...).where(...) for counters.
// vi.hoisted lifts these mocks above the hoisted vi.mock factories so the
// factory closures can reference them at call time without TDZ errors.
const dbMocks = vi.hoisted(() => ({
  findMany: vi.fn(),
  findFirst: vi.fn(),
  selectCount: vi.fn(),
  countWhere: vi.fn(),
  insertReturning: vi.fn(),
  insertVoid: vi.fn(),
  insertValues: vi.fn(),
  update: vi.fn(),
}))
vi.mock('@/lib/db', () => {
  const fromBuilder = () => {
    const p = dbMocks.selectCount()
    return {
      where: (w: unknown) => {
        dbMocks.countWhere(w)
        return p
      },
      then: (...a: Parameters<Promise<unknown>['then']>) => p.then(...a),
      catch: (...a: Parameters<Promise<unknown>['catch']>) => p.catch(...a),
    }
  }
  return {
    db: {
      query: {
        blogPosts: { findMany: dbMocks.findMany, findFirst: dbMocks.findFirst },
      },
      select: () => ({ from: () => fromBuilder() }),
      insert: () => ({
        values: (v: unknown) => {
          dbMocks.insertValues(v)
          const voidP = dbMocks.insertVoid()
          return {
            returning: () => dbMocks.insertReturning(),
            then: (...a: Parameters<Promise<unknown>['then']>) => voidP.then(...a),
            catch: (...a: Parameters<Promise<unknown>['catch']>) => voidP.catch(...a),
          }
        },
      }),
      update: () => ({ set: () => ({ where: () => dbMocks.update() }) }),
    },
  }
})

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
  createContextLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }),
}))

import { GET, POST } from '@/app/api/blog/route'
import { validateCSRFOrRespond } from '@/lib/api-csrf'
import { checkRateLimitOrRespond } from '@/lib/api-rate-limit'
import { isAdminRequest } from '@/lib/api-admin-auth'

const sampleAuthorId = 'cl0000000000000000000001'
const sampleCategoryId = 'cl9876543210abcdefghijkl'

const samplePost = {
  id: 'post-id-1',
  title: 'Hello',
  slug: 'hello',
  excerpt: 'short',
  content: '# h',
  contentType: 'MARKDOWN' as const,
  status: 'PUBLISHED' as const,
  metaTitle: null,
  metaDescription: null,
  keywords: [] as string[],
  canonicalUrl: null,
  featuredImage: null,
  featuredImageAlt: null,
  readingTime: 1,
  wordCount: 2,
  publishedAt: new Date('2026-01-01T00:00:00Z'),
  scheduledAt: null,
  createdAt: new Date('2026-01-01T00:00:00Z'),
  updatedAt: new Date('2026-01-01T00:00:00Z'),
  authorId: sampleAuthorId,
  categoryId: sampleCategoryId,
  viewCount: 0,
  likeCount: 0,
  shareCount: 0,
  commentCount: 0,
  deletedAt: null,
  author: {
    id: sampleAuthorId,
    name: 'R',
    email: 'r@x.com',
    slug: 'r',
    bio: null,
    avatar: null,
    website: null,
    totalPosts: 1,
    totalViews: 0,
    createdAt: new Date('2026-01-01T00:00:00Z'),
  },
  category: {
    id: sampleCategoryId,
    name: 'Cat',
    slug: 'cat',
    description: null,
    color: null,
    icon: null,
    postCount: 1,
    totalViews: 0,
    createdAt: new Date('2026-01-01T00:00:00Z'),
  },
  tags: [] as Array<{ tag: unknown }>,
}

function reqGet(query = '', headers: Record<string, string> = {}) {
  return new NextRequest(`http://localhost:3000/api/blog${query}`, {
    headers: { 'x-forwarded-for': '1.2.3.4', ...headers },
  })
}
function reqPost(body: unknown, headers: Record<string, string> = {}) {
  return new NextRequest('http://localhost:3000/api/blog', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': '1.2.3.4', ...headers },
    body: JSON.stringify(body),
  })
}

/**
 * Reset every shared mock to its default before each test. `vi.clearAllMocks`
 * clears call history but keeps implementations and unconsumed `…Once` values,
 * so the POST block's `isAdminRequest → true` leaked into GET tests whenever
 * test order changed (exposed by `--sequence.shuffle`).
 */
function resetSharedMocks() {
  vi.clearAllMocks()
  vi.mocked(checkRateLimitOrRespond).mockReset().mockReturnValue(null)
  vi.mocked(validateCSRFOrRespond).mockReset().mockResolvedValue(null)
  vi.mocked(isAdminRequest).mockReset().mockReturnValue(false)
  for (const mock of Object.values(dbMocks)) mock.mockReset()
}

describe('GET /api/blog', () => {
  beforeEach(() => {
    resetSharedMocks()
    dbMocks.findMany.mockResolvedValue([samplePost])
    dbMocks.selectCount.mockResolvedValue([{ value: 1 }])
  })

  it('returns 200 with paginated success+data shape', async () => {
    const res = await GET(reqGet())
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toMatchObject({
      success: true,
      pagination: { page: 1, limit: expect.any(Number), total: 1 },
    })
    expect(Array.isArray(body.data)).toBe(true)
    expect(body.data[0]).toMatchObject({ slug: 'hello' })
  })

  it('sets public-cacheable headers on the list', async () => {
    const res = await GET(reqGet())
    expect(res.headers.get('Cache-Control')).toBe('public, max-age=60, s-maxage=300')
  })

  it('short-circuits with rate-limit response', async () => {
    vi.mocked(checkRateLimitOrRespond).mockReturnValueOnce(
      NextResponse.json({ success: false }, { status: 429 })
    )
    const res = await GET(reqGet())
    expect(res.status).toBe(429)
    expect(dbMocks.findMany).not.toHaveBeenCalled()
  })

  it('returns 500 with sanitized error when db throws', async () => {
    dbMocks.findMany.mockRejectedValueOnce(new Error('SELECT failed at /var/lib/postgres'))
    const res = await GET(reqGet())
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.success).toBe(false)
    expect(JSON.stringify(body)).not.toContain('/var/lib/postgres')
  })

  it('rejects an invalid status query param with 400 (not a 500 from the enum query)', async () => {
    const res = await GET(reqGet('?status=BOGUS'))
    expect(res.status).toBe(400)
    expect(dbMocks.findMany).not.toHaveBeenCalled()
  })

  it('accepts a valid PostStatus query param', async () => {
    const res = await GET(reqGet('?status=PUBLISHED'))
    expect(res.status).toBe(200)
  })

  // Regression: the gate used to apply only when a caller sent neither
  // `status` nor `published`, so anonymous `?status=DRAFT` / `?published=false`
  // listed unpublished posts with full content. These compile the WHERE clause
  // that actually reached the query, not the intermediate filters object.
  describe('public visibility gate', () => {
    const listWhere = () => dbMocks.findMany.mock.calls[0]?.[0]?.where
    const whereSql = () => new PgDialect().sqlToQuery(listWhere())

    it.each([
      '',
      '?status=DRAFT',
      '?status=SCHEDULED,ARCHIVED',
      '?status=PUBLISHED',
      '?published=false',
      '?status=DRAFT&published=false',
    ])('anonymous "%s" sees only PUBLISHED, non-deleted posts', async (query) => {
      const res = await GET(reqGet(query))
      expect(res.status).toBe(200)
      // Exact SQL, so an and→or or eq→ne slip in buildBlogWhereClause fails here.
      const { sql, params } = whereSql()
      expect(sql).toBe('("blog_posts"."status" = $1 and "blog_posts"."deletedAt" is null)')
      expect(params).toEqual(['PUBLISHED'])
      // The pagination total must count the same rows, or it leaks how many
      // unpublished posts exist.
      expect(dbMocks.countWhere).toHaveBeenCalledWith(listWhere())
      expect(res.headers.get('Cache-Control')).toBe('public, max-age=60, s-maxage=300')
    })

    it('admin ?status=DRAFT gets drafts, never shared-cacheable', async () => {
      vi.mocked(isAdminRequest).mockReturnValueOnce(true)
      const res = await GET(reqGet('?status=DRAFT'))
      expect(res.status).toBe(200)
      const { sql, params } = whereSql()
      expect(params).toEqual(['DRAFT'])
      expect(sql).not.toContain('"deletedAt" is null')
      expect(dbMocks.countWhere).toHaveBeenCalledWith(listWhere())
      expect(res.headers.get('Cache-Control')).toBe('private, no-store, max-age=0, must-revalidate')
    })

    it('admin with no filters sees every status, never shared-cacheable', async () => {
      vi.mocked(isAdminRequest).mockReturnValueOnce(true)
      const res = await GET(reqGet())
      expect(listWhere()).toBeUndefined()
      expect(dbMocks.countWhere).toHaveBeenCalledWith(undefined)
      expect(res.headers.get('Cache-Control')).toBe('private, no-store, max-age=0, must-revalidate')
    })
  })

  it.each([
    '?dateFrom=garbage&dateTo=2030-01-01',
    '?dateFrom=2026-01-01&dateTo=not-a-date',
    '?dateFrom=0000-01-01&dateTo=2030-01-01',
    '?dateFrom=2026-01-01&dateTo=%2B010000-01-01',
  ])('rejects an unqueryable date range "%s" with 400, not a 500', async (query) => {
    const res = await GET(reqGet(query))
    expect(res.status).toBe(400)
    expect(dbMocks.findMany).not.toHaveBeenCalled()
  })

  it('accepts a valid ISO date range', async () => {
    const res = await GET(reqGet('?dateFrom=2026-01-01&dateTo=2026-12-31'))
    expect(res.status).toBe(200)
  })
})

describe('POST /api/blog', () => {
  beforeEach(() => {
    resetSharedMocks()
    vi.mocked(isAdminRequest).mockReturnValue(true)
    // findFirst by slug → no existing post; then second findFirst for read-back returns the new post.
    dbMocks.findFirst.mockResolvedValueOnce(undefined).mockResolvedValueOnce(samplePost)
    dbMocks.insertReturning.mockResolvedValue([{ id: samplePost.id }])
    dbMocks.insertVoid.mockResolvedValue(undefined)
    dbMocks.update.mockResolvedValue(undefined)
  })

  const validBody = {
    title: 'Hello World',
    content: 'This is content with at least one word.',
    authorId: sampleAuthorId,
    status: 'DRAFT' as const,
  }

  it('stores an SEO title within 43 chars, derived when missing or too long', async () => {
    await POST(
      reqPost({
        ...validBody,
        metaTitle: 'Salesloft vs Outreach: How to Choose the Right Platform for Your Team',
      })
    )
    expect(dbMocks.insertValues.mock.calls[0]?.[0]).toMatchObject({
      metaTitle: 'Hello World',
    })

    resetSharedMocks()
    vi.mocked(isAdminRequest).mockReturnValue(true)
    dbMocks.findFirst.mockResolvedValueOnce(undefined).mockResolvedValueOnce(samplePost)
    dbMocks.insertReturning.mockResolvedValue([{ id: samplePost.id }])
    dbMocks.insertVoid.mockResolvedValue(undefined)
    await POST(reqPost(validBody))
    expect(dbMocks.insertValues.mock.calls[0]?.[0]).toMatchObject({ metaTitle: 'Hello World' })
  })

  it('returns 401 when admin token missing', async () => {
    vi.mocked(isAdminRequest).mockReturnValueOnce(false)
    const res = await POST(reqPost(validBody))
    expect(res.status).toBe(401)
    expect(vi.mocked(validateCSRFOrRespond)).not.toHaveBeenCalled()
    expect(dbMocks.findFirst).not.toHaveBeenCalled()
  })

  it('returns 403 when CSRF guard responds', async () => {
    vi.mocked(validateCSRFOrRespond).mockResolvedValueOnce(
      NextResponse.json({ success: false }, { status: 403 })
    )
    const res = await POST(reqPost(validBody))
    expect(res.status).toBe(403)
    expect(dbMocks.findFirst).not.toHaveBeenCalled()
  })

  it('accepts a bio-opener meta and excerpt and stores ones derived from the body', async () => {
    const bio =
      'I spent six years in the Texas Army National Guard as an Information Technology Specialist, including a deployment to Iraq. I learned quickly that when equ...'
    const lede =
      'Forecasts miss when stage definitions drift from how buyers actually decide. Here is how to fix it.'
    const res = await POST(
      reqPost({
        ...validBody,
        content: `${bio}\n\n${lede}`,
        excerpt: bio,
        metaDescription: bio,
      })
    )
    expect(res.status).toBe(201)
    expect(dbMocks.insertValues.mock.calls[0]?.[0]).toMatchObject({
      excerpt: lede,
      metaDescription: lede,
    })
  })

  it('normalizes a bio excerpt sent without a meta and leaves the meta unset', async () => {
    const bio = 'I served in the National Guard for six years before moving into RevOps.'
    const lede =
      'Win rates fall when discovery skips the economic buyer. Fix the qualification step.'
    const res = await POST(reqPost({ ...validBody, content: `${bio}\n\n${lede}`, excerpt: bio }))
    expect(res.status).toBe(201)
    const values = dbMocks.insertValues.mock.calls[0]?.[0]
    expect(values).toMatchObject({ excerpt: lede })
    expect(values.metaDescription ?? null).toBeNull()
  })

  it('stores a normal meta and excerpt exactly as sent', async () => {
    const meta =
      'Seven ways CRM pipeline data drifts from reality, the reports that catch each one, and the systems that keep it accurate.'
    const res = await POST(
      reqPost({ ...validBody, excerpt: 'A short, real excerpt.', metaDescription: meta })
    )
    expect(res.status).toBe(201)
    expect(dbMocks.insertValues.mock.calls[0]?.[0]).toMatchObject({
      excerpt: 'A short, real excerpt.',
      metaDescription: meta,
    })
  })

  const PROSE_META =
    'Pipeline data drifts from reality in seven predictable ways. Each one has a report that catches it and a weekly inspection that keeps it honest. Teams that skip the inspection end up forecasting from stale stages.'

  it('trims a 161+ character prose meta at a sentence end and returns 201', async () => {
    expect(PROSE_META.length).toBeGreaterThan(160)
    const res = await POST(reqPost({ ...validBody, metaDescription: PROSE_META }))
    expect(res.status).toBe(201)
    const stored = dbMocks.insertValues.mock.calls[0]?.[0]?.metaDescription as string
    expect(stored.length).toBeLessThanOrEqual(160)
    expect(stored).toBe(
      normalizeStoredSeoText({
        excerpt: undefined,
        metaDescription: PROSE_META,
        content: validBody.content,
      }).metaDescription
    )
  })

  it('cuts a 161-character unbroken meta to 159 characters plus one ellipsis', async () => {
    const res = await POST(reqPost({ ...validBody, metaDescription: 'x'.repeat(161) }))
    expect(res.status).toBe(201)
    expect(dbMocks.insertValues.mock.calls[0]?.[0]?.metaDescription).toBe(`${'x'.repeat(159)}…`)
  })

  it('accepts a 5000-character meta and stores at most 160 characters', async () => {
    const res = await POST(reqPost({ ...validBody, metaDescription: `${'word '.repeat(1000)}end` }))
    expect(res.status).toBe(201)
    const stored = dbMocks.insertValues.mock.calls[0]?.[0]?.metaDescription as string
    expect(stored.length).toBeLessThanOrEqual(160)
    expect(stored.match(/…/g)?.length ?? 0).toBeLessThanOrEqual(1)
  })

  it('names the field when a meta is genuinely invalid (wrong type)', async () => {
    const res = await POST(reqPost({ ...validBody, metaDescription: 123 }))
    expect(res.status).toBe(400)
    expect(await res.json()).toMatchObject({ success: false })
    expect(dbMocks.insertValues).not.toHaveBeenCalled()
  })

  it('returns 400 when body fails strict createBlogPostSchema validation', async () => {
    // Missing required fields (title, content, authorId) → schema reject.
    const res = await POST(reqPost({ excerpt: 'too short' }))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.success).toBe(false)
    expect(body.error).toMatch(/^Invalid request body: /)
    for (const field of ['title', 'content', 'authorId']) {
      expect(body.error).toContain(`${field}: `)
    }
  })

  it('rejects unknown fields (.strict() mass-assignment guard)', async () => {
    const res = await POST(reqPost({ ...validBody, isAdmin: true, internalFlag: 'pwn' }))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/^Invalid request body: Unrecognized keys?: /)
    expect(body.error).toContain('isAdmin')
    expect(body.error).toContain('internalFlag')
  })

  it('returns 409 when slug already exists', async () => {
    dbMocks.findFirst.mockReset()
    dbMocks.findFirst.mockResolvedValueOnce({ id: 'existing-id' })
    const res = await POST(reqPost(validBody))
    expect(res.status).toBe(409)
    const body = await res.json()
    expect(body.success).toBe(false)
  })

  it('returns 201 on happy path with computed reading-time', async () => {
    const res = await POST(reqPost(validBody))
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body).toMatchObject({
      success: true,
      message: 'Blog post created successfully',
    })
    expect(body.data).toMatchObject({ slug: 'hello' })
  })

  it('returns 500 with sanitized error when insert throws', async () => {
    dbMocks.findFirst.mockReset()
    dbMocks.findFirst.mockResolvedValueOnce(undefined)
    dbMocks.insertReturning.mockRejectedValueOnce(new Error('INSERT failed at /var/lib/postgres'))
    const res = await POST(reqPost(validBody))
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.success).toBe(false)
    expect(JSON.stringify(body)).not.toContain('/var/lib/postgres')
  })
})
