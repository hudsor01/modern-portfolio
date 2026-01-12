/**
 * Blog types - Unique types not provided by Prisma
 * For model types, import directly from @/generated/prisma/client
 */

import type { BlogPost, Author, Category, Tag, PostTag } from '@/generated/prisma/client'
import { Prisma } from '@/generated/prisma/client'

// Re-export Prisma types for convenience
export type { BlogPost, Author, Category, Tag, PostTag }

// ============================================================================
// UTILITY TYPES - Prisma-based combinations
// ============================================================================

export type BlogPostWithRelations = Prisma.BlogPostGetPayload<{
  include: {
    author: true
    category: true
    tags: { include: { tag: true } }
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

// Helper to check if value is a non-null object with required string fields
function hasStringFields(value: unknown, fields: string[]): boolean {
  if (typeof value !== 'object' || value === null) return false
  const obj = value as Record<string, unknown>
  return fields.every((field) => field in obj && typeof obj[field] === 'string')
}

export function isBlogPost(value: unknown): value is BlogPost {
  return hasStringFields(value, ['id', 'title', 'content']) && 'status' in (value as object)
}

export function isAuthor(value: unknown): value is Author {
  return hasStringFields(value, ['id', 'name', 'email', 'slug'])
}

export function isCategory(value: unknown): value is Category {
  return hasStringFields(value, ['id', 'name', 'slug'])
}

export function isTag(value: unknown): value is Tag {
  return hasStringFields(value, ['id', 'name', 'slug'])
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

// ============================================================================
// INPUT TYPES - Use Prisma-generated types
// ============================================================================

// Re-export Prisma input types
export type BlogPostCreateInput = Prisma.BlogPostCreateInput
export type BlogPostUpdateInput = Prisma.BlogPostUpdateInput

// ============================================================================
// ANALYTICS TYPES - For blog analytics
// ============================================================================

export interface BlogAnalytics {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalViews: number
  totalInteractions: number
  avgReadingTime: number
  topPosts: BlogPost[]
  topCategories: Category[]
  topTags: Tag[]
  recentActivity: unknown[]
  seoSummary: {
    averageScore: number
    totalIssues: number
    criticalIssues: number
    opportunities: number
    lastAnalysis: Date
    topKeywords: string[]
  }
}

// ============================================================================
// SUMMARY TYPES - For API responses
// ============================================================================

export interface BlogPostSummary {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featuredImage: string | null
  publishedAt: string
  viewCount: number
  commentCount: number
  readingTime: number
  author: {
    id: string
    name: string
    email: string
    slug: string
    bio: string | null
    avatar: string | null
    website: string | null
    totalPosts: number
    totalViews: number
    createdAt: string
  }
  category: {
    id: string
    name: string
    slug: string
    description: string | null
    color: string | null
    icon: string | null
    parentId: string | null
    metaTitle: string | null
    metaDescription: string | null
    keywords: string[]
    postCount: number
    totalViews: number
    createdAt: string
    updatedAt: string
  }
  tags: Array<{
    id: string
    name: string
    slug: string
    description: string | null
    color: string | null
    metaDescription: string | null
    postCount: number
    totalViews: number
    createdAt: string
    updatedAt: string
  }>
}

// Alias for backward compatibility
export type BlogPostFilter = BlogFilters
