// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'

vi.mock('@/lib/api-csrf', () => ({
  validateCSRFOrRespond: vi.fn(async () => null),
}))
vi.mock('@/lib/api-admin-auth', () => ({
  isAdminRequest: vi.fn(() => false),
}))
vi.mock('@/lib/api-rate-limit', () => ({
  checkRateLimitOrRespond: vi.fn(() => null),
  RateLimitPresets: { read: {}, write: {}, sensitive: {} },
}))

const dbMocks = vi.hoisted(() => ({
  findFirst: vi.fn(),
  insertVoid: vi.fn(),
  update: vi.fn(),
  updateSet: vi.fn(),
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
      set: (v: unknown) => {
        dbMocks.updateSet(v)
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

const sampleAuthorId = 'test-author-id-0000000000000000000001'
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

  it('accepts a bio-opener meta and stores one derived from the stored body', async () => {
    const bio =
      'I spent six years in the Texas Army National Guard as an Information Technology Specialist. That service included a deployment to Iraq. In the military, am...'
    const lede =
      'Salesloft is one of the most powerful sales engagement platforms available. Most teams configure it poorly.'
    dbMocks.findFirst
      .mockResolvedValueOnce(samplePost) // existing-by-slug
      .mockResolvedValueOnce({ content: `${bio}\n\n${lede}`, excerpt: null }) // stored body
      .mockResolvedValueOnce(samplePost) // read-back
    dbMocks.update.mockResolvedValue(undefined)
    const res = await PUT(reqPut('hello', { metaDescription: bio }), ctx('hello'))
    expect(res.status).toBe(200)
    expect(dbMocks.findFirst.mock.calls[1]?.[0]).toMatchObject({
      columns: { content: true, excerpt: true },
    })
    expect(dbMocks.updateSet.mock.calls[0]?.[0]).toMatchObject({ metaDescription: lede })
  })

  it('derives a bio-opener meta from the stored excerpt and leaves the omitted excerpt alone', async () => {
    const bio = 'I served in the National Guard for six years before moving into RevOps.'
    const storedExcerpt =
      'Stage definitions drift from how buyers decide. Here is how to pin them down.'
    dbMocks.findFirst
      .mockResolvedValueOnce(samplePost)
      .mockResolvedValueOnce({
        content: 'A body paragraph that is long enough to be a lede.',
        excerpt: storedExcerpt,
      })
      .mockResolvedValueOnce(samplePost)
    dbMocks.update.mockResolvedValue(undefined)
    const res = await PUT(reqPut('hello', { metaDescription: bio }), ctx('hello'))
    expect(res.status).toBe(200)
    const set = dbMocks.updateSet.mock.calls[0]?.[0]
    expect(set).toMatchObject({ metaDescription: storedExcerpt })
    expect(set).not.toHaveProperty('excerpt')
  })

  it('reads the stored excerpt for a bio meta sent with new content but no excerpt', async () => {
    const bio = 'I served in the National Guard for six years before moving into RevOps.'
    const storedExcerpt =
      'Coverage is a ratio, not a promise. Track it weekly against weighted quota.'
    dbMocks.findFirst
      .mockResolvedValueOnce(samplePost)
      .mockResolvedValueOnce({ content: 'old body', excerpt: storedExcerpt })
      .mockResolvedValueOnce(samplePost)
    dbMocks.update.mockResolvedValue(undefined)
    const res = await PUT(
      reqPut('hello', {
        content: `${bio}\n\nA brand new opening paragraph that is long enough to count.`,
        metaDescription: bio,
      }),
      ctx('hello')
    )
    expect(res.status).toBe(200)
    expect(dbMocks.findFirst).toHaveBeenCalledTimes(3)
    const set = dbMocks.updateSet.mock.calls[0]?.[0]
    expect(set).toMatchObject({ metaDescription: storedExcerpt })
    expect(set).not.toHaveProperty('excerpt')
  })

  it('derives a bio-opener meta and excerpt from new content without reading the stored body', async () => {
    const bio = 'I served in the National Guard for six years before moving into RevOps.'
    const lede =
      'Pipeline coverage is a ratio, not a promise. Track it weekly against stage-weighted quota.'
    dbMocks.findFirst.mockResolvedValueOnce(samplePost).mockResolvedValueOnce(samplePost)
    dbMocks.update.mockResolvedValue(undefined)
    const res = await PUT(
      reqPut('hello', { content: `${bio}\n\n${lede}`, excerpt: bio, metaDescription: bio }),
      ctx('hello')
    )
    expect(res.status).toBe(200)
    expect(dbMocks.findFirst).toHaveBeenCalledTimes(2)
    expect(dbMocks.updateSet.mock.calls[0]?.[0]).toMatchObject({
      excerpt: lede,
      metaDescription: lede,
    })
  })

  it('accepts a normal metaDescription on PUT', async () => {
    dbMocks.findFirst.mockResolvedValueOnce(samplePost).mockResolvedValueOnce(samplePost)
    dbMocks.update.mockResolvedValue(undefined)
    const res = await PUT(
      reqPut('hello', {
        metaDescription:
          'Seven ways CRM pipeline data drifts from reality, the reports that catch each one, and the systems, metrics and weekly inspection that keep pipeline accurate.',
      }),
      ctx('hello')
    )
    expect(res.status).toBe(200)
  })

  it('trims an over-long prose meta on PUT with no extra stored read', async () => {
    const prose =
      'Pipeline data drifts from reality in seven predictable ways. Each one has a report that catches it and a weekly inspection that keeps it honest. Teams that skip the inspection end up forecasting from stale stages.'
    dbMocks.findFirst.mockResolvedValueOnce(samplePost).mockResolvedValueOnce(samplePost)
    dbMocks.update.mockResolvedValue(undefined)
    const res = await PUT(reqPut('hello', { metaDescription: prose }), ctx('hello'))
    expect(res.status).toBe(200)
    // Cut at the last sentence end within 160 characters: no ellipsis.
    expect(dbMocks.updateSet.mock.calls[0]?.[0]?.metaDescription).toBe(
      'Pipeline data drifts from reality in seven predictable ways. Each one has a report that catches it and a weekly inspection that keeps it honest.'
    )
    expect(dbMocks.findFirst).toHaveBeenCalledTimes(2)
  })

  it('derives a markup-only over-long meta from the stored excerpt (one extra read)', async () => {
    dbMocks.findFirst
      .mockResolvedValueOnce(samplePost)
      .mockResolvedValueOnce({
        content: 'Body text.',
        excerpt: 'A real stored excerpt that describes the post.',
      })
      .mockResolvedValueOnce(samplePost)
    dbMocks.update.mockResolvedValue(undefined)
    const res = await PUT(reqPut('hello', { metaDescription: '&nbsp;'.repeat(40) }), ctx('hello'))
    expect(res.status).toBe(200)
    expect(dbMocks.findFirst).toHaveBeenCalledTimes(3)
    expect(dbMocks.updateSet.mock.calls[0]?.[0]?.metaDescription).toBe(
      'A real stored excerpt that describes the post.'
    )
  })

  it('normalizes a too-long SEO title to 43 chars and derives a cleared one from the title', async () => {
    const longTitle = 'A Post Title Long Enough That It Never Fits the Search Result Budget'
    dbMocks.findFirst
      .mockResolvedValueOnce({ ...samplePost, title: longTitle })
      .mockResolvedValueOnce(samplePost)
    dbMocks.update.mockResolvedValue(undefined)
    await PUT(
      reqPut('hello', {
        metaTitle: 'Optimizing Customer Lifetime Value Calculations (Formulas + Python)',
      }),
      ctx('hello')
    )
    expect(dbMocks.updateSet.mock.calls[0]?.[0]).toMatchObject({
      metaTitle: 'Optimizing Customer Lifetime Value',
    })

    dbMocks.updateSet.mockClear()
    dbMocks.findFirst
      .mockResolvedValueOnce({ ...samplePost, title: 'Short Stored Title' })
      .mockResolvedValueOnce(samplePost)
    await PUT(reqPut('hello', { metaTitle: null }), ctx('hello'))
    expect(dbMocks.updateSet.mock.calls[0]?.[0]).toMatchObject({ metaTitle: 'Short Stored Title' })
  })

  it('leaves the stored SEO title alone when the update does not send one', async () => {
    dbMocks.findFirst.mockResolvedValueOnce(samplePost).mockResolvedValueOnce(samplePost)
    dbMocks.update.mockResolvedValue(undefined)
    await PUT(reqPut('hello', { title: 'Updated' }), ctx('hello'))
    expect(dbMocks.updateSet.mock.calls[0]?.[0]).not.toHaveProperty('metaTitle')
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
