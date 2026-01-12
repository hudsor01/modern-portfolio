import { NextRequest, NextResponse } from 'next/server'
import { createContextLogger } from '@/lib/monitoring/logger'
import { db } from '@/lib/db'
import {
  PaginatedResponse,
  BlogPostData,
  ApiResponse,
  BlogPostFilters,
  BlogPostSort,
} from '@/types/shared-api'
import { getEnhancedRateLimiter } from '@/lib/security/rate-limiter'
import { validateCSRFToken } from '@/lib/security/csrf-protection'
import { transformToBlogPostData } from '@/lib/api/blog-transformers'
import { buildBlogWhereClause, buildBlogOrderBy } from '@/lib/api/blog-filters'

const logger = createContextLogger('BlogAPI')

/**
 * Blog API Route Handler
 * GET /api/blog - List blog posts with filtering and pagination
 * POST /api/blog - Create new blog post
 *
 * Uses Prisma database for production data
 */

// Helper function to get client identifier
function getClientId(request: NextRequest): string {
  return request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
}

// GET /api/blog - List blog posts with filtering and pagination
export async function GET(request: NextRequest) {
  const clientId = getClientId(request)

  // Rate limiting: 100 requests per minute for blog listing
  const rateLimiter = getEnhancedRateLimiter()

  const rateLimitResult = rateLimiter.checkLimit(
    clientId,
    {
      windowMs: 60 * 1000, // 1 minute
      maxAttempts: 100,
      progressivePenalty: false,
      blockDuration: 0,
      adaptiveThreshold: true,
      antiAbuse: true,
      burstProtection: {
        enabled: true,
        burstWindow: 5 * 1000, // 5 seconds
        maxBurstRequests: 120,
      },
    },
    {
      path: '/api/blog',
      method: 'GET',
    }
  )

  if (!rateLimitResult.allowed) {
    const errorResponse: ApiResponse<never> = {
      data: undefined as never,
      success: false,
      error: 'Rate limit exceeded. Please try again later.',
    }

    return NextResponse.json(errorResponse, {
      status: 429,
      headers: {
        'Retry-After': String(Math.ceil((rateLimitResult.retryAfter || 0) / 1000)),
        'X-RateLimit-Remaining': String(rateLimitResult.remaining || 0),
        'X-RateLimit-Reset': String(rateLimitResult.resetTime || 0),
      },
    })
  }

  try {
    const { searchParams } = new URL(request.url)

    // Parse pagination parameters with abuse prevention
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(Math.max(1, parseInt(searchParams.get('limit') || '10', 10)), 100)
    const skip = (page - 1) * limit

    // Parse filters
    const filters: BlogPostFilters = {}

    if (searchParams.get('status')) {
      filters.status = searchParams.get('status')!
    }
    if (searchParams.get('authorId')) {
      filters.authorId = searchParams.get('authorId')!
    }
    if (searchParams.get('categoryId')) {
      filters.categoryId = searchParams.get('categoryId')!
    }
    if (searchParams.get('tagIds')) {
      filters.tagIds = searchParams.get('tagIds')!.split(',')
    }
    if (searchParams.get('search')) {
      filters.search = searchParams.get('search')!
    }
    if (searchParams.get('published')) {
      filters.published = searchParams.get('published') === 'true'
    }

    // Date range filter
    if (searchParams.get('dateFrom') && searchParams.get('dateTo')) {
      filters.dateRange = {
        from: searchParams.get('dateFrom')!,
        to: searchParams.get('dateTo')!,
      }
    }

    // Parse sorting
    let sort: BlogPostSort | undefined
    if (searchParams.get('sortBy')) {
      sort = {
        field: searchParams.get('sortBy') as BlogPostSort['field'],
        order: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
      }
    }

    // Build Prisma query
    const where = buildBlogWhereClause(filters)
    const orderBy = buildBlogOrderBy(sort)

    // Execute parallel queries for posts and total count
    const [posts, total] = await Promise.all([
      db.blogPost.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          author: true,
          category: true,
          tags: {
            include: { tag: true },
          },
        },
      }),
      db.blogPost.count({ where }),
    ])

    // Transform to API response format
    const data = posts.map(transformToBlogPostData)

    const response: PaginatedResponse<BlogPostData> = {
      data,
      success: true,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: skip + limit < total,
        hasPrev: page > 1,
      },
    }

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=60, s-maxage=300', // Cache for 1 minute, CDN for 5 minutes
      },
    })
  } catch (error) {
    logger.error('Blog API Error:', error instanceof Error ? error : new Error(String(error)))

    const errorResponse: ApiResponse<never> = {
      data: undefined as never,
      success: false,
      error: 'Failed to fetch blog posts',
    }

    return NextResponse.json(errorResponse, { status: 500 })
  }
}

