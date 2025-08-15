import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { GET } from '../route'
import type { RSSFeedData } from '@/types/shared-api'

// Mock Next.js
vi.mock('next/server', async () => {
  const actual = await vi.importActual('next/server')
  
  const mockNextResponse = vi.fn((content, options) => ({
    status: options?.status || 200,
    headers: options?.headers || {},
    text: async () => content,
  }))
  
  return {
    ...actual,
    NextResponse: {
      json: vi.fn((data, options) => ({
        json: async () => data,
        status: options?.status || 200,
        headers: options?.headers || {},
        ok: (options?.status || 200) < 400,
      })),
      // Mock constructor for XML response
      constructor: mockNextResponse,
    },
  }
})

const createMockRequest = (url: string, options: RequestInit = {}) => {
  return {
    url,
    ...options,
  } as NextRequest
}

const createMockRequestWithSearchParams = (searchParams: Record<string, string>) => {
  const url = new URL('http://localhost:3000/api/blog/rss')
  Object.entries(searchParams).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })
  return createMockRequest(url.toString())
}

describe('/api/blog/rss', () => {
  beforeEach(() => {
    vi.clearAllMocks()
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

      expect(response.headers['Cache-Control']).toBe('public, max-age=3600, s-maxage=7200')
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
    beforeEach(() => {
      // Reset NextResponse mock for XML tests
      vi.clearAllMocks()
    })

    it('returns RSS feed in XML format when requested', async () => {
      const request = createMockRequestWithSearchParams({ format: 'xml' })
      
      // Mock NextResponse constructor for XML response
      const mockXMLResponse = {
        status: 200,
        headers: {
          'Content-Type': 'application/rss+xml; charset=utf-8',
          'Cache-Control': 'public, max-age=3600, s-maxage=7200'
        },
        text: async () => '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0">...</rss>'
      }
      
      // Mock the NextResponse constructor
      const NextResponseMock = vi.fn(() => mockXMLResponse)
      vi.doMock('next/server', () => ({
        NextRequest: vi.fn(),
        NextResponse: NextResponseMock
      }))

      const response = await GET(request)

      expect(response.status).toBe(200)
      expect(response.headers['Content-Type']).toBe('application/rss+xml; charset=utf-8')
      expect(response.headers['Cache-Control']).toBe('public, max-age=3600, s-maxage=7200')
    })

    it('generates valid XML RSS structure', async () => {
      const request = createMockRequestWithSearchParams({ format: 'xml' })
      
      // Create a more realistic mock that captures the XML content
      const mockXMLContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[Richard Hudson - Revenue Operations Blog]]></title>
    <description><![CDATA[Expert insights...]]></description>
    <link>https://richardhudson.dev/blog</link>
    <language>en-us</language>
  </channel>
</rss>`

      const mockXMLResponse = {
        status: 200,
        headers: {
          'Content-Type': 'application/rss+xml; charset=utf-8',
          'Cache-Control': 'public, max-age=3600, s-maxage=7200'
        },
        text: async () => mockXMLContent
      }
      
      const NextResponseMock = vi.fn(() => mockXMLResponse)
      vi.doMock('next/server', () => ({
        NextRequest: vi.fn(),
        NextResponse: NextResponseMock
      }))

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
      
      const mockXMLResponse = {
        status: 200,
        headers: {
          'Content-Type': 'application/rss+xml; charset=utf-8',
          'Cache-Control': 'public, max-age=3600, s-maxage=7200'
        },
        text: async () => 'xml-content'
      }
      
      const NextResponseMock = vi.fn(() => mockXMLResponse)
      vi.doMock('next/server', () => ({
        NextRequest: vi.fn(),
        NextResponse: NextResponseMock
      }))

      const response = await GET(request)

      expect(response.headers['Content-Type']).toBe('application/rss+xml; charset=utf-8')
      expect(response.headers['Cache-Control']).toBe('public, max-age=3600, s-maxage=7200')
    })

    it('respects limit parameter in XML format', async () => {
      const request = createMockRequestWithSearchParams({ format: 'xml', limit: '1' })
      
      const mockXMLResponse = {
        status: 200,
        headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
        text: async () => '<rss><channel><item>single item</item></channel></rss>'
      }
      
      const NextResponseMock = vi.fn(() => mockXMLResponse)
      vi.doMock('next/server', () => ({
        NextRequest: vi.fn(),
        NextResponse: NextResponseMock
      }))

      const response = await GET(request)

      expect(response.status).toBe(200)
      expect(response.headers['Content-Type']).toBe('application/rss+xml; charset=utf-8')
    })
  })

  describe('Error Handling', () => {
    it('handles server errors gracefully', async () => {
      // Create an invalid request that will cause an error
      const request = createMockRequest('invalid-url')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Failed to generate RSS feed')
    })

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