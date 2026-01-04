import { NextRequest, NextResponse } from 'next/server'
import { ApiResponse, BlogPostData } from '@/types/shared-api'
import { createContextLogger } from '@/lib/monitoring/logger'
import { db } from '@/lib/db'
import { Prisma } from '@/prisma/client'
import { validateCSRFToken } from '@/lib/security/csrf-protection'

const logger = createContextLogger('SlugAPI')

/**
 * Individual Blog Post API Route Handler
 * GET /api/blog/[slug] - Get single blog post by slug
 * PUT /api/blog/[slug] - Update blog post by slug
 * DELETE /api/blog/[slug] - Delete blog post by slug
 *
 * Uses Prisma database for production data
 */

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

// GET /api/blog/[slug] - Get single blog post by slug
export async function GET(_request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params

    if (!slug) {
      const errorResponse: ApiResponse<never> = {
        data: undefined as never,
        success: false,
        error: 'Slug parameter is required',
      }

      return NextResponse.json(errorResponse, { status: 400 })
    }

    // Find post by slug with relations
    const post = await db.blogPost.findUnique({
      where: { slug },
      include: {
        author: true,
        category: true,
        tags: {
          include: { tag: true },
        },
      },
    })

    if (!post) {
      const errorResponse: ApiResponse<never> = {
        data: undefined as never,
        success: false,
        error: 'Blog post not found',
      }

      return NextResponse.json(errorResponse, { status: 404 })
    }

    // Increment view count asynchronously (fire and forget)
    db.blogPost
      .update({
        where: { id: post.id },
        data: { viewCount: { increment: 1 } },
      })
      .catch((err) => logger.error('Failed to increment view count', err))

    const response: ApiResponse<BlogPostData> = {
      data: transformToBlogPostData(post),
      success: true,
    }

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=600', // Cache for 5 minutes, CDN for 10 minutes
      },
    })
  } catch (error) {
    logger.error('Blog Post API Error:', error instanceof Error ? error : new Error(String(error)))

    const errorResponse: ApiResponse<never> = {
      data: undefined as never,
      success: false,
      error: 'Failed to fetch blog post',
    }

    return NextResponse.json(errorResponse, { status: 500 })
  }
}

// PUT /api/blog/[slug] - Update blog post by slug
export async function PUT(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  try {
    // CSRF token validation
    const csrfToken = request.headers.get('x-csrf-token')
    const isCSRFValid = await validateCSRFToken(csrfToken ?? undefined)

    if (!isCSRFValid) {
      logger.warn('CSRF validation failed for blog post update')
      const errorResponse: ApiResponse<never> = {
        data: undefined as never,
        success: false,
        error: 'Security validation failed. Please refresh and try again.',
      }

      return NextResponse.json(errorResponse, { status: 403 })
    }

    const { slug } = await context.params
    const body = await request.json()

    if (!slug) {
      const errorResponse: ApiResponse<never> = {
        data: undefined as never,
        success: false,
        error: 'Slug parameter is required',
      }

      return NextResponse.json(errorResponse, { status: 400 })
    }

    // Find existing post
    const existingPost = await db.blogPost.findUnique({
      where: { slug },
    })

    if (!existingPost) {
      const errorResponse: ApiResponse<never> = {
        data: undefined as never,
        success: false,
        error: 'Blog post not found',
      }

      return NextResponse.json(errorResponse, { status: 404 })
    }

    // Calculate reading time and word count if content changed
    const wordCount = body.content ? body.content.split(/\s+/).length : undefined
    const readingTime = wordCount ? Math.ceil(wordCount / 200) : undefined

    // Build update data
    const updateData: Prisma.BlogPostUpdateInput = {
      ...(body.title && { title: body.title }),
      ...(body.excerpt !== undefined && { excerpt: body.excerpt }),
      ...(body.content && { content: body.content, wordCount, readingTime }),
      ...(body.contentType && { contentType: body.contentType }),
      ...(body.status && { status: body.status }),
      ...(body.metaTitle !== undefined && { metaTitle: body.metaTitle }),
      ...(body.metaDescription !== undefined && { metaDescription: body.metaDescription }),
      ...(body.keywords && { keywords: body.keywords }),
      ...(body.canonicalUrl !== undefined && { canonicalUrl: body.canonicalUrl }),
      ...(body.featuredImage !== undefined && { featuredImage: body.featuredImage }),
      ...(body.featuredImageAlt !== undefined && { featuredImageAlt: body.featuredImageAlt }),
      ...(body.categoryId !== undefined && { categoryId: body.categoryId }),
    }

    // If status changed to published and wasn't published before, set publishedAt
    if (body.status === 'PUBLISHED' && !existingPost.publishedAt) {
      updateData.publishedAt = new Date()
    }

    // Handle tag updates if provided
    if (body.tagIds !== undefined) {
      // Delete existing tags and create new ones
      updateData.tags = {
        deleteMany: {},
        create: body.tagIds.map((tagId: string) => ({
          tagId,
        })),
      }
    }

    // Update post
    const updatedPost = await db.blogPost.update({
      where: { slug },
      data: updateData,
      include: {
        author: true,
        category: true,
        tags: {
          include: { tag: true },
        },
      },
    })

    const response: ApiResponse<BlogPostData> = {
      data: transformToBlogPostData(updatedPost),
      success: true,
      message: 'Blog post updated successfully',
    }

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    logger.error(
      'Blog Post Update Error:',
      error instanceof Error ? error : new Error(String(error))
    )

    const errorResponse: ApiResponse<never> = {
      data: undefined as never,
      success: false,
      error: 'Failed to update blog post',
    }

    return NextResponse.json(errorResponse, { status: 500 })
  }
}

