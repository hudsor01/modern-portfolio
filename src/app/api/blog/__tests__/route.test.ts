import { describe, afterAll, it, expect, vi, beforeEach, mock } from 'bun:test'

// Create mock functions
const mockBlogPostFindMany = vi.fn()
const mockBlogPostCount = vi.fn()
const mockBlogPostFindUnique = vi.fn()
const mockBlogPostCreate = vi.fn()
const mockAuthorUpdate = vi.fn()
const mockCategoryUpdate = vi.fn()
const mockTagUpdateMany = vi.fn()
const mockValidateCSRFToken = vi.fn().mockResolvedValue(true)

// Mock the db module
mock.module('@/lib/db', () => ({
  db: {
    blogPost: {
      findMany: mockBlogPostFindMany,
      count: mockBlogPostCount,
      findUnique: mockBlogPostFindUnique,
      create: mockBlogPostCreate,
    },
    author: {
      update: mockAuthorUpdate,
    },
    category: {
      update: mockCategoryUpdate,
    },
    tag: {
      updateMany: mockTagUpdateMany,
    },
  },
}))

// Mock the logger
mock.module('@/lib/monitoring/logger', () => ({
  createContextLogger: () => ({
    info: () => {},
    warn: () => {},
    error: () => {},
    debug: () => {},
  }),
}))

// Mock CSRF protection
mock.module('@/lib/security/csrf-protection', () => ({
  validateCSRFToken: mockValidateCSRFToken,
  generateCSRFToken: vi.fn().mockResolvedValue('mock-csrf-token'),
}))

// Import after mocks
import { GET, POST } from '@/app/api/blog/route'

// Import mock request helper
import { createMockNextRequest } from '@/test/mock-next-request'

// Create a proper mock request with headers
const createMockRequest = (url: string, options?: { method?: string; body?: string; headers?: Record<string, string> }) => {
  return createMockNextRequest(url, options)
}

// Clean up mocks after all tests in this file
afterAll(() => {
  mock.restore()
})

