// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({ findFirst: vi.fn() }))

vi.mock('@/lib/db', () => ({ db: { query: { blogPosts: { findFirst: mocks.findFirst } } } }))
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
  BreadcrumbListJsonLd: () => null,
}))
vi.mock('../../_components/blog-post-layout', () => ({ BlogPostLayout: () => null }))

import { generateMetadata } from '../page'

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
