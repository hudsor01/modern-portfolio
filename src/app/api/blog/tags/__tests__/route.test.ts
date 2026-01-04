import { describe, afterAll, it, expect, vi, beforeEach, mock } from 'bun:test'
import type { BlogTagData } from '@/types/shared-api'

// Mock server-only
mock.module('server-only', () => ({}))

// Mock Next.js with proper headers Map
mock.module('next/server', () => ({
  NextRequest: class NextRequest {
    url: string
    constructor(url: string) { this.url = url }
  },
  NextResponse: {
    json: (data: unknown, options?: { status?: number; headers?: Record<string, string> }) => ({
      json: async () => data,
      status: options?.status || 200,
      headers: new Map(Object.entries(options?.headers || {})),
      ok: (options?.status || 200) < 400,
    }),
  },
}))

// Mock logger
mock.module('@/lib/monitoring/logger', () => ({
  createContextLogger: () => ({
    info: () => {},
    warn: () => {},
    error: () => {},
    debug: () => {},
  })
}))

// Import after mocks
import { GET, POST } from '@/app/api/blog/tags/route'
import { NextRequest } from 'next/server'

const createMockRequest = (url: string, options: RequestInit = {}) => {
  return {
    url,
    ...options,
    json: async () => options.body ? JSON.parse(options.body as string) : {},
  } as NextRequest
}

const createMockRequestWithSearchParams = (searchParams: Record<string, string>) => {
  const url = new URL('http://localhost:3000/api/blog/tags')
  Object.entries(searchParams).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })
  return createMockRequest(url.toString())
}

// Clean up mocks after all tests in this file
afterAll(() => {
  mock.restore()
})

