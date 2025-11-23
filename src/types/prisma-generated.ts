/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/no-explicit-any */

/**
 * Manually generated Prisma type definitions
 * This file serves as a fallback when Prisma client cannot be generated
 * (e.g., when DATABASE_URL is not available in the environment)
 *
 * These types mirror the schema defined in prisma/schema.prisma
 *
 * Note: This file uses namespace syntax to maintain compatibility with code
 * that imports from @prisma/client. The any type is used for complex query input
 * types that would otherwise require extensive generic parameter definitions.
 */

// ===== ENUMS =====

export enum PostStatus {
  DRAFT = 'DRAFT',
  REVIEW = 'REVIEW',
  SCHEDULED = 'SCHEDULED',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED',
}

export enum ContentType {
  MARKDOWN = 'MARKDOWN',
  HTML = 'HTML',
  RICH_TEXT = 'RICH_TEXT',
}

export enum RelationType {
  RELATED = 'RELATED',
  SEQUEL = 'SEQUEL',
  PREQUEL = 'PREQUEL',
  UPDATE = 'UPDATE',
  REFERENCE = 'REFERENCE',
}

export enum ChangeType {
  MAJOR = 'MAJOR',
  MINOR = 'MINOR',
  PATCH = 'PATCH',
  CONTENT = 'CONTENT',
  SEO = 'SEO',
  STRUCTURE = 'STRUCTURE',
}

export enum InteractionType {
  LIKE = 'LIKE',
  SHARE = 'SHARE',
  COMMENT = 'COMMENT',
  BOOKMARK = 'BOOKMARK',
  SUBSCRIBE = 'SUBSCRIBE',
  DOWNLOAD = 'DOWNLOAD',
}

export enum SEOEventType {
  TITLE_CHANGE = 'TITLE_CHANGE',
  META_DESCRIPTION_CHANGE = 'META_DESCRIPTION_CHANGE',
  KEYWORD_UPDATE = 'KEYWORD_UPDATE',
  CONTENT_ANALYSIS = 'CONTENT_ANALYSIS',
  PERFORMANCE_ALERT = 'PERFORMANCE_ALERT',
  RANKING_CHANGE = 'RANKING_CHANGE',
  TECHNICAL_ISSUE = 'TECHNICAL_ISSUE',
  OPPORTUNITY = 'OPPORTUNITY',
}

export enum SEOSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
  INFO = 'INFO',
}

export enum ChangeFrequency {
  ALWAYS = 'ALWAYS',
  HOURLY = 'HOURLY',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
  NEVER = 'NEVER',
}

// ===== MODEL TYPES =====

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  contentType: ContentType
  status: PostStatus

  // SEO Fields
  metaTitle: string | null
  metaDescription: string | null
  keywords: string[]
  canonicalUrl: string | null

  // Social Media
  ogTitle: string | null
  ogDescription: string | null
  ogImage: string | null
  twitterTitle: string | null
  twitterDescription: string | null
  twitterImage: string | null

  // Content Structure
  featuredImage: string | null
  featuredImageAlt: string | null
  readingTime: number | null
  wordCount: number | null

  // Publishing
  publishedAt: Date | null
  scheduledAt: Date | null
  archivedAt: Date | null

  // Timestamps
  createdAt: Date
  updatedAt: Date

  // Author relationship
  authorId: string

  // Category and tags
  categoryId: string | null

  // Version control
  currentVersion: number

  // Analytics & Engagement
  viewCount: number
  likeCount: number
  shareCount: number
  commentCount: number

  // SEO Analytics
  seoScore: number | null
  seoAnalysis: unknown | null
  lastSeoCheck: Date | null
}

export interface Author {
  id: string
  name: string
  email: string
  slug: string
  bio: string | null
  avatar: string | null
  website: string | null
  twitter: string | null
  linkedin: string | null
  github: string | null

  // SEO
  metaDescription: string | null

  // Analytics
  totalViews: number
  totalPosts: number

  // Timestamps
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  color: string | null
  icon: string | null

  // SEO
  metaTitle: string | null
  metaDescription: string | null
  keywords: string[]

  // Hierarchy
  parentId: string | null

