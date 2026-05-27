import { type NextRequest, NextResponse } from 'next/server'
import { count, eq, inArray, sql } from 'drizzle-orm'
import { createContextLogger } from '@/lib/logger'
import { db } from '@/lib/db'
import { authors, blogPosts, categories, postTags, tags } from '@/db/schema'
import type {
  PaginatedResponse,
  BlogPostData,
  ApiResponse,
  BlogPostFilters,
  BlogPostSort,
} from '@/types/api'
import { checkRateLimitOrRespond, RateLimitPresets } from '@/lib/api-rate-limit'
import { validateCSRFOrRespond } from '@/lib/api-csrf'
import { isAdminRequest } from '@/lib/api-admin-auth'
import { parsePaginationParams, createPaginationMeta } from '@/lib/api-pagination'
import {
  transformToBlogPostData,
  buildBlogWhereClause,
  buildBlogOrderBy,
  createErrorResponse,
  generateSlug,
} from '@/lib/api-blog'
import { createBlogPostSchema } from '@/lib/schemas'

// POST/PUT contract asymmetry (kept here so a future admin client knows
// what to send):
//   - POST applies defaults: omitting `status` lands a row as DRAFT;
//     omitting `contentType` defaults to MARKDOWN; omitting `keywords`
//     defaults to []. See createBlogPostSchema in src/lib/schemas.ts.
//   - PUT applies no defaults (PATCH semantics): omitting a field
//     leaves the DB value unchanged. Sending `null` clears nullable
//     columns. See updateBlogPostSchema.
// If a future "clone post" UI POSTs the body of an existing post, it
// must pass `status` explicitly or the clone lands as DRAFT.

const logger = createContextLogger('BlogAPI')

/**
 * Blog API Route Handler
 * GET /api/blog - List blog posts with filtering and pagination
 * POST /api/blog - Create new blog post
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
    const isAdmin = isAdminRequest(request)

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

    // Public callers see only PUBLISHED, non-soft-deleted posts. Admin-token
    // holders can pass `?status=DRAFT` (etc.) to see other states; if they
    // don't pass `status`, they see everything (legacy admin behavior).
    if (!isAdmin && !filters.status && filters.published === undefined) {
      filters.published = true
    }

    // Parse sorting
    let sort: BlogPostSort | undefined
    if (searchParams.get('sortBy')) {
      sort = {
        field: searchParams.get('sortBy') as BlogPostSort['field'],
        order: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
      }
    }

    const where = buildBlogWhereClause(filters)
    const orderBy = buildBlogOrderBy(sort)

    const [posts, totalRows] = await Promise.all([
      db.query.blogPosts.findMany({
        where,
        orderBy,
        offset: skip,
        limit,
        with: {
          author: true,
          category: true,
          tags: { with: { tag: true } },
        },
      }),
      db.select({ value: count() }).from(blogPosts).where(where),
    ])

    const total = totalRows[0]?.value ?? 0
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

    const slug = generateSlug(body.title)

    const existingPost = await db.query.blogPosts.findFirst({
      where: eq(blogPosts.slug, slug),
      columns: { id: true },
    })

    if (existingPost) {
      return NextResponse.json(createErrorResponse('A post with this slug already exists'), {
        status: 409,
      })
    }

    const wordCount = body.content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200)

    const insertedRows = await db
      .insert(blogPosts)
      .values({
        title: body.title,
        slug,
        excerpt: body.excerpt,
        content: body.content,
        contentType: body.contentType,
        status: body.status,
        // Coerce empty-string → null on nullable text columns so a
        // client posting an HTML form (where missing fields become '')
        // lands in the canonical "cleared" state. Critical for
        // featuredImage: two empty strings would collide on the
        // partial unique index.
        metaTitle: body.metaTitle || null,
        metaDescription: body.metaDescription || null,
        keywords: body.keywords,
        canonicalUrl: body.canonicalUrl || null,
        ogTitle: body.ogTitle || null,
        ogDescription: body.ogDescription || null,
        ogImage: body.ogImage || null,
        twitterTitle: body.twitterTitle || null,
        twitterDescription: body.twitterDescription || null,
        twitterImage: body.twitterImage || null,
        featuredImage: body.featuredImage || null,
        featuredImageAlt: body.featuredImageAlt || null,
        readingTime,
        wordCount,
        publishedAt:
          body.status === 'PUBLISHED'
            ? new Date()
            : body.publishedAt
              ? new Date(body.publishedAt)
              : null,
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
        authorId: body.authorId,
        categoryId: body.categoryId ?? null,
      })
      .returning()

    const insertedRow = insertedRows[0]
    if (!insertedRow) {
      throw new Error('Failed to insert blog post')
    }
    const insertedId = insertedRow.id

    if (body.tagIds && body.tagIds.length > 0) {
      await db.insert(postTags).values(body.tagIds.map((tagId) => ({ postId: insertedId, tagId })))
    }

    const newPost = await db.query.blogPosts.findFirst({
      where: eq(blogPosts.id, insertedId),
      with: {
        author: true,
        category: true,
        tags: { with: { tag: true } },
      },
    })

    if (!newPost) {
      throw new Error('Failed to read back inserted blog post')
    }

    await db
      .update(authors)
      .set({ totalPosts: sql`${authors.totalPosts} + 1` })
      .where(eq(authors.id, body.authorId))

    if (body.categoryId) {
      await db
        .update(categories)
        .set({ postCount: sql`${categories.postCount} + 1` })
        .where(eq(categories.id, body.categoryId))
    }

    if (body.tagIds && body.tagIds.length > 0) {
      await db
        .update(tags)
        .set({ postCount: sql`${tags.postCount} + 1` })
        .where(inArray(tags.id, body.tagIds))
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
