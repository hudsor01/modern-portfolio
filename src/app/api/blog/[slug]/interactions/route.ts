import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { InteractionType } from '@/generated/prisma/client'
import { ApiResponse } from '@/types/shared-api'
import {
  validateBlogInteraction,
  BlogInteractionInput,
  ValidationError,
} from '@/lib/validations/schemas'
import { createContextLogger } from '@/lib/monitoring/logger'
import { validateCSRFToken } from '@/lib/security/csrf-protection'
import { generateVisitorId } from '@/lib/interactions-helper'

const logger = createContextLogger('InteractionsAPI')

// Using centralized validation schema from schemas

interface BlogInteractionResponse {
  id: string
  type: InteractionType
  createdAt: string
  postCounts: {
    likes: number
    shares: number
    comments: number
    bookmarks: number
    subscribes: number
    downloads: number
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
): Promise<NextResponse<ApiResponse<BlogInteractionResponse>>> {
  try {
    // CSRF token validation
    const csrfToken = request.headers.get('x-csrf-token')
    const isCSRFValid = await validateCSRFToken(csrfToken ?? undefined)

    if (!isCSRFValid) {
      logger.warn('CSRF validation failed for blog interaction')
      return NextResponse.json(
        {
          success: false,
          error: 'Security validation failed. Please refresh and try again.',
          data: null as never,
        },
        { status: 403 }
      )
    }

    const body = await request.json()

    // Validate request data
    let validatedData: BlogInteractionInput
    try {
      validatedData = validateBlogInteraction(body)
    } catch (error) {
      if (error instanceof ValidationError) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid request data',
            data: null as never,
          },
          { status: 400 }
        )
      }
      throw error
    }

    const { type, value, metadata } = validatedData
    const postSlug = params.slug

    // Find the blog post by slug
    const blogPost = await db.blogPost.findUnique({
      where: { slug: postSlug },
    })

    if (!blogPost) {
      return NextResponse.json(
        {
          success: false,
          error: 'Blog post not found',
          data: null as never,
        },
        { status: 404 }
      )
    }

    // Generate visitor ID and session ID
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(/, /)[0] : request.headers.get('x-real-ip')
    const userAgent = request.headers.get('user-agent') || ''
    const visitorId = await generateVisitorId(ip || '', userAgent)
    const sessionId = request.headers.get('x-session-id') || crypto.randomUUID()

    // Create the interaction
    const interaction = await db.postInteraction.create({
      data: {
        postId: blogPost.id,
        type: type as InteractionType,
        value,
        metadata: metadata || undefined,
        visitorId,
        sessionId,
      },
    })

    // Update the blog post counters based on interaction type
    const updateData: Partial<{
      likeCount: { increment: number }
      shareCount: { increment: number }
      commentCount: { increment: number }
    }> = {}

    switch (type) {
      case 'LIKE':
        updateData.likeCount = { increment: 1 }
        break
      case 'SHARE':
        updateData.shareCount = { increment: 1 }
        break
      case 'COMMENT':
        updateData.commentCount = { increment: 1 }
        break
    }

    if (Object.keys(updateData).length > 0) {
      await db.blogPost.update({
        where: { id: blogPost.id },
        data: updateData,
      })
    }

    // Get current post counts
    const updatedPost = await db.blogPost.findUnique({
      where: { id: blogPost.id },
      select: {
        likeCount: true,
        shareCount: true,
        commentCount: true,
      },
    })

    // Get additional interaction counts from PostInteraction table
    const additionalCounts = await db.postInteraction.groupBy({
      by: ['type'],
      where: {
        postId: blogPost.id,
        type: {
          in: ['BOOKMARK', 'SUBSCRIBE', 'DOWNLOAD'],
        },
      },
      _count: {
        id: true,
      },
    })

    const postCounts = {
      likes: updatedPost?.likeCount || 0,
      shares: updatedPost?.shareCount || 0,
      comments: updatedPost?.commentCount || 0,
      bookmarks: additionalCounts.find((c) => c.type === 'BOOKMARK')?._count.id || 0,
      subscribes: additionalCounts.find((c) => c.type === 'SUBSCRIBE')?._count.id || 0,
      downloads: additionalCounts.find((c) => c.type === 'DOWNLOAD')?._count.id || 0,
    }

    const response: ApiResponse<BlogInteractionResponse> = {
      success: true,
      data: {
        id: interaction.id,
        type: interaction.type,
        createdAt: interaction.createdAt.toISOString(),
        postCounts,
      },
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    logger.error(
      'Blog interaction error',
      error instanceof Error ? error : new Error(String(error))
    )

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to record interaction',
        data: null as never,
      },
      { status: 500 }
    )
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
): Promise<NextResponse<ApiResponse<{ postCounts: Record<string, number> }>>> {
  try {
    const postSlug = params.slug

    // Find the blog post
    const blogPost = await db.blogPost.findUnique({
      where: { slug: postSlug },
      select: {
        id: true,
        likeCount: true,
        shareCount: true,
        commentCount: true,
      },
    })

    if (!blogPost) {
      return NextResponse.json(
        {
          success: false,
          error: 'Blog post not found',
          data: null as never,
        },
        { status: 404 }
      )
    }

    // Get additional interaction counts
    const additionalCounts = await db.postInteraction.groupBy({
      by: ['type'],
      where: {
        postId: blogPost.id,
        type: {
          in: ['BOOKMARK', 'SUBSCRIBE', 'DOWNLOAD'],
        },
      },
      _count: {
        id: true,
      },
    })

    const postCounts = {
      likes: blogPost.likeCount,
      shares: blogPost.shareCount,
      comments: blogPost.commentCount,
      bookmarks: additionalCounts.find((c) => c.type === 'BOOKMARK')?._count.id || 0,
      subscribes: additionalCounts.find((c) => c.type === 'SUBSCRIBE')?._count.id || 0,
      downloads: additionalCounts.find((c) => c.type === 'DOWNLOAD')?._count.id || 0,
    }

    const response: ApiResponse<{ postCounts: Record<string, number> }> = {
      success: true,
      data: { postCounts },
    }

    return NextResponse.json(response)
  } catch (error) {
    logger.error(
      'Get blog interactions error',
      error instanceof Error ? error : new Error(String(error))
    )

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get interactions',
        data: null as never,
      },
      { status: 500 }
    )
  }
}
