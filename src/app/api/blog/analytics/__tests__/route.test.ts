// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

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
      totalPosts: expect.any(Number),
      publishedPosts: expect.any(Number),
      draftPosts: expect.any(Number),
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

  it('returns 500 with sanitized error when a downstream query throws', async () => {
    dbMocks.selectCount.mockRejectedValueOnce(new Error('SELECT fail at /var/db'))
    const res = await GET(req())
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(JSON.stringify(body)).not.toContain('/var/db')
  })
})
