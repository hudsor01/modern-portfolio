// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

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

  it('returns 200 JSON with success+data shape by default', async () => {
    const res = await GET(req())
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
    const res = await GET(req())
    const body = await res.json()
    expect(body.data.posts[1].description).toBe('fallback')
  })

  it('falls back to default author/category when author/category null', async () => {
    const res = await GET(req())
    const body = await res.json()
    expect(body.data.posts[1].author).toBe('Richard Hudson')
    expect(body.data.posts[1].category).toBe('Revenue Operations')
  })

  it('returns XML with rss content-type when ?format=xml', async () => {
    const res = await GET(req('?format=xml'))
    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toContain('application/rss+xml')
    const xml = await res.text()
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(xml).toContain('<rss version="2.0"')
    expect(xml).toContain('<title><![CDATA[First Post]]></title>')
    // CDATA-wrapped to prevent injection of `<` from special-char title.
    expect(xml).toContain('Second & Special <chars>')
  })

  it('honors ?limit= but caps at 100', async () => {
    await GET(req('?limit=200'))
    expect(dbMocks.findMany).toHaveBeenCalledWith(expect.objectContaining({ limit: 100 }))
  })

  it('uses default limit of 50 when ?limit not set', async () => {
    await GET(req())
    expect(dbMocks.findMany).toHaveBeenCalledWith(expect.objectContaining({ limit: 50 }))
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
