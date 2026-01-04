import { describe, afterAll, it, expect, beforeEach, mock } from 'bun:test'
import type { RSSFeedData } from '@/types/shared-api'

// Mock next/server BEFORE any imports using Bun's native mock.module
mock.module('next/server', () => {
  class MockNextResponse {
    status: number
    headers: Map<string, string>
    private content: unknown

    constructor(content: unknown, options?: { status?: number; headers?: Record<string, string> }) {
      this.content = content
      this.status = options?.status || 200
      this.headers = new Map(Object.entries(options?.headers || {}))
    }

    get ok() { return this.status < 400 }
    async text() { return this.content }
    async json() { return typeof this.content === 'string' ? JSON.parse(this.content as string) : this.content }

    static json(data: unknown, options?: { status?: number; headers?: Record<string, string> }) {
      return new MockNextResponse(JSON.stringify(data), {
        ...options,
        headers: { 'Content-Type': 'application/json', ...options?.headers },
      })
    }
  }

  return {
    NextRequest: class NextRequest {
      url: string
      constructor(url: string) { this.url = url }
    },
    NextResponse: MockNextResponse,
  }
})

// Mock logger
mock.module('@/lib/monitoring/logger', () => ({
  createContextLogger: () => ({
    info: () => {},
    warn: () => {},
    error: () => {},
    debug: () => {},
  }),
}))

// Import AFTER mocks are set up
import { GET } from '@/app/api/blog/rss/route'
import { NextRequest } from 'next/server'

const createMockRequest = (url: string) => {
  return {
    url,
  } as NextRequest
}

const createMockRequestWithSearchParams = (searchParams: Record<string, string>) => {
  const url = new URL('http://localhost:3000/api/blog/rss')
  Object.entries(searchParams).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })
  return createMockRequest(url.toString())
}

// Clean up mocks after all tests in this file
afterAll(() => {
  mock.restore()
})

