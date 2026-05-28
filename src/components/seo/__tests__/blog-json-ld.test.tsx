// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { BlogJsonLd, BlogPostJsonLd, BlogCategoryJsonLd, BlogFAQJsonLd } from '../blog-json-ld'
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
    // Interaction stats embedded
    expect(Array.isArray(parsed.interactionStatistic)).toBe(true)
    expect(parsed.interactionStatistic.length).toBe(4)
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
})

describe('BlogCategoryJsonLd', () => {
  beforeEach(() => {
    cleanup()
  })

  it('renders a CollectionPage schema with category-derived fields', () => {
    const { container } = render(
      <BlogCategoryJsonLd
        category={{ name: 'RevOps', slug: 'revops', postCount: 5, description: 'desc' }}
      />
    )
    const script = container.querySelector('script')
    const parsed = JSON.parse(script!.innerHTML)
    expect(parsed['@type']).toBe('CollectionPage')
    expect(parsed.url).toBe('https://richardwhudsonjr.com/blog/category/revops')
    expect(parsed.mainEntity.numberOfItems).toBe(5)
  })
})

describe('BlogFAQJsonLd', () => {
  beforeEach(() => {
    cleanup()
  })

  it('renders an FAQPage with one Question per faq', () => {
    const faqs = [
      { question: 'Q1?', answer: 'A1.' },
      { question: 'Q2?', answer: 'A2.' },
    ]
    const { container } = render(<BlogFAQJsonLd faqs={faqs} />)
    const script = container.querySelector('script')
    const parsed = JSON.parse(script!.innerHTML)
    expect(parsed['@type']).toBe('FAQPage')
    expect(parsed.mainEntity.length).toBe(2)
    expect(parsed.mainEntity[0]['@type']).toBe('Question')
    expect(parsed.mainEntity[0].acceptedAnswer.text).toBe('A1.')
  })
})
