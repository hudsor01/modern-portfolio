// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { BlogJsonLd, BlogPostJsonLd, BlogCategoryJsonLd } from '../blog-json-ld'
import type { BlogPostData } from '@/types/api'

describe('BlogJsonLd', () => {
  beforeEach(() => {
    cleanup()
  })

  it('renders a script with @type Blog', () => {
    const { container } = render(<BlogJsonLd />)
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).toBeTruthy()
    const parsed = JSON.parse(script!.innerHTML)
    expect(parsed['@type']).toBe('Blog')
    expect(parsed.url).toBe('https://richardwhudsonjr.com/blog')
  })

  it('forwards a nonce when provided', () => {
    const { container } = render(<BlogJsonLd nonce="nonce-1" />)
    const script = container.querySelector('script')
    expect(script?.getAttribute('nonce')).toBe('nonce-1')
  })

  it('omits nonce when null', () => {
    const { container } = render(<BlogJsonLd nonce={null} />)
    const script = container.querySelector('script')
    expect(script?.hasAttribute('nonce')).toBe(false)
  })
})

const samplePost: BlogPostData = {
  id: 'post1',
  title: 'Test Post',
  slug: 'test-post',
  excerpt: 'An excerpt',
  metaDescription: 'meta description',
  featuredImage: '/images/post1.jpg',
  publishedAt: '2026-05-01',
  updatedAt: '2026-05-02',
  createdAt: '2026-04-30',
  author: { id: 'a1', name: 'Richard Hudson', bio: 'About', avatar: null },
  category: { id: 'c1', name: 'RevOps', slug: 'revops' },
  tags: [{ id: 't1', name: 'salesforce', slug: 'salesforce', description: 'Salesforce ecosystem' }],
  keywords: ['revenue', 'ops'],
  wordCount: 1234,
  readingTime: 5,
  viewCount: 100,
  likeCount: 10,
  shareCount: 5,
  commentCount: 2,
} as unknown as BlogPostData

describe('BlogPostJsonLd', () => {
  beforeEach(() => {
    cleanup()
  })

  it('renders a BlogPosting schema with derived fields', () => {
    const { container } = render(<BlogPostJsonLd post={samplePost} />)
    const script = container.querySelector('script')
    const parsed = JSON.parse(script!.innerHTML)
    expect(parsed['@type']).toBe('BlogPosting')
    expect(parsed.headline).toBe('Test Post')
    expect(parsed.url).toBe('https://richardwhudsonjr.com/blog/test-post')
    expect(parsed.wordCount).toBe(1234)
    expect(parsed.timeRequired).toBe('PT5M')
    // No engagement counts: the site has no likes, shares or comments, and the
    // view counter is not a reliable read count.
    expect(parsed.interactionStatistic).toBeUndefined()
    // Author and publisher are the sitewide Person; author URL is the /about profile.
    expect(parsed.author['@id']).toBe('https://richardwhudsonjr.com/#person')
    expect(parsed.author.url).toBe('https://richardwhudsonjr.com/about')
    expect(parsed.publisher['@id']).toBe('https://richardwhudsonjr.com/#person')
    // `logo` belongs to Organization; a Person publisher carries `image`.
    expect(parsed.publisher.logo).toBeUndefined()
    expect(parsed.publisher.image).toBe('https://richardwhudsonjr.com/images/richard.jpg')
  })

  it('includes a 3-item BreadcrumbList', () => {
    const { container } = render(<BlogPostJsonLd post={samplePost} />)
    const script = container.querySelector('script')
    const parsed = JSON.parse(script!.innerHTML)
    expect(parsed.breadcrumb['@type']).toBe('BreadcrumbList')
    expect(parsed.breadcrumb.itemListElement.length).toBe(3)
    expect(parsed.breadcrumb.itemListElement[2].name).toBe('Test Post')
  })

  it('forwards a nonce', () => {
    const { container } = render(<BlogPostJsonLd post={samplePost} nonce="abc" />)
    expect(container.querySelector('script')?.getAttribute('nonce')).toBe('abc')
  })

  it('prefixes site origin onto relative featuredImage paths', () => {
    const { container } = render(<BlogPostJsonLd post={samplePost} />)
    const parsed = JSON.parse(container.querySelector('script')!.innerHTML)
    expect(parsed.image).toBe('https://richardwhudsonjr.com/images/post1.jpg')
  })

  it('passes through absolute featuredImage URLs without double-prefixing', () => {
    const absolutePost = {
      ...samplePost,
      featuredImage: 'https://images.unsplash.com/photo-1542744173-05336fcc7ad4?w=1200',
    } as BlogPostData
    const { container } = render(<BlogPostJsonLd post={absolutePost} />)
    const parsed = JSON.parse(container.querySelector('script')!.innerHTML)
    expect(parsed.image).toBe('https://images.unsplash.com/photo-1542744173-05336fcc7ad4?w=1200')
  })

  it('drops a stored brand suffix from the headline, breadcrumb and OG card title', () => {
    const branded = {
      ...samplePost,
      title: 'Pipeline Velocity Explained | Richard Hudson',
      featuredImage: null,
    } as unknown as BlogPostData
    const { container } = render(<BlogPostJsonLd post={branded} />)
    const parsed = JSON.parse(container.querySelector('script')!.innerHTML)
    expect(parsed.headline).toBe('Pipeline Velocity Explained')
    expect(parsed.breadcrumb.itemListElement[2].name).toBe('Pipeline Velocity Explained')
    expect(new URL(parsed.image).searchParams.get('title')).toBe('Pipeline Velocity Explained')
  })
})

describe('BlogCategoryJsonLd', () => {
  beforeEach(() => {
    cleanup()
  })

  it('drops a stored brand suffix from list item names', () => {
    const { container } = render(
      <BlogCategoryJsonLd
        category={{ name: 'RevOps', slug: 'revops' }}
        posts={[{ title: 'First — Richard Hudson', slug: 'first' }]}
      />
    )
    const parsed = JSON.parse(container.querySelector('script')!.innerHTML)
    expect(parsed.mainEntity.itemListElement[0].name).toBe('First')
  })

  it('renders a CollectionPage schema with category-derived fields', () => {
    const { container } = render(
      <BlogCategoryJsonLd
        category={{ name: 'RevOps', slug: 'revops', description: 'desc' }}
        posts={[
          { title: 'First', slug: 'first' },
          { title: 'Second', slug: 'second' },
        ]}
      />
    )
    const script = container.querySelector('script')
    const parsed = JSON.parse(script!.innerHTML)
    expect(parsed['@type']).toBe('CollectionPage')
    expect(parsed.url).toBe('https://richardwhudsonjr.com/blog/category/revops')
    // Count and items come from the listed posts, never the stored counter.
    expect(parsed.mainEntity.numberOfItems).toBe(2)
    expect(parsed.mainEntity.itemListElement).toEqual([
      {
        '@type': 'ListItem',
        position: 1,
        name: 'First',
        url: 'https://richardwhudsonjr.com/blog/first',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Second',
        url: 'https://richardwhudsonjr.com/blog/second',
      },
    ])
  })
})
