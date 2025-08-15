/**
 * Shared types and schemas for Hono RPC API
 * Provides type-safe validation and serialization for all RPC endpoints
 */

import { z } from 'zod'

// =======================
// BASE RPC TYPES
// =======================

export interface RPCContext {
  userId?: string
  sessionId: string
  ipAddress: string
  userAgent: string
  timestamp: Date
}

export interface RPCResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
  meta?: {
    timestamp: string
    requestId: string
    version: string
  }
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// =======================
// CONTACT FORM SCHEMAS
// =======================

export const ContactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Valid email is required'),
  subject: z.string().min(1, 'Subject is required').max(200).optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
  company: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  honeypot: z.string().optional(), // Bot detection
})

export const ContactResponseSchema = z.object({
  id: z.string(),
  status: z.enum(['sent', 'failed', 'pending']),
  timestamp: z.string(),
  createdAt: z.string(),
})

export type ContactFormInput = z.infer<typeof ContactFormSchema>
export type ContactResponse = z.infer<typeof ContactResponseSchema>

// =======================
// PROJECT SCHEMAS
// =======================

export const ProjectSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.enum(['analytics', 'dashboard', 'visualization', 'automation', 'integration']),
  technologies: z.array(z.string()),
  imageUrl: z.string().url().optional(),
  demoUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  featured: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  viewCount: z.number().optional(),
  likeCount: z.number().optional(),
  analytics: z.object({
    revenue: z.number().optional(),
    users: z.number().optional(),
    growth: z.number().optional(),
  }).optional(),
})

export const ProjectFiltersSchema = z.object({
  category: z.string().optional(),
  technology: z.string().optional(),
  featured: z.boolean().optional(),
  search: z.string().optional(),
})

export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
})

export type Project = z.infer<typeof ProjectSchema>
export type ProjectFilters = z.infer<typeof ProjectFiltersSchema>
export type Pagination = z.infer<typeof PaginationSchema>

// =======================
// BLOG SCHEMAS
// =======================

export const BlogPostSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1),
  contentType: z.enum(['MARKDOWN', 'HTML', 'RICH_TEXT']).default('MARKDOWN'),
  status: z.enum(['DRAFT', 'REVIEW', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED', 'DELETED']).default('DRAFT'),
  
  // SEO fields
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
  keywords: z.array(z.string()),
  canonicalUrl: z.string().url().optional(),
  
  // Content metadata
  featuredImage: z.string().url().optional(),
  featuredImageAlt: z.string().optional(),
  readingTime: z.number().optional(),
  wordCount: z.number().optional(),
  
  // Publishing
  publishedAt: z.string().optional(),
  scheduledAt: z.string().optional(),
  
  // Timestamps
  createdAt: z.string(),
  updatedAt: z.string(),
  
  // Relationships
  authorId: z.string(),
  categoryId: z.string().optional(),
  
  // Analytics
  viewCount: z.number().default(0),
  likeCount: z.number().default(0),
  shareCount: z.number().default(0),
  commentCount: z.number().default(0),
})

export const BlogPostCreateSchema = BlogPostSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true,
  likeCount: true,
  shareCount: true,
  commentCount: true,
})

export const BlogPostUpdateSchema = BlogPostCreateSchema.partial()

export const BlogPostFiltersSchema = z.object({
  status: z.string().or(z.array(z.string())).optional(),
  authorId: z.string().optional(),
  categoryId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
  search: z.string().optional(),
  dateRange: z.object({
    from: z.string(),
    to: z.string(),
  }).optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
})

export const BlogCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
  postCount: z.number(),
  totalViews: z.number(),
  createdAt: z.string(),
})

export const BlogTagSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  color: z.string().optional(),
  postCount: z.number(),
  totalViews: z.number(),
  createdAt: z.string(),
})

export type BlogPost = z.infer<typeof BlogPostSchema>
export type BlogPostCreate = z.infer<typeof BlogPostCreateSchema>
export type BlogPostUpdate = z.infer<typeof BlogPostUpdateSchema>
export type BlogPostFilters = z.infer<typeof BlogPostFiltersSchema>
export type BlogCategory = z.infer<typeof BlogCategorySchema>
export type BlogTag = z.infer<typeof BlogTagSchema>

// =======================
// ANALYTICS SCHEMAS
// =======================

export const WebVitalSchema = z.object({
  name: z.enum(['FCP', 'LCP', 'CLS', 'FID', 'TTFB']),
  value: z.number(),
  rating: z.enum(['good', 'needs-improvement', 'poor']),
})

export const PageViewSchema = z.object({
  page: z.string(),
  views: z.number(),
  uniqueViews: z.number(),
})

export const AnalyticsDataSchema = z.object({
  pageViews: z.number(),
  visitors: z.number(),
  bounceRate: z.number(),
  avgSessionDuration: z.number(),
  topPages: z.array(PageViewSchema),
  vitals: z.array(WebVitalSchema),
})

export const WebVitalReportSchema = z.object({
  name: z.enum(['FCP', 'LCP', 'CLS', 'FID', 'TTFB']),
  value: z.number(),
  id: z.string(),
  url: z.string(),
  timestamp: z.number(),
})

export type WebVital = z.infer<typeof WebVitalSchema>
export type PageView = z.infer<typeof PageViewSchema>
export type AnalyticsData = z.infer<typeof AnalyticsDataSchema>
export type WebVitalReport = z.infer<typeof WebVitalReportSchema>

// =======================
// AUTH SCHEMAS
// =======================

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const RegisterSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
})

export const AuthUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.enum(['user', 'admin']).default('user'),
  createdAt: z.string(),
})

export type LoginInput = z.infer<typeof LoginSchema>
export type RegisterInput = z.infer<typeof RegisterSchema>
export type AuthUser = z.infer<typeof AuthUserSchema>

// =======================
// FILE UPLOAD SCHEMAS
// =======================

export const FileUploadSchema = z.object({
  fieldName: z.string(),
  originalName: z.string(),
  encoding: z.string(),
  mimeType: z.string(),
  size: z.number(),
  buffer: z.instanceof(Buffer).or(z.any()), // Allow any for browser compatibility
})

export const UploadedFileSchema = z.object({
  id: z.string(),
  url: z.string(),
  filename: z.string(),
  mimeType: z.string(),
  size: z.number(),
  uploadedAt: z.string(),
})

export type FileUpload = z.infer<typeof FileUploadSchema>
export type UploadedFile = z.infer<typeof UploadedFileSchema>

// =======================
// HEALTH CHECK SCHEMAS
// =======================

export const HealthCheckSchema = z.object({
  status: z.enum(['healthy', 'degraded', 'unhealthy']),
  timestamp: z.string(),
  uptime: z.number(),
  version: z.string(),
  services: z.record(z.string(), z.object({
    status: z.enum(['up', 'down']),
    latency: z.number().optional(),
    error: z.string().optional(),
  })),
})

export type HealthCheck = z.infer<typeof HealthCheckSchema>

// =======================
// ERROR SCHEMAS
// =======================

export const RPCErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.string(), z.unknown()).optional(),
  stack: z.string().optional(),
})

export type RPCError = z.infer<typeof RPCErrorSchema>

// =======================
// UTILITY TYPES
// =======================

export interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationMeta
}

export type RPCHandler<TInput = unknown, TOutput = unknown> = (
  input: TInput,
  context: RPCContext
) => Promise<TOutput>