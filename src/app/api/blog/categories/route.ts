import { type NextRequest, NextResponse } from 'next/server'
import { asc, desc, eq } from 'drizzle-orm'
import type { ApiResponse, BlogCategoryData } from '@/types/api'
import { db } from '@/lib/db'
import { categories } from '@/db/schema'
import { createContextLogger } from '@/lib/logger'
import { generateSlug, createErrorResponse, transformToCategoryData } from '@/lib/api-blog'
import { validateCSRFOrRespond } from '@/lib/api-csrf'
import { isAdminRequest } from '@/lib/api-admin-auth'

const logger = createContextLogger('CategoriesAPI')

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(categories)
      .orderBy(desc(categories.postCount), asc(categories.name))

    const response: ApiResponse<BlogCategoryData[]> = {
      data: rows.map(transformToCategoryData),
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
    return NextResponse.json(createErrorResponse('Failed to fetch blog categories'), {
      status: 500,
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) {
      logger.warn('Unauthorized blog mutation attempt', {
        route: '/api/blog/categories',
        method: 'POST',
      })
      return NextResponse.json(createErrorResponse('Unauthorized'), { status: 401 })
    }

    const csrfResponse = await validateCSRFOrRespond(request, 'blog category creation')
    if (csrfResponse) return csrfResponse

    const body = await request.json()

    if (!body.name) {
      return NextResponse.json(createErrorResponse('Missing required field: name'), { status: 400 })
    }

    const slug = generateSlug(body.name)

    const existingCategory = await db.query.categories.findFirst({
      where: eq(categories.slug, slug),
      columns: { id: true },
    })

    if (existingCategory) {
      return NextResponse.json(createErrorResponse('Category with this name already exists'), {
        status: 409,
      })
    }

    const inserted = await db
      .insert(categories)
      .values({
        name: body.name,
        slug,
        description: body.description ?? null,
        color: body.color || '#6B7280',
        icon: body.icon ?? null,
        metaTitle: body.metaTitle ?? null,
        metaDescription: body.metaDescription ?? null,
        keywords: body.keywords ?? [],
        postCount: 0,
        totalViews: 0,
      })
      .returning()

    const newCategory = inserted[0]
    if (!newCategory) {
      throw new Error('Failed to insert category')
    }

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
    return NextResponse.json(createErrorResponse('Failed to create blog category'), { status: 500 })
  }
}
