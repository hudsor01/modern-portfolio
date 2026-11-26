// @vitest-environment jsdom
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

const ATOM_NS = 'http://www.w3.org/2005/Atom'

const hostile = {
  title: 'A ]]> B & <c> "q" \'s\u0001',
  slug: 'hostile',
  excerpt: 'Excerpt with ]]> and \u000B control & <tags>, long enough to be kept as is.',
  metaDescription: null,
  publishedAt: new Date('2026-03-01T00:00:00Z'),
  createdAt: new Date('2026-02-28T00:00:00Z'),
  author: { name: "O'Brien & Co" },
  category: { name: 'R&D <ops>' },
}

const plain = {
  title: 'Plain Post',
  slug: 'plain',
  excerpt: 'A plain, perfectly ordinary summary.',
  metaDescription: null,
  publishedAt: new Date('2026-01-01T00:00:00Z'),
  createdAt: new Date('2025-12-31T00:00:00Z'),
  author: null,
  category: null,
}

function req() {
  return new NextRequest('http://localhost:3000/api/blog/rss')
}

function parse(xml: string) {
  return new DOMParser().parseFromString(xml, 'application/xml')
}

describe('GET /api/blog/rss well-formedness', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('negative control: malformed XML reports a parsererror', () => {
    const doc = parse('<rss><a>&</a></rss>')
    expect(doc.getElementsByTagName('parsererror').length).toBeGreaterThan(0)
  })

  it('plain feed parses with no parsererror', async () => {
    dbMocks.findMany.mockResolvedValue([plain])
    const doc = parse(await (await GET(req())).text())
    expect(doc.getElementsByTagName('parsererror')).toHaveLength(0)
    expect(doc.documentElement.nodeName).toBe('rss')
    expect(doc.documentElement.getAttribute('version')).toBe('2.0')
  })

  it('hostile fixture still yields a well-formed document', async () => {
    dbMocks.findMany.mockResolvedValue([hostile, plain])
    const doc = parse(await (await GET(req())).text())
    expect(doc.getElementsByTagName('parsererror')).toHaveLength(0)
    const item = doc.getElementsByTagName('item')[0]
    expect(item?.getElementsByTagName('title')[0]?.textContent).toBe('A ]]> B & <c> "q" \'s')
    expect(item?.getElementsByTagName('category')[0]?.textContent).toBe('R&D <ops>')
    expect(doc.getElementsByTagNameNS(ATOM_NS, 'link')[0]?.getAttribute('href')).toBe(
      'https://richardwhudsonjr.com/api/blog/rss'
    )
    for (const el of Array.from(doc.getElementsByTagName('pubDate'))) {
      expect(Number.isNaN(new Date(el.textContent ?? '').getTime())).toBe(false)
    }
  })
})
