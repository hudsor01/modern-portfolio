/**
 * Database Types - Centralized
 * Consolidated from src/lib/database/production-utils.ts and other db-related files
 */

export interface DatabaseHealth {
  status: 'healthy' | 'degraded' | 'unhealthy'
  latency?: number
  error?: string
  timestamp: string
}

export interface ConnectionPoolStats {
  size: number
  available: number
  pending: number
  idle: number
}

export interface QueryPerformanceMetrics {
  operation: string
  duration: number
  timestamp: number
  success: boolean
  error?: string
}

export interface DatabaseConfig {
  provider: 'postgresql' | 'mysql' | 'sqlite' | 'mongodb'
  host: string
  port: number
  database: string
  ssl?: boolean
  poolSize?: number
  connectionTimeout?: number
}

// Blog post types for DAL
export interface BlogPostWithRelations {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  status: string
  authorId: string
  author?: Pick<Author, 'id' | 'name' | 'slug' | 'avatar'>
  categoryId?: string
  category?: BlogCategory
  tags?: BlogTag[]
  publishedAt?: string
  createdAt: string
  updatedAt: string
  viewCount: number
  likeCount: number
}

export interface Author {
  id: string
  name: string
  email: string
  slug: string
  bio?: string
  avatar?: string
  website?: string
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
  icon?: string
}

export interface BlogTag {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
}

// Contact submission types
export interface ContactSubmission {
  id: string
  name: string
  email: string
  company?: string
  phone?: string
  message: string
  status: 'pending' | 'processed' | 'failed'
  createdAt: string
}

// Analytics types
export interface BlogAnalyticsData {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalViews: number
  totalInteractions: number
  avgReadingTime: number
  topPosts: BlogPostWithRelations[]
  topCategories: BlogCategory[]
  topTags: BlogTag[]
  monthlyViews: Array<{ month: string; views: number }>
  popularKeywords: Array<{ keyword: string; count: number }>
}
