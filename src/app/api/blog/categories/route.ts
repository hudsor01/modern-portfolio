import { NextRequest, NextResponse } from 'next/server'
import { ApiResponse, BlogCategoryData } from '@/types/api'
import { db } from '@/lib/db'
import { createContextLogger } from '@/lib/logger'
import {
  generateSlug,
  createErrorResponse,
  transformToCategoryData,
} from '@/lib/api-blog'

const logger = createContextLogger('CategoriesAPI')

/**
 * Blog Categories API Route Handler
 * GET /api/blog/categories - List all blog categories
 * POST /api/blog/categories - Create new blog category
 *
 * Uses Prisma database for production data
 */

// GET /api/blog/categories - List all blog categories
export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: [{ postCount: 'desc' }, { name: 'asc' }],
    })

    const response: ApiResponse<BlogCategoryData[]> = {
      data: categories.map(transformToCategoryData),
      success: true,
    }

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=600',
      },
    })
  } catch (error) {
    logger.error(
      'Blog Categories API Error:',
      error instanceof Error ? error : new Error(String(error))
    )
    return NextResponse.json(
      createErrorResponse('Failed to fetch blog categories'),
      { status: 500 }
    )
  }
}

// POST /api/blog/categories - Create new blog category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.name) {
      return NextResponse.json(
        createErrorResponse('Missing required field: name'),
        { status: 400 }
      )
    }

    const slug = generateSlug(body.name)

    // Check if category with this slug already exists
    const existingCategory = await db.category.findUnique({
      where: { slug },
    })

    if (existingCategory) {
      return NextResponse.json(
        createErrorResponse('Category with this name already exists'),
        { status: 409 }
      )
    }

    // Create new category in database
    const newCategory = await db.category.create({
      data: {
        name: body.name,
        slug,
        description: body.description,
        color: body.color || '#6B7280',
        icon: body.icon,
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
        keywords: body.keywords || [],
        postCount: 0,
        totalViews: 0,
      },
    })

    const response: ApiResponse<BlogCategoryData> = {
      data: transformToCategoryData(newCategory),
      success: true,
      message: 'Blog category created successfully',
    }

    return NextResponse.json(response, {
      status: 201,
      headers: { 'Cache-Control': 'no-cache' },
    })
  } catch (error) {
    logger.error(
      'Blog Category Creation Error:',
      error instanceof Error ? error : new Error(String(error))
    )
    return NextResponse.json(
      createErrorResponse('Failed to create blog category'),
      { status: 500 }
    )
  }
}
