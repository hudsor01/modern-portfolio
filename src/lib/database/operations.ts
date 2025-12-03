/**
 * Type-safe database operations with comprehensive error handling
 * Provides a robust abstraction layer over Prisma for production use
 */

import { db } from '../db'
import { Prisma } from '@prisma/client'
import type {
  BlogPost,
  Author,
  Category,
  Tag,
  // PostView,
  // PostInteraction,
  // SEOKeyword,
  PostStatus
} from '@prisma/client'

// =======================
// ERROR TYPES & HANDLING
// =======================

export class DatabaseError extends Error {
  constructor(
    message: string,
    public operation: string,
    public code?: string,
    public originalError?: unknown
  ) {
    super(message)
    this.name = 'DatabaseError'
  }
}

export class NotFoundError extends DatabaseError {
  constructor(resource: string, identifier: string) {
    super(`${resource} not found with identifier: ${identifier}`, 'READ', 'NOT_FOUND')
    this.name = 'NotFoundError'
  }
}

export class ValidationError extends DatabaseError {
  constructor(field: string, value: unknown, constraint: string) {
    super(`Validation failed for field '${field}' with value '${value}': ${constraint}`, 'VALIDATE', 'VALIDATION_ERROR')
    this.name = 'ValidationError'
  }
}

function handlePrismaError(error: unknown, operation: string): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        throw new DatabaseError('Unique constraint violation', operation, error.code, error)
      case 'P2025':
        throw new NotFoundError('Record', 'unknown')
      case 'P2003':
        throw new DatabaseError('Foreign key constraint violation', operation, error.code, error)
      case 'P2014':
        throw new DatabaseError('Invalid relation', operation, error.code, error)
      default:
        throw new DatabaseError(`Database operation failed: ${error.message}`, operation, error.code, error)
    }
  }
  
  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    throw new DatabaseError('Unknown database error', operation, 'UNKNOWN', error)
  }
  
  if (error instanceof Prisma.PrismaClientValidationError) {
    throw new ValidationError('Unknown field', 'unknown', error.message)
  }
  
  throw new DatabaseError(
    error instanceof Error ? error.message : 'Unknown error',
    operation,
    'UNEXPECTED',
    error
  )
}

// =======================
// BLOG POST OPERATIONS
// =======================

export interface BlogPostWithRelations extends BlogPost {
  author: Pick<Author, 'id' | 'name' | 'slug' | 'avatar'>
  category?: Pick<Category, 'id' | 'name' | 'slug' | 'color'> | null
  tags: Array<{
    tag: Pick<Tag, 'id' | 'name' | 'slug' | 'color'>
  }>
  _count?: {
    views: number
    interactions: number
  }
}

export interface BlogPostCreateInput {
  title: string
  slug: string
  excerpt?: string
  content: string
  metaTitle?: string
  metaDescription?: string
  keywords?: string[]
  authorId: string
  categoryId?: string
  tagIds?: string[]
  status?: PostStatus
  featuredImage?: string
  featuredImageAlt?: string
  publishedAt?: Date
  scheduledAt?: Date
}

export interface BlogPostUpdateInput extends Partial<BlogPostCreateInput> {
  id: string
}

export interface BlogPostQuery {
  status?: PostStatus | PostStatus[]
  authorId?: string
  categoryId?: string
  tagIds?: string[]
  search?: string
  publishedAfter?: Date
  publishedBefore?: Date
  limit?: number
  offset?: number
  orderBy?: 'publishedAt' | 'viewCount' | 'createdAt' | 'title'
  orderDirection?: 'asc' | 'desc'
  includeAnalytics?: boolean
}

