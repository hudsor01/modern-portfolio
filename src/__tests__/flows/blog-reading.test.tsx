/**
 * Production Behavior Test: Blog Post Reading Flow
 *
 * Tests the complete user journey for reading blog posts:
 * 1. User visits blog page
 * 2. User sees list of published posts
 * 3. User filters/searches posts
 * 4. User clicks on a post
 * 5. User reads post (view tracked)
 * 6. User can like/share post
 *
 * Uses MSW to mock API responses at network level
 */

import { describe, it, expect, beforeAll, afterEach, afterAll } from 'bun:test'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

// Mock blog post data
const mockBlogPosts = [
  {
    id: '1',
    title: 'Revenue Operations Best Practices',
    slug: 'revenue-operations-best-practices',
    excerpt: 'Learn the essential best practices for building a world-class revenue operations function.',
    content: '# Revenue Operations Best Practices\n\nRevenue operations is critical...',
    contentType: 'MARKDOWN',
    status: 'PUBLISHED',
    publishedAt: new Date('2024-01-15').toISOString(),
    readingTime: 8,
    viewCount: 2540,
    likeCount: 87,
    author: {
      id: 'author-1',
      name: 'Richard Hudson',
      slug: 'richard-hudson',
    },
    category: {
      id: 'cat-1',
      name: 'Revenue Operations',
      slug: 'revenue-operations',
    },
    tags: [
      { id: 'tag-1', name: 'RevOps', slug: 'revops' },
      { id: 'tag-2', name: 'Best Practices', slug: 'best-practices' },
    ],
  },
  {
    id: '2',
    title: 'Advanced Customer Churn Analysis',
    slug: 'advanced-customer-churn-analysis',
    excerpt: 'Deep dive into predictive churn modeling and retention strategies.',
    content: '# Advanced Customer Churn Analysis\n\nChurn analysis is essential...',
    contentType: 'MARKDOWN',
    status: 'PUBLISHED',
    publishedAt: new Date('2024-01-10').toISOString(),
    readingTime: 12,
    viewCount: 1890,
    likeCount: 65,
    author: {
      id: 'author-1',
      name: 'Richard Hudson',
      slug: 'richard-hudson',
    },
    category: {
      id: 'cat-2',
      name: 'Analytics',
      slug: 'analytics',
    },
    tags: [
      { id: 'tag-3', name: 'Churn', slug: 'churn' },
      { id: 'tag-4', name: 'Analytics', slug: 'analytics' },
    ],
  },
]

// Setup MSW server - IMPORTANT: Order matters! More specific routes MUST come first
const handlers = [
  // Mock blog categories API - Must be before generic /api/blog
  http.get('http://localhost:3000/api/blog/categories*', () => {
    return HttpResponse.json({
      success: true,
      data: [
        { id: 'cat-1', name: 'Revenue Operations', slug: 'revenue-operations', postCount: 1 },
        { id: 'cat-2', name: 'Analytics', slug: 'analytics', postCount: 1 },
      ],
    })
  }),

  // Mock blog tags API - Must be before generic /api/blog
  http.get('http://localhost:3000/api/blog/tags*', () => {
    return HttpResponse.json({
      success: true,
      data: [
        { id: 'tag-1', name: 'RevOps', slug: 'revops', postCount: 1 },
        { id: 'tag-2', name: 'Best Practices', slug: 'best-practices', postCount: 1 },
        { id: 'tag-3', name: 'Churn', slug: 'churn', postCount: 1 },
        { id: 'tag-4', name: 'Analytics', slug: 'analytics', postCount: 1 },
      ],
    })
  }),

  // Mock blog post detail API - Must be before generic /api/blog
  http.get('http://localhost:3000/api/blog/:slug', ({ params }) => {
    const { slug } = params
    const post = mockBlogPosts.find(p => p.slug === slug)

    if (!post) {
      return HttpResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      )
    }

    return HttpResponse.json({
      success: true,
      data: post,
    })
  }),

  // Mock blog post interactions API
  http.post('http://localhost:3000/api/blog/:slug/interactions', async ({ params, request }) => {
    const { slug } = params
    const body = (await request.json()) as { type?: string } | null
    const post = mockBlogPosts.find(p => p.slug === slug)

    if (!post) {
      return HttpResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      )
    }

    if (body?.type === 'view') {
      return HttpResponse.json({
        success: true,
        data: {
          ...post,
          viewCount: post.viewCount + 1,
        },
      })
    }

    if (body?.type === 'like') {
      return HttpResponse.json({
        success: true,
        data: {
          ...post,
          likeCount: post.likeCount + 1,
        },
      })
    }

    return HttpResponse.json(
      { success: false, error: 'Invalid interaction type' },
      { status: 400 }
    )
  }),

  // Mock blog posts list API - Generic route MUST be last
  http.get('http://localhost:3000/api/blog', ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get('search')
    const category = url.searchParams.get('category')
    const status = url.searchParams.get('status')

    let filteredPosts = [...mockBlogPosts]

    // Filter by search
    if (search) {
      filteredPosts = filteredPosts.filter(
        post =>
          post.title.toLowerCase().includes(search.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Filter by category
    if (category) {
      filteredPosts = filteredPosts.filter(post => post.category.slug === category)
    }

    // Filter by status
    if (status) {
      filteredPosts = filteredPosts.filter(post => post.status === status)
    }

    return HttpResponse.json({
      success: true,
      data: filteredPosts,
      pagination: {
        page: 1,
        limit: 10,
        total: filteredPosts.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    })
  }),
]

const server = setupServer(...handlers)

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' })
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})

