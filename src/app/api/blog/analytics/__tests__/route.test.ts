import { describe, afterAll, it, expect, vi, beforeEach, mock } from 'bun:test'

// Create mock functions
const mockCount = vi.fn()
const mockAggregate = vi.fn()
const mockBlogPostFindMany = vi.fn()
const mockCategoryFindMany = vi.fn()
const mockTagFindMany = vi.fn()
const mockGroupBy = vi.fn()

// Mock the db module
mock.module('@/lib/db', () => ({
  db: {
    blogPost: {
      count: mockCount,
      aggregate: mockAggregate,
      findMany: mockBlogPostFindMany,
    },
    category: {
      findMany: mockCategoryFindMany,
    },
    tag: {
      findMany: mockTagFindMany,
    },
    postView: {
      groupBy: mockGroupBy,
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

// Import after mocks
import { GET } from '@/app/api/blog/analytics/route'
import { createMockNextRequest } from '@/test/mock-next-request'

const createMockRequest = (url: string) => createMockNextRequest(url)

// Helper to set up standard mocks for successful responses
function setupStandardMocks(overrides?: {
  totalPosts?: number
  publishedPosts?: number
  draftPosts?: number
  viewCount?: number | null
  likeCount?: number | null
  shareCount?: number | null
  commentCount?: number | null
  readingTime?: number | null
  topPosts?: unknown[]
  topCategories?: unknown[]
  topTags?: unknown[]
  monthlyViews?: unknown[]
  keywords?: unknown[]
}) {
  mockCount
    .mockResolvedValueOnce(overrides?.totalPosts ?? 10)
    .mockResolvedValueOnce(overrides?.publishedPosts ?? 8)
    .mockResolvedValueOnce(overrides?.draftPosts ?? 2)

  mockAggregate.mockResolvedValueOnce({
    _sum: {
      viewCount: overrides?.viewCount ?? 1500,
      likeCount: overrides?.likeCount ?? 100,
      shareCount: overrides?.shareCount ?? 50,
      commentCount: overrides?.commentCount ?? 25,
    },
    _avg: { readingTime: overrides?.readingTime ?? 5 },
  } as never)

  mockBlogPostFindMany
    .mockResolvedValueOnce((overrides?.topPosts ?? []) as never)
    .mockResolvedValueOnce((overrides?.keywords ?? []) as never)

  mockCategoryFindMany.mockResolvedValueOnce((overrides?.topCategories ?? []) as never)
  mockTagFindMany.mockResolvedValueOnce((overrides?.topTags ?? []) as never)
  mockGroupBy.mockResolvedValueOnce((overrides?.monthlyViews ?? []) as never)
}

// Clean up mocks after all tests in this file
afterAll(() => {
  mock.restore()
})

describe('/api/blog/analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCount.mockReset()
    mockAggregate.mockReset()
    mockBlogPostFindMany.mockReset()
    mockCategoryFindMany.mockReset()
    mockTagFindMany.mockReset()
    mockGroupBy.mockReset()
  })

  describe('GET', () => {
    it('returns comprehensive blog analytics data', async () => {
      setupStandardMocks()

      const request = createMockRequest('http://localhost:3000/api/blog/analytics')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toHaveProperty('totalPosts')
      expect(data.data).toHaveProperty('publishedPosts')
      expect(data.data).toHaveProperty('draftPosts')
      expect(data.data).toHaveProperty('totalViews')
      expect(data.data).toHaveProperty('totalInteractions')
      expect(data.data).toHaveProperty('avgReadingTime')
      expect(data.data).toHaveProperty('topPosts')
      expect(data.data).toHaveProperty('topCategories')
      expect(data.data).toHaveProperty('topTags')
      expect(data.data).toHaveProperty('monthlyViews')
      expect(data.data).toHaveProperty('popularKeywords')
    })

    it('returns correct counts from database', async () => {
      setupStandardMocks({
        totalPosts: 15,
        publishedPosts: 12,
        draftPosts: 3,
        viewCount: 5000,
        likeCount: 200,
        shareCount: 100,
        commentCount: 50,
        readingTime: 7,
      })

      const request = createMockRequest('http://localhost:3000/api/blog/analytics')
      const response = await GET(request)
      const data = await response.json()

      expect(data.data.totalPosts).toBe(15)
      expect(data.data.publishedPosts).toBe(12)
      expect(data.data.draftPosts).toBe(3)
      expect(data.data.totalViews).toBe(5000)
      expect(data.data.totalInteractions).toBe(350) // 200 + 100 + 50
      expect(data.data.avgReadingTime).toBe(7)
    })

    it('returns top posts with correct structure', async () => {
      const mockPost = {
        id: 'post-1',
        title: 'Test Post',
        slug: 'test-post',
        excerpt: 'Test excerpt',
        content: 'Test content',
        contentType: 'MARKDOWN',
        status: 'PUBLISHED',
        metaTitle: null,
        metaDescription: null,
        keywords: ['test'],
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
          color: '#000',
          icon: null,
          postCount: 10,
          totalViews: 5000,
          createdAt: new Date(),
        },
        tags: [],
      }

      setupStandardMocks({
        totalPosts: 1,
        publishedPosts: 1,
        draftPosts: 0,
        viewCount: 100,
        likeCount: 10,
        shareCount: 5,
        commentCount: 2,
        topPosts: [mockPost],
        keywords: [{ keywords: ['test'] }],
      })

      const request = createMockRequest('http://localhost:3000/api/blog/analytics')
      const response = await GET(request)
      const data = await response.json()

      expect(data.data.topPosts).toBeInstanceOf(Array)
      expect(data.data.topPosts.length).toBe(1)
      expect(data.data.topPosts[0]).toHaveProperty('id')
      expect(data.data.topPosts[0]).toHaveProperty('title')
      expect(data.data.topPosts[0]).toHaveProperty('slug')
      expect(data.data.topPosts[0]).toHaveProperty('viewCount')
    })

    it('returns top categories with correct structure', async () => {
      const mockCategory = {
        id: 'cat-1',
        name: 'Tech',
        slug: 'tech',
        description: 'Technology posts',
        color: '#0066cc',
        icon: null,
        postCount: 10,
        totalViews: 5000,
        createdAt: new Date(),
      }

      setupStandardMocks({
        topCategories: [mockCategory],
      })

      const request = createMockRequest('http://localhost:3000/api/blog/analytics')
      const response = await GET(request)
      const data = await response.json()

      expect(data.data.topCategories).toBeInstanceOf(Array)
      expect(data.data.topCategories.length).toBe(1)
      expect(data.data.topCategories[0]).toHaveProperty('id')
      expect(data.data.topCategories[0]).toHaveProperty('name')
      expect(data.data.topCategories[0]).toHaveProperty('slug')
      expect(data.data.topCategories[0]).toHaveProperty('postCount')
      expect(data.data.topCategories[0]).toHaveProperty('totalViews')
    })

    it('returns top tags with correct structure', async () => {
      const mockTag = {
        id: 'tag-1',
        name: 'JavaScript',
        slug: 'javascript',
        description: null,
        color: '#f7df1e',
        postCount: 8,
        totalViews: 3000,
        createdAt: new Date(),
      }

      setupStandardMocks({
        topTags: [mockTag],
      })

      const request = createMockRequest('http://localhost:3000/api/blog/analytics')
      const response = await GET(request)
      const data = await response.json()

      expect(data.data.topTags).toBeInstanceOf(Array)
      expect(data.data.topTags.length).toBe(1)
      expect(data.data.topTags[0]).toHaveProperty('id')
      expect(data.data.topTags[0]).toHaveProperty('name')
      expect(data.data.topTags[0]).toHaveProperty('slug')
      expect(data.data.topTags[0]).toHaveProperty('postCount')
      expect(data.data.topTags[0]).toHaveProperty('totalViews')
    })

    it('returns monthly views data with correct structure', async () => {
      setupStandardMocks({
        monthlyViews: [
          { viewedAt: new Date('2024-01-15'), _count: 100 },
          { viewedAt: new Date('2024-02-10'), _count: 150 },
        ],
      })

      const request = createMockRequest('http://localhost:3000/api/blog/analytics')
      const response = await GET(request)
      const data = await response.json()

      expect(data.data.monthlyViews).toBeInstanceOf(Array)
      data.data.monthlyViews.forEach((monthData: { month: string; views: number }) => {
        expect(monthData).toHaveProperty('month')
        expect(monthData).toHaveProperty('views')
        expect(monthData.month).toMatch(/^\d{4}-\d{2}$/) // YYYY-MM format
        expect(typeof monthData.views).toBe('number')
      })
    })

    it('returns popular keywords with correct structure', async () => {
      setupStandardMocks({
        keywords: [
          { keywords: ['react', 'javascript'] },
          { keywords: ['react', 'typescript'] },
          { keywords: ['javascript'] },
        ],
      })

      const request = createMockRequest('http://localhost:3000/api/blog/analytics')
      const response = await GET(request)
      const data = await response.json()

      expect(data.data.popularKeywords).toBeInstanceOf(Array)
      data.data.popularKeywords.forEach((keywordData: { keyword: string; count: number }) => {
        expect(keywordData).toHaveProperty('keyword')
        expect(keywordData).toHaveProperty('count')
        expect(typeof keywordData.keyword).toBe('string')
        expect(typeof keywordData.count).toBe('number')
      })
    })

    it('handles time range parameter', async () => {
      setupStandardMocks()

      const request = createMockRequest('http://localhost:3000/api/blog/analytics?timeRange=7d')
      const response = await GET(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.data).toHaveProperty('totalViews')
    })

    it('handles database errors gracefully', async () => {
      mockCount.mockRejectedValueOnce(new Error('Database error'))

      const request = createMockRequest('http://localhost:3000/api/blog/analytics')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Failed to fetch blog analytics')
    })

    it('returns empty arrays when no data exists', async () => {
      setupStandardMocks({
        totalPosts: 0,
        publishedPosts: 0,
        draftPosts: 0,
        viewCount: null,
        likeCount: null,
        shareCount: null,
        commentCount: null,
        readingTime: null,
      })

      const request = createMockRequest('http://localhost:3000/api/blog/analytics')
      const response = await GET(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.data.totalPosts).toBe(0)
      expect(data.data.topPosts).toEqual([])
      expect(data.data.topCategories).toEqual([])
      expect(data.data.topTags).toEqual([])
      expect(data.data.monthlyViews).toEqual([])
      expect(data.data.popularKeywords).toEqual([])
    })

    it('includes cache headers in response', async () => {
      setupStandardMocks({
        totalPosts: 0,
        publishedPosts: 0,
        draftPosts: 0,
        viewCount: null,
        likeCount: null,
        shareCount: null,
        commentCount: null,
        readingTime: null,
      })

      const request = createMockRequest('http://localhost:3000/api/blog/analytics')
      const response = await GET(request)

      expect(response.headers.get('Cache-Control')).toBe('public, max-age=60, s-maxage=120')
    })
  })
})