export class BlogPostOperations {
  static async findMany(query: BlogPostQuery = {}): Promise<BlogPostWithRelations[]> {
    try {
      const {
        status = 'PUBLISHED',
        authorId,
        categoryId,
        tagIds,
        search,
        publishedAfter,
        publishedBefore,
        limit = 50,
        offset = 0,
        orderBy = 'publishedAt',
        orderDirection = 'desc',
        includeAnalytics = false
      } = query

      const where: Prisma.BlogPostWhereInput = {
        ...(Array.isArray(status) ? { status: { in: status } } : { status }),
        ...(authorId && { authorId }),
        ...(categoryId && { categoryId }),
        ...(tagIds?.length && { 
          tags: { 
            some: { 
              tagId: { in: tagIds } 
            } 
          } 
        }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { excerpt: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } }
          ]
        }),
        ...(publishedAfter && { publishedAt: { gte: publishedAfter } }),
        ...(publishedBefore && { publishedAt: { lte: publishedBefore } })
      }

      const orderByClause: Prisma.BlogPostOrderByWithRelationInput = 
        orderBy === 'viewCount' ? { viewCount: orderDirection } :
        orderBy === 'createdAt' ? { createdAt: orderDirection } :
        orderBy === 'title' ? { title: orderDirection } :
        { publishedAt: orderDirection }

      const posts = await db.blogPost.findMany({
        where,
        include: {
          author: {
            select: { id: true, name: true, slug: true, avatar: true }
          },
          category: {
            select: { id: true, name: true, slug: true, color: true }
          },
          tags: {
            select: {
              tag: {
                select: { id: true, name: true, slug: true, color: true }
              }
            }
          },
          ...(includeAnalytics && {
            _count: {
              select: {
                views: true,
                interactions: true
              }
            }
          })
        },
        orderBy: orderByClause,
        take: Math.min(limit, 100), // Max 100 records per query
        skip: offset
      })

      return posts as BlogPostWithRelations[]

    } catch (error: unknown) {
      handlePrismaError(error, 'BLOG_POST_FIND_MANY')
    }
  }

  static async findBySlug(slug: string, includeAnalytics = false): Promise<BlogPostWithRelations> {
    try {
      const post = await db.blogPost.findUnique({
        where: { slug },
        include: {
          author: {
            select: { id: true, name: true, slug: true, avatar: true, bio: true }
          },
          category: {
            select: { id: true, name: true, slug: true, color: true, description: true }
          },
          tags: {
            select: {
              tag: {
                select: { id: true, name: true, slug: true, color: true }
              }
            }
          },
          ...(includeAnalytics && {
            _count: {
              select: {
                views: true,
                interactions: true
              }
            }
          })
        }
      })

      if (!post) {
        throw new NotFoundError('BlogPost', slug)
      }

      return post as BlogPostWithRelations

    } catch (error: unknown) {
      if (error instanceof NotFoundError) throw error
      handlePrismaError(error, 'BLOG_POST_FIND_BY_SLUG')
    }
  }

  static async create(input: BlogPostCreateInput): Promise<BlogPost> {
    try {
      // Validate required fields
      if (!input.title?.trim()) {
        throw new ValidationError('title', input.title, 'Title is required')
      }
      if (!input.slug?.trim()) {
        throw new ValidationError('slug', input.slug, 'Slug is required')
      }
      if (!input.content?.trim()) {
        throw new ValidationError('content', input.content, 'Content is required')
      }
      if (!input.authorId?.trim()) {
        throw new ValidationError('authorId', input.authorId, 'Author ID is required')
      }

      const { tagIds, ...postData } = input

      const post = await db.blogPost.create({
        data: {
          ...postData,
          wordCount: input.content.split(/\s+/).length,
          readingTime: Math.ceil(input.content.split(/\s+/).length / 200),
          ...(tagIds?.length && {
            tags: {
              create: tagIds.map(tagId => ({ tagId }))
            }
          })
        }
      })

      return post

    } catch (error: unknown) {
      if (error instanceof ValidationError) throw error
      handlePrismaError(error, 'BLOG_POST_CREATE')
    }
  }

  static async update(input: BlogPostUpdateInput): Promise<BlogPost> {
    try {
      const { id, tagIds, ...updateData } = input

      if (!id?.trim()) {
        throw new ValidationError('id', id, 'ID is required for update')
      }

      // Update word count and reading time if content changed
      if (input.content) {
        const wordCount = input.content.split(/\s+/).length
        Object.assign(updateData, {
          wordCount,
          readingTime: Math.ceil(wordCount / 200)
        })
      }

      const post = await db.blogPost.update({
        where: { id },
        data: {
          ...updateData,
          ...(tagIds && {
            tags: {
              deleteMany: {},
              create: tagIds.map(tagId => ({ tagId }))
            }
          })
        }
      })

      return post

    } catch (error: unknown) {
      if (error instanceof ValidationError) throw error
      handlePrismaError(error, 'BLOG_POST_UPDATE')
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      if (!id?.trim()) {
        throw new ValidationError('id', id, 'ID is required for deletion')
      }

      await db.blogPost.delete({
        where: { id }
      })

    } catch (error: unknown) {
      if (error instanceof ValidationError) throw error
      handlePrismaError(error, 'BLOG_POST_DELETE')
    }
  }
}

