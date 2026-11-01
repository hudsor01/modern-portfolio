// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { PgDialect } from 'drizzle-orm/pg-core'

vi.mock('@/lib/api-admin-auth', () => ({
  isAdminRequest: vi.fn(() => false),
}))

const dbMocks = vi.hoisted(() => ({
  selectCount: vi.fn(),
  selectAggregates: vi.fn(),
  topPosts: vi.fn(),
  topCategories: vi.fn(),
  topTags: vi.fn(),
  monthlyViews: vi.fn(),
  popularKeywords: vi.fn(),
}))

// The analytics route fires nine queries in Promise.all and the order/shape
// of those queries differs. We discriminate inside the mock via a counter.
let selectCallIndex = 0

vi.mock('@/lib/db', () => {
  // The handler uses `db.select(<projection>).from(t).where?(...)` and
  // `db.query.blogPosts.findMany(...)`. We return distinct mock values per
  // sequential call to db.select(), matching the order in the route.
  // Order: count(blogPosts) → count(PUBLISHED) → count(DRAFT) → aggregates
  //        → query.findMany(top posts) → select categories → select tags
  //        → select monthly views → select popular keywords
  const sequence = [
    () => dbMocks.selectCount(), // total
    () => dbMocks.selectCount(), // published
    () => dbMocks.selectCount(), // draft
    () => dbMocks.selectAggregates(), // aggregates
    () => dbMocks.topCategories(),
    () => dbMocks.topTags(),
    () => dbMocks.monthlyViews(),
    () => dbMocks.popularKeywords(),
  ]
  const selectChain = () => {
    const idx = selectCallIndex++
    const fn = sequence[idx] ?? (() => Promise.resolve([]))
    const node: Record<string, unknown> = {}
    node.from = () => node
    node.where = () => node
    node.orderBy = () => node
    node.limit = () => node
    node.groupBy = () => node
    node.then = (...a: Parameters<Promise<unknown>['then']>) => fn().then(...a)
    return node
  }
  return {
    db: {
      query: { blogPosts: { findMany: dbMocks.topPosts } },
      select: selectChain,
    },
  }
})

vi.mock('@/lib/logger', () => ({
  createContextLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }),
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}))

import { GET } from '@/app/api/blog/analytics/route'
import { isAdminRequest } from '@/lib/api-admin-auth'

function req(query = '') {
  return new NextRequest(`http://localhost:3000/api/blog/analytics${query}`)
}

describe('GET /api/blog/analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    selectCallIndex = 0
    dbMocks.selectCount.mockResolvedValue([{ value: 0 }])
    dbMocks.selectAggregates.mockResolvedValue([
      { totalViews: 0, totalLikes: 0, totalShares: 0, totalComments: 0, avgReadingTime: 0 },
    ])
    dbMocks.topPosts.mockResolvedValue([])
    dbMocks.topCategories.mockResolvedValue([])
    dbMocks.topTags.mockResolvedValue([])
    dbMocks.monthlyViews.mockResolvedValue([])
    dbMocks.popularKeywords.mockResolvedValue([])
  })

  it('returns 200 with the full analytics shape on default 30d range', async () => {
    const res = await GET(req())
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toMatchObject({ success: true })
    expect(body.data).toMatchObject({
      publishedPosts: expect.any(Number),
      totalViews: expect.any(Number),
      totalInteractions: expect.any(Number),
      avgReadingTime: expect.any(Number),
      topPosts: expect.any(Array),
      topCategories: expect.any(Array),
      topTags: expect.any(Array),
      monthlyViews: expect.any(Array),
      popularKeywords: expect.any(Array),
    })
  })

  it('sets short Cache-Control on the analytics list', async () => {
    const res = await GET(req())
    expect(res.headers.get('Cache-Control')).toBe('public, max-age=60, s-maxage=120')
  })

  it.each(['7d', '30d', '90d', '1y'])('accepts timeRange=%s', async (range) => {
    const res = await GET(req(`?timeRange=${range}`))
    expect(res.status).toBe(200)
  })

  it('returns 400 for invalid timeRange enum', async () => {
    const res = await GET(req('?timeRange=999d'))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body).toMatchObject({
      success: false,
      error: 'Invalid timeRange; must be one of 7d, 30d, 90d, 1y',
    })
  })

  // Regression: anonymous callers were told how many unpublished posts exist,
  // and top posts / published counts included soft-deleted rows.
  describe('public visibility gate', () => {
    it('hides total/draft counts from anonymous callers', async () => {
      const body = await (await GET(req())).json()
      expect(body.data).not.toHaveProperty('totalPosts')
      expect(body.data).not.toHaveProperty('draftPosts')
    })

    it('gives admins the counts in a never-shared-cacheable response', async () => {
      vi.mocked(isAdminRequest).mockReturnValueOnce(true)
      const res = await GET(req())
      const body = await res.json()
      expect(body.data).toMatchObject({ totalPosts: 0, draftPosts: 0 })
      expect(res.headers.get('Cache-Control')).toBe('private, no-store, max-age=0, must-revalidate')
    })

    it('ranks only PUBLISHED, non-soft-deleted posts', async () => {
      await GET(req())
      const { sql, params } = new PgDialect().sqlToQuery(dbMocks.topPosts.mock.calls[0]?.[0]?.where)
      expect(sql).toBe('("blog_posts"."status" = $1 and "blog_posts"."deletedAt" is null)')
      expect(params).toEqual(['PUBLISHED'])
    })
  })

  it('returns 500 with sanitized error when a downstream query throws', async () => {
    dbMocks.selectCount.mockRejectedValueOnce(new Error('SELECT fail at /var/db'))
    const res = await GET(req())
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(JSON.stringify(body)).not.toContain('/var/db')
  })
})
