/**
 * API Types - Centralized for type-safe communication
 */

import type { PostStatus, ContentType } from '@/db/schema'

// ============================================================================
// REQUEST/RESPONSE CORE TYPES
// ============================================================================

// Base API Response wrapper (used in API routes)
export interface ApiResponse<T = unknown> {
  data: T
  success: boolean
  message?: string
  error?: string
}

// ============================================================================
// PAGINATION TYPES
// ============================================================================

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// ============================================================================
// CONTACT TYPES
// ============================================================================

export interface ContactFormData {
  name: string
  email: string
  subject?: string
  message: string
  company?: string
  phone?: string
  honeypot?: string
}

// ============================================================================
// BLOG TYPES
// ============================================================================

export interface BlogPostData {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  contentType: ContentType
  status: PostStatus
  metaTitle?: string
  metaDescription?: string
  keywords: string[]
  canonicalUrl?: string
  featuredImage?: string
  featuredImageAlt?: string
  readingTime?: number
  wordCount?: number
  publishedAt?: string
  scheduledAt?: string
  createdAt: string
  updatedAt: string
  authorId: string
  author?: BlogAuthorData
  categoryId?: string
  category?: BlogCategoryData
  tags?: BlogTagData[]
  previousPost?: { id: string; title: string; slug: string }
  nextPost?: { id: string; title: string; slug: string }
  relatedPosts?: Array<{
    id: string
    title: string
    slug: string
    excerpt?: string
    featuredImage?: string
  }>
  viewCount: number
  likeCount: number
  shareCount: number
  commentCount: number
}

interface BlogAuthorData {
  id: string
  name: string
  email: string
  slug: string
  bio?: string
  avatar?: string
  website?: string
  totalPosts: number
  totalViews: number
  createdAt: string
}

export interface BlogCategoryData {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
  icon?: string
  postCount: number
  totalViews: number
  createdAt: string
  keywords?: string[]
  updatedAt?: string
}

export interface BlogTagData {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
  postCount: number
  totalViews: number
  createdAt: string
  updatedAt?: string
}

export interface BlogPostFilters {
  status?: string | string[]
  authorId?: string
  categoryId?: string
  tagIds?: string[]
  search?: string
  dateRange?: {
    from: string
    to: string
  }
  published?: boolean
}

export interface BlogPostSort {
  field: 'title' | 'createdAt' | 'updatedAt' | 'publishedAt' | 'viewCount' | 'likeCount'
  order: 'asc' | 'desc'
}

export interface BlogAnalyticsData {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalViews: number
  totalInteractions: number
  avgReadingTime: number
  topPosts: BlogPostData[]
  topCategories: BlogCategoryData[]
  topTags: BlogTagData[]
  monthlyViews: Array<{ month: string; views: number }>
  popularKeywords: Array<{ keyword: string; count: number }>
}

export interface RSSFeedData {
  title: string
  description: string
  link: string
  lastBuildDate: string
  language: string
  posts: Array<{
    title: string
    link: string
    description: string
    pubDate: string
    author: string
    category?: string
    guid: string
  }>
}
