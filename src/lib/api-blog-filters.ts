/**
 * Blog query building utilities
 * Centralized query construction for blog posts
 */

import { Prisma } from '@/generated/prisma/client'
import type { BlogPostFilters, BlogPostSort } from '@/types/api'

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
