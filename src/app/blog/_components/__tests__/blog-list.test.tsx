// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { BlogListPost } from '@/types/blog'

vi.mock('nuqs', () => ({
  useQueryState: () => ['', vi.fn()],
  debounce: () => undefined,
}))
vi.mock('next/image', () => ({
  // biome-ignore lint/performance/noImgElement: test stub
  default: () => <img alt="" />,
}))
vi.mock('../blog-tag-filter', () => ({ BlogTagFilter: () => null }))
vi.mock('@/components/blog/blog-featured-image', () => ({ BlogFeaturedImage: () => null }))

import { BlogList } from '../blog-list'

const CHIP_CLASSES =
  'inline-flex items-center px-2.5 py-1 mb-2 text-xs font-semibold tracking-wide uppercase text-primary bg-primary/8 border border-primary/15 rounded-md'

function post(over: Partial<BlogListPost>): BlogListPost {
  return {
    id: 'p1',
    slug: 'p1',
    title: 'Post',
    excerpt: null,
    featuredImage: null,
    publishedAt: null,
    categoryName: null,
    tags: [],
    ...over,
  }
}

function renderList(posts: BlogListPost[]) {
  return render(
    <BlogList
      posts={posts}
      categoryNames={[]}
      categoryCounts={{}}
      total={posts.length}
      page={1}
      totalPages={1}
      query=""
      selectedCategory="all"
    />
  )
}

describe('BlogList cards', () => {
  beforeEach(() => cleanup())

  it('renders one chip span per card with the resolved label', () => {
    const { container } = renderList([
      post({ id: 'a', slug: 'a', categoryName: 'Analytics' }),
      post({ id: 'b', slug: 'b', tags: [{ id: 't', name: 'Forecasting' }] }),
      post({ id: 'c', slug: 'c' }),
    ])
    const cards = container.querySelectorAll('a[href^="/blog/"]')
    expect(cards).toHaveLength(3)
    const labels = Array.from(cards).map((card) => {
      const chips = card.querySelectorAll(`span[class="${CHIP_CLASSES}"]`)
      expect(chips).toHaveLength(1)
      return chips[0]?.textContent
    })
    expect(labels).toEqual(['Analytics', 'Forecasting', 'Revenue Operations'])
  })

  it('keeps the chip out of links and headings', () => {
    const { container } = renderList([post({ categoryName: 'Analytics' })])
    const card = container.querySelector('a[href^="/blog/"]')
    expect(card?.querySelectorAll('a')).toHaveLength(0)
    expect(card?.querySelectorAll('h2')).toHaveLength(1)
    expect(card?.querySelector('h2')?.querySelector('span[class*="uppercase"]')).toBeNull()
  })

  it('clamps titles at 3 lines', () => {
    const { container } = renderList([post({})])
    const h2 = container.querySelector('h2')
    expect(h2?.className).toContain('line-clamp-3')
    expect(h2?.className).not.toContain('line-clamp-2')
  })

  it('renders no tag badge row', () => {
    const { container } = renderList([
      post({
        categoryName: 'Analytics',
        tags: [
          { id: '1', name: 'Alpha' },
          { id: '2', name: 'Beta' },
          { id: '3', name: 'Gamma' },
        ],
      }),
    ])
    expect(container.textContent).not.toMatch(/Alpha|Beta|Gamma/)
  })
})
