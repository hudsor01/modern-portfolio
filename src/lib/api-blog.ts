import {
  and,
  asc,
  desc,
  eq,
  exists,
  gte,
  ilike,
  inArray,
  lte,
  ne,
  or,
  sql,
  type SQL,
} from 'drizzle-orm'
import { db } from '@/lib/db'
import {
  blogPosts,
  postTags,
  type Author,
  type Category,
  type Tag,
  type BlogPost,
} from '@/db/schema'
import type {
  BlogPostFilters,
  BlogPostSort,
  BlogPostData,
  BlogCategoryData,
  BlogTagData,
  ApiResponse,
} from '@/types/api'

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .trim()
}

export function createErrorResponse(message: string): ApiResponse<never> {
  return {
    data: undefined as never,
    success: false,
    error: message,
  }
}

export function transformToCategoryData(category: {
  id: string
  name: string
  slug: string
  description: string | null
  color: string | null
  icon: string | null
  postCount: number
  totalViews: number
  createdAt: Date
}): BlogCategoryData {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description ?? undefined,
    color: category.color ?? undefined,
    icon: category.icon ?? undefined,
    postCount: category.postCount,
    totalViews: category.totalViews,
    createdAt: category.createdAt.toISOString(),
  }
}

export function transformToTagData(tag: {
  id: string
  name: string
  slug: string
  description: string | null
  color: string | null
  postCount: number
  totalViews: number
  createdAt: Date
}): BlogTagData {
  return {
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
    description: tag.description ?? undefined,
    color: tag.color ?? undefined,
    postCount: tag.postCount,
    totalViews: tag.totalViews,
    createdAt: tag.createdAt.toISOString(),
  }
}

// Shape returned by the canonical Drizzle query (relational findFirst/findMany
// with `with: { author, category, tags: { with: { tag } } }`).
export type BlogPostWithRelations = BlogPost & {
  author: Author | null
  category: Category | null
  tags: Array<{ tag: Tag }>
}

/**
 * Drizzle WHERE clause builder. Returns `undefined` when no filters apply so
 * callers can pass it straight into `where:` without conditional checks.
 */
export function buildBlogWhereClause(filters?: BlogPostFilters): SQL | undefined {
  if (!filters) return undefined

  const conditions: SQL[] = []

  if (filters.status) {
    const statuses = Array.isArray(filters.status) ? filters.status : [filters.status]
    conditions.push(inArray(blogPosts.status, statuses as BlogPost['status'][]))
  }

  if (filters.authorId) {
    conditions.push(eq(blogPosts.authorId, filters.authorId))
  }

  if (filters.categoryId) {
    conditions.push(eq(blogPosts.categoryId, filters.categoryId))
  }

  if (filters.tagIds && filters.tagIds.length > 0) {
    // Posts that have at least one of the requested tags. Canonical Drizzle
    // pattern: `exists()` wrapping a correlated subquery, with `inArray()`
    // for the IN list. Hand-rolling the SQL with template strings was tried
    // and produced `tagId = text[]` because Drizzle binds JS arrays as a
    // single Postgres array parameter.
    conditions.push(
      exists(
        db
          .select({ one: sql`1` })
          .from(postTags)
          .where(and(eq(postTags.postId, blogPosts.id), inArray(postTags.tagId, filters.tagIds)))
      )
    )
  }

  if (filters.search) {
    const term = `%${filters.search}%`
    const searchOr = or(
      ilike(blogPosts.title, term),
      ilike(blogPosts.excerpt, term),
      ilike(blogPosts.content, term),
      sql`${filters.search} = ANY(${blogPosts.keywords})`
    )
    if (searchOr) conditions.push(searchOr)
  }

  if (filters.dateRange) {
    conditions.push(
      and(
        gte(blogPosts.publishedAt, new Date(filters.dateRange.from)),
        lte(blogPosts.publishedAt, new Date(filters.dateRange.to))
      ) as SQL
    )
  }

  if (filters.published !== undefined) {
    conditions.push(
      filters.published ? eq(blogPosts.status, 'PUBLISHED') : ne(blogPosts.status, 'PUBLISHED')
    )
  }

  if (conditions.length === 0) return undefined
  return conditions.length === 1 ? conditions[0] : and(...conditions)
}

type BlogOrderClause = SQL | ReturnType<typeof desc> | ReturnType<typeof asc>

/**
 * Drizzle ORDER BY builder. Returns the column-direction expression to drop
 * into `orderBy:`.
 */
export function buildBlogOrderBy(sort?: BlogPostSort): BlogOrderClause {
  if (!sort) return desc(blogPosts.publishedAt)
  const dir = sort.order === 'asc' ? asc : desc
  switch (sort.field) {
    case 'title':
      return dir(blogPosts.title)
    case 'createdAt':
      return dir(blogPosts.createdAt)
    case 'updatedAt':
      return dir(blogPosts.updatedAt)
    case 'publishedAt':
      return dir(blogPosts.publishedAt)
    case 'viewCount':
      return dir(blogPosts.viewCount)
    case 'likeCount':
      return dir(blogPosts.likeCount)
    default:
      return desc(blogPosts.publishedAt)
  }
}

export function transformToBlogPostData(post: BlogPostWithRelations): BlogPostData {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? undefined,
    content: post.content,
    contentType: post.contentType,
    status: post.status,
    metaTitle: post.metaTitle ?? undefined,
    metaDescription: post.metaDescription ?? undefined,
    keywords: post.keywords,
    canonicalUrl: post.canonicalUrl ?? undefined,
    featuredImage: post.featuredImage ?? undefined,
    featuredImageAlt: post.featuredImageAlt ?? undefined,
    readingTime: post.readingTime ?? undefined,
    wordCount: post.wordCount ?? undefined,
    publishedAt: post.publishedAt?.toISOString(),
    scheduledAt: post.scheduledAt?.toISOString(),
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    authorId: post.authorId,
    author: post.author
      ? {
          id: post.author.id,
          name: post.author.name,
          email: post.author.email,
          slug: post.author.slug,
          bio: post.author.bio ?? undefined,
          avatar: post.author.avatar ?? undefined,
          website: post.author.website ?? undefined,
          totalPosts: post.author.totalPosts,
          totalViews: post.author.totalViews,
          createdAt: post.author.createdAt.toISOString(),
        }
      : undefined,
    categoryId: post.categoryId ?? undefined,
    category: post.category
      ? {
          id: post.category.id,
          name: post.category.name,
          slug: post.category.slug,
          description: post.category.description ?? undefined,
          color: post.category.color ?? undefined,
          icon: post.category.icon ?? undefined,
          postCount: post.category.postCount,
          totalViews: post.category.totalViews,
          createdAt: post.category.createdAt.toISOString(),
        }
      : undefined,
    tags: post.tags.map((pt) => ({
      id: pt.tag.id,
      name: pt.tag.name,
      slug: pt.tag.slug,
      description: pt.tag.description ?? undefined,
      color: pt.tag.color ?? undefined,
      postCount: pt.tag.postCount,
      totalViews: pt.tag.totalViews,
      createdAt: pt.tag.createdAt.toISOString(),
    })),
    viewCount: post.viewCount,
    likeCount: post.likeCount,
    shareCount: post.shareCount,
    commentCount: post.commentCount,
  }
}
