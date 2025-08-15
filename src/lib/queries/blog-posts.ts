/**
 * Blog Post Query Utilities
 * Comprehensive CRUD operations, filtering, pagination, and analytics for blog posts
 */

import { db } from '@/lib/db'
import type { 
  BlogPostWithRelations,
  BlogPostWithAnalytics,
  BlogPostListResult
} from '@/types/blog-database'
import { 
  blogPostIncludes,
  blogPostFilters,
  blogPostSorts
} from '@/types/blog-database'
import type { 
  BlogPostFilter,
  BlogPostSort,
  Pagination,
  BlogPostCreateInput,
  BlogPostUpdateInput 
} from '@/lib/validations/blog-schema'
import { PostStatus, Prisma } from '@prisma/client'

// =======================
// CREATE OPERATIONS
// =======================

export async function createBlogPost(data: BlogPostCreateInput): Promise<BlogPostWithRelations> {
  const { tagIds = [], seriesId, relatedPostIds = [], ...postData } = data
  
  // Calculate reading time and word count
  const wordCount = postData.content.split(/\s+/).length
  const readingTime = Math.ceil(wordCount / 200) // Average reading speed: 200 words/minute
  
  const post = await db.blogPost.create({
    data: {
      ...postData,
      wordCount,
      readingTime,
      // Handle tag relationships
      tags: tagIds.length > 0 ? {
        create: tagIds.map(tagId => ({
          tagId
        }))
      } : undefined,
      // Handle series relationship
      seriesPosts: seriesId ? {
        create: {
          seriesId,
          order: await getNextSeriesOrder(seriesId)
        }
      } : undefined,
      // Handle related posts
      relatedPosts: relatedPostIds.length > 0 ? {
        create: relatedPostIds.map(relatedPostId => ({
          relatedPostId,
          relationType: 'RELATED'
        }))
      } : undefined
    },
    include: blogPostIncludes.withRelations
  })

  // Update category and author counters
  await Promise.all([
    updateCategoryStats(post.categoryId),
    updateAuthorStats(post.authorId),
    updateTagStats(tagIds)
  ])

  return post
}

export async function createBlogPostDraft(
  title: string, 
  content: string, 
  authorId: string
): Promise<BlogPostWithRelations> {
  const slug = generateSlug(title)
  
  return createBlogPost({
    title,
    slug,
    content,
    contentType: 'MARKDOWN',
    status: 'DRAFT',
    keywords: [],
    authorId,
    metaTitle: title.substring(0, 100),
    metaDescription: content.substring(0, 160),
    featured: false,
    allowComments: true,
    requiresAuth: false,
    visibility: 'PUBLIC',
    currentVersion: 1
  })
}

// =======================
// READ OPERATIONS
// =======================

export async function getBlogPostById(
  id: string, 
  includeAnalytics = false
): Promise<BlogPostWithRelations | null> {
  const include = includeAnalytics 
    ? blogPostIncludes.withAnalytics 
    : blogPostIncludes.withRelations

  return db.blogPost.findUnique({
    where: { id },
    include
  })
}

export async function getBlogPostBySlug(
  slug: string,
  includeAnalytics = false
): Promise<BlogPostWithRelations | null> {
  const include = includeAnalytics 
    ? blogPostIncludes.withAnalytics 
    : blogPostIncludes.withRelations

  return db.blogPost.findUnique({
    where: { slug },
    include
  })
}

export async function getBlogPosts(
  filters?: BlogPostFilter,
  sort?: BlogPostSort,
  pagination?: Pagination
): Promise<BlogPostListResult> {
  const { page = 1, limit = 10 } = pagination || {}
  const skip = (page - 1) * limit

  // Build where clause
  const where = buildWhereClause(filters)
  
  // Build order by clause
  const orderBy = buildOrderByClause(sort)

  // Get posts and total count in parallel
  const [posts, total, aggregations] = await Promise.all([
    db.blogPost.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: blogPostIncludes.withAnalytics
    }),
    db.blogPost.count({ where }),
    getBlogPostAggregations(where)
  ])

  const totalPages = Math.ceil(total / limit)

  return {
    posts: posts,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    },
    filters: filters || {},
    aggregations
  }
}

