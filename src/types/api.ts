/**
 * API Types - Centralized for type-safe communication
 * Consolidated from src/lib/api/utils.ts and src/types/api.ts
 */

import type { STARData } from './project'

// ============================================================================
// REQUEST/RESPONSE CORE TYPES
// ============================================================================

// Request metadata type
export interface RequestMetadata {
  userAgent?: string
  ip?: string
  path?: string
  timestamp?: number
}

// API Error Types for consistent error handling
export enum ApiErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  AUTH_ERROR = 'AUTH_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

// Standardized API Error Response (used by api-core.ts)
export interface ApiErrorResponse {
  success: false
  error: string
  code?: string
  details?: Record<string, unknown>
  timestamp: string
}

// Standardized API Success Response (used by api-core.ts)
export interface ApiSuccessResponse<T = unknown> {
  success: true
  data: T
  message?: string
  timestamp: string
}

// Union type for all API responses
export type ApiResult<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse

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

export interface PaginationParams {
  page: number
  limit: number
  offset?: number
}

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
// HTTP TYPES
// ============================================================================

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export interface RequestConfig {
  method: HttpMethod
  headers?: Record<string, string>
  body?: unknown
  cache?: RequestCache
  timeout?: number
}

export interface ApiClientConfig {
  baseUrl: string
  timeout: number
  retries: number
  headers: Record<string, string>
}

// ============================================================================
// PROJECT TYPES
// ============================================================================

export interface ProjectData {
  id: string
  title: string
  slug: string
  description: string
  longDescription?: string
  content?: string
  category: string
  tags: string[]
  image: string
  link?: string
  github?: string
  featured: boolean
  viewCount: number
  clickCount: number
  createdAt: string
  updatedAt: string
  client?: string
  role?: string
  metrics?: Record<string, string>
  starData?: STARData
  details?: {
    challenge: string
    solution: string
    impact: string
  }
  charts?: Array<{
    type: 'line' | 'bar' | 'pie' | 'funnel' | 'heatmap'
    title: string
    dataKey: string
  }>
}

export type ProjectCategory =
  | 'analytics'
  | 'dashboard'
  | 'visualization'
  | 'automation'
  | 'integration'

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export interface AnalyticsData {
  pageViews: number
  visitors: number
  bounceRate: number
  avgSessionDuration: number
  topPages: PageView[]
  vitals: WebVital[]
}

export interface PageView {
  page: string
  views: number
  uniqueViews: number
}

export interface WebVital {
  name: 'FCP' | 'LCP' | 'CLS' | 'FID' | 'TTFB' | 'INP'
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
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

export interface ContactResponse {
  id: string
  status: 'sent' | 'failed' | 'pending'
  timestamp: string
  createdAt: string
}

// ============================================================================
// NEWSLETTER TYPES
// ============================================================================

export interface NewsletterSubscriptionData {
  email: string
  name?: string
}

// ============================================================================
// SEARCH TYPES
// ============================================================================

export interface SearchResultItem {
  id: string
  title: string
  description?: string
  url: string
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
  contentType: 'MARKDOWN' | 'HTML' | 'RICH_TEXT'
  status: 'DRAFT' | 'REVIEW' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED' | 'DELETED'
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

export interface BlogAuthorData {
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

export interface BlogPostSummary {
  id: string
  title: string
  slug: string
  excerpt?: string
  featuredImage?: string
  featuredImageAlt?: string
  publishedAt?: string
  viewCount: number
  commentCount: number
  readingTime?: number
  author: BlogAuthorData
  category?: BlogCategoryData
  tags: BlogTagData[]
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

// ============================================================================
// RESUME TYPES
// ============================================================================

export interface ResumeDownloadData {
  url: string
  filename: string
  size: number
  generatedAt: string
}

// ============================================================================
// API ENDPOINTS INTERFACE
// ============================================================================

export interface ApiEndpoints {
  projects: {
    getAll: () => Promise<ApiResponse<ProjectData[]>>
    getById: (id: string) => Promise<ApiResponse<ProjectData>>
  }
  analytics: {
    getVitals: () => Promise<ApiResponse<AnalyticsData>>
  }
  contact: {
    send: (data: ContactFormData) => Promise<ApiResponse<ContactResponse>>
  }
  resume: {
    generate: () => Promise<ApiResponse<ResumeDownloadData>>
  }
  blog: {
    getPosts: (params?: {
      filters?: BlogPostFilters
      sort?: BlogPostSort
      page?: number
      limit?: number
    }) => Promise<PaginatedResponse<BlogPostData>>
    getPost: (slug: string) => Promise<ApiResponse<BlogPostData>>
    createPost: (data: Partial<BlogPostData>) => Promise<ApiResponse<BlogPostData>>
    updatePost: (id: string, data: Partial<BlogPostData>) => Promise<ApiResponse<BlogPostData>>
    deletePost: (id: string) => Promise<ApiResponse<{ success: boolean }>>
    getCategories: () => Promise<ApiResponse<BlogCategoryData[]>>
    getTags: () => Promise<ApiResponse<BlogTagData[]>>
    getAnalytics: () => Promise<ApiResponse<BlogAnalyticsData>>
    getRSSFeed: () => Promise<ApiResponse<RSSFeedData>>
  }
}
