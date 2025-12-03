import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { GET } from '@/app/api/blog/analytics/route'

// Import proper types from the types directory
import type { BlogPost, BlogCategory, BlogTag } from '@/types/blog'

// Use proper types instead of custom test interfaces
type PostAnalytics = BlogPost & {
  views: number
  likes: number
  shares: number
  comments: number
}

type CategoryAnalytics = BlogCategory & {
  totalViews: number
  totalPosts: number
}

type TagAnalytics = BlogTag & {
  totalViews: number
  totalPosts: number
}


interface KeywordData {
  keyword: string
  count: number
  relevanceScore: number
}

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
  } as NextRequest
}

const createMockRequestWithSearchParams = (searchParams: Record<string, string>) => {
  const url = new URL('http://localhost:3000/api/blog/analytics')
  Object.entries(searchParams).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })
  return createMockRequest(url.toString())
}

describe('/api/blog/analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET', () => {
    it('returns comprehensive blog analytics data', async () => {
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

    it('returns expected data structure for top posts', async () => {
      const request = createMockRequest('http://localhost:3000/api/blog/analytics')
      const response = await GET(request)
      const data = await response.json()

      expect(data.data.topPosts).toBeInstanceOf(Array)
      expect(data.data.topPosts.length).toBeGreaterThan(0)
      
      data.data.topPosts.forEach((post: PostAnalytics) => {
        expect(post).toHaveProperty('id')
        expect(post).toHaveProperty('title')
        expect(post).toHaveProperty('slug')
        expect(post).toHaveProperty('viewCount')
        expect(post).toHaveProperty('likeCount')
        expect(post).toHaveProperty('shareCount')
        expect(post).toHaveProperty('commentCount')
        expect(post).toHaveProperty('publishedAt')
      })
    })

    it('returns expected data structure for top categories', async () => {
      const request = createMockRequest('http://localhost:3000/api/blog/analytics')
      const response = await GET(request)
      const data = await response.json()

      expect(data.data.topCategories).toBeInstanceOf(Array)
      expect(data.data.topCategories.length).toBeGreaterThan(0)
      
      data.data.topCategories.forEach((category: CategoryAnalytics) => {
        expect(category).toHaveProperty('id')
        expect(category).toHaveProperty('name')
        expect(category).toHaveProperty('slug')
        expect(category).toHaveProperty('postCount')
        expect(category).toHaveProperty('totalViews')
        expect(category).toHaveProperty('color')
      })
    })

    it('returns expected data structure for top tags', async () => {
      const request = createMockRequest('http://localhost:3000/api/blog/analytics')
      const response = await GET(request)
      const data = await response.json()

      expect(data.data.topTags).toBeInstanceOf(Array)
      expect(data.data.topTags.length).toBeGreaterThan(0)
      
      data.data.topTags.forEach((tag: TagAnalytics) => {
        expect(tag).toHaveProperty('id')
        expect(tag).toHaveProperty('name')
        expect(tag).toHaveProperty('slug')
        expect(tag).toHaveProperty('postCount')
        expect(tag).toHaveProperty('totalViews')
        expect(tag).toHaveProperty('color')
      })
    })

    it('returns monthly views data with correct structure', async () => {
      const request = createMockRequest('http://localhost:3000/api/blog/analytics')
      const response = await GET(request)
      const data = await response.json()

      expect(data.data.monthlyViews).toBeInstanceOf(Array)
      expect(data.data.monthlyViews.length).toBeGreaterThan(0)
      
      data.data.monthlyViews.forEach((monthData: { month: string; views: number }) => {
        expect(monthData).toHaveProperty('month')
        expect(monthData).toHaveProperty('views')
        expect(monthData.month).toMatch(/^\d{4}-\d{2}$/) // YYYY-MM format
        expect(typeof monthData.views).toBe('number')
      })
    })

    it('returns popular keywords with correct structure', async () => {
      const request = createMockRequest('http://localhost:3000/api/blog/analytics')
      const response = await GET(request)
      const data = await response.json()

      expect(data.data.popularKeywords).toBeInstanceOf(Array)
      expect(data.data.popularKeywords.length).toBeGreaterThan(0)
      
      data.data.popularKeywords.forEach((keywordData: KeywordData) => {
        expect(keywordData).toHaveProperty('keyword')
        expect(keywordData).toHaveProperty('count')
        expect(typeof keywordData.keyword).toBe('string')
        expect(typeof keywordData.count).toBe('number')
      })
    })

    it('filters data for 7-day time range', async () => {
      const request = createMockRequestWithSearchParams({ timeRange: '7d' })
      const response = await GET(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.data.totalViews).toBeLessThan(15420) // Should be ~25% of original
      expect(data.data.totalInteractions).toBeLessThan(342) // Should be ~25% of original
      expect(data.data.monthlyViews.length).toBe(1) // Only current month for 7d
    })

    it('filters data for 90-day time range', async () => {
      const request = createMockRequestWithSearchParams({ timeRange: '90d' })
      const response = await GET(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.data.totalViews).toBeGreaterThan(15420) // Should be ~150% of original
      expect(data.data.totalInteractions).toBeGreaterThan(342) // Should be ~150% of original
    })

    it('filters data for 1-year time range', async () => {
      const request = createMockRequestWithSearchParams({ timeRange: '1y' })
      const response = await GET(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.data.totalViews).toBeGreaterThan(20000) // Should be ~250% of original
      expect(data.data.totalInteractions).toBeGreaterThan(500) // Should be ~250% of original
      expect(data.data.monthlyViews.length).toBeGreaterThan(6) // Extended month data
    })

    it('uses default 30-day time range when not specified', async () => {
      const request = createMockRequest('http://localhost:3000/api/blog/analytics')
      const response = await GET(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.data.totalViews).toBe(15420) // Original mock data
      expect(data.data.totalInteractions).toBe(342) // Original mock data
    })

    it('handles invalid time range gracefully', async () => {
      const request = createMockRequestWithSearchParams({ timeRange: 'invalid' })
      const response = await GET(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      // Should fall back to default behavior
      expect(data.data.totalViews).toBe(15420)
    })

    it('includes detailed post content when details=true', async () => {
      const request = createMockRequestWithSearchParams({ details: 'true' })
      const response = await GET(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      // In this mock implementation, content is always empty, but the structure is preserved
      data.data.topPosts.forEach((post: PostAnalytics) => {
        expect(post).toHaveProperty('content')
        expect(post).toHaveProperty('excerpt')
        expect(post).toHaveProperty('metaDescription')
      })
    })

    it('excludes post content by default for reduced payload', async () => {
      const request = createMockRequest('http://localhost:3000/api/blog/analytics')
      const response = await GET(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      data.data.topPosts.forEach((post: PostAnalytics) => {
        expect(post.content).toBe('') // Content should be empty
      })
    })

    it('includes cache headers in response', async () => {
      const request = createMockRequest('http://localhost:3000/api/blog/analytics')
      const response = await GET(request)

      expect((response.headers as unknown as Record<string, string>)['Cache-Control']).toBe('public, max-age=60, s-maxage=120')
    })

    it('has consistent data relationships', async () => {
      const request = createMockRequest('http://localhost:3000/api/blog/analytics')
      const response = await GET(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      
      // Total posts should equal published + draft posts
      expect(data.data.totalPosts).toBe(data.data.publishedPosts + data.data.draftPosts)
      
      // Categories should be sorted by some metric (views or post count)
      const categoryViews = data.data.topCategories.map((cat: CategoryAnalytics) => cat.totalViews)
      const sortedViews = [...categoryViews].sort((a, b) => b - a)
      expect(categoryViews).toEqual(sortedViews)
      
      // Tags should be sorted by some metric
      const tagViews = data.data.topTags.map((tag: TagAnalytics) => tag.totalViews)
      const sortedTagViews = [...tagViews].sort((a, b) => b - a)
      expect(tagViews).toEqual(sortedTagViews)
      
      // Keywords should be sorted by count descending
      const keywordCounts = data.data.popularKeywords.map((kw: KeywordData) => kw.count)
      const sortedCounts = [...keywordCounts].sort((a, b) => b - a)
      expect(keywordCounts).toEqual(sortedCounts)
    })

    it('validates numeric values are positive', async () => {
      const request = createMockRequest('http://localhost:3000/api/blog/analytics')
      const response = await GET(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.data.totalPosts).toBeGreaterThanOrEqual(0)
      expect(data.data.publishedPosts).toBeGreaterThanOrEqual(0)
      expect(data.data.draftPosts).toBeGreaterThanOrEqual(0)
      expect(data.data.totalViews).toBeGreaterThanOrEqual(0)
      expect(data.data.totalInteractions).toBeGreaterThanOrEqual(0)
      expect(data.data.avgReadingTime).toBeGreaterThan(0)
      
      data.data.monthlyViews.forEach((month: { month: string; views: number }) => {
        expect(month.views).toBeGreaterThanOrEqual(0)
      })
      
      data.data.popularKeywords.forEach((keyword: KeywordData) => {
        expect(keyword.count).toBeGreaterThan(0)
      })
    })

    it('handles server errors gracefully', async () => {
      // Mock an error condition by creating an invalid URL
      const request = createMockRequest('invalid-url')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Failed to fetch blog analytics')
    })

    it('combines timeRange and details parameters correctly', async () => {
      const request = createMockRequestWithSearchParams({ 
        timeRange: '1y',
        details: 'true' 
      })
      const response = await GET(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      // Should have extended year data
      expect(data.data.monthlyViews.length).toBeGreaterThan(6)
      // Should include post details
      data.data.topPosts.forEach((post: PostAnalytics) => {
        expect(post).toHaveProperty('excerpt')
        expect(post).toHaveProperty('metaDescription')
      })
    })
  })
})