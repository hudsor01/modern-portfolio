import { NextRequest, NextResponse } from 'next/server'
import { ApiResponse, BlogTagData } from '@/types/api'
import { createContextLogger } from '@/lib/logger'
import { db } from '@/lib/db'
import { generateSlug, createErrorResponse, transformToTagData } from '@/lib/api-blog'

const logger = createContextLogger('TagsAPI')

/**
 * Blog Tags API Route Handler
 * GET /api/blog/tags - List all blog tags
 * POST /api/blog/tags - Create new blog tag
 *
 * Uses Prisma database for production data
 */

// GET /api/blog/tags - List all blog tags
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const popular = searchParams.get('popular') === 'true'
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined

    // Build where clause for search
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}

    // Build orderBy based on popularity flag
    const orderBy = popular
      ? [{ totalViews: 'desc' as const }, { postCount: 'desc' as const }]
      : [{ name: 'asc' as const }]

    const tags = await db.tag.findMany({
      where,
      orderBy,
      take: limit ? Math.min(limit, 50) : undefined,
    })

    const response: ApiResponse<BlogTagData[]> = {
      data: tags.map(transformToTagData),
      success: true,
    }

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=600',
      },
    })
  } catch (error) {
    logger.error('Blog Tags API Error:', error instanceof Error ? error : new Error(String(error)))
    return NextResponse.json(createErrorResponse('Failed to fetch blog tags'), { status: 500 })
  }
}

// POST /api/blog/tags - Create new blog tag
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.name) {
      return NextResponse.json(createErrorResponse('Missing required field: name'), { status: 400 })
    }

    const slug = generateSlug(body.name)

    // Check if tag with this slug already exists
    const existingTag = await db.tag.findUnique({
      where: { slug },
    })

    if (existingTag) {
      return NextResponse.json(createErrorResponse('Tag with this name already exists'), { status: 409 })
    }

    // Create new tag in database
    const newTag = await db.tag.create({
      data: {
        name: body.name,
        slug,
        description: body.description,
        color: body.color || '#6B7280',
        metaDescription: body.metaDescription,
        postCount: 0,
        totalViews: 0,
      },
    })

    const response: ApiResponse<BlogTagData> = {
      data: transformToTagData(newTag),
      success: true,
      message: 'Blog tag created successfully',
    }

    return NextResponse.json(response, {
      status: 201,
      headers: { 'Cache-Control': 'no-cache' },
    })
  } catch (error) {
    logger.error('Blog Tag Creation Error:', error instanceof Error ? error : new Error(String(error)))
    return NextResponse.json(createErrorResponse('Failed to create blog tag'), { status: 500 })
  }
}