describe('/api/blog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockBlogPostFindMany.mockReset()
    mockBlogPostCount.mockReset()
    mockBlogPostFindUnique.mockReset()
    mockBlogPostCreate.mockReset()
    mockAuthorUpdate.mockReset()
    mockValidateCSRFToken.mockResolvedValue(true)
  })

  describe('GET', () => {
    it('returns blog posts with default pagination', async () => {
      const mockPosts = [
        {
          id: '1',
          title: 'Test Post',
          slug: 'test-post',
          excerpt: 'Test excerpt',
          content: 'Test content',
          contentType: 'MARKDOWN',
          status: 'PUBLISHED',
          metaTitle: null,
          metaDescription: null,
          keywords: [],
          canonicalUrl: null,
          featuredImage: null,
          featuredImageAlt: null,
          readingTime: 5,
          wordCount: 1000,
          publishedAt: new Date(),
          scheduledAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          authorId: 'author-1',
          categoryId: 'cat-1',
          viewCount: 100,
          likeCount: 10,
          shareCount: 5,
          commentCount: 2,
          author: {
            id: 'author-1',
            name: 'Test Author',
            email: 'test@example.com',
            slug: 'test-author',
            bio: null,
            avatar: null,
            website: null,
            totalPosts: 5,
            totalViews: 1000,
            createdAt: new Date(),
          },
          category: {
            id: 'cat-1',
            name: 'Tech',
            slug: 'tech',
            description: null,
            color: null,
            icon: null,
            postCount: 10,
            totalViews: 5000,
            createdAt: new Date(),
          },
          tags: [],
        },
      ]
      mockBlogPostFindMany.mockResolvedValueOnce(mockPosts as never)
      mockBlogPostCount.mockResolvedValueOnce(1)

      const request = createMockRequest('http://localhost:3000/api/blog')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toBeInstanceOf(Array)
      expect(data.data.length).toBe(1)
      expect(data.pagination).toMatchObject({
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      })
    })

    it('applies pagination parameters correctly', async () => {
      mockBlogPostFindMany.mockResolvedValueOnce([])
      mockBlogPostCount.mockResolvedValueOnce(15)

      const request = createMockRequest('http://localhost:3000/api/blog?page=2&limit=5')
      const response = await GET(request)
      const data = await response.json()

      expect(data.pagination.page).toBe(2)
      expect(data.pagination.limit).toBe(5)
      expect(data.pagination.hasPrev).toBe(true)
    })

    it('filters posts by status', async () => {
      mockBlogPostFindMany.mockResolvedValueOnce([])
      mockBlogPostCount.mockResolvedValueOnce(0)

      const request = createMockRequest('http://localhost:3000/api/blog?status=DRAFT')
      await GET(request)

      expect(mockBlogPostFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: { in: ['DRAFT'] },
          }),
        })
      )
    })

    it('filters posts by search term', async () => {
      mockBlogPostFindMany.mockResolvedValueOnce([])
      mockBlogPostCount.mockResolvedValueOnce(0)

      const request = createMockRequest('http://localhost:3000/api/blog?search=react')
      await GET(request)

      expect(mockBlogPostFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              { title: { contains: 'react', mode: 'insensitive' } },
              { excerpt: { contains: 'react', mode: 'insensitive' } },
            ]),
          }),
        })
      )
    })

    it('limits results to maximum of 100 per page', async () => {
      mockBlogPostFindMany.mockResolvedValueOnce([])
      mockBlogPostCount.mockResolvedValueOnce(0)

      const request = createMockRequest('http://localhost:3000/api/blog?limit=200')
      const response = await GET(request)
      const data = await response.json()

      expect(data.pagination.limit).toBe(100)
    })

    it('handles database errors gracefully', async () => {
      mockBlogPostFindMany.mockRejectedValueOnce(new Error('Database error'))

      const request = createMockRequest('http://localhost:3000/api/blog')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Failed to fetch blog posts')
    })
  })

  describe('POST', () => {
    it('creates a new blog post with required fields', async () => {
      const createdPost = {
        id: 'new-post-1',
        title: 'New Post',
        slug: 'new-post',
        excerpt: null,
        content: 'This is the content of the new post',
        contentType: 'MARKDOWN',
        status: 'DRAFT',
        metaTitle: null,
        metaDescription: null,
        keywords: [],
        canonicalUrl: null,
        featuredImage: null,
        featuredImageAlt: null,
        readingTime: 1,
        wordCount: 7,
        publishedAt: null,
        scheduledAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        authorId: 'author-1',
        categoryId: null,
        viewCount: 0,
        likeCount: 0,
        shareCount: 0,
        commentCount: 0,
        author: {
          id: 'author-1',
          name: 'Test Author',
          email: 'test@example.com',
          slug: 'test-author',
          bio: null,
          avatar: null,
          website: null,
          totalPosts: 1,
          totalViews: 0,
          createdAt: new Date(),
        },
        category: null,
        tags: [],
      }

      mockBlogPostFindUnique.mockResolvedValueOnce(null)
      mockBlogPostCreate.mockResolvedValueOnce(createdPost as never)
      mockAuthorUpdate.mockResolvedValueOnce({} as never)

      const request = createMockRequest('http://localhost:3000/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': 'mock-csrf-token',
          'x-forwarded-for': '127.0.0.1',
        },
        body: JSON.stringify({
          title: 'New Post',
          content: 'This is the content of the new post',
          authorId: 'author-1',
        }),
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data.title).toBe('New Post')
      expect(data.data.slug).toBe('new-post')
    })

    it('returns 400 for missing required fields', async () => {
      const request = createMockRequest('http://localhost:3000/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': 'mock-csrf-token',
          'x-forwarded-for': '127.0.0.1',
        },
        body: JSON.stringify({
          title: 'New Post',
          // Missing content and authorId
        }),
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Missing required fields')
    })

    it('returns 409 for duplicate slug', async () => {
      mockBlogPostFindUnique.mockResolvedValueOnce({ id: 'existing' } as never)

      const request = createMockRequest('http://localhost:3000/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': 'mock-csrf-token',
          'x-forwarded-for': '127.0.0.1',
        },
        body: JSON.stringify({
          title: 'New Post',
          content: 'Content',
          authorId: 'author-1',
        }),
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.success).toBe(false)
      expect(data.error).toContain('slug already exists')
    })
  })
})
