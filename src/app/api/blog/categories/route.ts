import { type NextRequest, NextResponse } from 'next/server'
import { asc, desc, eq } from 'drizzle-orm'
import type { ApiResponse, BlogCategoryData } from '@/types/api'
import { db } from '@/lib/db'
import { categories } from '@/db/schema'
import { createContextLogger } from '@/lib/logger'
import { fitMetaDescription, fitStoredText, STORED_TEXT_LIMITS } from '@/lib/blog-excerpt'
import { generateSlug, createErrorResponse, transformToCategoryData } from '@/lib/api-blog'
import { createCategorySchema } from '@/lib/schemas'
import { validateCSRFOrRespond } from '@/lib/api-csrf'
import { isAdminRequest } from '@/lib/api-admin-auth'
import { checkRateLimitOrRespond, RateLimitPresets } from '@/lib/api-rate-limit'
import { normalizeSeoTitle } from '@/lib/post-title'

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
  const rateLimitResponse = checkRateLimitOrRespond(
    request,
    RateLimitPresets.sensitive,
    '/api/blog/categories',
    'POST'
  )
  if (rateLimitResponse) return rateLimitResponse

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

    const parsed = createCategorySchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json(createErrorResponse('Invalid request body'), { status: 400 })
    }
    const body = parsed.data

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
        description:
          fitStoredText(body.description, STORED_TEXT_LIMITS.taxonomyDescription) ?? null,
        color: body.color,
        icon: body.icon ?? null,
        // Any length is accepted and stored within the search budget, the
        // same never-reject rule as post SEO titles (src/lib/post-title.ts).
        metaTitle: body.metaTitle ? normalizeSeoTitle(body.metaTitle, body.name) : null,
        metaDescription: fitMetaDescription(body.metaDescription) ?? null,
        keywords: body.keywords,
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
