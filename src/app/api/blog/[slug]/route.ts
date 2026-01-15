import { NextRequest, NextResponse } from 'next/server'
import { ApiResponse, BlogPostData } from '@/types/api'
import { createContextLogger } from '@/lib/logger'
import { db } from '@/lib/db'
import { Prisma } from '@/generated/prisma/client'
import { validateCSRFOrRespond } from '@/lib/api-core'
import { transformToBlogPostData, createErrorResponse } from '@/lib/api-blog'

const logger = createContextLogger('SlugAPI')

/**
 * Individual Blog Post API Route Handler
 * GET /api/blog/[slug] - Get single blog post by slug
 * PUT /api/blog/[slug] - Update blog post by slug
 * DELETE /api/blog/[slug] - Delete blog post by slug
 *
 * Uses Prisma database for production data
 */

// GET /api/blog/[slug] - Get single blog post by slug
export async function GET(_request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params

    if (!slug) {
      return NextResponse.json(createErrorResponse('Slug parameter is required'), { status: 400 })
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
      return NextResponse.json(createErrorResponse('Blog post not found'), { status: 404 })
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
        'Cache-Control': 'public, max-age=300, s-maxage=600',
      },
    })
  } catch (error) {
    logger.error('Blog Post API Error:', error instanceof Error ? error : new Error(String(error)))
    return NextResponse.json(createErrorResponse('Failed to fetch blog post'), { status: 500 })
  }
}

// PUT /api/blog/[slug] - Update blog post by slug
export async function PUT(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  // CSRF validation using shared utility
  const csrfResponse = await validateCSRFOrRespond(request, 'blog post update')
  if (csrfResponse) return csrfResponse

  try {
    const { slug } = await context.params
    const body = await request.json()

    if (!slug) {
      return NextResponse.json(createErrorResponse('Slug parameter is required'), { status: 400 })
    }

    // Find existing post
    const existingPost = await db.blogPost.findUnique({
      where: { slug },
    })

    if (!existingPost) {
      return NextResponse.json(createErrorResponse('Blog post not found'), { status: 404 })
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
    logger.error('Blog Post Update Error:', error instanceof Error ? error : new Error(String(error)))
    return NextResponse.json(createErrorResponse('Failed to update blog post'), { status: 500 })
  }
}

// DELETE /api/blog/[slug] - Delete blog post by slug
export async function DELETE(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  // CSRF validation using shared utility
  const csrfResponse = await validateCSRFOrRespond(request, 'blog post deletion')
  if (csrfResponse) return csrfResponse

  try {
    const { slug } = await context.params

    if (!slug) {
      return NextResponse.json(createErrorResponse('Slug parameter is required'), { status: 400 })
    }

    // Find post to get related info for updating counts
    const post = await db.blogPost.findUnique({
      where: { slug },
      include: {
        tags: true,
      },
    })

    if (!post) {
      return NextResponse.json(createErrorResponse('Blog post not found'), { status: 404 })
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
    logger.error('Blog Post Deletion Error:', error instanceof Error ? error : new Error(String(error)))
    return NextResponse.json(createErrorResponse('Failed to delete blog post'), { status: 500 })
  }
}
