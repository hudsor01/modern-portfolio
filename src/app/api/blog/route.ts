import { type NextRequest, NextResponse } from 'next/server'
import { createContextLogger } from '@/lib/logger'
import { db } from '@/lib/db'
import type {
  PaginatedResponse,
  BlogPostData,
  ApiResponse,
  BlogPostFilters,
  BlogPostSort,
} from '@/types/api'
import { checkRateLimitOrRespond, RateLimitPresets } from '@/lib/api-rate-limit'
import { validateCSRFOrRespond } from '@/lib/api-csrf'
import { parsePaginationParams, createPaginationMeta } from '@/lib/api-pagination'
import {
  transformToBlogPostData,
  buildBlogWhereClause,
  buildBlogOrderBy,
  createErrorResponse,
  generateSlug,
} from '@/lib/api-blog'
import { createBlogPostSchema } from '@/lib/schemas'

const logger = createContextLogger('BlogAPI')

/**
 * Blog API Route Handler
 * GET /api/blog - List blog posts with filtering and pagination
 * POST /api/blog - Create new blog post
 *
 * Uses Prisma database for production data
 */

// GET /api/blog - List blog posts with filtering and pagination
export async function GET(request: NextRequest) {
  // Rate limiting using shared utility
  const rateLimitResponse = checkRateLimitOrRespond(
    request,
    RateLimitPresets.read,
    '/api/blog',
    'GET'
  )
  if (rateLimitResponse) return rateLimitResponse

  try {
    const { searchParams } = new URL(request.url)

    // Parse pagination using shared utility
    const { page, limit, skip } = parsePaginationParams(searchParams)

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
    const pagination = createPaginationMeta(page, limit, total)

    const response: PaginatedResponse<BlogPostData> = {
      data,
      success: true,
      pagination,
    }

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=60, s-maxage=300',
      },
    })
  } catch (error) {
    logger.error('Blog API Error:', error instanceof Error ? error : new Error(String(error)))
    return NextResponse.json(createErrorResponse('Failed to fetch blog posts'), { status: 500 })
  }
}

// POST /api/blog - Create new blog post
export async function POST(request: NextRequest) {
  // Rate limiting using shared utility
  const rateLimitResponse = checkRateLimitOrRespond(
    request,
    RateLimitPresets.sensitive,
    '/api/blog',
    'POST'
  )
  if (rateLimitResponse) return rateLimitResponse

  // CSRF validation using shared utility
  const csrfResponse = await validateCSRFOrRespond(request, 'blog post creation')
  if (csrfResponse) return csrfResponse

  try {
    const raw = await request.json()
    const parsed = createBlogPostSchema.safeParse(raw)
    if (!parsed.success) {
      logger.warn('Blog POST validation failed', { issues: parsed.error.flatten() })
      return NextResponse.json(createErrorResponse('Invalid request body'), { status: 400 })
    }
    const body = parsed.data

    // Generate slug using shared utility
    const slug = generateSlug(body.title)

    // Check if slug already exists
    const existingPost = await db.blogPost.findUnique({
      where: { slug },
    })

    if (existingPost) {
      return NextResponse.json(createErrorResponse('A post with this slug already exists'), {
        status: 409,
      })
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
        contentType: body.contentType,
        status: body.status,

        // SEO fields
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
        keywords: body.keywords,
        canonicalUrl: body.canonicalUrl || undefined,

        // Social card fields (OG + Twitter)
        ogTitle: body.ogTitle,
        ogDescription: body.ogDescription,
        ogImage: body.ogImage || undefined,
        twitterTitle: body.twitterTitle,
        twitterDescription: body.twitterDescription,
        twitterImage: body.twitterImage || undefined,

        // Content metadata
        featuredImage: body.featuredImage || undefined,
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
                create: body.tagIds.map((tagId) => ({
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

    // IndexNow: notify search engines of new published content (per D-01)
    // Fire-and-forget: do NOT await — must not delay the 201 response (per D-04)
    if (newPost.status === 'PUBLISHED') {
      const indexNowKey = process.env.INDEXNOW_KEY
      if (indexNowKey) {
        const postUrl = `https://richardwhudsonjr.com/blog/${newPost.slug}`
        fetch('https://api.indexnow.org/indexnow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify({
            host: 'richardwhudsonjr.com',
            key: indexNowKey,
            keyLocation: `https://richardwhudsonjr.com/${indexNowKey}.txt`,
            urlList: [postUrl],
          }),
        })
          .then((res) => {
            if (!res.ok) {
              logger.warn(`IndexNow ping failed: HTTP ${res.status} for ${postUrl}`)
            } else {
              logger.info(`IndexNow ping sent for ${postUrl}`)
            }
          })
          .catch((err) => {
            // Network failure must not surface — swallow and log (per D-04)
            logger.warn('IndexNow ping network error', {
              error: err instanceof Error ? err.message : String(err),
            })
          })
      }
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
    return NextResponse.json(createErrorResponse('Failed to create blog post'), { status: 500 })
  }
}