  // Analytics
  postCount: number
  totalViews: number

  // Timestamps
  createdAt: Date
  updatedAt: Date
}

export interface Tag {
  id: string
  name: string
  slug: string
  description: string | null
  color: string | null

  // SEO
  metaDescription: string | null

  // Analytics
  postCount: number
  totalViews: number

  // Timestamps
  createdAt: Date
  updatedAt: Date
}

export interface PostTag {
  postId: string
  tagId: string
  createdAt: Date
}

export interface PostRelation {
  id: string
  originalPostId: string
  relatedPostId: string
  relationType: RelationType
  createdAt: Date
}

export interface PostVersion {
  id: string
  postId: string
  version: number
  title: string
  content: string
  excerpt: string | null

  // Change tracking
  changeType: ChangeType
  changeNotes: string | null

  // Author of this version
  authorId: string

  // Timestamps
  createdAt: Date
}

export interface PostSeries {
  id: string
  name: string
  slug: string
  description: string | null

  // SEO
  metaTitle: string | null
  metaDescription: string | null

  // Display
  coverImage: string | null
  color: string | null

  // Analytics
  totalPosts: number
  totalViews: number

  // Timestamps
  createdAt: Date
  updatedAt: Date
}

export interface SeriesPost {
  seriesId: string
  postId: string
  order: number
  createdAt: Date
}

export interface PostView {
  id: string
  postId: string

  // Visitor tracking (anonymized)
  visitorId: string | null
  sessionId: string | null

  // Request details
  ipAddress: string | null
  userAgent: string | null
  referer: string | null

  // Location (optional, anonymized)
  country: string | null
  region: string | null
  city: string | null

  // Engagement metrics
  readingTime: number | null
  scrollDepth: number | null

  // Timestamps
  viewedAt: Date
}

export interface PostInteraction {
  id: string
  postId: string
  type: InteractionType

  // Visitor tracking (anonymized)
  visitorId: string | null
  sessionId: string | null

  // Interaction details
  value: string | null
  metadata: unknown | null

  // Timestamps
  createdAt: Date
}

export interface SEOEvent {
  id: string
  postId: string | null
  type: SEOEventType

  // Event details
  title: string
  description: string | null
  severity: SEOSeverity

  // Data
  oldValue: string | null
  newValue: string | null
  recommendations: string | null

  // Processing
  processed: boolean
  processedAt: Date | null

  // Timestamps
  createdAt: Date
}

export interface SEOKeyword {
  id: string
  keyword: string
  postId: string | null

  // Tracking data
  position: number | null
  searchVolume: number | null
  difficulty: number | null
  cpc: number | null

  // Performance
  clicks: number
  impressions: number
  ctr: number | null

  // Timestamps
  createdAt: Date
  updatedAt: Date
  lastChecked: Date | null
}

export interface SitemapEntry {
  id: string
  url: string
  lastMod: Date
  changeFreq: ChangeFrequency
  priority: number

  // Content association
  postId: string | null

  // Status
  included: boolean

  // Timestamps
  createdAt: Date
  updatedAt: Date
}

// ===== NAMESPACE FOR PRISMA TYPE EXPORTS =====
// This allows code that imports from @prisma/client to still work
export namespace Prisma {
   
  export type BlogPostWhereInput = any
   
  export type BlogPostOrderByWithRelationInput = any
   
  export type PostViewWhereInput = any
  export type InputJsonValue = unknown
   
  export type TransactionClient = any

  export class PrismaClientKnownRequestError extends Error {
    code: string
    clientVersion: string

    constructor(message: string, code: string, clientVersion: string) {
      super(message)
      this.name = 'PrismaClientKnownRequestError'
      this.code = code
      this.clientVersion = clientVersion
    }
  }

  export class PrismaClientUnknownRequestError extends Error {
    clientVersion: string

    constructor(message: string, clientVersion: string) {
      super(message)
      this.name = 'PrismaClientUnknownRequestError'
      this.clientVersion = clientVersion
    }
  }

  export class PrismaClientValidationError extends Error {
    constructor(message: string) {
      super(message)
      this.name = 'PrismaClientValidationError'
    }
  }
}
