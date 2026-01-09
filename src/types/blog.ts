/**
 * Blog types - Unique types not provided by Prisma
 * For model types, import directly from @/prisma/client
 */

import type { BlogPost, Author, Category, Tag, PostTag, PostSeries, SeriesPost } from '@/prisma/client'
import { Prisma } from '@/prisma/client'

// Re-export Prisma types for convenience
export type { BlogPost, Author, Category, Tag, PostTag, PostSeries, SeriesPost }

// ============================================================================
// UTILITY TYPES - Prisma-based combinations
// ============================================================================

export type BlogPostWithRelations = Prisma.BlogPostGetPayload<{
  include: {
    author: true
    category: true
    tags: { include: { tag: true } }
    series: { include: { series: true } }
  }
}>

export type CategoryWithPosts = Prisma.CategoryGetPayload<{
  include: {
    posts: true
    children: true
  }
}>

export type TagWithPosts = Prisma.TagGetPayload<{
  include: {
    posts: { include: { post: true } }
  }
}>

export type AuthorWithPosts = Prisma.AuthorGetPayload<{
  include: {
    posts: true
  }
}>

export type SeriesWithPosts = Prisma.PostSeriesGetPayload<{
  include: {
    posts: { include: { post: true } }
  }
}>

// ============================================================================
// API/UI TYPES - Not in Prisma schema
// ============================================================================

export interface BlogFilters {
  category?: string
  tags?: string[]
  author?: string
  search?: string
  dateFrom?: Date
  dateTo?: Date
  sortBy?: 'publishedAt' | 'title' | 'viewCount' | 'commentCount'
  sortOrder?: 'asc' | 'desc'
}

export interface BlogListResponse {
  posts: BlogPost[]
  totalCount: number
  hasMore: boolean
}

export interface BlogPostCardProps {
  post: BlogPost
  variant?: 'default' | 'compact' | 'featured'
  showCategory?: boolean
  showTags?: boolean
  showReadingTime?: boolean
  showViewCount?: boolean
  showCommentCount?: boolean
  showAuthor?: boolean
  className?: string
  onClick?: (post: BlogPost) => void
}

// ============================================================================
// SEO TYPES - Complex nested types not in schema
// ============================================================================

export interface SEOAnalysis {
  score: number
  issues: SEOIssue[]
  opportunities: SEOOpportunity[]
  technicalChecks: TechnicalCheck[]
  contentAnalysis: ContentAnalysis
  keywordAnalysis: KeywordAnalysis
}

export interface SEOIssue {
  type: 'error' | 'warning' | 'info'
  category: string
  message: string
  description?: string
  fix?: string
  impact: 'high' | 'medium' | 'low'
}

export interface SEOOpportunity {
  type: string
  message: string
  description?: string
  action: string
  potential: 'high' | 'medium' | 'low'
}

export interface TechnicalCheck {
  name: string
  status: 'pass' | 'fail' | 'warning'
  message?: string
  details?: Record<string, unknown>
}

export interface ContentAnalysis {
  wordCount: number
  readingTime: number
  readabilityScore?: number
  sentimentScore?: number
  keywordDensity: Record<string, number>
  headingStructure: HeadingAnalysis[]
  internalLinks: number
  externalLinks: number
  images: number
  imageAltTexts: number
}

export interface HeadingAnalysis {
  level: number
  text: string
  wordCount: number
}

export interface KeywordAnalysis {
  primary?: string
  secondary: string[]
  density: Record<string, number>
  prominence: Record<string, number>
  suggestions: string[]
}

// ============================================================================
// TYPE GUARDS - Runtime validation
// ============================================================================

export function isBlogPost(value: unknown): value is BlogPost {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'title' in value &&
    'content' in value &&
    'status' in value &&
    typeof (value as BlogPost).id === 'string' &&
    typeof (value as BlogPost).title === 'string' &&
    typeof (value as BlogPost).content === 'string'
  )
}

export function isAuthor(value: unknown): value is Author {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'email' in value &&
    'slug' in value &&
    typeof (value as Author).id === 'string' &&
    typeof (value as Author).name === 'string' &&
    typeof (value as Author).email === 'string' &&
    typeof (value as Author).slug === 'string'
  )
}

export function isCategory(value: unknown): value is Category {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'slug' in value &&
    typeof (value as Category).id === 'string' &&
    typeof (value as Category).name === 'string' &&
    typeof (value as Category).slug === 'string'
  )
}

export function isTag(value: unknown): value is Tag {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'slug' in value &&
    typeof (value as Tag).id === 'string' &&
    typeof (value as Tag).name === 'string' &&
    typeof (value as Tag).slug === 'string'
  )
}

// ============================================================================
// TYPE ALIASES - Backward compatibility
// ============================================================================

export type BlogCategory = Category
export type BlogTag = Tag
export type BlogAuthor = Author

// ============================================================================
// COMMENT TYPES - Not in Prisma schema
// ============================================================================

export interface BlogComment {
  id: string
  content: string
  postId: string
  authorName: string
  authorEmail: string
  authorWebsite?: string
  approved: boolean
  parentId?: string
  createdAt: Date
  updatedAt: Date
  replies?: BlogComment[]
}
