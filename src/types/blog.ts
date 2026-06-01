/**
 * Blog types — model types come from the Drizzle schema.
 * For row shapes, import directly from `@/db/schema` (or via `@/lib/db`).
 */

import type {
  BlogPost,
  Author,
  Category,
  Tag,
  PostTag,
  NewBlogPost,
  PostStatus,
  ContentType,
} from '@/db/schema'

// Model + enum types come from the Drizzle schema (the single source of truth
// for PostStatus / ContentType values — see src/db/schema.ts pgEnums).
export type { BlogPost, Author, Category, Tag, PostTag, PostStatus, ContentType }

// ============================================================================
// UTILITY TYPES — Drizzle relational shapes
// ============================================================================

// Shape returned by the canonical Drizzle blog query (relational
// findFirst/findMany with `with: { author, category, tags: { with: { tag } } }`).
export type BlogPostWithRelations = BlogPost & {
  author: Author | null
  category: Category | null
  tags: Array<{ tag: Tag }>
}

export type CategoryWithPosts = Category & {
  posts: BlogPost[]
  children: Category[]
}

export type TagWithPosts = Tag & {
  posts: Array<{ post: BlogPost }>
}

export type AuthorWithPosts = Author & {
  posts: BlogPost[]
}

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

// Drizzle insert/update shapes
export type BlogPostCreateInput = NewBlogPost
export type BlogPostUpdateInput = Partial<NewBlogPost>

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

export interface BlogPostSummaryDetailed {
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