// =======================
// ANALYTICS OPERATIONS
// =======================

export interface AnalyticsQuery {
  postId?: string
  startDate?: Date
  endDate?: Date
  country?: string
  groupBy?: 'day' | 'week' | 'month'
}

export interface AnalyticsResult {
  totalViews: number
  uniqueViews: number
  averageReadingTime: number
  bounceRate: number
  topCountries: Array<{ country: string; views: number }>
  viewsByPeriod?: Array<{ period: string; views: number }>
}

export class AnalyticsOperations {
  static async recordView(postId: string, visitorData: {
    visitorId?: string
    sessionId?: string
    ipAddress?: string
    userAgent?: string
    country?: string
    readingTime?: number
    scrollDepth?: number
  }): Promise<void> {
    try {
      // Verify post exists and is published
      const post = await db.blogPost.findUnique({
        where: { id: postId },
        select: { status: true }
      })

      if (!post) {
        throw new NotFoundError('BlogPost', postId)
      }

      if (post.status !== 'PUBLISHED') {
        throw new ValidationError('postId', postId, 'Can only track views for published posts')
      }

      await db.postView.create({
        data: {
          postId,
          ...visitorData
        }
      })

      // Update post view count (async, don't wait)
      db.blogPost.update({
        where: { id: postId },
        data: {
          viewCount: {
            increment: 1
          }
        }
      }).catch((error: unknown) => {
        console.error('Failed to update view count:', error)
      })

    } catch (error: unknown) {
      if (error instanceof NotFoundError || error instanceof ValidationError) throw error
      handlePrismaError(error, 'ANALYTICS_RECORD_VIEW')
    }
  }

  static async recordInteraction(
    postId: string, 
    type: 'LIKE' | 'SHARE' | 'COMMENT' | 'BOOKMARK' | 'SUBSCRIBE' | 'DOWNLOAD',
    visitorData: {
      visitorId?: string
      sessionId?: string
      value?: string
      metadata?: Record<string, unknown>
    }
  ): Promise<void> {
    try {
      await db.postInteraction.create({
        data: {
          postId,
          type,
          ...visitorData,
          metadata: visitorData.metadata as Prisma.InputJsonValue | undefined
        }
      })

      // Update post interaction counts
      const updateField = type === 'LIKE' ? 'likeCount' : 
                         type === 'SHARE' ? 'shareCount' : 
                         type === 'COMMENT' ? 'commentCount' : null

      if (updateField) {
        db.blogPost.update({
          where: { id: postId },
          data: {
            [updateField]: {
              increment: 1
            }
          }
        }).catch((error: unknown) => {
          console.error('Failed to update interaction count:', error)
        })
      }

    } catch (error: unknown) {
      handlePrismaError(error, 'ANALYTICS_RECORD_INTERACTION')
    }
  }