export async function getPublishedBlogPosts(
  limit = 10,
  offset = 0
): Promise<BlogPostWithAnalytics[]> {
  return db.blogPost.findMany({
    where: blogPostFilters.published,
    orderBy: blogPostSorts.published,
    take: limit,
    skip: offset,
    include: blogPostIncludes.withAnalytics
  })
}

export async function getFeaturedBlogPosts(limit = 5): Promise<BlogPostWithAnalytics[]> {
  return db.blogPost.findMany({
    where: {
      ...blogPostFilters.published,
      featuredImage: { not: null }
    },
    orderBy: [
      { viewCount: 'desc' },
      { publishedAt: 'desc' }
    ],
    take: limit,
    include: blogPostIncludes.withAnalytics
  })
}

export async function getRelatedPosts(
  postId: string,
  limit = 5
): Promise<BlogPostWithAnalytics[]> {
  const post = await db.blogPost.findUnique({
    where: { id: postId },
    select: { categoryId: true, tags: { select: { tagId: true } } }
  })

  if (!post) return []

  const tagIds = post.tags.map(t => t.tagId)

  return db.blogPost.findMany({
    where: {
      ...blogPostFilters.published,
      id: { not: postId },
      OR: [
        { categoryId: post.categoryId },
        { tags: { some: { tagId: { in: tagIds } } } }
      ]
    },
    orderBy: { viewCount: 'desc' },
    take: limit,
    include: blogPostIncludes.withAnalytics
  })
}

// =======================
// UPDATE OPERATIONS
// =======================

export async function updateBlogPost(
  id: string,
  data: BlogPostUpdateInput
): Promise<BlogPostWithRelations> {
  const { tagIds, seriesId, relatedPostIds, ...updateData } = data

  // Calculate reading time if content changed
  if (updateData.content) {
    const wordCount = updateData.content.split(/\s+/).length
    updateData.readingTime = Math.ceil(wordCount / 200)
    updateData.wordCount = wordCount
  }

  const post = await db.$transaction(async (tx) => {
    // Update the post
    const updatedPost = await tx.blogPost.update({
      where: { id },
      data: {
        ...updateData,
        // Handle tag updates
        ...(tagIds && {
          tags: {
            deleteMany: {},
            create: tagIds.map(tagId => ({ tagId }))
          }
        }),
        // Handle series updates
        ...(seriesId !== undefined && {
          seriesPosts: {
            deleteMany: {},
            ...(seriesId && {
              create: {
                seriesId,
                order: await getNextSeriesOrder(seriesId)
              }
            })
          }
        }),
        // Handle related posts updates
        ...(relatedPostIds && {
          relatedPosts: {
            deleteMany: {},
            create: relatedPostIds.map(relatedPostId => ({
              relatedPostId,
              relationType: 'RELATED'
            }))
          }
        })
      },
      include: blogPostIncludes.withRelations
    })

    return updatedPost
  })

  return post
}

export async function publishBlogPost(
  id: string,
  publishedAt?: Date
): Promise<BlogPostWithRelations> {
  return updateBlogPost(id, {
    status: 'PUBLISHED',
    publishedAt: publishedAt || new Date()
  })
}

export async function scheduleBlogPost(
  id: string,
  scheduledAt: Date
): Promise<BlogPostWithRelations> {
  return updateBlogPost(id, {
    status: 'SCHEDULED',
    scheduledAt
  })
}

export async function archiveBlogPost(id: string): Promise<BlogPostWithRelations> {
  return updateBlogPost(id, {
    status: 'ARCHIVED',
    archivedAt: new Date()
  })
}

// =======================
// DELETE OPERATIONS
// =======================