// POST /api/blog - Create new blog post
export async function POST(request: NextRequest) {
  const clientId = getClientId(request)

  // Rate limiting: 10 blog post creations per hour
  const rateLimiter = getEnhancedRateLimiter()

  const rateLimitResult = rateLimiter.checkLimit(
    clientId,
    {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxAttempts: 10,
      progressivePenalty: true,
      blockDuration: 15 * 60 * 1000, // 15 minutes
      adaptiveThreshold: true,
      antiAbuse: true,
      burstProtection: {
        enabled: false,
        burstWindow: 10 * 1000,
        maxBurstRequests: 10,
      },
    },
    {
      path: '/api/blog',
      method: 'POST',
    }
  )

  if (!rateLimitResult.allowed) {
    const errorResponse: ApiResponse<never> = {
      data: undefined as never,
      success: false,
      error: 'Rate limit exceeded. Too many blog posts created.',
    }

    return NextResponse.json(errorResponse, {
      status: 429,
      headers: {
        'Retry-After': String(Math.ceil((rateLimitResult.retryAfter || 0) / 1000)),
        'X-RateLimit-Remaining': String(rateLimitResult.remaining || 0),
        'X-RateLimit-Reset': String(rateLimitResult.resetTime || 0),
      },
    })
  }

  try {
    // CSRF token validation
    const csrfToken = request.headers.get('x-csrf-token')
    const isCSRFValid = await validateCSRFToken(csrfToken ?? undefined)

    if (!isCSRFValid) {
      logger.warn('CSRF validation failed for blog post creation', { clientId })
      const errorResponse: ApiResponse<never> = {
        data: undefined as never,
        success: false,
        error: 'Security validation failed. Please refresh and try again.',
      }

      return NextResponse.json(errorResponse, { status: 403 })
    }

    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.content || !body.authorId) {
      const errorResponse: ApiResponse<never> = {
        data: undefined as never,
        success: false,
        error: 'Missing required fields: title, content, authorId',
      }

      return NextResponse.json(errorResponse, { status: 400 })
    }

    // Generate slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    // Check if slug already exists
    const existingPost = await db.blogPost.findUnique({
      where: { slug },
    })

    if (existingPost) {
      const errorResponse: ApiResponse<never> = {
        data: undefined as never,
        success: false,
        error: 'A post with this slug already exists',
      }

      return NextResponse.json(errorResponse, { status: 409 })
    }

    // Calculate reading time and word count
    const wordCount = body.content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200) // ~200 WPM

    // Create blog post in database
    const newPost = await db.blogPost.create({
      data: {
        title: body.title,
        slug,
        excerpt: body.excerpt,
        content: body.content,
        contentType: body.contentType || 'MARKDOWN',
        status: body.status || 'DRAFT',

        // SEO fields
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
        keywords: body.keywords || [],
        canonicalUrl: body.canonicalUrl,

        // Content metadata
        featuredImage: body.featuredImage,
        featuredImageAlt: body.featuredImageAlt,
        readingTime,
        wordCount,

        // Publishing
        publishedAt:
          body.status === 'PUBLISHED'
            ? new Date()
            : body.publishedAt
              ? new Date(body.publishedAt)
              : undefined,
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : undefined,

        // Relationships
        authorId: body.authorId,
        categoryId: body.categoryId,

        // Tags - create PostTag relations if tagIds provided
        tags:
          body.tagIds && body.tagIds.length > 0
            ? {
                create: body.tagIds.map((tagId: string) => ({
                  tagId,
                })),
              }
            : undefined,
      },
      include: {
        author: true,
        category: true,
        tags: {
          include: { tag: true },
        },
      },
    })

    // Update author's totalPosts count
    await db.author.update({
      where: { id: body.authorId },
      data: { totalPosts: { increment: 1 } },
    })

    // Update category postCount if category provided
    if (body.categoryId) {
      await db.category.update({
        where: { id: body.categoryId },
        data: { postCount: { increment: 1 } },
      })
    }

    // Update tag postCounts
    if (body.tagIds && body.tagIds.length > 0) {
      await db.tag.updateMany({
        where: { id: { in: body.tagIds } },
        data: { postCount: { increment: 1 } },
      })
    }

    const response: ApiResponse<BlogPostData> = {
      data: transformToBlogPostData(newPost),
      success: true,
      message: 'Blog post created successfully',
    }

    return NextResponse.json(response, {
      status: 201,
      headers: {
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    logger.error('Blog Creation Error:', error instanceof Error ? error : new Error(String(error)))

    const errorResponse: ApiResponse<never> = {
      data: undefined as never,
      success: false,
      error: 'Failed to create blog post',
    }

    return NextResponse.json(errorResponse, { status: 500 })
  }
}
