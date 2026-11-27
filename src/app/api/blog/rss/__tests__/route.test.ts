// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { PgDialect } from 'drizzle-orm/pg-core'

const dbMocks = vi.hoisted(() => ({
  findMany: vi.fn(),
}))

vi.mock('@/lib/db', () => ({
  db: {
    query: {
      blogPosts: { findMany: dbMocks.findMany },
    },
  },
}))

vi.mock('@/lib/logger', () => ({
  createContextLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }),
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}))

import { GET } from '@/app/api/blog/rss/route'
import { resolvePostLede } from '@/lib/blog-excerpt'

const fakePosts = [
  {
    id: 'p1',
    title: 'First Post',
    slug: 'first',
    excerpt: 'Short summary',
    metaDescription: null,
    publishedAt: new Date('2026-01-01T00:00:00Z'),
    createdAt: new Date('2025-12-31T00:00:00Z'),
    author: { name: 'Richard Hudson' },
    category: { name: 'Revenue Operations' },
  },
  {
    id: 'p2',
    title: 'Second & Special <chars>',
    slug: 'second',
    excerpt: null,
    metaDescription: 'fallback',
    publishedAt: new Date('2026-02-01T00:00:00Z'),
    createdAt: new Date('2026-01-31T00:00:00Z'),
    author: null,
    category: null,
  },
]

function req(query = '') {
  return new NextRequest(`http://localhost:3000/api/blog/rss${query}`)
}