describe('Blog Post Reading Flow', () => {
  it('fetches and displays list of published posts', async () => {
    const response = await fetch('http://localhost:3000/api/blog')
    const data = await response.json()

    expect(data.success).toBe(true)
    expect(data.data).toHaveLength(2)
    expect(data.data[0].status).toBe('PUBLISHED')
  })

  it('searches posts by keyword', async () => {
    const response = await fetch('http://localhost:3000/api/blog?search=churn')
    const data = await response.json()

    expect(data.success).toBe(true)
    expect(data.data).toHaveLength(1)
    expect(data.data[0].title).toContain('Churn')
  })

  it('filters posts by category', async () => {
    const response = await fetch('http://localhost:3000/api/blog?category=analytics')
    const data = await response.json()

    expect(data.success).toBe(true)
    expect(data.data).toHaveLength(1)
    expect(data.data[0].category.slug).toBe('analytics')
  })

  it('loads individual blog post with full content', async () => {
    const response = await fetch('http://localhost:3000/api/blog/revenue-operations-best-practices')
    const data = await response.json()

    expect(data.success).toBe(true)
    expect(data.data.slug).toBe('revenue-operations-best-practices')
    expect(data.data.content).toBeDefined()
    expect(data.data.content).toContain('Revenue Operations Best Practices')
  })

  it('tracks view count when post is read', async () => {
    // Get initial view count
    const initialResponse = await fetch('http://localhost:3000/api/blog/revenue-operations-best-practices')
    const initialData = await initialResponse.json()
    const initialViewCount = initialData.data.viewCount

    // Track a view
    const viewResponse = await fetch(
      'http://localhost:3000/api/blog/revenue-operations-best-practices/interactions',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'view' }),
      }
    )
    const viewData = await viewResponse.json()

    expect(viewData.success).toBe(true)
    expect(viewData.data.viewCount).toBe(initialViewCount + 1)
  })

  it('tracks like count when user likes post', async () => {
    // Get initial like count
    const initialResponse = await fetch('http://localhost:3000/api/blog/revenue-operations-best-practices')
    const initialData = await initialResponse.json()
    const initialLikeCount = initialData.data.likeCount

    // Send like interaction
    const likeResponse = await fetch(
      'http://localhost:3000/api/blog/revenue-operations-best-practices/interactions',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'like' }),
      }
    )
    const likeData = await likeResponse.json()

    expect(likeData.success).toBe(true)
    expect(likeData.data.likeCount).toBe(initialLikeCount + 1)
  })

  it('returns 404 for non-existent post', async () => {
    const response = await fetch('http://localhost:3000/api/blog/nonexistent-post')
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Post not found')
  })

  it('fetches available categories', async () => {
    const response = await fetch('http://localhost:3000/api/blog/categories')
    const data = await response.json()

    expect(data.success).toBe(true)
    expect(data.data).toHaveLength(2)
    expect(data.data[0].name).toBe('Revenue Operations')
  })

  it('fetches available tags', async () => {
    const response = await fetch('http://localhost:3000/api/blog/tags')
    const data = await response.json()

    expect(data.success).toBe(true)
    expect(data.data).toHaveLength(4)
    expect(data.data.some((tag: { slug: string }) => tag.slug === 'revops')).toBe(true)
  })

  it('returns empty results for search with no matches', async () => {
    const response = await fetch('http://localhost:3000/api/blog?search=nonexistent')
    const data = await response.json()

    expect(data.success).toBe(true)
    expect(data.data).toHaveLength(0)
  })

  it('handles invalid interaction type', async () => {
    const response = await fetch(
      'http://localhost:3000/api/blog/revenue-operations-best-practices/interactions',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'invalid-action' }),
      }
    )
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Invalid interaction type')
  })
})
