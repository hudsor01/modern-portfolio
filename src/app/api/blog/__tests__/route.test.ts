import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/blog/route'
import { createMockBlogPostInput } from '@/test/blog-factories'

// Import proper types from the types directory
import type { BlogPostSummary } from '@/types/blog'

// Use the actual blog post types instead of custom interfaces

// Mock Next.js
vi.mock('next/server', async () => {
  const actual = await vi.importActual('next/server')
  return {
    ...actual,
    NextResponse: {
      json: vi.fn((data, options) => ({
        json: async () => data,
        status: options?.status || 200,
        headers: options?.headers || {},
        ok: (options?.status || 200) < 400,
      })),
    },
  }
})

const createMockRequest = (url: string, options: RequestInit = {}) => {
  return {
    url,
    ...options,
    json: async () => options.body ? JSON.parse(options.body as string) : {},
  } as NextRequest
}

const createMockRequestWithSearchParams = (searchParams: Record<string, string>) => {
  const url = new URL('http://localhost:3000/api/blog')
  Object.entries(searchParams).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })
  return createMockRequest(url.toString())
}

describe('/api/blog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET', () => {
    it('returns blog posts with default pagination', async () => {
      const request = createMockRequest('http://localhost:3000/api/blog')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toBeInstanceOf(Array)
      expect(data.pagination).toMatchObject({
        page: 1,
        limit: 10,
        total: expect.any(Number),
        totalPages: expect.any(Number),
        hasNext: expect.any(Boolean),
        hasPrev: false,
      })
    })

    it('applies pagination parameters correctly', async () => {
      const request = createMockRequestWithSearchParams({
        page: '2',
        limit: '5',
      })
      const response = await GET(request)
      const data = await response.json()

      expect(data.pagination.page).toBe(2)
      expect(data.pagination.limit).toBe(5)
      expect(data.pagination.hasPrev).toBe(true)
    })

    it('filters posts by status', async () => {
      const request = createMockRequestWithSearchParams({
        status: 'PUBLISHED',
      })
      const response = await GET(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      data.data.forEach((post: { status: string }) => {
        expect(post.status).toBe('PUBLISHED')
      })
    })

    it('filters posts by authorId', async () => {
      const request = createMockRequestWithSearchParams({
        authorId: 'richard-hudson',
      })
      const response = await GET(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      data.data.forEach((post: { authorId: string }) => {
        expect(post.authorId).toBe('richard-hudson')
      })
    })

    it('filters posts by categoryId', async () => {
      const request = createMockRequestWithSearchParams({
        categoryId: 'revenue-operations',
      })
      const response = await GET(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      data.data.forEach((post: { categoryId: string }) => {
        expect(post.categoryId).toBe('revenue-operations')
      })
    })

    it('filters posts by tag IDs', async () => {
      const request = createMockRequestWithSearchParams({
        tagIds: 'analytics,dashboards',
      })
      const response = await GET(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      data.data.forEach((post: BlogPostSummary) => {
        expect(post.tags.some((tag: { id: string }) => 
          ['analytics', 'dashboards'].includes(tag.id)
        )).toBe(true)
      })
    })

    it('filters posts by search term', async () => {
      const request = createMockRequestWithSearchParams({
        search: 'revenue',
      })
      const response = await GET(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      data.data.forEach((post: { title: string; excerpt?: string; content: string; keywords: string[] }) => {
        const searchableText = [
          post.title,
          post.excerpt,
          post.content,
          ...post.keywords
        ].join(' ').toLowerCase()
        expect(searchableText).toContain('revenue')
      })
    })

    it('filters posts by published status', async () => {
      const request = createMockRequestWithSearchParams({
        published: 'true',
      })
      const response = await GET(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      data.data.forEach((post: { status: string }) => {
        expect(post.status).toBe('PUBLISHED')
      })
    })

    it('sorts posts by title ascending', async () => {
      const request = createMockRequestWithSearchParams({
        sortBy: 'title',
        sortOrder: 'asc',
      })
      const response = await GET(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      const titles = data.data.map((post: BlogPostSummary) => post.title)
      const sortedTitles = [...titles].sort()
      expect(titles).toEqual(sortedTitles)
    })

    it('sorts posts by viewCount descending', async () => {
      const request = createMockRequestWithSearchParams({
        sortBy: 'viewCount',
        sortOrder: 'desc',
      })
      const response = await GET(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      const viewCounts = data.data.map((post: BlogPostSummary) => post.viewCount)
      const sortedViewCounts = [...viewCounts].sort((a, b) => b - a)
      expect(viewCounts).toEqual(sortedViewCounts)
    })

    it('applies date range filter', async () => {
      const request = createMockRequestWithSearchParams({
        dateFrom: '2024-01-01',
        dateTo: '2024-01-31',
      })
      const response = await GET(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      data.data.forEach((post: { publishedAt?: string; createdAt: string }) => {
        const publishedAt = new Date(post.publishedAt || post.createdAt)
        expect(publishedAt.getTime()).toBeGreaterThanOrEqual(new Date('2024-01-01').getTime())
        expect(publishedAt.getTime()).toBeLessThanOrEqual(new Date('2024-01-31').getTime())
      })
    })

    it('limits results to maximum of 50 per page', async () => {
      const request = createMockRequestWithSearchParams({
        limit: '100',
      })
      const response = await GET(request)
      const data = await response.json()

      expect(data.pagination.limit).toBe(50)
    })

    it('includes cache headers in response', async () => {
      const request = createMockRequest('http://localhost:3000/api/blog')
      const response = await GET(request)

      expect((response.headers as unknown as Record<string, string>)['Cache-Control']).toBe('public, max-age=60, s-maxage=300')
    })

    it('handles errors gracefully', async () => {
      // Mock an error scenario
      const request = createMockRequest('invalid-url')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Failed to fetch blog posts')
    })
  })

  describe('POST', () => {
    it('creates a new blog post with required fields', async () => {
      const postInput = createMockBlogPostInput({
        title: 'Test Blog Post',
        content: 'This is test content',
        authorId: 'test-author',
      })

      const request = createMockRequest('http://localhost:3000/api/blog', {
        method: 'POST',
        body: JSON.stringify(postInput),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data).toMatchObject({
        title: 'Test Blog Post',
        content: 'This is test content',
        authorId: 'test-author',
        status: 'DRAFT',
        slug: 'test-blog-post',
      })
      expect(data.data.id).toBeDefined()
      expect(data.data.createdAt).toBeDefined()
      expect(data.data.updatedAt).toBeDefined()
      expect(data.message).toBe('Blog post created successfully')
    })

    it('generates slug from title correctly', async () => {
      const postInput = createMockBlogPostInput({
        title: 'This is a Test Blog Post with Special Characters!@#',
        content: 'Test content',
        authorId: 'test-author',
      })

      const request = createMockRequest('http://localhost:3000/api/blog', {
        method: 'POST',
        body: JSON.stringify(postInput),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(data.data.slug).toBe('this-is-a-test-blog-post-with-special-characters')
    })

    it('sets default values for optional fields', async () => {
      const postInput = {
        title: 'Minimal Post',
        content: 'Minimal content',
        authorId: 'test-author',
      }

      const request = createMockRequest('http://localhost:3000/api/blog', {
        method: 'POST',
        body: JSON.stringify(postInput),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(data.data.contentType).toBe('MARKDOWN')
      expect(data.data.status).toBe('DRAFT')
      expect(data.data.readingTime).toBeGreaterThan(0)
      expect(data.data.wordCount).toBeGreaterThan(0)
      expect(data.data.viewCount).toBe(0)
      expect(data.data.likeCount).toBe(0)
      expect(data.data.shareCount).toBe(0)
      expect(data.data.commentCount).toBe(0)
    })

    it('calculates reading time based on word count', async () => {
      const longContent = new Array(400).fill('word').join(' ') // 400 words
      const postInput = {
        title: 'Long Post',
        content: longContent,
        authorId: 'test-author',
      }

      const request = createMockRequest('http://localhost:3000/api/blog', {
        method: 'POST',
        body: JSON.stringify(postInput),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(data.data.wordCount).toBe(400)
      expect(data.data.readingTime).toBe(2) // 400 words / 200 WPM = 2 minutes
    })

    it('sets publishedAt when status is PUBLISHED', async () => {
      const postInput = {
        title: 'Published Post',
        content: 'Published content',
        authorId: 'test-author',
        status: 'PUBLISHED',
      }

      const request = createMockRequest('http://localhost:3000/api/blog', {
        method: 'POST',
        body: JSON.stringify(postInput),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(data.data.status).toBe('PUBLISHED')
      expect(data.data.publishedAt).toBeDefined()
      expect(new Date(data.data.publishedAt)).toBeInstanceOf(Date)
    })

    it('preserves custom publishedAt when provided', async () => {
      const customDate = '2024-02-01T10:00:00Z'
      const postInput = {
        title: 'Custom Date Post',
        content: 'Content',
        authorId: 'test-author',
        status: 'SCHEDULED',
        publishedAt: customDate,
      }

      const request = createMockRequest('http://localhost:3000/api/blog', {
        method: 'POST',
        body: JSON.stringify(postInput),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(data.data.publishedAt).toBe(customDate)
    })

    it('includes no-cache header in response', async () => {
      const postInput = {
        title: 'Test Post',
        content: 'Test content',
        authorId: 'test-author',
      }

      const request = createMockRequest('http://localhost:3000/api/blog', {
        method: 'POST',
        body: JSON.stringify(postInput),
      })

      const response = await POST(request)

      expect((response.headers as unknown as Record<string, string>)['Cache-Control']).toBe('no-cache')
    })

    it('validates required fields - missing title', async () => {
      const postInput = {
        content: 'Test content',
        authorId: 'test-author',
      }

      const request = createMockRequest('http://localhost:3000/api/blog', {
        method: 'POST',
        body: JSON.stringify(postInput),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Missing required fields: title, content, authorId')
    })

    it('validates required fields - missing content', async () => {
      const postInput = {
        title: 'Test Title',
        authorId: 'test-author',
      }

      const request = createMockRequest('http://localhost:3000/api/blog', {
        method: 'POST',
        body: JSON.stringify(postInput),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Missing required fields: title, content, authorId')
    })

    it('validates required fields - missing authorId', async () => {
      const postInput = {
        title: 'Test Title',
        content: 'Test content',
      }

      const request = createMockRequest('http://localhost:3000/api/blog', {
        method: 'POST',
        body: JSON.stringify(postInput),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Missing required fields: title, content, authorId')
    })

    it('handles JSON parsing errors', async () => {
      const request = {
        url: 'http://localhost:3000/api/blog',
        method: 'POST',
        body: 'invalid-json',
        json: async () => {
          throw new Error('Invalid JSON')
        },
      } as unknown as NextRequest

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Failed to create blog post')
    })
  })
})