describe('GET /api/blog/rss', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    dbMocks.findMany.mockResolvedValue(fakePosts)
  })

  it('returns 200 JSON with success+data shape for ?format=json', async () => {
    const res = await GET(req('?format=json'))
    expect(res.status).toBe(200)
    expect(res.headers.get('Cache-Control')).toBe('public, max-age=3600, s-maxage=7200')
    const body = await res.json()
    expect(body).toMatchObject({ success: true })
    expect(body.data).toMatchObject({
      title: expect.any(String),
      link: 'https://richardwhudsonjr.com/blog',
      language: 'en-us',
    })
    expect(body.data.posts).toHaveLength(2)
    expect(body.data.posts[0]).toMatchObject({
      title: 'First Post',
      link: 'https://richardwhudsonjr.com/blog/first',
    })
  })

  it('falls back to metaDescription when excerpt is null', async () => {
    const res = await GET(req('?format=json'))
    const body = await res.json()
    expect(body.data.posts[1].description).toBe('fallback')
  })

  it('falls back to default author/category when author/category null', async () => {
    const res = await GET(req('?format=json'))
    const body = await res.json()
    expect(body.data.posts[1].author).toBe('Richard Hudson')
    expect(body.data.posts[1].category).toBe('Revenue Operations')
  })

  it('serves RSS 2.0 XML on the bare URL', async () => {
    const res = await GET(req())
    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toBe('application/rss+xml; charset=utf-8')
    expect(res.headers.get('Cache-Control')).toBe('public, max-age=3600, s-maxage=7200')
    const xml = await res.text()
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true)
    expect(xml).toContain('<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">')
  })

  it('?format=xml and unknown formats return the identical feed', async () => {
    const bare = await (await GET(req())).text()
    const xml = await (await GET(req('?format=xml'))).text()
    const bogus = await GET(req('?format=bogus'))
    expect(xml).toBe(bare)
    expect(bogus.headers.get('Content-Type')).toContain('application/rss+xml')
  })

  it('JSON keeps ISO dates', async () => {
    const body = await (await GET(req('?format=json'))).json()
    expect(body.data.lastBuildDate).toBe('2026-02-01T00:00:00.000Z')
    expect(body.data.posts[0].pubDate).toBe('2026-01-01T00:00:00.000Z')
  })

  it('escapes text nodes and emits no unwrapped-section markup', async () => {
    const xml = await (await GET(req())).text()
    expect(xml).toContain('<title>Second &amp; Special &lt;chars&gt;</title>')
    expect(xml).not.toContain('<![CDATA[')
  })

  it('uses RFC 822 dates and the newest item as lastBuildDate', async () => {
    const xml = await (await GET(req())).text()
    expect(xml).toContain('<lastBuildDate>Sun, 01 Feb 2026 00:00:00 GMT</lastBuildDate>')
    expect(xml).toContain('<pubDate>Thu, 01 Jan 2026 00:00:00 GMT</pubDate>')
    const re = /^[A-Z][a-z]{2}, \d{2} [A-Z][a-z]{2} \d{4} \d{2}:\d{2}:\d{2} GMT$/
    const values = [...xml.matchAll(/<(?:pubDate|lastBuildDate)>([^<]*)</g)].map((m) => m[1] ?? '')
    expect(values.length).toBe(3)
    for (const v of values) expect(v).toMatch(re)
  })

  it('uses a now-dated RFC 822 lastBuildDate when there are no posts', async () => {
    dbMocks.findMany.mockResolvedValue([])
    const xml = await (await GET(req())).text()
    const m = xml.match(/<lastBuildDate>([^<]*)<\/lastBuildDate>/)
    expect(m?.[1]).toMatch(/^[A-Z][a-z]{2}, \d{2} [A-Z][a-z]{2} \d{4} \d{2}:\d{2}:\d{2} GMT$/)
    expect(xml).toContain('</channel>')
  })

  it('self link is the bare URL and guid equals the canonical post URL', async () => {
    const xml = await (await GET(req())).text()
    expect(xml).toContain(
      '<atom:link href="https://richardwhudsonjr.com/api/blog/rss" rel="self" type="application/rss+xml"/>'
    )
    expect(xml).not.toContain('format=xml')
    expect(xml).toContain('<guid isPermaLink="true">https://richardwhudsonjr.com/blog/first</guid>')
    expect(xml).toContain('<link>https://richardwhudsonjr.com/blog/first</link>')
  })

  it('replaces a bio-boilerplate excerpt with the first body paragraph', async () => {
    dbMocks.findMany.mockResolvedValue([
      {
        ...fakePosts[0],
        excerpt: 'I spent 10 years in the Texas Army National Guard before moving into RevOps.',
        contentHead:
          '## Intro\n\nForecast accuracy depends on clean pipeline stages and honest close dates.',
      },
    ])
    const xml = await (await GET(req())).text()
    expect(xml).toContain(
      '<description>Forecast accuracy depends on clean pipeline stages and honest close dates.</description>'
    )
    expect(xml).not.toContain('National Guard')
  })

  // The page-vs-feed equality is pinned in src/app/blog/[slug]/__tests__/post-metadata.test.ts.
  it('description is resolvePostLede over the bounded contentHead', async () => {
    const para =
      'Forecast accuracy depends on clean pipeline stages and honest close dates across every region of the business.'
    const body = `${'😀 filler words\n\n'.repeat(300)}${para}\n\nMore text.`
    const contentHead = Array.from(body).slice(0, 4000).join('')
    const row = {
      ...fakePosts[0],
      excerpt: null,
      metaDescription: 'A meta fallback description.',
      contentHead,
    }
    dbMocks.findMany.mockResolvedValue([row])
    const xml = await (await GET(req())).text()
    const lede = resolvePostLede({
      excerpt: null,
      content: body,
      metaDescription: row.metaDescription,
    })
    expect(lede.length).toBeGreaterThan(0)
    expect(xml).toContain(`<description>${lede}</description>`)
  })

  it('drops a stored brand suffix from item titles', async () => {
    dbMocks.findMany.mockResolvedValue([
      { ...fakePosts[0], title: 'Pipeline Velocity Explained | Richard Hudson', contentHead: '' },
    ])
    const xml = await (await GET(req())).text()
    expect(xml).toContain('<title>Pipeline Velocity Explained</title>')
    expect(xml).not.toContain('Explained | Richard Hudson')
    const json = await (await GET(req('?format=json'))).json()
    expect(json.data.posts[0].title).toBe('Pipeline Velocity Explained')
  })

  it('renders an empty description when every source is bio boilerplate', async () => {
    const bio = 'I spent 10 years in the Texas Army National Guard before moving into RevOps.'
    dbMocks.findMany.mockResolvedValue([
      { ...fakePosts[0], excerpt: bio, metaDescription: bio, contentHead: bio },
    ])
    const xml = await (await GET(req())).text()
    expect(xml).toContain('<description></description>')
  })

  it('never selects the body or search vector; only the bounded contentHead extra', async () => {
    await GET(req())
    const args = dbMocks.findMany.mock.calls[0]?.[0]
    expect(args.columns).not.toHaveProperty('content')
    expect(args.columns).not.toHaveProperty('searchVector')
    expect(args.extras).toHaveProperty('contentHead')
  })

  it.each([
    ['?limit=abc', 50],
    ['?limit=0', 1],
    ['?limit=-5', 1],
    ['?limit=200', 100],
    ['', 50],
  ])('limit %s -> %i', async (q, expected) => {
    await GET(req(q))
    expect(dbMocks.findMany).toHaveBeenCalledWith(expect.objectContaining({ limit: expected }))
  })

  it('honors ?limit= but caps at 100', async () => {
    await GET(req('?limit=200'))
    expect(dbMocks.findMany).toHaveBeenCalledWith(expect.objectContaining({ limit: 100 }))
  })

  it('uses default limit of 50 when ?limit not set', async () => {
    await GET(req())
    expect(dbMocks.findMany).toHaveBeenCalledWith(expect.objectContaining({ limit: 50 }))
  })

  // Regression: the feed filtered on status alone, so soft-deleted posts kept
  // appearing in it after /blog and the sitemap dropped them.
  it('lists only PUBLISHED, non-soft-deleted posts', async () => {
    await GET(req())
    const { sql, params } = new PgDialect().sqlToQuery(dbMocks.findMany.mock.calls[0]?.[0]?.where)
    expect(sql).toBe('("blog_posts"."status" = $1 and "blog_posts"."deletedAt" is null)')
    expect(params).toEqual(['PUBLISHED'])
  })

  it('returns 500 with sanitized error when db throws', async () => {
    dbMocks.findMany.mockRejectedValueOnce(new Error('SELECT fail at /var/lib'))
    const res = await GET(req())
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.success).toBe(false)
    expect(JSON.stringify(body)).not.toContain('/var/lib')
  })
})
