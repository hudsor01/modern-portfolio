// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'

vi.mock('@/lib/api-csrf', () => ({
  validateCSRFOrRespond: vi.fn(async () => null),
}))
vi.mock('@/lib/api-admin-auth', () => ({
  isAdminRequest: vi.fn(() => false),
}))

const dbMocks = vi.hoisted(() => ({
  findFirst: vi.fn(),
  insertVoid: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}))

vi.mock('@/lib/db', () => ({
  db: {
    query: {
      blogPosts: { findFirst: dbMocks.findFirst },
    },
    insert: () => ({
      values: () => ({
        then: (...a: Parameters<Promise<unknown>['then']>) => dbMocks.insertVoid().then(...a),
      }),
    }),
    update: () => ({
      set: () => {
        const p = dbMocks.update()
        return {
          where: () => p,
          // For the fire-and-forget viewCount increment that calls .catch directly.
          catch: (...a: Parameters<Promise<unknown>['catch']>) => p.catch(...a),
        }
      },
    }),
    delete: () => ({ where: () => dbMocks.delete() }),
  },
}))

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
  createContextLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }),
}))

import { GET, PUT, DELETE } from '@/app/api/blog/[slug]/route'
import { validateCSRFOrRespond } from '@/lib/api-csrf'
import { isAdminRequest } from '@/lib/api-admin-auth'

const sampleAuthorId = 'cl1234567890abcdefghijkl'
const samplePost = {
  id: 'post-1',
  title: 'Hello',
  slug: 'hello',
  excerpt: 'short',
  content: 'body',
  contentType: 'MARKDOWN' as const,
  status: 'PUBLISHED' as const,
  metaTitle: null,
  metaDescription: null,
  keywords: [] as string[],
  canonicalUrl: null,
  featuredImage: null,
  featuredImageAlt: null,
  readingTime: 1,
  wordCount: 1,
  publishedAt: new Date('2026-01-01T00:00:00Z'),
  scheduledAt: null,
  createdAt: new Date('2026-01-01T00:00:00Z'),
  updatedAt: new Date('2026-01-01T00:00:00Z'),
  authorId: sampleAuthorId,
  categoryId: null,
  viewCount: 0,
  likeCount: 0,
  shareCount: 0,
  commentCount: 0,
  deletedAt: null,
  author: null,
  category: null,
  tags: [] as Array<{ tag: unknown; tagId?: string }>,
}

function ctx(slug: string) {
  return { params: Promise.resolve({ slug }) }
}
function reqGet(slug: string, headers: Record<string, string> = {}) {
  return new NextRequest(`http://localhost:3000/api/blog/${slug}`, {
    headers: { 'x-forwarded-for': '1.2.3.4', ...headers },
  })
}
function reqPut(slug: string, body: unknown, headers: Record<string, string> = {}) {
  return new NextRequest(`http://localhost:3000/api/blog/${slug}`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': '1.2.3.4', ...headers },
    body: JSON.stringify(body),
  })
}
function reqDelete(slug: string, headers: Record<string, string> = {}) {
  return new NextRequest(`http://localhost:3000/api/blog/${slug}`, {
    method: 'DELETE',
    headers: { 'x-forwarded-for': '1.2.3.4', ...headers },
  })
}

describe('GET /api/blog/[slug]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(isAdminRequest).mockReturnValue(false)
    // Default: viewCount fire-and-forget update resolves successfully.
    dbMocks.update.mockResolvedValue(undefined)
    dbMocks.delete.mockResolvedValue(undefined)
    dbMocks.insertVoid.mockResolvedValue(undefined)
  })

  it('returns 404 when slug not found', async () => {
    dbMocks.findFirst.mockResolvedValueOnce(undefined)
    const res = await GET(reqGet('missing'), ctx('missing'))
    expect(res.status).toBe(404)
  })

  it('returns 200 with post data on a published post', async () => {
    dbMocks.findFirst.mockResolvedValueOnce(samplePost)
    const res = await GET(reqGet('hello'), ctx('hello'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toMatchObject({ success: true, data: { slug: 'hello' } })
    // Public-cacheable.
    expect(res.headers.get('Cache-Control')).toBe('public, max-age=300, s-maxage=600')
  })

  it('returns 404 to anonymous callers on a DRAFT post (cannot differentiate from missing)', async () => {
    dbMocks.findFirst.mockResolvedValueOnce({ ...samplePost, status: 'DRAFT' })
    const res = await GET(reqGet('hello'), ctx('hello'))
    expect(res.status).toBe(404)
  })

  it('returns 200 with private cache headers for admin viewing a DRAFT post', async () => {
    vi.mocked(isAdminRequest).mockReturnValueOnce(true)
    dbMocks.findFirst.mockResolvedValueOnce({ ...samplePost, status: 'DRAFT' })
    const res = await GET(reqGet('hello'), ctx('hello'))
    expect(res.status).toBe(200)
    expect(res.headers.get('Cache-Control')).toBe('private, no-store, max-age=0, must-revalidate')
  })

  it('returns 404 on soft-deleted post (deletedAt set) for anonymous caller', async () => {
    dbMocks.findFirst.mockResolvedValueOnce({ ...samplePost, deletedAt: new Date() })
    const res = await GET(reqGet('hello'), ctx('hello'))
    expect(res.status).toBe(404)
  })

  it('returns 500 with sanitized error when db throws', async () => {
    dbMocks.findFirst.mockRejectedValueOnce(new Error('SELECT explosion at /var/lib/postgres'))
    const res = await GET(reqGet('hello'), ctx('hello'))
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(JSON.stringify(body)).not.toContain('/var/lib/postgres')
  })
})

