import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { ApiResponse } from '@/types/shared-api'
import { validateViewTracking, ViewTrackingInput, ValidationError } from '@/lib/validations/unified-schemas'
import { createContextLogger } from '@/lib/monitoring/logger'

const prisma = new PrismaClient()
const logger = createContextLogger('ViewTrackingAPI')

// Using centralized validation schema from unified-schemas

interface ViewTrackingResponse {
  id: string
  type: string
  slug: string
  viewedAt: string
  totalViews: number
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<ViewTrackingResponse>>> {
  try {
    const body = await request.json()
    
    // Validate request data
    let validatedData: ViewTrackingInput
    try {
      validatedData = validateViewTracking(body)
    } catch (error) {
      if (error instanceof ValidationError) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid request data: ' + error.message,
            data: null as never
          },
          { status: 400 }
        )
      }
      throw error
    }
    
    const { type, slug, readingTime, scrollDepth, referrer } = validatedData

    // Get visitor information
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(/, /)[0] : request.headers.get('x-real-ip')
    const userAgent = request.headers.get('user-agent')
    const refererHeader = request.headers.get('referer')
    const visitorId = await generateVisitorId(ip || '', userAgent || '')
    const sessionId = request.headers.get('x-session-id') || crypto.randomUUID()

    if (type === 'blog') {
      // Handle blog post view tracking using Prisma schema
      const blogPost = await prisma.blogPost.findUnique({
        where: { slug }
      })

      if (!blogPost) {
        return NextResponse.json(
          {
            success: false,
            error: 'Blog post not found',
            data: null as never
          },
          { status: 404 }
        )
      }

      // Create view record
      const view = await prisma.postView.create({
        data: {
          postId: blogPost.id,
          visitorId,
          sessionId,
          ipAddress: ip || null,
          userAgent: userAgent || null,
          referer: referrer || refererHeader || null,
          readingTime: readingTime ?? null,
          scrollDepth: scrollDepth ?? null,
        }
      })

      // Update blog post view count
      const updatedPost = await prisma.blogPost.update({
        where: { id: blogPost.id },
        data: {
          viewCount: {
            increment: 1
          }
        },
        select: {
          viewCount: true
        }
      })

      const response: ApiResponse<ViewTrackingResponse> = {
        success: true,
        data: {
          id: view.id,
          type: 'blog',
          slug,
          viewedAt: view.viewedAt.toISOString(),
          totalViews: updatedPost.viewCount
        }
      }

      return NextResponse.json(response, { status: 201 })

    } else if (type === 'project') {
      // Handle project view tracking using custom approach
      // Since projects aren't in the blog schema, we'll use a different approach
      
      // Create a pseudo-post view for projects (using postId format)
      const projectPostId = `project-${slug}`
      
      // Check if we need to create a pseudo blog post for this project
      let projectPost = await prisma.blogPost.findFirst({
        where: { slug: projectPostId }
      })

      if (!projectPost) {
        // Create a minimal blog post entry for the project to track views
        projectPost = await prisma.blogPost.create({
          data: {
            title: `Project: ${slug}`,
            slug: projectPostId,
            content: `Project view tracking for ${slug}`,
            authorId: 'system', // You might need to create a system author
            status: 'PUBLISHED', // From PostStatus enum
            contentType: 'MARKDOWN', // From ContentType enum
          }
        })
      }

      // Create view record
      const view = await prisma.postView.create({
        data: {
          postId: projectPost.id,
          visitorId,
          sessionId,
          ipAddress: ip || null,
          userAgent: userAgent || null,
          referer: referrer || refererHeader || null,
          readingTime: readingTime ?? null,
          scrollDepth: scrollDepth ?? null,
        }
      })

      // Update view count
      const updatedPost = await prisma.blogPost.update({
        where: { id: projectPost.id },
        data: {
          viewCount: {
            increment: 1
          }
        },
        select: {
          viewCount: true
        }
      })

      const response: ApiResponse<ViewTrackingResponse> = {
        success: true,
        data: {
          id: view.id,
          type: 'project',
          slug,
          viewedAt: view.viewedAt.toISOString(),
          totalViews: updatedPost.viewCount
        }
      }

      return NextResponse.json(response, { status: 201 })
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Invalid type. Must be "project" or "blog"',
        data: null as never
      },
      { status: 400 }
    )

  } catch (error) {
    logger.error('View tracking error', error instanceof Error ? error : new Error(String(error)))

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to track view',
        data: null as never
      },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ views: Array<{ slug: string; type: string; totalViews: number }> }>>> {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'project' | 'blog' | null (all)
    const slug = searchParams.get('slug')

    const whereClause: Record<string, unknown> = {}

    if (slug) {
      if (type === 'project') {
        whereClause.slug = `project-${slug}`
      } else {
        whereClause.slug = slug
      }
    } else if (type === 'project') {
      whereClause.slug = { startsWith: 'project-' }
    } else if (type === 'blog') {
      whereClause.slug = { not: { startsWith: 'project-' } }
    }

    const posts = await prisma.blogPost.findMany({
      where: whereClause,
      select: {
        slug: true,
        viewCount: true
      },
      orderBy: {
        viewCount: 'desc'
      }
    })

    const views = posts.map((post: { slug: string; viewCount: number }) => ({
      slug: post.slug.startsWith('project-') ? post.slug.replace('project-', '') : post.slug,
      type: post.slug.startsWith('project-') ? 'project' : 'blog',
      totalViews: post.viewCount
    }))

    const response: ApiResponse<{ views: Array<{ slug: string; type: string; totalViews: number }> }> = {
      success: true,
      data: { views }
    }

    return NextResponse.json(response)

  } catch (error) {
    logger.error('Get views error', error instanceof Error ? error : new Error(String(error)))

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get views',
        data: null as never
      },
      { status: 500 }
    )
  }
}

// Helper function to generate consistent visitor ID
async function generateVisitorId(ip: string, userAgent: string): Promise<string> {
  const data = `${ip}-${userAgent}`
  const encoder = new TextEncoder()
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data))
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16)
}