describe('/api/blog/rss', () => {
  beforeEach(() => {
    // Reset mocks between tests
  })

  describe('GET - JSON Format', () => {
    it('returns RSS feed data in JSON format by default', async () => {
      const request = createMockRequest('http://localhost:3000/api/blog/rss')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toHaveProperty('title')
      expect(data.data).toHaveProperty('description')
      expect(data.data).toHaveProperty('link')
      expect(data.data).toHaveProperty('lastBuildDate')
      expect(data.data).toHaveProperty('language')
      expect(data.data).toHaveProperty('posts')
    })

    it('returns expected feed metadata', async () => {
      const request = createMockRequest('http://localhost:3000/api/blog/rss')
      const response = await GET(request)
      const data = await response.json()

      expect(data.data.title).toBe('Richard Hudson - Revenue Operations Blog')
      expect(data.data.description).toContain('Expert insights on revenue operations')
      expect(data.data.link).toBe('https://richardhudson.dev/blog')
      expect(data.data.language).toBe('en-us')
      expect(data.data.lastBuildDate).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
    })

    it('returns blog posts with required RSS fields', async () => {
      const request = createMockRequest('http://localhost:3000/api/blog/rss')
      const response = await GET(request)
      const data = await response.json()

      expect(data.data.posts).toBeInstanceOf(Array)
      expect(data.data.posts.length).toBeGreaterThan(0)

      data.data.posts.forEach((post: RSSFeedData['posts'][0]) => {
        expect(post).toHaveProperty('title')
        expect(post).toHaveProperty('link')
        expect(post).toHaveProperty('description')
        expect(post).toHaveProperty('pubDate')
        expect(post).toHaveProperty('author')
        expect(post).toHaveProperty('category')
        expect(post).toHaveProperty('guid')
        expect(post.author).toBe('Richard Hudson')
        expect(post.link).toMatch(/^https:\/\/richardhudson\.dev\/blog\//)
        expect(post.guid).toMatch(/^https:\/\/richardhudson\.dev\/blog\//)
      })
    })

    it('limits posts to specified limit', async () => {
      const request = createMockRequestWithSearchParams({ limit: '2' })
      const response = await GET(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.data.posts.length).toBe(2)
    })

    it('enforces maximum limit of 100 posts', async () => {
      const request = createMockRequestWithSearchParams({ limit: '150' })
      const response = await GET(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.data.posts.length).toBeLessThanOrEqual(100)
    })

    it('uses default limit of 50 when not specified', async () => {
      const request = createMockRequest('http://localhost:3000/api/blog/rss')
      const response = await GET(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.data.posts.length).toBeLessThanOrEqual(50)
    })

    it('handles invalid limit gracefully', async () => {
      const request = createMockRequestWithSearchParams({ limit: 'invalid' })
      const response = await GET(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.data.posts.length).toBeLessThanOrEqual(50) // Should use default
    })

    it('includes cache headers for JSON format', async () => {
      const request = createMockRequest('http://localhost:3000/api/blog/rss')
      const response = await GET(request)

      expect(response.headers.get('Cache-Control')).toBe('public, max-age=3600, s-maxage=7200')
    })

    it('returns posts in chronological order', async () => {
      const request = createMockRequest('http://localhost:3000/api/blog/rss')
      const response = await GET(request)
      const data = await response.json()

      expect(data.success).toBe(true)

      // Check that posts are sorted by publication date (most recent first typically)
      const dates = data.data.posts.map((post: RSSFeedData['posts'][0]) => new Date(post.pubDate).getTime())
      for (let i = 1; i < dates.length; i++) {
        expect(dates[i-1]).toBeGreaterThanOrEqual(dates[i])
      }
    })

    it('includes expected blog post categories', async () => {
      const request = createMockRequest('http://localhost:3000/api/blog/rss')
      const response = await GET(request)
      const data = await response.json()

      const categories = data.data.posts.map((post: RSSFeedData['posts'][0]) => post.category)
      const expectedCategories = ['Revenue Operations', 'Data Visualization', 'Analytics', 'Automation']

      expectedCategories.forEach(category => {
        expect(categories).toContain(category)
      })
    })
  })

  describe('GET - XML Format', () => {
    it('returns RSS feed in XML format when requested', async () => {
      const request = createMockRequestWithSearchParams({ format: 'xml' })
      const response = await GET(request)

      expect(response.status).toBe(200)
      expect(response.headers.get('Content-Type')).toBe('application/rss+xml; charset=utf-8')
      expect(response.headers.get('Cache-Control')).toBe('public, max-age=3600, s-maxage=7200')
    })

    it('generates valid XML RSS structure', async () => {
      const request = createMockRequestWithSearchParams({ format: 'xml' })
      const response = await GET(request)
      const xmlContent = await response.text()

      expect(xmlContent).toContain('<?xml version="1.0" encoding="UTF-8"?>')
      expect(xmlContent).toContain('<rss version="2.0"')
      expect(xmlContent).toContain('<channel>')
      expect(xmlContent).toContain('<title><![CDATA[Richard Hudson - Revenue Operations Blog]]></title>')
      expect(xmlContent).toContain('https://richardhudson.dev/blog')
    })

    it('includes proper XML headers and metadata', async () => {
      const request = createMockRequestWithSearchParams({ format: 'xml' })
      const response = await GET(request)

      expect(response.headers.get('Content-Type')).toBe('application/rss+xml; charset=utf-8')
      expect(response.headers.get('Cache-Control')).toBe('public, max-age=3600, s-maxage=7200')
    })

    it('respects limit parameter in XML format', async () => {
      const request = createMockRequestWithSearchParams({ format: 'xml', limit: '1' })
      const response = await GET(request)

      expect(response.status).toBe(200)
      expect(response.headers.get('Content-Type')).toBe('application/rss+xml; charset=utf-8')
    })
  })

  describe('Error Handling', () => {
    it('handles edge cases with zero posts', async () => {
      const request = createMockRequestWithSearchParams({ limit: '0' })
      const response = await GET(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.data.posts).toEqual([])
    })

    it('handles negative limit values', async () => {
      const request = createMockRequestWithSearchParams({ limit: '-5' })
      const response = await GET(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      // Should handle negative values gracefully, likely treating as 0 or default
      expect(data.data.posts.length).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Content Validation', () => {
    it('ensures all posts have valid URLs', async () => {
      const request = createMockRequest('http://localhost:3000/api/blog/rss')
      const response = await GET(request)
      const data = await response.json()

      data.data.posts.forEach((post: RSSFeedData['posts'][0]) => {
        expect(post.link).toMatch(/^https?:\/\//)
        expect(post.guid).toMatch(/^https?:\/\//)
        expect(post.link).toContain('richardhudson.dev')
        expect(post.guid).toContain('richardhudson.dev')
      })
    })

    it('ensures all posts have valid publication dates', async () => {
      const request = createMockRequest('http://localhost:3000/api/blog/rss')
      const response = await GET(request)
      const data = await response.json()

      data.data.posts.forEach((post: RSSFeedData['posts'][0]) => {
        const pubDate = new Date(post.pubDate)
        expect(pubDate).toBeInstanceOf(Date)
        expect(pubDate.getTime()).not.toBeNaN()
        expect(post.pubDate).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
      })
    })

    it('ensures posts have non-empty required fields', async () => {
      const request = createMockRequest('http://localhost:3000/api/blog/rss')
      const response = await GET(request)
      const data = await response.json()

      data.data.posts.forEach((post: RSSFeedData['posts'][0]) => {
        expect(post.title.trim()).not.toBe('')
        expect(post.link.trim()).not.toBe('')
        expect(post.description.trim()).not.toBe('')
        expect(post.author.trim()).not.toBe('')
        expect(post.category?.trim()).not.toBe('')
        expect(post.guid.trim()).not.toBe('')
      })
    })

    it('validates feed-level metadata', async () => {
      const request = createMockRequest('http://localhost:3000/api/blog/rss')
      const response = await GET(request)
      const data = await response.json()

      expect(data.data.title.trim()).not.toBe('')
      expect(data.data.description.trim()).not.toBe('')
      expect(data.data.link).toMatch(/^https?:\/\//)
      expect(data.data.language).toMatch(/^[a-z]{2}(-[a-z]{2})?$/i)

      const lastBuildDate = new Date(data.data.lastBuildDate)
      expect(lastBuildDate).toBeInstanceOf(Date)
      expect(lastBuildDate.getTime()).not.toBeNaN()
    })
  })
})