describe('PUT /api/blog/[slug]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(isAdminRequest).mockReturnValue(true)
    vi.mocked(validateCSRFOrRespond).mockResolvedValue(null)
  })

  it('returns 401 when admin token missing', async () => {
    vi.mocked(isAdminRequest).mockReturnValueOnce(false)
    const res = await PUT(reqPut('hello', { title: 'New' }), ctx('hello'))
    expect(res.status).toBe(401)
    expect(vi.mocked(validateCSRFOrRespond)).not.toHaveBeenCalled()
    expect(dbMocks.findFirst).not.toHaveBeenCalled()
  })

  it('returns 403 when CSRF guard responds (CSRF required for mutation)', async () => {
    vi.mocked(validateCSRFOrRespond).mockResolvedValueOnce(
      NextResponse.json({ success: false }, { status: 403 })
    )
    const res = await PUT(reqPut('hello', { title: 'New' }), ctx('hello'))
    expect(res.status).toBe(403)
    expect(dbMocks.findFirst).not.toHaveBeenCalled()
  })

  it('returns 404 when post does not exist', async () => {
    dbMocks.findFirst.mockResolvedValueOnce(undefined)
    const res = await PUT(reqPut('missing', { title: 'New' }), ctx('missing'))
    expect(res.status).toBe(404)
  })

  it('returns 200 on happy path with updated post', async () => {
    dbMocks.findFirst
      .mockResolvedValueOnce(samplePost) // existing-by-slug
      .mockResolvedValueOnce({ ...samplePost, title: 'Updated' }) // read-back
    dbMocks.update.mockResolvedValue(undefined)

    const res = await PUT(reqPut('hello', { title: 'Updated' }), ctx('hello'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toMatchObject({ success: true, message: 'Blog post updated successfully' })
  })
})

describe('DELETE /api/blog/[slug]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(isAdminRequest).mockReturnValue(true)
    vi.mocked(validateCSRFOrRespond).mockResolvedValue(null)
  })

  it('returns 401 when admin token missing', async () => {
    vi.mocked(isAdminRequest).mockReturnValueOnce(false)
    const res = await DELETE(reqDelete('hello'), ctx('hello'))
    expect(res.status).toBe(401)
    expect(vi.mocked(validateCSRFOrRespond)).not.toHaveBeenCalled()
    expect(dbMocks.findFirst).not.toHaveBeenCalled()
  })

  it('returns 403 when CSRF guard responds', async () => {
    vi.mocked(validateCSRFOrRespond).mockResolvedValueOnce(
      NextResponse.json({ success: false }, { status: 403 })
    )
    const res = await DELETE(reqDelete('hello'), ctx('hello'))
    expect(res.status).toBe(403)
    expect(dbMocks.findFirst).not.toHaveBeenCalled()
  })

  it('returns 404 when post not found', async () => {
    dbMocks.findFirst.mockResolvedValueOnce(undefined)
    const res = await DELETE(reqDelete('nope'), ctx('nope'))
    expect(res.status).toBe(404)
  })

  it('returns 200 success with deletion confirmation on happy path', async () => {
    dbMocks.findFirst.mockResolvedValueOnce({ ...samplePost, tags: [] })
    dbMocks.delete.mockResolvedValue(undefined)
    dbMocks.update.mockResolvedValue(undefined)

    const res = await DELETE(reqDelete('hello'), ctx('hello'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toMatchObject({
      success: true,
      message: 'Blog post deleted successfully',
      data: { success: true },
    })
  })
})
