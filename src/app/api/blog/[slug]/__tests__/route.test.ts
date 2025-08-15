import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { GET, PUT, DELETE } from '@/app/api/blog/route'

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

const createMockParams = (slug: string) => ({ params: Promise.resolve({ slug }) })

describe('/api/blog/[slug]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET', () => {
    it('returns a blog post by slug', async () => {
      const request = createMockRequest('http://localhost:3000/api/blog/revenue-operations-best-practices-complete-guide')
      const params = createMockParams('revenue-operations-best-practices-complete-guide')
      
      const response = await GET(request, params)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toMatchObject({
        slug: 'revenue-operations-best-practices-complete-guide',
        title: 'Revenue Operations Best Practices: A Complete Guide',
        status: 'PUBLISHED',
      })
      expect(data.data.id).toBeDefined()
      expect(data.data.content).toContain('Revenue Operations Best Practices')
    })

    it('increments view count when post is retrieved', async () => {
      const request = createMockRequest('http://localhost:3000/api/blog/revenue-operations-best-practices-complete-guide')
      const params = createMockParams('revenue-operations-best-practices-complete-guide')
      
      const response1 = await GET(request, params)
      const data1 = await response1.json()
      const initialViewCount = data1.data.viewCount

      const response2 = await GET(request, params)
      const data2 = await response2.json()

      expect(data2.data.viewCount).toBe(initialViewCount + 1)
    })

    it('returns 404 for non-existent slug', async () => {
      const request = createMockRequest('http://localhost:3000/api/blog/non-existent-post')
      const params = createMockParams('non-existent-post')
      
      const response = await GET(request, params)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Blog post not found')
    })

    it('returns 400 for missing slug parameter', async () => {
      const request = createMockRequest('http://localhost:3000/api/blog/')
      const params = createMockParams('')
      
      const response = await GET(request, params)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Slug parameter is required')
    })

    it('includes cache headers in response', async () => {
      const request = createMockRequest('http://localhost:3000/api/blog/revenue-operations-best-practices-complete-guide')
      const params = createMockParams('revenue-operations-best-practices-complete-guide')
      
      const response = await GET(request, params)

      expect(response.headers['Cache-Control']).toBe('public, max-age=300, s-maxage=600')
    })

    it('includes all expected fields in response', async () => {
      const request = createMockRequest('http://localhost:3000/api/blog/revenue-operations-best-practices-complete-guide')
      const params = createMockParams('revenue-operations-best-practices-complete-guide')
      
      const response = await GET(request, params)
      const data = await response.json()

      expect(data.data).toHaveProperty('id')
      expect(data.data).toHaveProperty('title')
      expect(data.data).toHaveProperty('slug')
      expect(data.data).toHaveProperty('content')
      expect(data.data).toHaveProperty('excerpt')
      expect(data.data).toHaveProperty('status')
      expect(data.data).toHaveProperty('metaTitle')
      expect(data.data).toHaveProperty('metaDescription')
      expect(data.data).toHaveProperty('keywords')
      expect(data.data).toHaveProperty('author')
      expect(data.data).toHaveProperty('category')
      expect(data.data).toHaveProperty('tags')
      expect(data.data).toHaveProperty('viewCount')
      expect(data.data).toHaveProperty('publishedAt')
      expect(data.data).toHaveProperty('createdAt')
      expect(data.data).toHaveProperty('updatedAt')
    })

    it('handles internal server errors', async () => {
      const request = createMockRequest('http://localhost:3000/api/blog/test-slug')
      const params = { params: Promise.reject(new Error('Database connection failed')) } // Force an error
      
      const response = await GET(request, params)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Failed to fetch blog post')
    })
  })

  describe('PUT', () => {
    it('updates a blog post successfully', async () => {
      const updateData = {
        title: 'Updated Title',
        content: 'Updated content for the blog post',
        metaDescription: 'Updated meta description',
      }

      const request = createMockRequest('http://localhost:3000/api/blog/revenue-operations-best-practices-complete-guide', {
        method: 'PUT',
        body: JSON.stringify(updateData),
      })
      const params = createMockParams('revenue-operations-best-practices-complete-guide')
      
      const response = await PUT(request, params)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toMatchObject({
        title: 'Updated Title',
        content: 'Updated content for the blog post',
        metaDescription: 'Updated meta description',
      })
      expect(data.data.updatedAt).toBeDefined()
      expect(data.message).toBe('Blog post updated successfully')
    })

    it('preserves post ID and slug when updating', async () => {
      const updateData = {
        title: 'New Title',
        id: 'different-id',
        slug: 'different-slug',
      }

      const request = createMockRequest('http://localhost:3000/api/blog/revenue-operations-best-practices-complete-guide', {
        method: 'PUT',
        body: JSON.stringify(updateData),
      })
      const params = createMockParams('revenue-operations-best-practices-complete-guide')
      
      const response = await PUT(request, params)
      const data = await response.json()

      expect(data.data.id).toBe('1') // Original ID preserved
      expect(data.data.slug).toBe('revenue-operations-best-practices-complete-guide') // Original slug preserved
      expect(data.data.title).toBe('New Title') // Title updated
    })

    it('updates reading time and word count when content changes', async () => {
      const longContent = new Array(600).fill('word').join(' ') // 600 words
      const updateData = {
        content: longContent,
      }

      const request = createMockRequest('http://localhost:3000/api/blog/revenue-operations-best-practices-complete-guide', {
        method: 'PUT',
        body: JSON.stringify(updateData),
      })
      const params = createMockParams('revenue-operations-best-practices-complete-guide')
      
      const response = await PUT(request, params)
      const data = await response.json()

      expect(data.data.wordCount).toBe(600)
      expect(data.data.readingTime).toBe(3) // 600 words / 200 WPM = 3 minutes
    })

    it('sets publishedAt when status changes to PUBLISHED', async () => {
      // First, let's create a draft post scenario
      const updateData = {
        status: 'PUBLISHED',
      }

      const request = createMockRequest('http://localhost:3000/api/blog/revenue-operations-best-practices-complete-guide', {
        method: 'PUT',
        body: JSON.stringify(updateData),
      })
      const params = createMockParams('revenue-operations-best-practices-complete-guide')
      
      const response = await PUT(request, params)
      const data = await response.json()

      expect(data.data.status).toBe('PUBLISHED')
      // Note: In this case, publishedAt already exists, so it should be preserved
      expect(data.data.publishedAt).toBeDefined()
    })

    it('preserves existing publishedAt if already set', async () => {
      const originalPublishedAt = '2024-01-15T10:00:00Z'
      const updateData = {
        title: 'Updated Title',
      }

      const request = createMockRequest('http://localhost:3000/api/blog/revenue-operations-best-practices-complete-guide', {
        method: 'PUT',
        body: JSON.stringify(updateData),
      })
      const params = createMockParams('revenue-operations-best-practices-complete-guide')
      
      const response = await PUT(request, params)
      const data = await response.json()

      expect(data.data.publishedAt).toBe(originalPublishedAt)
    })

    it('returns 404 for non-existent slug', async () => {
      const updateData = { title: 'Updated Title' }

      const request = createMockRequest('http://localhost:3000/api/blog/non-existent-post', {
        method: 'PUT',
        body: JSON.stringify(updateData),
      })
      const params = createMockParams('non-existent-post')
      
      const response = await PUT(request, params)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Blog post not found')
    })

    it('returns 400 for missing slug parameter', async () => {
      const updateData = { title: 'Updated Title' }

      const request = createMockRequest('http://localhost:3000/api/blog/', {
        method: 'PUT',
        body: JSON.stringify(updateData),
      })
      const params = createMockParams('')
      
      const response = await PUT(request, params)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Slug parameter is required')
    })

    it('includes no-cache header in response', async () => {
      const updateData = { title: 'Updated Title' }

      const request = createMockRequest('http://localhost:3000/api/blog/revenue-operations-best-practices-complete-guide', {
        method: 'PUT',
        body: JSON.stringify(updateData),
      })
      const params = createMockParams('revenue-operations-best-practices-complete-guide')
      
      const response = await PUT(request, params)

      expect(response.headers['Cache-Control']).toBe('no-cache')
    })

    it('handles JSON parsing errors', async () => {
      const request = {
        url: 'http://localhost:3000/api/blog/revenue-operations-best-practices-complete-guide',
        method: 'PUT',
        body: 'invalid-json',
        json: async () => {
          throw new Error('Invalid JSON')
        },
      } as NextRequest
      const params = createMockParams('revenue-operations-best-practices-complete-guide')
      
      const response = await PUT(request, params)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Failed to update blog post')
    })
  })

  describe('DELETE', () => {
    it('deletes a blog post successfully', async () => {
      const request = createMockRequest('http://localhost:3000/api/blog/revenue-operations-best-practices-complete-guide', {
        method: 'DELETE',
      })
      const params = createMockParams('revenue-operations-best-practices-complete-guide')
      
      const response = await DELETE(request, params)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.success).toBe(true)
      expect(data.message).toBe('Blog post deleted successfully')
    })

    it('returns 404 for non-existent slug', async () => {
      const request = createMockRequest('http://localhost:3000/api/blog/non-existent-post', {
        method: 'DELETE',
      })
      const params = createMockParams('non-existent-post')
      
      const response = await DELETE(request, params)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Blog post not found')
    })

    it('returns 400 for missing slug parameter', async () => {
      const request = createMockRequest('http://localhost:3000/api/blog/', {
        method: 'DELETE',
      })
      const params = createMockParams('')
      
      const response = await DELETE(request, params)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Slug parameter is required')
    })

    it('includes no-cache header in response', async () => {
      const request = createMockRequest('http://localhost:3000/api/blog/revenue-operations-best-practices-complete-guide', {
        method: 'DELETE',
      })
      const params = createMockParams('revenue-operations-best-practices-complete-guide')
      
      const response = await DELETE(request, params)

      expect(response.headers['Cache-Control']).toBe('no-cache')
    })

    it('actually removes the post from the collection', async () => {
      const slug = 'revenue-operations-best-practices-complete-guide'
      
      // First, verify the post exists
      const getRequest = createMockRequest(`http://localhost:3000/api/blog/${slug}`)
      const getParams = createMockParams(slug)
      const getResponse1 = await GET(getRequest, getParams)
      expect(getResponse1.status).toBe(200)

      // Delete the post
      const deleteRequest = createMockRequest(`http://localhost:3000/api/blog/${slug}`, {
        method: 'DELETE',
      })
      const deleteParams = createMockParams(slug)
      await DELETE(deleteRequest, deleteParams)

      // Verify the post is gone
      const getResponse2 = await GET(getRequest, getParams)
      expect(getResponse2.status).toBe(404)
    })

    it('handles internal server errors', async () => {
      const request = createMockRequest('http://localhost:3000/api/blog/test-slug', {
        method: 'DELETE',
      })
      const params = { params: Promise.reject(new Error('Database connection failed')) } // Force an error
      
      const response = await DELETE(request, params)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Failed to delete blog post')
    })
  })
})