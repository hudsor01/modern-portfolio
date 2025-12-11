import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/blog/route'

// Mock the db module
vi.mock('@/lib/db', () => ({
  db: {
    blogPost: {
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    author: {
      update: vi.fn(),
    },
    category: {
      update: vi.fn(),
    },
    tag: {
      updateMany: vi.fn(),
    },
  },
}))

// Mock the logger
vi.mock('@/lib/monitoring/logger', () => ({
  createContextLogger: vi.fn(() => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  })),
}))

const createMockRequest = (url: string, options?: RequestInit) => {
  return new NextRequest(url, options as ConstructorParameters<typeof NextRequest>[1])
}

describe('/api/blog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET', () => {
    it('returns blog posts with default pagination', async () => {
      const { db } = await import('@/lib/db')
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
      vi.mocked(db.blogPost.findMany).mockResolvedValueOnce(mockPosts as never)
      vi.mocked(db.blogPost.count).mockResolvedValueOnce(1)

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
      const { db } = await import('@/lib/db')
      vi.mocked(db.blogPost.findMany).mockResolvedValueOnce([])
      vi.mocked(db.blogPost.count).mockResolvedValueOnce(15)

      const request = createMockRequest('http://localhost:3000/api/blog?page=2&limit=5')
      const response = await GET(request)
      const data = await response.json()

      expect(data.pagination.page).toBe(2)
      expect(data.pagination.limit).toBe(5)
      expect(data.pagination.hasPrev).toBe(true)
    })

    it('filters posts by status', async () => {
      const { db } = await import('@/lib/db')
      vi.mocked(db.blogPost.findMany).mockResolvedValueOnce([])
      vi.mocked(db.blogPost.count).mockResolvedValueOnce(0)

      const request = createMockRequest('http://localhost:3000/api/blog?status=DRAFT')
      await GET(request)

      expect(db.blogPost.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: { in: ['DRAFT'] },
          }),
        })
      )
    })

    it('filters posts by search term', async () => {
      const { db } = await import('@/lib/db')
      vi.mocked(db.blogPost.findMany).mockResolvedValueOnce([])
      vi.mocked(db.blogPost.count).mockResolvedValueOnce(0)

      const request = createMockRequest('http://localhost:3000/api/blog?search=react')
      await GET(request)

      expect(db.blogPost.findMany).toHaveBeenCalledWith(
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

    it('limits results to maximum of 50 per page', async () => {
      const { db } = await import('@/lib/db')
      vi.mocked(db.blogPost.findMany).mockResolvedValueOnce([])
      vi.mocked(db.blogPost.count).mockResolvedValueOnce(0)

      const request = createMockRequest('http://localhost:3000/api/blog?limit=100')
      const response = await GET(request)
      const data = await response.json()

      expect(data.pagination.limit).toBe(50)
    })

    it('handles database errors gracefully', async () => {
      const { db } = await import('@/lib/db')
      vi.mocked(db.blogPost.findMany).mockRejectedValueOnce(new Error('Database error'))

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
      const { db } = await import('@/lib/db')
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

      vi.mocked(db.blogPost.findUnique).mockResolvedValueOnce(null)
      vi.mocked(db.blogPost.create).mockResolvedValueOnce(createdPost as never)
      vi.mocked(db.author.update).mockResolvedValueOnce({} as never)

      const request = createMockRequest('http://localhost:3000/api/blog', {
        method: 'POST',
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
      const { db } = await import('@/lib/db')
      vi.mocked(db.blogPost.findUnique).mockResolvedValueOnce({ id: 'existing' } as never)

      const request = createMockRequest('http://localhost:3000/api/blog', {
        method: 'POST',
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
