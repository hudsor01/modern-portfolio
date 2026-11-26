// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({ findFirst: vi.fn(), findMany: vi.fn() }))

vi.mock('@/lib/db', () => ({
  db: { query: { blogPosts: { findFirst: mocks.findFirst, findMany: mocks.findMany } } },
}))
vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND')
  },
}))
vi.mock('@/lib/logger', () => ({
  createContextLogger: () => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() }),
}))
vi.mock('@/components/layout/navbar', () => ({ Navbar: () => null }))
vi.mock('@/components/blog/related-posts', () => ({ RelatedPosts: () => null }))
vi.mock('@/components/seo/blog-json-ld', () => ({ BlogPostJsonLd: vi.fn(() => null) }))
vi.mock('@/components/seo/json-ld/breadcrumb-json-ld', () => ({
  BreadcrumbListJsonLd: vi.fn(() => null),
}))
vi.mock('../../_components/blog-post-layout', () => ({ BlogPostLayout: () => null }))

import { isValidElement, type ReactNode } from 'react'
import { NextRequest } from 'next/server'
import { GET as rssGET } from '@/app/api/blog/rss/route'
import { BlogPostJsonLd } from '@/components/seo/blog-json-ld'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import { CONTENT_HEAD_CHARS, LEDE_MAX, resolveExcerpt } from '@/lib/blog-excerpt'
import type { BlogPostData } from '@/types/api'
import BlogPostPage, { generateMetadata } from '../page'

const LEGACY_META_TITLE = 'Forecast Accuracy Starts With Data Hygiene: Stage mapping an'
const FULL_TITLE = 'Forecast Accuracy Starts With Data Hygiene: Stage mapping and duplicate rules'

function row(metaTitle: string | null, title: string) {
  return {
    id: 'p1',
    slug: 'forecast',
    title,
    content: '# Heading\n\nForecast accuracy collapses when stages are seller-defined.',
    excerpt: 'A perfectly good summary of the post.',
    status: 'PUBLISHED',
    deletedAt: null,
    metaDescription: null,
    metaTitle,
    contentType: 'MARKDOWN',
    author: null,
    category: null,
    tags: [],
    keywords: [],
    featuredImage: null,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-02T00:00:00Z'),
    publishedAt: new Date('2026-01-01T00:00:00Z'),
  }
}

async function metaFor(metaTitle: string | null, title: string) {
  mocks.findFirst.mockResolvedValue(row(metaTitle, title))
  const meta = await generateMetadata({ params: Promise.resolve({ slug: 'forecast' }) })
  return {
    title: meta.title,
    og: meta.openGraph?.title,
    tw: (meta.twitter as { title?: string } | null | undefined)?.title,
  }
}

describe('post metadata title normalization', () => {
  beforeEach(() => mocks.findFirst.mockReset())

  it('renders the legacy 60-char metaTitle whole-word on title, og and twitter', async () => {
    const m = await metaFor(LEGACY_META_TITLE, FULL_TITLE)
    expect(m.title).toBe('Forecast Accuracy Starts With Data Hygiene')
    expect(m.og).toBe('Forecast Accuracy Starts With Data Hygiene | Richard Hudson')
    expect(m.tw).toBe('Forecast Accuracy Starts With Data Hygiene | Richard Hudson')
  })

  it('keeps a compliant stored metaTitle and brands the same value for og/twitter', async () => {
    const m = await metaFor('Salesloft Cadences That Get Replies', FULL_TITLE)
    expect(m.title).toBe('Salesloft Cadences That Get Replies')
    expect(m.og).toBe('Salesloft Cadences That Get Replies | Richard Hudson')
    expect(m.tw).toBe(m.og)
  })
})

/** Props of the first element of `type` in a rendered tree. */
function propsOf<P>(node: ReactNode, type: unknown): P | undefined {
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = propsOf<P>(child, type)
      if (found) return found
    }
    return undefined
  }
  if (!isValidElement(node)) return undefined
  const props = node.props as P & { children?: ReactNode }
  if (node.type === type) return props
  return propsOf<P>(props.children, type)
}

/** The `post` prop the rendered page hands BlogPostJsonLd: what the page shows as its lede. */
const jsonLdPost = (node: ReactNode) => propsOf<{ post: BlogPostData }>(node, BlogPostJsonLd)?.post

// The page holds the full row and RSS reads only left(content, 4000); both must
// resolve the lede through resolvePostLede over the same CONTENT_HEAD_CHARS
// prefix. If either went back to the full body (or another resolver), this
// fails: the fixture's first real paragraph sits past the prefix.
describe('post lede matches the RSS description', () => {
  beforeEach(() => {
    mocks.findFirst.mockReset()
    mocks.findMany.mockReset()
  })

  it('agrees for a post whose first paragraph is past CONTENT_HEAD_CHARS', async () => {
    const para =
      'Forecast accuracy depends on clean pipeline stages and honest close dates across every region of the business.'
    const body = `${'😀 filler words\n\n'.repeat(300)}${para}\n\nMore text.`
    expect(Array.from(body.slice(0, body.indexOf(para))).length).toBeGreaterThan(CONTENT_HEAD_CHARS)
    // A full-body read would pick the paragraph, so the fixture exercises the prefix.
    expect(resolveExcerpt({ excerpt: null, content: body }, { maxLength: LEDE_MAX })).toContain(
      'Forecast accuracy'
    )

    const stored = {
      ...row(null, FULL_TITLE),
      content: body,
      excerpt: null,
      metaDescription: 'A meta fallback description for the post.',
    }
    mocks.findFirst.mockResolvedValue(stored)
    const page = await BlogPostPage({ params: Promise.resolve({ slug: 'forecast' }) })
    const pageLede = jsonLdPost(page)?.excerpt

    // What Postgres left(content, 4000) returns: code points, not UTF-16 units.
    const contentHead = Array.from(body).slice(0, CONTENT_HEAD_CHARS).join('')
    mocks.findMany.mockResolvedValue([
      {
        title: stored.title,
        slug: stored.slug,
        excerpt: stored.excerpt,
        metaDescription: stored.metaDescription,
        publishedAt: stored.publishedAt,
        createdAt: stored.createdAt,
        author: null,
        category: null,
        contentHead,
      },
    ])
    const res = await rssGET(new NextRequest('http://localhost:3000/api/blog/rss?format=json'))
    const feed = (await res.json()) as { data: { posts: { description: string }[] } }

    expect(pageLede).toBe('A meta fallback description for the post.')
    expect(feed.data.posts[0]?.description).toBe(pageLede)
  })
})

describe('stored brand suffix on full-title surfaces', () => {
  beforeEach(() => mocks.findFirst.mockReset())

  it('drops it from the OG card title, its alt and the breadcrumb', async () => {
    mocks.findFirst.mockResolvedValue(row(null, 'Pipeline Velocity Explained | Richard Hudson'))
    const params = Promise.resolve({ slug: 'forecast' })
    const meta = await generateMetadata({ params })
    const image = ((meta.openGraph?.images ?? []) as { url: string; alt: string }[])[0]
    expect(new URL(image?.url ?? '').searchParams.get('title')).toBe('Pipeline Velocity Explained')
    expect(image?.alt).toBe('Pipeline Velocity Explained')

    const page = await BlogPostPage({ params })
    const crumbs = propsOf<{ items: { name: string }[] }>(page, BreadcrumbListJsonLd)?.items
    expect(crumbs?.at(-1)?.name).toBe('Pipeline Velocity Explained')
  })
})
