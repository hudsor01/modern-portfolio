import { NextRequest, NextResponse } from 'next/server'
import { createContextLogger } from '@/lib/monitoring/logger'
import { db } from '@/lib/db'
import { Prisma } from '@/prisma/client'
import {
  PaginatedResponse,
  BlogPostData,
  ApiResponse,
  BlogPostFilters,
  BlogPostSort,
} from '@/types/shared-api'
import { EnhancedRateLimiter } from '@/lib/security/rate-limiter'
import { validateCSRFToken } from '@/lib/security/csrf-protection'

const logger = createContextLogger('BlogAPI')

/**
 * Blog API Route Handler
 * GET /api/blog - List blog posts with filtering and pagination
 * POST /api/blog - Create new blog post
 *
 * Uses Prisma database for production data
 */

// Build Prisma where clause from filters
function buildWhereClause(filters?: BlogPostFilters): Prisma.BlogPostWhereInput {
  const where: Prisma.BlogPostWhereInput = {}

  if (!filters) return where

  if (filters.status) {
    const statuses = Array.isArray(filters.status) ? filters.status : [filters.status]
    where.status = { in: statuses as Prisma.EnumPostStatusFilter['in'] }
  }

  if (filters.authorId) {
    where.authorId = filters.authorId
  }

  if (filters.categoryId) {
    where.categoryId = filters.categoryId
  }

  if (filters.tagIds && filters.tagIds.length > 0) {
    where.tags = {
      some: {
        tagId: { in: filters.tagIds },
      },
    }
  }

  if (filters.search) {
    const searchTerm = filters.search
    where.OR = [
      { title: { contains: searchTerm, mode: 'insensitive' } },
      { excerpt: { contains: searchTerm, mode: 'insensitive' } },
      { content: { contains: searchTerm, mode: 'insensitive' } },
      { keywords: { has: searchTerm } },
    ]
  }

  if (filters.dateRange) {
    where.publishedAt = {
      gte: new Date(filters.dateRange.from),
      lte: new Date(filters.dateRange.to),
    }
  }

  if (filters.published !== undefined) {
    if (filters.published) {
      where.status = 'PUBLISHED'
    } else {
      where.status = { not: 'PUBLISHED' }
    }
  }

  return where
}

// Build Prisma orderBy from sort
function buildOrderBy(sort?: BlogPostSort): Prisma.BlogPostOrderByWithRelationInput {
  if (!sort) {
    // Default sort by publishedAt desc
    return { publishedAt: 'desc' }
  }

  const direction = sort.order === 'asc' ? 'asc' : 'desc'

  switch (sort.field) {
    case 'title':
      return { title: direction }
    case 'createdAt':
      return { createdAt: direction }
    case 'updatedAt':
      return { updatedAt: direction }
    case 'publishedAt':
      return { publishedAt: direction }
    case 'viewCount':
      return { viewCount: direction }
    case 'likeCount':
      return { likeCount: direction }
    default:
      return { publishedAt: 'desc' }
  }
}

// Transform Prisma result to BlogPostData
function transformToBlogPostData(
  post: Prisma.BlogPostGetPayload<{
    include: {
      author: true
      category: true
      tags: { include: { tag: true } }
    }
  }>
): BlogPostData {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? undefined,
    content: post.content,
    contentType: post.contentType,
    status: post.status,

    // SEO fields
    metaTitle: post.metaTitle ?? undefined,
    metaDescription: post.metaDescription ?? undefined,
    keywords: post.keywords,
    canonicalUrl: post.canonicalUrl ?? undefined,

    // Content metadata
    featuredImage: post.featuredImage ?? undefined,
    featuredImageAlt: post.featuredImageAlt ?? undefined,
    readingTime: post.readingTime ?? undefined,
    wordCount: post.wordCount ?? undefined,

    // Publishing
    publishedAt: post.publishedAt?.toISOString(),
    scheduledAt: post.scheduledAt?.toISOString(),

    // Timestamps
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),

    // Relationships
    authorId: post.authorId,
    author: post.author
      ? {
          id: post.author.id,
          name: post.author.name,
          email: post.author.email,
          slug: post.author.slug,
          bio: post.author.bio ?? undefined,
          avatar: post.author.avatar ?? undefined,
          website: post.author.website ?? undefined,
          totalPosts: post.author.totalPosts,
          totalViews: post.author.totalViews,
          createdAt: post.author.createdAt.toISOString(),
        }
      : undefined,
    categoryId: post.categoryId ?? undefined,
    category: post.category
      ? {
          id: post.category.id,
          name: post.category.name,
          slug: post.category.slug,
          description: post.category.description ?? undefined,
          color: post.category.color ?? undefined,
          icon: post.category.icon ?? undefined,
          postCount: post.category.postCount,
          totalViews: post.category.totalViews,
          createdAt: post.category.createdAt.toISOString(),
        }
      : undefined,
    tags: post.tags.map((pt) => ({
      id: pt.tag.id,
      name: pt.tag.name,
      slug: pt.tag.slug,
      description: pt.tag.description ?? undefined,
      color: pt.tag.color ?? undefined,
      postCount: pt.tag.postCount,
      totalViews: pt.tag.totalViews,
      createdAt: pt.tag.createdAt.toISOString(),
    })),

    // Analytics
    viewCount: post.viewCount,
    likeCount: post.likeCount,
    shareCount: post.shareCount,
    commentCount: post.commentCount,
  }
}

// Helper function to get client identifier
function getClientId(request: NextRequest): string {
  return request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
}

// GET /api/blog - List blog posts with filtering and pagination
export async function GET(request: NextRequest) {
  const clientId = getClientId(request)

  // Rate limiting: 100 requests per minute for blog listing
  using rateLimiter = new EnhancedRateLimiter()

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
    const where = buildWhereClause(filters)
    const orderBy = buildOrderBy(sort)

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
  using rateLimiter = new EnhancedRateLimiter()

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
