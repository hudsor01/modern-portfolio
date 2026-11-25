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

function post(publishedAt: string | null): BlogListPost {
  return {
    id: 'p1',
    slug: 'p1',
    title: 'Post',
    excerpt: null,
    featuredImage: null,
    publishedAt,
    categoryName: null,
    tags: [],
  }
}

function renderList(publishedAt: string | null) {
  return render(
    <BlogList
      posts={[post(publishedAt)]}
      categoryNames={[]}
      categoryCounts={{}}
      total={1}
      page={1}
      totalPages={1}
      query=""
      selectedCategory="all"
    />
  )
}

describe('BlogList dates are timezone-invariant', () => {
  beforeEach(() => cleanup())

  it('renders Chicago-day text with a machine-readable dateTime', () => {
    const { container } = renderList('2026-11-09T03:00:00Z')
    const time = container.querySelector('time')
    expect(time?.getAttribute('datetime')).toBe('2026-11-09T03:00:00Z')
    expect(time?.textContent).toBe('November 8, 2026')
  })

  it('omits dateTime when publishedAt is null', () => {
    const { container } = renderList(null)
    expect(container.querySelector('time')?.hasAttribute('datetime')).toBe(false)
  })
})
