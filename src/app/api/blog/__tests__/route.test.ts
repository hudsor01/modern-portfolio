// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'

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
  insertReturning: vi.fn(),
  insertVoid: vi.fn(),
  update: vi.fn(),
}))
vi.mock('@/lib/db', () => {
  const fromBuilder = () => {
    const p = dbMocks.selectCount()
    return {
      where: () => p,
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
        values: () => {
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

describe('GET /api/blog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(checkRateLimitOrRespond).mockReturnValue(null)
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
})

describe('POST /api/blog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(checkRateLimitOrRespond).mockReturnValue(null)
    vi.mocked(validateCSRFOrRespond).mockResolvedValue(null)
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

  it('returns 400 when body fails strict createBlogPostSchema validation', async () => {
    // Missing required fields (title, content, authorId) → schema reject.
    const res = await POST(reqPost({ excerpt: 'too short' }))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body).toMatchObject({ success: false, error: 'Invalid request body' })
  })

  it('rejects unknown fields (.strict() mass-assignment guard)', async () => {
    const res = await POST(reqPost({ ...validBody, isAdmin: true, internalFlag: 'pwn' }))
    expect(res.status).toBe(400)
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