// DELETE /api/blog/[slug] - Delete blog post by slug
export async function DELETE(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  try {
    // CSRF token validation
    const csrfToken = request.headers.get('x-csrf-token')
    const isCSRFValid = await validateCSRFToken(csrfToken ?? undefined)

    if (!isCSRFValid) {
      logger.warn('CSRF validation failed for blog post deletion')
      const errorResponse: ApiResponse<never> = {
        data: undefined as never,
        success: false,
        error: 'Security validation failed. Please refresh and try again.',
      }

      return NextResponse.json(errorResponse, { status: 403 })
    }

    const { slug } = await context.params

    if (!slug) {
      const errorResponse: ApiResponse<never> = {
        data: undefined as never,
        success: false,
        error: 'Slug parameter is required',
      }

      return NextResponse.json(errorResponse, { status: 400 })
    }

    // Find post to get related info for updating counts
    const post = await db.blogPost.findUnique({
      where: { slug },
      include: {
        tags: true,
      },
    })

    if (!post) {
      const errorResponse: ApiResponse<never> = {
        data: undefined as never,
        success: false,
        error: 'Blog post not found',
      }

      return NextResponse.json(errorResponse, { status: 404 })
    }

    // Delete post (cascades to PostTag relations via schema)
    await db.blogPost.delete({
      where: { slug },
    })

    // Update related counts
    await db.author.update({
      where: { id: post.authorId },
      data: { totalPosts: { decrement: 1 } },
    })

    if (post.categoryId) {
      await db.category.update({
        where: { id: post.categoryId },
        data: { postCount: { decrement: 1 } },
      })
    }

    // Update tag counts
    const tagIds = post.tags.map((t) => t.tagId)
    if (tagIds.length > 0) {
      await db.tag.updateMany({
        where: { id: { in: tagIds } },
        data: { postCount: { decrement: 1 } },
      })
    }

    const response: ApiResponse<{ success: boolean }> = {
      data: { success: true },
      success: true,
      message: 'Blog post deleted successfully',
    }

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    logger.error(
      'Blog Post Deletion Error:',
      error instanceof Error ? error : new Error(String(error))
    )

    const errorResponse: ApiResponse<never> = {
      data: undefined as never,
      success: false,
      error: 'Failed to delete blog post',
    }

    return NextResponse.json(errorResponse, { status: 500 })
  }
}
