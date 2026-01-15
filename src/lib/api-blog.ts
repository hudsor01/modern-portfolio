/**
 * Blog API Utilities
 * Consolidates blog query building, filtering, and data transformation
 */

import { Prisma } from '@/generated/prisma/client'
import type {
  BlogPostFilters,
  BlogPostSort,
  BlogPostData,
  BlogCategoryData,
  BlogTagData,
  ApiResponse,
} from '@/types/api'

// ============================================================================
// SHARED HELPERS
// ============================================================================

/**
 * Generate URL-safe slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .trim()
}

/**
 * Create standardized error response
 */
export function createErrorResponse(message: string): ApiResponse<never> {
  return {
    data: undefined as never,
    success: false,
    error: message,
  }
}

/**
 * Transform category to API response format
 */
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

/**
 * Transform tag to API response format
 */
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

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type BlogPostWithRelations = Prisma.BlogPostGetPayload<{
  include: {
    author: true
    category: true
    tags: { include: { tag: true } }
  }
}>

// ============================================================================
// QUERY BUILDERS
// ============================================================================

/**
 * Build Prisma where clause from blog post filters
 */
export function buildBlogWhereClause(filters?: BlogPostFilters): Prisma.BlogPostWhereInput {
  const where: Prisma.BlogPostWhereInput = {}

  if (!filters) return where

  if (filters.status) {
    const statuses = Array.isArray(filters.status) ? filters.status : [filters.status]
    where.status = { in: statuses as Prisma.EnumPostStatusFilter['in'] }
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
        tagId: { in: filters.tagIds },
      },
    }
  }

  if (filters.search) {
    const searchTerm = filters.search
    where.OR = [
      { title: { contains: searchTerm, mode: 'insensitive' } },
      { excerpt: { contains: searchTerm, mode: 'insensitive' } },
      { content: { contains: searchTerm, mode: 'insensitive' } },
      { keywords: { has: searchTerm } },
    ]
  }

  if (filters.dateRange) {
    where.publishedAt = {
      gte: new Date(filters.dateRange.from),
      lte: new Date(filters.dateRange.to),
    }
  }

  if (filters.published !== undefined) {
    if (filters.published) {
      where.status = 'PUBLISHED'
    } else {
      where.status = { not: 'PUBLISHED' }
    }
  }

  return where
}

/**
 * Build Prisma orderBy from blog post sort parameters
 */
export function buildBlogOrderBy(sort?: BlogPostSort): Prisma.BlogPostOrderByWithRelationInput {
  if (!sort) {
    return { publishedAt: 'desc' }
  }

  const direction = sort.order === 'asc' ? 'asc' : 'desc'

  switch (sort.field) {
    case 'title':
      return { title: direction }
    case 'createdAt':
      return { createdAt: direction }
    case 'updatedAt':
      return { updatedAt: direction }
    case 'publishedAt':
      return { publishedAt: direction }
    case 'viewCount':
      return { viewCount: direction }
    case 'likeCount':
      return { likeCount: direction }
    default:
      return { publishedAt: 'desc' }
  }
}

// ============================================================================
// DATA TRANSFORMERS
// ============================================================================

/**
 * Transform a Prisma BlogPost (with relations) to BlogPostData for API responses
 * Centralizes the transformation logic used across blog API routes
 */
export function transformToBlogPostData(post: BlogPostWithRelations): BlogPostData {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? undefined,
    content: post.content,
    contentType: post.contentType,
    status: post.status,

    // SEO fields
    metaTitle: post.metaTitle ?? undefined,
    metaDescription: post.metaDescription ?? undefined,
    keywords: post.keywords,
    canonicalUrl: post.canonicalUrl ?? undefined,

    // Content metadata
    featuredImage: post.featuredImage ?? undefined,
    featuredImageAlt: post.featuredImageAlt ?? undefined,
    readingTime: post.readingTime ?? undefined,
    wordCount: post.wordCount ?? undefined,

    // Publishing
    publishedAt: post.publishedAt?.toISOString(),
    scheduledAt: post.scheduledAt?.toISOString(),

    // Timestamps
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),

    // Relationships
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

    // Analytics
    viewCount: post.viewCount,
    likeCount: post.likeCount,
    shareCount: post.shareCount,
    commentCount: post.commentCount,
  }
}
