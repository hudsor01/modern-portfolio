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

import { CATEGORY_CHIP_CLASSES } from '@/lib/blog-list'
import { BlogList } from '../blog-list'

const CHIP_CLASSES = `${CATEGORY_CHIP_CLASSES} mb-2`

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

  it('keeps the cover flush and pins the date to the card bottom (B-1, B-2)', () => {
    const { container } = renderList([
      post({ id: 'a', slug: 'a', featuredImage: '/x.jpg' }),
      post({ id: 'b', slug: 'b' }),
    ])
    const [withImage, withoutImage] = Array.from(
      container.querySelectorAll('[data-slot="card"]')
    ) as HTMLElement[]
    // The default card padding (py-6) put a band above the cover: only the image card drops it.
    expect(withImage?.className).toContain('pt-0')
    expect(withoutImage?.className).not.toContain('pt-0')
    for (const card of [withImage, withoutImage]) {
      const content = card?.querySelector('[data-slot="card-content"]')
      expect(content?.className).toContain('mt-auto')
      expect(content?.querySelector('time')).not.toBeNull()
    }
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