describe('/api/blog/tags', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET', () => {
    it('returns all blog tags', async () => {
      const request = createMockRequest('http://localhost:3000/api/blog/tags')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toBeInstanceOf(Array)
      expect(data.data.length).toBeGreaterThan(0)
    })

    it('returns tags with all required fields', async () => {
      const request = createMockRequest('http://localhost:3000/api/blog/tags')
      const response = await GET(request)
      const data = await response.json()

      data.data.forEach((tag: BlogTagData) => {
        expect(tag).toHaveProperty('id')
        expect(tag).toHaveProperty('name')
        expect(tag).toHaveProperty('slug')
        expect(tag).toHaveProperty('description')
        expect(tag).toHaveProperty('color')
        expect(tag).toHaveProperty('postCount')
        expect(tag).toHaveProperty('totalViews')
        expect(tag).toHaveProperty('createdAt')
      })
    })

    it('includes specific expected tags', async () => {
      const request = createMockRequest('http://localhost:3000/api/blog/tags')
      const response = await GET(request)
      const data = await response.json()

      const tagNames = data.data.map((tag: BlogTagData) => tag.name)
      expect(tagNames).toContain('Analytics')
      expect(tagNames).toContain('Dashboards')
      expect(tagNames).toContain('KPIs')
      expect(tagNames).toContain('Automation')
      expect(tagNames).toContain('CRM')
    })

    it('filters tags by search term', async () => {
      const request = createMockRequestWithSearchParams({ search: 'data' })
      const response = await GET(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      data.data.forEach((tag: BlogTagData) => {
        const searchableText = `${tag.name} ${tag.description || ''}`.toLowerCase()
        expect(searchableText).toContain('data')
      })
    })

    it('returns case-insensitive search results', async () => {
      const request = createMockRequestWithSearchParams({ search: 'ANALYTICS' })
      const response = await GET(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.data.some((tag: BlogTagData) => tag.name === 'Analytics')).toBe(true)
    })

    it('sorts tags by popularity when requested', async () => {
      const request = createMockRequestWithSearchParams({ popular: 'true' })
      const response = await GET(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      
      // Check that tags are sorted by total views (descending)
      const totalViews = data.data.map((tag: BlogTagData) => tag.totalViews)
      const sortedViews = [...totalViews].sort((a, b) => b - a)
      expect(totalViews).toEqual(sortedViews)
    })

    it('limits results when limit parameter is provided', async () => {
      const request = createMockRequestWithSearchParams({ limit: '3' })
      const response = await GET(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.data.length).toBe(3)
    })

    it('enforces maximum limit of 50 tags', async () => {
      const request = createMockRequestWithSearchParams({ limit: '100' })
      const response = await GET(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.data.length).toBeLessThanOrEqual(50)
    })

    it('ignores invalid limit values', async () => {
      const request = createMockRequestWithSearchParams({ limit: '0' })
      const response = await GET(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.data.length).toBeGreaterThan(0) // Should return all tags
    })

    it('combines search and popular sorting', async () => {
      const request = createMockRequestWithSearchParams({ 
        search: 'operations',
        popular: 'true' 
      })
      const response = await GET(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      // Should filter by search term and sort by popularity
      data.data.forEach((tag: BlogTagData) => {
        const searchableText = `${tag.name} ${tag.description || ''}`.toLowerCase()
        expect(searchableText).toContain('operations')
      })
    })

    it('combines search and limit', async () => {
      const request = createMockRequestWithSearchParams({ 
        search: 'a', // Should match many tags
        limit: '2'
      })
      const response = await GET(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.data.length).toBeLessThanOrEqual(2)
      data.data.forEach((tag: BlogTagData) => {
        const searchableText = `${tag.name} ${tag.description || ''}`.toLowerCase()
        expect(searchableText).toContain('a')
      })
    })

    it('returns empty array when no tags match search', async () => {
      const request = createMockRequestWithSearchParams({ search: 'nonexistenttag' })
      const response = await GET(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.data).toEqual([])
    })

    it('includes cache headers in response', async () => {
      const request = createMockRequest('http://localhost:3000/api/blog/tags')
      const response = await GET(request)

      expect(response.headers.get('Cache-Control')).toBe('public, max-age=300, s-maxage=600')
    })

    it('handles malformed limit parameter gracefully', async () => {
      const request = createMockRequestWithSearchParams({ limit: 'invalid' })
      const response = await GET(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.data.length).toBeGreaterThan(0) // Should return all tags
    })
  })

  describe('POST', () => {
    it('creates a new blog tag with required fields', async () => {
      const tagData = {
        name: 'Test Tag',
        description: 'A test tag for testing',
        color: '#FF5733',
      }

      const request = createMockRequest('http://localhost:3000/api/blog/tags', {
        method: 'POST',
        body: JSON.stringify(tagData),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data).toMatchObject({
        name: 'Test Tag',
        description: 'A test tag for testing',
        color: '#FF5733',
        slug: 'test-tag',
        postCount: 0,
        totalViews: 0,
      })
      expect(data.data.id).toBeDefined()
      expect(data.data.createdAt).toBeDefined()
      expect(data.message).toBe('Blog tag created successfully')
    })

    it('generates slug from name correctly', async () => {
      const tagData = {
        name: 'Machine Learning & AI!',
        description: 'Test tag',
      }

      const request = createMockRequest('http://localhost:3000/api/blog/tags', {
        method: 'POST',
        body: JSON.stringify(tagData),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(data.data.slug).toBe('machine-learning-ai')
    })

    it('generates random color when not provided', async () => {
      const tagData = {
        name: 'Random Color Tag',
        description: 'Tag without specified color',
      }

      const request = createMockRequest('http://localhost:3000/api/blog/tags', {
        method: 'POST',
        body: JSON.stringify(tagData),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(data.data.color).toMatch(/^#[0-9A-F]{6}$/i) // Valid hex color
      expect(data.data.color).toBeDefined()
    })

    it('uses provided color when specified', async () => {
      const customColor = '#123456'
      const tagData = {
        name: 'Custom Color Tag',
        description: 'Tag with custom color',
        color: customColor,
      }

      const request = createMockRequest('http://localhost:3000/api/blog/tags', {
        method: 'POST',
        body: JSON.stringify(tagData),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(data.data.color).toBe(customColor)
    })

    it('initializes counters to zero', async () => {
      const tagData = {
        name: 'New Tag',
        description: 'Fresh tag',
      }

      const request = createMockRequest('http://localhost:3000/api/blog/tags', {
        method: 'POST',
        body: JSON.stringify(tagData),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(data.data.postCount).toBe(0)
      expect(data.data.totalViews).toBe(0)
    })

    it('includes no-cache header in response', async () => {
      const tagData = {
        name: 'Cache Test Tag',
        description: 'Testing cache headers',
      }

      const request = createMockRequest('http://localhost:3000/api/blog/tags', {
        method: 'POST',
        body: JSON.stringify(tagData),
      })

      const response = await POST(request)

      expect(response.headers.get('Cache-Control')).toBe('no-cache')
    })

    it('validates required name field', async () => {
      const tagData = {
        description: 'Tag without name',
        color: '#FF5733',
      }

      const request = createMockRequest('http://localhost:3000/api/blog/tags', {
        method: 'POST',
        body: JSON.stringify(tagData),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Missing required field: name')
    })

    it('prevents duplicate tags by slug', async () => {
      // First, create a tag
      const tagData1 = {
        name: 'Unique Tag',
        description: 'First tag',
      }

      const request1 = createMockRequest('http://localhost:3000/api/blog/tags', {
        method: 'POST',
        body: JSON.stringify(tagData1),
      })

      await POST(request1)

      // Try to create another with the same name (will generate same slug)
      const tagData2 = {
        name: 'Unique Tag',
        description: 'Duplicate tag',
      }

      const request2 = createMockRequest('http://localhost:3000/api/blog/tags', {
        method: 'POST',
        body: JSON.stringify(tagData2),
      })

      const response2 = await POST(request2)
      const data2 = await response2.json()

      expect(response2.status).toBe(409)
      expect(data2.success).toBe(false)
      expect(data2.error).toBe('Tag with this name already exists')
    })

    it('allows tags with different names but similar descriptions', async () => {
      const tagData1 = {
        name: 'React',
        description: 'JavaScript library for building user interfaces',
      }

      const tagData2 = {
        name: 'Vue',
        description: 'JavaScript library for building user interfaces',
      }

      const request1 = createMockRequest('http://localhost:3000/api/blog/tags', {
        method: 'POST',
        body: JSON.stringify(tagData1),
      })

      const request2 = createMockRequest('http://localhost:3000/api/blog/tags', {
        method: 'POST',
        body: JSON.stringify(tagData2),
      })

      const response1 = await POST(request1)
      const response2 = await POST(request2)
      const data1 = await response1.json()
      const data2 = await response2.json()

      expect(response1.status).toBe(201)
      expect(response2.status).toBe(201)
      expect(data1.success).toBe(true)
      expect(data2.success).toBe(true)
      expect(data1.data.slug).toBe('react')
      expect(data2.data.slug).toBe('vue')
    })

    it('handles empty description gracefully', async () => {
      const tagData = {
        name: 'Minimal Tag',
        description: '',
      }

      const request = createMockRequest('http://localhost:3000/api/blog/tags', {
        method: 'POST',
        body: JSON.stringify(tagData),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data.name).toBe('Minimal Tag')
      expect(data.data.description).toBe('')
    })

    it('handles JSON parsing errors', async () => {
      const request = {
        url: 'http://localhost:3000/api/blog/tags',
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
      expect(data.error).toBe('Failed to create blog tag')
    })

    it('assigns random color from predefined palette', async () => {
      const expectedColors = [
        '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
        '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
      ]

      const tagData = {
        name: 'Palette Test Tag',
        description: 'Testing color palette',
      }

      const request = createMockRequest('http://localhost:3000/api/blog/tags', {
        method: 'POST',
        body: JSON.stringify(tagData),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(expectedColors).toContain(data.data.color)
    })
  })
})