import { type NextRequest, NextResponse } from 'next/server'
import { eq, inArray, sql } from 'drizzle-orm'
import type { ApiResponse, BlogPostData } from '@/types/api'
import { createContextLogger } from '@/lib/logger'
import { db } from '@/lib/db'
import { authors, blogPosts, categories, postTags, tags, type NewBlogPost } from '@/db/schema'
import { validateCSRFOrRespond } from '@/lib/api-csrf'
import { isAdminRequest } from '@/lib/api-admin-auth'
import { checkRateLimitOrRespond, RateLimitPresets } from '@/lib/api-rate-limit'
import { transformToBlogPostData, createErrorResponse, invalidBodyMessage } from '@/lib/api-blog'
import { updateBlogPostSchema } from '@/lib/schemas'
import { BLOG_POST_COLUMNS } from '@/lib/blog-columns'
import { normalizeSeoTitle } from '@/lib/post-title'
import {
  metaDescriptionNeedsDerivation,
  normalizeStoredSeoText,
  opensWithAuthorBio,
  fitStoredText,
  STORED_TEXT_LIMITS,
} from '@/lib/blog-excerpt'

const logger = createContextLogger('SlugAPI')

/**
 * PUT semantics for normalized text: a string the client sent that normalizes
 * to nothing (an over-long value with no text, or a bio opener with no body to
 * derive from) is treated as omitted, so it never clears a stored value. Only
 * an explicit `null` clears. POST has nothing stored, so it keeps the `null`.
 */
function unlessEmptied<T>(sent: unknown, normalized: T | null | undefined): T | null | undefined {
  return typeof sent === 'string' && normalized === null ? undefined : normalized
}

/** fitStoredText under the PUT rule above. */
function fitForUpdate(sent: string | null | undefined, max: number): string | null | undefined {
  return unlessEmptied(sent, fitStoredText(sent, max))
}

const POST_WITH_RELATIONS = {
  columns: BLOG_POST_COLUMNS,
  with: {
    author: true,
    category: true,
    tags: { with: { tag: true } },
  },
} as const