export async function deleteBlogPost(id: string): Promise<void> {
  // Soft delete by setting status to DELETED
  await db.blogPost.update({
    where: { id },
    data: {
      status: 'DELETED',
      archivedAt: new Date()
    }
  })
}

export async function permanentlyDeleteBlogPost(id: string): Promise<void> {
  await db.blogPost.delete({
    where: { id }
  })
}

// =======================
// ANALYTICS OPERATIONS
// =======================

export async function recordBlogPostView(
  postId: string,
  viewData: {
    visitorId?: string
    sessionId?: string
    ipAddress?: string
    userAgent?: string
    referer?: string
    country?: string
    region?: string
    city?: string
    readingTime?: number
    scrollDepth?: number
  }
): Promise<void> {
  await Promise.all([
    // Record the view
    db.postView.create({
      data: {
        postId,
        ...viewData
      }
    }),
    // Increment view count
    db.blogPost.update({
      where: { id: postId },
      data: {
        viewCount: { increment: 1 }
      }
    })
  ])
}

export async function recordBlogPostInteraction(
  postId: string,
  type: 'LIKE' | 'SHARE' | 'COMMENT' | 'BOOKMARK' | 'SUBSCRIBE' | 'DOWNLOAD',
  interactionData: {
    visitorId?: string
    sessionId?: string
    value?: string
    metadata?: Record<string, unknown>
  } = {}
): Promise<void> {
  await Promise.all([
    // Record the interaction
    db.postInteraction.create({
      data: {
        postId,
        type,
        ...interactionData
      }
    }),
    // Update interaction counts
    db.blogPost.update({
      where: { id: postId },
      data: {
        ...(type === 'LIKE' && { likeCount: { increment: 1 } }),
        ...(type === 'SHARE' && { shareCount: { increment: 1 } }),
        ...(type === 'COMMENT' && { commentCount: { increment: 1 } })
      }
    })
  ])
}

// =======================
// HELPER FUNCTIONS
// =======================

function buildWhereClause(filters?: BlogPostFilter): Prisma.BlogPostWhereInput {
  if (!filters) return {}

  const where: Prisma.BlogPostWhereInput = {}

  if (filters.status) {
    where.status = Array.isArray(filters.status) 
      ? { in: filters.status as PostStatus[] }
      : filters.status as PostStatus
  }

  if (filters.authorId) {
    where.authorId = filters.authorId
  }

  if (filters.categoryId) {
    where.categoryId = filters.categoryId
  }

  if (filters.tagIds && filters.tagIds.length > 0) {
    where.tags = {
      some: {
        tagId: { in: filters.tagIds }
      }
    }
  }

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { content: { contains: filters.search, mode: 'insensitive' } },
      { excerpt: { contains: filters.search, mode: 'insensitive' } }
    ]
  }

  if (filters.dateRange) {
    where.publishedAt = {
      gte: filters.dateRange.from,
      lte: filters.dateRange.to
    }
  }

  if (filters.featured !== undefined) {
    where.featuredImage = filters.featured ? { not: null } : null
  }

  if (filters.published !== undefined) {
    if (filters.published) {
      where.AND = [
        { status: 'PUBLISHED' },
        { publishedAt: { lte: new Date() } }
      ]
    } else {
      where.OR = [
        { status: { not: 'PUBLISHED' } },
        { publishedAt: { gt: new Date() } }
      ]
    }
  }

  return where
}

function buildOrderByClause(sort?: BlogPostSort): Prisma.BlogPostOrderByWithRelationInput {
  if (!sort) return { createdAt: 'desc' }

  const { field, order = 'desc' } = sort

  return { [field]: order }
}

