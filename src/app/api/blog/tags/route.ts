import { type NextRequest, NextResponse } from 'next/server'
import { asc, desc, eq, ilike, or, type SQL } from 'drizzle-orm'
import type { ApiResponse, BlogTagData } from '@/types/api'
import { createContextLogger } from '@/lib/logger'
import { db } from '@/lib/db'
import { tags } from '@/db/schema'
import { generateSlug, createErrorResponse, transformToTagData } from '@/lib/api-blog'
import { createTagSchema } from '@/lib/schemas'
import { validateCSRFOrRespond } from '@/lib/api-csrf'
import { isAdminRequest } from '@/lib/api-admin-auth'
import { checkRateLimitOrRespond, RateLimitPresets } from '@/lib/api-rate-limit'

const logger = createContextLogger('TagsAPI')

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const popular = searchParams.get('popular') === 'true'
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? Math.min(parseInt(limitParam, 10), 50) : undefined

    let where: SQL | undefined
    if (search) {
      const term = `%${search}%`
      where = or(ilike(tags.name, term), ilike(tags.description, term))
    }

    const orderBy = popular ? [desc(tags.totalViews), desc(tags.postCount)] : [asc(tags.name)]

    const baseQuery = db
      .select()
      .from(tags)
      .where(where)
      .orderBy(...orderBy)
    const rows = await (limit ? baseQuery.limit(limit) : baseQuery)

    const response: ApiResponse<BlogTagData[]> = {
      data: rows.map(transformToTagData),
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

export async function POST(request: NextRequest) {
  const rateLimitResponse = checkRateLimitOrRespond(
    request,
    RateLimitPresets.sensitive,
    '/api/blog/tags',
    'POST'
  )
  if (rateLimitResponse) return rateLimitResponse

  try {
    if (!isAdminRequest(request)) {
      logger.warn('Unauthorized blog mutation attempt', {
        route: '/api/blog/tags',
        method: 'POST',
      })
      return NextResponse.json(createErrorResponse('Unauthorized'), { status: 401 })
    }

    const csrfResponse = await validateCSRFOrRespond(request, 'blog tag creation')
    if (csrfResponse) return csrfResponse

    const parsed = createTagSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json(createErrorResponse('Invalid request body'), { status: 400 })
    }
    const body = parsed.data

    const slug = generateSlug(body.name)

    const existingTag = await db.query.tags.findFirst({
      where: eq(tags.slug, slug),
      columns: { id: true },
    })

    if (existingTag) {
      return NextResponse.json(createErrorResponse('Tag with this name already exists'), {
        status: 409,
      })
    }

    const inserted = await db
      .insert(tags)
      .values({
        name: body.name,
        slug,
        description: body.description ?? null,
        color: body.color,
        metaDescription: body.metaDescription ?? null,
        postCount: 0,
        totalViews: 0,
      })
      .returning()

    const newTag = inserted[0]
    if (!newTag) {
      throw new Error('Failed to insert tag')
    }

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
    logger.error(
      'Blog Tag Creation Error:',
      error instanceof Error ? error : new Error(String(error))
    )
    return NextResponse.json(createErrorResponse('Failed to create blog tag'), { status: 500 })
  }
}
