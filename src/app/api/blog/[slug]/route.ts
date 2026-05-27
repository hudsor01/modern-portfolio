import { type NextRequest, NextResponse } from 'next/server'
import { eq, inArray, sql } from 'drizzle-orm'
import type { ApiResponse, BlogPostData } from '@/types/api'
import { createContextLogger } from '@/lib/logger'
import { db } from '@/lib/db'
import { authors, blogPosts, categories, postTags, tags, type NewBlogPost } from '@/db/schema'
import { validateCSRFOrRespond } from '@/lib/api-csrf'
import { isAdminRequest } from '@/lib/api-admin-auth'
import { transformToBlogPostData, createErrorResponse } from '@/lib/api-blog'
import { updateBlogPostSchema } from '@/lib/schemas'

const logger = createContextLogger('SlugAPI')

const POST_WITH_RELATIONS = {
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
      const issue = parsed.error.issues[0]
      const msg = issue
        ? `Invalid request body: ${issue.path.join('.')}: ${issue.message}`
        : 'Invalid request body'
      return NextResponse.json(createErrorResponse(msg), { status: 400 })
    }
    const body = parsed.data

    const existingPost = await db.query.blogPosts.findFirst({
      where: eq(blogPosts.slug, slug),
    })

    if (!existingPost) {
      return NextResponse.json(createErrorResponse('Blog post not found'), { status: 404 })
    }

    const wordCount = body.content ? body.content.split(/\s+/).length : undefined
    const readingTime = wordCount ? Math.ceil(wordCount / 200) : undefined

    // Coerce empty-string → null on nullable text columns to keep the
    // DB in a single canonical "cleared" state (NULL). The partial
    // unique index on featuredImage treats NULL as distinct (multiple
    // rows can hold NULL) but two empty strings as equal — without
    // this coalesce, a PATCH client sending `featuredImage: ''` from
    // an HTML form would land empty strings that collide on the index.
    const blank = <T>(v: T | null | undefined | ''): T | null =>
      v === undefined || v === '' ? null : (v as T)
    const updateData: Partial<NewBlogPost> = {
      ...(body.title && { title: body.title }),
      ...(body.excerpt !== undefined && { excerpt: blank(body.excerpt) }),
      ...(body.content && { content: body.content, wordCount, readingTime }),
      ...(body.contentType && { contentType: body.contentType }),
      ...(body.status && { status: body.status }),
      ...(body.metaTitle !== undefined && { metaTitle: blank(body.metaTitle) }),
      ...(body.metaDescription !== undefined && {
        metaDescription: blank(body.metaDescription),
      }),
      ...(body.keywords && { keywords: body.keywords }),
      ...(body.canonicalUrl !== undefined && { canonicalUrl: blank(body.canonicalUrl) }),
      // Social-card fields — schema accepts these on PUT (`.nullish()`
      // in blogPostBaseShape), so the handler must spread them through
      // or silently drop a valid client payload.
      ...(body.ogTitle !== undefined && { ogTitle: blank(body.ogTitle) }),
      ...(body.ogDescription !== undefined && { ogDescription: blank(body.ogDescription) }),
      ...(body.ogImage !== undefined && { ogImage: blank(body.ogImage) }),
      ...(body.twitterTitle !== undefined && { twitterTitle: blank(body.twitterTitle) }),
      ...(body.twitterDescription !== undefined && {
        twitterDescription: blank(body.twitterDescription),
      }),
      ...(body.twitterImage !== undefined && { twitterImage: blank(body.twitterImage) }),
      ...(body.featuredImage !== undefined && { featuredImage: blank(body.featuredImage) }),
      ...(body.featuredImageAlt !== undefined && {
        featuredImageAlt: blank(body.featuredImageAlt),
      }),
      ...(body.categoryId !== undefined && { categoryId: body.categoryId ?? null }),
      ...(body.publishedAt !== undefined && {
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
      }),
      ...(body.scheduledAt !== undefined && {
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
      }),
      updatedAt: new Date(),
    }

    if (body.status === 'PUBLISHED' && !existingPost.publishedAt) {
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
  const csrfResponse = await validateCSRFOrRespond(request, 'blog post deletion')
  if (csrfResponse) return csrfResponse

  try {
    const { slug } = await context.params

    if (!slug) {
      return NextResponse.json(createErrorResponse('Slug parameter is required'), { status: 400 })
    }

    const post = await db.query.blogPosts.findFirst({
      where: eq(blogPosts.slug, slug),
      with: { tags: true },
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