async function getBlogPostAggregations(where: Prisma.BlogPostWhereInput) {
  const [totalViews, avgReadingTime, statusCounts, categoryCounts, tagCounts] = await Promise.all([
    // Total views
    db.blogPost.aggregate({
      where,
      _sum: { viewCount: true }
    }),
    // Average reading time
    db.blogPost.aggregate({
      where,
      _avg: { readingTime: true }
    }),
    // Status counts
    db.blogPost.groupBy({
      by: ['status'],
      where,
      _count: { status: true }
    }),
    // Category counts
    db.blogPost.groupBy({
      by: ['categoryId'],
      where: { ...where, categoryId: { not: null } },
      _count: { categoryId: true },
      orderBy: { _count: { categoryId: 'desc' } },
      take: 10
    }),
    // Tag counts - we need to get posts first then count tags
    db.blogPost.findMany({
      where,
      select: { tags: { select: { tagId: true } } }
    }).then(posts => {
      const tagIds = posts.flatMap(p => p.tags.map(t => t.tagId))
      const tagCounts = tagIds.reduce((acc, tagId) => {
        acc[tagId] = (acc[tagId] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      return Object.entries(tagCounts)
        .map(([tagId, count]) => ({ tagId, _count: { tagId: count } }))
        .sort((a, b) => b._count.tagId - a._count.tagId)
        .slice(0, 10)
    })
  ])

  return {
    totalViews: totalViews._sum.viewCount || 0,
    avgReadingTime: Math.round(avgReadingTime._avg.readingTime || 0),
    statusCounts: statusCounts.reduce((acc, { status, _count }) => {
      acc[status] = _count.status
      return acc
    }, {} as Record<PostStatus, number>),
    categoryCounts: await Promise.all(
      categoryCounts.map(async ({ categoryId, _count }) => {
        const category = await db.category.findUnique({
          where: { id: categoryId || '' },
          select: { name: true }
        })
        return {
          category: category?.name || 'Unknown',
          count: _count.categoryId
        }
      })
    ),
    tagCounts: await Promise.all(
      tagCounts.map(async ({ tagId, _count }) => {
        const tag = await db.tag.findUnique({
          where: { id: tagId },
          select: { name: true }
        })
        return {
          tag: tag?.name || 'Unknown',
          count: _count.tagId
        }
      })
    )
  }
}

async function getNextSeriesOrder(seriesId: string): Promise<number> {
  const lastPost = await db.seriesPost.findFirst({
    where: { seriesId },
    orderBy: { order: 'desc' },
    select: { order: true }
  })

  return (lastPost?.order || 0) + 1
}

async function updateCategoryStats(categoryId?: string | null): Promise<void> {
  if (!categoryId) return

  const stats = await db.blogPost.aggregate({
    where: { 
      categoryId,
      status: 'PUBLISHED'
    },
    _count: { id: true },
    _sum: { viewCount: true }
  })

  await db.category.update({
    where: { id: categoryId },
    data: {
      postCount: stats._count.id,
      totalViews: stats._sum.viewCount || 0
    }
  })
}

async function updateAuthorStats(authorId: string): Promise<void> {
  const stats = await db.blogPost.aggregate({
    where: { 
      authorId,
      status: 'PUBLISHED'
    },
    _count: { id: true },
    _sum: { viewCount: true }
  })

  await db.author.update({
    where: { id: authorId },
    data: {
      totalPosts: stats._count.id,
      totalViews: stats._sum.viewCount || 0
    }
  })
}

async function updateTagStats(tagIds: string[]): Promise<void> {
  await Promise.all(
    tagIds.map(async (tagId) => {
      const stats = await db.postTag.aggregate({
        where: { 
          tagId,
          post: { status: 'PUBLISHED' }
        },
        _count: { tagId: true }
      })

      const totalViews = await db.blogPost.aggregate({
        where: {
          status: 'PUBLISHED',
          tags: { some: { tagId } }
        },
        _sum: { viewCount: true }
      })

      await db.tag.update({
        where: { id: tagId },
        data: {
          postCount: stats._count.tagId,
          totalViews: totalViews._sum.viewCount || 0
        }
      })
    })
  )
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}