export async function GET(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params

    if (!slug) {
      return NextResponse.json(createErrorResponse('Slug parameter is required'), { status: 400 })
    }

    const post = await db.query.blogPosts.findFirst({
      where: eq(blogPosts.slug, slug),
      ...POST_WITH_RELATIONS,
    })

    if (!post) {
      return NextResponse.json(createErrorResponse('Blog post not found'), { status: 404 })
    }

    // Hide DRAFT/SCHEDULED/ARCHIVED/DELETED posts (and soft-deleted ones) from
    // public callers. Admin-token holders bypass the gate so the future admin
    // UI can preview unpublished content. Same 404 response so anonymous
    // callers can't differentiate "doesn't exist" from "exists but not public".
    const isPublic = post.status === 'PUBLISHED' && post.deletedAt === null
    if (!isPublic && !isAdminRequest(request)) {
      return NextResponse.json(createErrorResponse('Blog post not found'), { status: 404 })
    }

    // Fire-and-forget view count increment (only for actually-public reads)
    if (isPublic) {
      db.update(blogPosts)
        .set({ viewCount: sql`${blogPosts.viewCount} + 1` })
        .where(eq(blogPosts.id, post.id))
        .catch((err) =>
          logger.error(
            'Failed to increment view count',
            err instanceof Error ? err : new Error(String(err)),
            { slug: post.slug, postId: post.id }
          )
        )
    }

    const response: ApiResponse<BlogPostData> = {
      data: transformToBlogPostData(post),
      success: true,
    }

    return NextResponse.json(response, {
      headers: {
        // Don't cache admin-only views in public/CDN tier — Cache-Control
        // private prevents leaking unpublished content via shared cache.
        'Cache-Control': isPublic
          ? 'public, max-age=300, s-maxage=600'
          : 'private, no-store, max-age=0, must-revalidate',
      },
    })
  } catch (error) {
    logger.error('Blog Post API Error:', error instanceof Error ? error : new Error(String(error)))
    return NextResponse.json(createErrorResponse('Failed to fetch blog post'), { status: 500 })
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const rateLimitResponse = checkRateLimitOrRespond(
    request,
    RateLimitPresets.sensitive,
    '/api/blog/[slug]',
    'PUT'
  )
  if (rateLimitResponse) return rateLimitResponse

  if (!isAdminRequest(request)) {
    logger.warn('Unauthorized blog mutation attempt', { route: '/api/blog/[slug]', method: 'PUT' })
    return NextResponse.json(createErrorResponse('Unauthorized'), { status: 401 })
  }

  const csrfResponse = await validateCSRFOrRespond(request, 'blog post update')
  if (csrfResponse) return csrfResponse

  try {
    const { slug } = await context.params
    const rawBody = await request.json()

    if (!slug) {
      return NextResponse.json(createErrorResponse('Slug parameter is required'), { status: 400 })
    }

    // Validate with updateBlogPostSchema (partial of the base shape, no
    // defaults). Enforces the featuredImage host allowlist + path-traversal
    // guard on the update path so POST and PUT have identical contracts.
    const parsed = updateBlogPostSchema.safeParse(rawBody)
    if (!parsed.success) {
      return NextResponse.json(createErrorResponse(invalidBodyMessage(parsed.error)), {
        status: 400,
      })
    }
    const body = parsed.data

    const existingPost = await db.query.blogPosts.findFirst({
      where: eq(blogPosts.slug, slug),
      columns: { id: true, publishedAt: true, title: true },
    })

    if (!existingPost) {
      return NextResponse.json(createErrorResponse('Blog post not found'), { status: 404 })
    }

    // A bio-opener excerpt or meta is re-derived from the body, and an over-long
    // meta is trimmed (re-derived only when it has no text of its own).
    // Normalized, never rejected, so an update can't fail on SEO text. The
    // stored body and excerpt are read only when needed: a bio field without new
    // content, or a derived meta without a new excerpt (the meta prefers the
    // post's excerpt).
    const bioExcerpt = opensWithAuthorBio(body.excerpt)
    const deriveMeta = metaDescriptionNeedsDerivation(body.metaDescription)
    const stored =
      (body.content === undefined && (bioExcerpt || deriveMeta)) ||
      (deriveMeta && body.excerpt === undefined)
        ? await db.query.blogPosts.findFirst({
            where: eq(blogPosts.id, existingPost.id),
            columns: { content: true, excerpt: true },
          })
        : undefined
    const seoText = normalizeStoredSeoText({
      excerpt: body.excerpt,
      metaDescription: body.metaDescription,
      content: body.content ?? stored?.content,
      currentExcerpt: stored?.excerpt,
    })

    const excerpt = unlessEmptied(body.excerpt, seoText.excerpt)
    const metaDescription = unlessEmptied(body.metaDescription, seoText.metaDescription)
    const ogTitle = fitForUpdate(body.ogTitle, STORED_TEXT_LIMITS.ogTitle)
    const ogDescription = fitForUpdate(body.ogDescription, STORED_TEXT_LIMITS.ogDescription)
    const twitterTitle = fitForUpdate(body.twitterTitle, STORED_TEXT_LIMITS.twitterTitle)
    const twitterDescription = fitForUpdate(
      body.twitterDescription,
      STORED_TEXT_LIMITS.twitterDescription
    )
    const featuredImageAlt = fitForUpdate(
      body.featuredImageAlt,
      STORED_TEXT_LIMITS.featuredImageAlt
    )

    const wordCount = body.content ? body.content.split(/\s+/).length : undefined
    const readingTime = wordCount ? Math.ceil(wordCount / 200) : undefined

    // updateBlogPostSchema coerces empty-string → null on every
    // nullable text column at parse time (via nullishText), so the
    // handler only needs `body.X !== undefined` to distinguish
    // "client omitted the field" from "client cleared it" — no per-call
    // `|| null` coalesce required.
    const updateData: Partial<NewBlogPost> = {
      ...(body.title && { title: body.title }),
      ...(excerpt !== undefined && { excerpt }),
      ...(body.content && { content: body.content, wordCount, readingTime }),
      ...(body.contentType && { contentType: body.contentType }),
      ...(body.status && { status: body.status }),
      // Same ≤ 43-char rule as POST; a cleared (null) SEO title is derived
      // from the post title. Normalized, never rejected.
      ...(body.metaTitle !== undefined && {
        metaTitle: normalizeSeoTitle(body.metaTitle, body.title || existingPost.title),
      }),
      ...(metaDescription !== undefined && { metaDescription }),
      ...(body.keywords && { keywords: body.keywords }),
      ...(body.canonicalUrl !== undefined && { canonicalUrl: body.canonicalUrl }),
      // ogTitle, ogDescription, twitterTitle and twitterDescription (and the
      // images) are stored for API round-tripping and normalized on write, but
      // intentionally not rendered: post pages derive every share surface from
      // the one canonical normalized title, meta description and image
      // (src/app/blog/[slug]/page.tsx), because separate per-surface values
      // were how three SEO surfaces disagreed before. Omitted (or sent but
      // normalized to nothing, see unlessEmptied) stays unwritten; null clears.
      ...(ogTitle !== undefined && { ogTitle }),
      ...(ogDescription !== undefined && { ogDescription }),
      ...(body.ogImage !== undefined && { ogImage: body.ogImage }),
      ...(twitterTitle !== undefined && { twitterTitle }),
      ...(twitterDescription !== undefined && { twitterDescription }),
      ...(body.twitterImage !== undefined && { twitterImage: body.twitterImage }),
      ...(body.featuredImage !== undefined && { featuredImage: body.featuredImage }),
      ...(featuredImageAlt !== undefined && { featuredImageAlt }),
      ...(body.categoryId !== undefined && { categoryId: body.categoryId ?? null }),
      ...(body.publishedAt !== undefined && {
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
      }),
      ...(body.scheduledAt !== undefined && {
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
      }),
      updatedAt: new Date(),
    }

    // First-publish auto-stamp: only set publishedAt if the row has
    // never been published AND the client didn't supply an explicit
    // publishedAt (which would be a back-date for an imported post).
    // Without the `body.publishedAt === undefined` guard, a client
    // PATCHing `{status:'PUBLISHED', publishedAt:'2025-01-01...'}` to
    // back-date an import would get `new Date()` (now) silently.
    if (
      body.status === 'PUBLISHED' &&
      !existingPost.publishedAt &&
      body.publishedAt === undefined
    ) {
      updateData.publishedAt = new Date()
    }

    await db.update(blogPosts).set(updateData).where(eq(blogPosts.slug, slug))

    if (body.tagIds !== undefined) {
      await db.delete(postTags).where(eq(postTags.postId, existingPost.id))
      if (body.tagIds.length > 0) {
        await db
          .insert(postTags)
          .values(body.tagIds.map((tagId: string) => ({ postId: existingPost.id, tagId })))
      }
    }

    const updatedPost = await db.query.blogPosts.findFirst({
      where: eq(blogPosts.slug, slug),
      ...POST_WITH_RELATIONS,
    })

    if (!updatedPost) {
      return NextResponse.json(createErrorResponse('Blog post not found after update'), {
        status: 500,
      })
    }

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
    return NextResponse.json(createErrorResponse('Failed to update blog post'), { status: 500 })
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const rateLimitResponse = checkRateLimitOrRespond(
    request,
    RateLimitPresets.sensitive,
    '/api/blog/[slug]',
    'DELETE'
  )
  if (rateLimitResponse) return rateLimitResponse

  if (!isAdminRequest(request)) {
    logger.warn('Unauthorized blog mutation attempt', {
      route: '/api/blog/[slug]',
      method: 'DELETE',
    })
    return NextResponse.json(createErrorResponse('Unauthorized'), { status: 401 })
  }

  const csrfResponse = await validateCSRFOrRespond(request, 'blog post deletion')
  if (csrfResponse) return csrfResponse

  try {
    const { slug } = await context.params

    if (!slug) {
      return NextResponse.json(createErrorResponse('Slug parameter is required'), { status: 400 })
    }

    const post = await db.query.blogPosts.findFirst({
      where: eq(blogPosts.slug, slug),
      columns: { id: true, authorId: true, categoryId: true },
      with: { tags: { columns: { tagId: true } } },
    })

    if (!post) {
      return NextResponse.json(createErrorResponse('Blog post not found'), { status: 404 })
    }

    // Cascades to post_tags via schema FK
    await db.delete(blogPosts).where(eq(blogPosts.slug, slug))

    await db
      .update(authors)
      .set({ totalPosts: sql`${authors.totalPosts} - 1` })
      .where(eq(authors.id, post.authorId))

    if (post.categoryId) {
      await db
        .update(categories)
        .set({ postCount: sql`${categories.postCount} - 1` })
        .where(eq(categories.id, post.categoryId))
    }

    const tagIds = post.tags.map((t) => t.tagId)
    if (tagIds.length > 0) {
      await db
        .update(tags)
        .set({ postCount: sql`${tags.postCount} - 1` })
        .where(inArray(tags.id, tagIds))
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
    return NextResponse.json(createErrorResponse('Failed to delete blog post'), { status: 500 })
  }
}