  static async getAnalytics(query: AnalyticsQuery): Promise<AnalyticsResult> {
    try {
      const { postId, startDate, endDate, country } = query

      const whereClause: Prisma.PostViewWhereInput = {
        ...(postId && { postId }),
        ...(startDate && { viewedAt: { gte: startDate } }),
        ...(endDate && { viewedAt: { lte: endDate } }),
        ...(country && { country })
      }

      const [views, uniqueViews, avgReadingTime, countryStats] = await Promise.all([
        // Total views
        db.postView.count({ where: whereClause }),
        
        // Unique views (distinct visitor IDs)
        db.postView.groupBy({
          by: ['visitorId'],
          where: whereClause,
          _count: true
        }).then((results: unknown[]) => results.length),

        // Average reading time
        db.postView.aggregate({
          where: { ...whereClause, readingTime: { not: null } },
          _avg: { readingTime: true }
        }),

        // Top countries
        db.postView.groupBy({
          by: ['country'],
          where: { ...whereClause, country: { not: null } },
          _count: true,
          orderBy: { _count: { country: 'desc' } },
          take: 10
        })
      ])

      const bounceRate = views > 0 ?
        await db.postView.count({
          where: { ...whereClause, readingTime: { lt: 30 } }
        }).then((bounces: number) => bounces / views) : 0

      return {
        totalViews: views,
        uniqueViews,
        averageReadingTime: avgReadingTime._avg.readingTime || 0,
        bounceRate,
        topCountries: countryStats.map((stat: unknown) => {
          const s = stat as Record<string, unknown>
          return {
            country: (s.country as string | null) || 'Unknown',
            views: (s._count as Record<string, number>).country || 0
          }
        })
      }

    } catch (error: unknown) {
      handlePrismaError(error, 'ANALYTICS_GET_ANALYTICS')
    }
  }
}

// =======================
// USER CONTEXT OPERATIONS
// =======================

export class UserContextOperations {
  static async setAdminContext(): Promise<void> {
    try {
      await db.$executeRaw`SELECT set_user_context('admin', 'admin')`
    } catch (error: unknown) {
      handlePrismaError(error, 'SET_ADMIN_CONTEXT')
    }
  }

  static async setAuthorContext(authorId: string): Promise<void> {
    try {
      if (!authorId?.trim()) {
        throw new ValidationError('authorId', authorId, 'Author ID is required')
      }

      await db.$executeRaw`SELECT set_user_context(${authorId}, 'author')`
    } catch (error: unknown) {
      if (error instanceof ValidationError) throw error
      handlePrismaError(error, 'SET_AUTHOR_CONTEXT')
    }
  }

  static async clearContext(): Promise<void> {
    try {
      await db.$executeRaw`SELECT clear_user_context()`
    } catch (error: unknown) {
      handlePrismaError(error, 'CLEAR_CONTEXT')
    }
  }
}

// =======================
// TRANSACTION OPERATIONS
// =======================

export class TransactionOperations {
  static async withTransaction<T>(
    operation: (tx: Prisma.TransactionClient) => Promise<T>
  ): Promise<T> {
    try {
      return await db.$transaction(operation)
    } catch (error: unknown) {
      handlePrismaError(error, 'TRANSACTION')
    }
  }

  static async createPostWithTags(
    postData: BlogPostCreateInput,
    tagNames: string[]
  ): Promise<BlogPost> {
    return this.withTransaction(async (tx) => {
      // Create or find tags
      const tags = await Promise.all(
        tagNames.map(async (name) => {
          const slug = name.toLowerCase().replace(/\s+/g, '-')
          return tx.tag.upsert({
            where: { slug },
            create: { name, slug },
            update: {}
          })
        })
      )

      // Create post with tags
      const { tagIds: _tagIds, ...postCreateData } = postData
      return tx.blogPost.create({
        data: {
          ...postCreateData,
          wordCount: postData.content.split(/\s+/).length,
          readingTime: Math.ceil(postData.content.split(/\s+/).length / 200),
          tags: {
            create: tags.map((tag: Tag) => ({ tagId: tag.id }))
          }
        }
      })
    })
  }
}

// All operations are already exported above as part of their class definitions