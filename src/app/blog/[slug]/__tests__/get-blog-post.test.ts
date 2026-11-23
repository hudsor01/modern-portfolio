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
vi.mock('@/components/seo/blog-json-ld', () => ({ BlogPostJsonLd: () => null }))
vi.mock('@/components/seo/json-ld/breadcrumb-json-ld', () => ({
  BreadcrumbListJsonLd: () => null,
}))
vi.mock('../../_components/blog-post-layout', () => ({ BlogPostLayout: () => null }))

import { generateMetadata } from '../page'

const BOILERPLATE =
  'I spent six years in the Texas Army National Guard learning leadership and discipline that shaped my career.'
const PARAGRAPH =
  'Forecast accuracy collapses when pipeline stages are defined by sellers instead of buyer evidence.'

function row(excerpt: string) {
  return {
    id: 'p1',
    slug: 'p1',
    title: 'A Post',
    content: `# Heading\n\n${PARAGRAPH}\n\nMore text here.`,
    excerpt,
    status: 'PUBLISHED',
    deletedAt: null,
    metaDescription: null,
    metaTitle: null,
    contentType: 'MARKDOWN',
    author: null,
    category: null,
    tags: [],
    featuredImage: null,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-02T00:00:00Z'),
    publishedAt: new Date('2026-01-01T00:00:00Z'),
  }
}

describe('getBlogPost excerpt resolution (via generateMetadata)', () => {
  beforeEach(() => mocks.findFirst.mockReset())

  it('replaces boilerplate with the body-derived excerpt', async () => {
    mocks.findFirst.mockResolvedValue(row(BOILERPLATE))
    const meta = await generateMetadata({ params: Promise.resolve({ slug: 'boiler' }) })
    expect(meta.description).toContain('Forecast accuracy collapses')
    expect(meta.description).not.toContain('National Guard')
  })

  it('keeps a normal excerpt unchanged', async () => {
    mocks.findFirst.mockResolvedValue(row('A perfectly good summary of the post.'))
    const meta = await generateMetadata({ params: Promise.resolve({ slug: 'normal' }) })
    expect(meta.description).toBe('A perfectly good summary of the post.')
  })
})
