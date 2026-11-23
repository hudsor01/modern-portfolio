// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { BlogPostData } from '@/types/api'

vi.mock('next/image', () => ({
  // biome-ignore lint/performance/noImgElement: test stub
  default: () => <img alt="" />,
}))
vi.mock('@/components/blog/blog-featured-image', () => ({ BlogFeaturedImage: () => null }))
vi.mock('../blog-post-article', () => ({ BlogPostArticle: () => null }))

import { BlogPostLayout } from '../blog-post-layout'

function makePost(overrides: Partial<BlogPostData> = {}): BlogPostData {
  return {
    id: 'p1',
    slug: 'p1',
    title: 'A Post',
    content: 'word '.repeat(50),
    excerpt: 'Summary text',
    publishedAt: '2026-11-09T18:00:00Z',
    readingTime: 5,
    wordCount: 1000,
    viewCount: 0,
    category: { id: 'c1', name: 'Revenue Operations', slug: 'revenue-operations' },
    tags: [],
    ...overrides,
  } as unknown as BlogPostData
}

describe('BlogPostLayout', () => {
  afterEach(() => cleanup())

  it('shows the date and reading time once, with no sidebar duplicates', () => {
    const { container } = render(<BlogPostLayout post={makePost()} />)
    const text = container.textContent ?? ''
    expect(text.split('November 9, 2026').length - 1).toBe(1)
    expect(text.split('5 min').length - 1).toBe(1)
    expect(text).not.toContain('Published')
    expect(text).not.toContain('Reading time')
    expect(text).toContain('Word count')
    expect(text).toContain('Category')
  })

  it('has no top padding on the article', () => {
    const { container } = render(<BlogPostLayout post={makePost()} />)
    const cls = container.querySelector('article')?.className ?? ''
    expect(cls).toContain('pb-10')
    expect(cls).toContain('lg:pb-14')
    expect(cls).not.toContain('py-10')
    expect(cls).not.toContain('lg:py-14')
  })

  it('omits the details card when there is nothing to list', () => {
    const { container } = render(
      <BlogPostLayout post={makePost({ wordCount: 0, content: '', category: undefined })} />
    )
    expect(container.textContent).not.toContain('Post details')
  })
})
