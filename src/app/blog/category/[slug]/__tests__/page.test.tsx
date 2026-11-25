// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReactElement, ReactNode } from 'react'
import { buildOgCoverUrl, CATEGORY_CHIP_CLASSES } from '@/lib/blog-list'

const mocks = vi.hoisted(() => ({ findFirst: vi.fn() }))

vi.mock('@/lib/db', () => ({ db: { query: { categories: { findFirst: mocks.findFirst } } } }))
vi.mock('next/headers', () => ({ headers: async () => new Headers() }))
vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND')
  },
}))
vi.mock('@/lib/logger', () => ({
  createContextLogger: () => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() }),
}))
vi.mock('@/components/layout/navbar', () => ({ Navbar: () => null }))
vi.mock('@/components/blog/blog-featured-image', () => ({ BlogFeaturedImage: () => null }))
vi.mock('@/components/seo/blog-json-ld', () => ({ BlogCategoryJsonLd: () => null }))
vi.mock('@/components/seo/json-ld/breadcrumb-json-ld', () => ({
  BreadcrumbListJsonLd: () => null,
}))

import BlogCategoryPage from '../page'
import { BlogFeaturedImage } from '@/components/blog/blog-featured-image'

const BOILERPLATE =
  'I spent six years in the Texas Army National Guard learning leadership and discipline.'
const PARAGRAPH =
  'Forecast accuracy collapses when pipeline stages are defined by sellers instead of buyers.'
const COVER = 'https://images.unsplash.com/photo-1'

function post(n: number, excerpt: string) {
  return {
    id: `p${n}`,
    slug: `p${n}`,
    title: `Post ${n}`,
    excerpt,
    contentHead: `# H\n\n${PARAGRAPH}\n`,
    featuredImage: COVER,
    publishedAt: new Date('2026-06-01T00:00:00Z'),
    tags: [{ tag: { id: 't1', name: 'Forecasting' } }],
  }
}

function walk(node: ReactNode, visit: (el: ReactElement<Record<string, unknown>>) => void) {
  if (!node || typeof node !== 'object') return
  if (Array.isArray(node)) {
    for (const n of node) walk(n, visit)
    return
  }
  const el = node as ReactElement<Record<string, unknown>>
  visit(el)
  walk(el.props?.children as ReactNode, visit)
}

describe('category page cards', () => {
  beforeEach(() => mocks.findFirst.mockReset())

  it('resolves excerpts, de-dups covers, shows one chip and 3-line titles', async () => {
    mocks.findFirst.mockResolvedValue({
      id: 'c1',
      name: 'Revenue Operations',
      slug: 'revenue-operations',
      description: null,
      postCount: 2,
      posts: [post(1, 'A normal excerpt.'), post(2, BOILERPLATE)],
    })
    const call = mocks.findFirst.mock.calls
    const tree = await BlogCategoryPage({
      params: Promise.resolve({ slug: 'revenue-operations' }),
    })
    expect(call.length).toBe(1)
    const withPosts = ((call[0] as unknown[])[0] as { with: { posts: { extras?: unknown } } }).with
      .posts
    expect(withPosts.extras).toHaveProperty('contentHead')

    const images: string[] = []
    const variants: unknown[] = []
    const chipClasses: string[] = []
    const chips: string[] = []
    const descriptions: string[] = []
    const titleClasses: string[] = []
    let hasBadge = false
    walk(tree, (el) => {
      if (el.type === BlogFeaturedImage) {
        images.push(String(el.props.src))
        variants.push(el.props.fallbackVariant)
      }
      const cls = String(el.props.className ?? '')
      if (el.type === 'span' && cls.includes('bg-primary/8')) {
        chips.push(String(el.props.children))
        chipClasses.push(cls)
      }
      if (typeof el.type === 'function' && el.type.name === 'CardTitle') titleClasses.push(cls)
      if (typeof el.type === 'function' && el.type.name === 'CardDescription')
        descriptions.push(String(el.props.children))
      if (typeof el.type === 'function' && el.type.name === 'Badge') hasBadge = true
    })
    expect(images).toEqual([COVER, buildOgCoverUrl('Post 2', 'Revenue Operations')])
    expect(chips).toEqual(['Revenue Operations', 'Revenue Operations'])
    // Same 16:10 card cover and chip look as the /blog cards.
    expect(variants).toEqual(['card', 'card'])
    expect(chipClasses.every((c) => c.startsWith(CATEGORY_CHIP_CLASSES))).toBe(true)
    expect(descriptions[0]).toBe('A normal excerpt.')
    expect(descriptions[1]).toContain('Forecast accuracy collapses')
    expect(descriptions[1]).not.toContain('National Guard')
    expect(titleClasses.every((c) => c.includes('line-clamp-3'))).toBe(true)
    expect(hasBadge).toBe(false)
  })
})
