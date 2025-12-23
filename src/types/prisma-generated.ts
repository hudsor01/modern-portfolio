/**
 * Manually generated Prisma type definitions
 * This file serves as a fallback when Prisma client cannot be generated
 * (e.g., when DATABASE_URL is not available in the environment)
 *
 * These types mirror the schema defined in prisma/schema.prisma
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

export enum SubmissionStatus {
  NEW = 'NEW',
  READ = 'READ',
  IN_PROGRESS = 'IN_PROGRESS',
  RESPONDED = 'RESPONDED',
  ARCHIVED = 'ARCHIVED',
  SPAM = 'SPAM',
}

export enum SecurityEventType {
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  CSRF_VALIDATION_FAILED = 'CSRF_VALIDATION_FAILED',
  INVALID_INPUT = 'INVALID_INPUT',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  BOT_DETECTED = 'BOT_DETECTED',
  BRUTE_FORCE_ATTEMPT = 'BRUTE_FORCE_ATTEMPT',
  BLOCKED_REQUEST = 'BLOCKED_REQUEST',
  AUTH_FAILURE = 'AUTH_FAILURE',
  SQL_INJECTION_ATTEMPT = 'SQL_INJECTION_ATTEMPT',
  XSS_ATTEMPT = 'XSS_ATTEMPT',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
}

export enum SecuritySeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

// ===== UTILITY TYPES =====

/** JSON value type for Prisma */
export type InputJsonValue = string | number | boolean | null | { [key: string]: InputJsonValue } | InputJsonValue[]

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
  seoAnalysis: InputJsonValue | null
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
  metadata: InputJsonValue | null

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

export interface Project {
  id: string
  slug: string
  title: string
  description: string
  image: string
  link: string | null
  github: string | null
  category: string
  tags: string[]
  featured: boolean

  // Analytics
  viewCount: number
  clickCount: number

  // Timestamps
  createdAt: Date
  updatedAt: Date
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  subject: string
  message: string
  company: string | null
  phone: string | null
  timeline: string | null
  budget: string | null

  // Metadata
  status: SubmissionStatus
  responded: boolean
  respondedAt: Date | null
  notes: string | null

  // Security & Analytics
  ipAddress: string | null
  userAgent: string | null
  referer: string | null

  // Email tracking
  emailSent: boolean
  emailId: string | null
  emailError: string | null

  // Timestamps
  createdAt: Date
  updatedAt: Date
}

export interface SecurityEvent {
  id: string
  type: SecurityEventType
  severity: SecuritySeverity

  // Event details
  message: string
  details: InputJsonValue | null

  // Context
  ipAddress: string | null
  userAgent: string | null
  path: string | null
  method: string | null

  // User identification
  clientId: string | null
  sessionId: string | null

  // Processing
  acknowledged: boolean
  acknowledgedAt: Date | null
  acknowledgedBy: string | null

  // Timestamps
  createdAt: Date
}

// ===== PRISMA QUERY INPUT TYPES =====

/** Filter conditions for BlogPost queries */
export interface BlogPostWhereInput {
  id?: string | { in?: string[]; notIn?: string[] }
  status?: PostStatus | { in?: PostStatus[] }
  authorId?: string
  categoryId?: string | null
  title?: string | { contains?: string; mode?: 'insensitive' | 'default' }
  excerpt?: string | { contains?: string; mode?: 'insensitive' | 'default' } | null
  content?: string | { contains?: string; mode?: 'insensitive' | 'default' }
  publishedAt?: Date | { gte?: Date; lte?: Date } | null
  tags?: { some?: { tagId?: { in?: string[] } } }
  OR?: BlogPostWhereInput[]
  AND?: BlogPostWhereInput[]
  NOT?: BlogPostWhereInput | BlogPostWhereInput[]
}

/** Sort direction type */
type SortOrder = 'asc' | 'desc'

/** Order by options for BlogPost queries */
export interface BlogPostOrderByWithRelationInput {
  id?: SortOrder
  title?: SortOrder
  createdAt?: SortOrder
  updatedAt?: SortOrder
  publishedAt?: SortOrder
  viewCount?: SortOrder
  likeCount?: SortOrder
}

/** Filter conditions for PostView queries */
export interface PostViewWhereInput {
  id?: string | { in?: string[] }
  postId?: string
  visitorId?: string | null
  sessionId?: string | null
  viewedAt?: Date | { gte?: Date; lte?: Date }
}

// ===== PRISMA ARGUMENT TYPES =====

/** Arguments for BlogPost.findMany */
export interface BlogPostFindManyArgs {
  where?: BlogPostWhereInput
  orderBy?: BlogPostOrderByWithRelationInput | BlogPostOrderByWithRelationInput[]
  skip?: number
  take?: number
  include?: { author?: boolean; category?: boolean; tags?: boolean | { include?: { tag?: boolean } } }
  select?: Partial<Record<keyof BlogPost, boolean>>
}

/** Arguments for BlogPost.findUnique */
export interface BlogPostFindUniqueArgs {
  where: { id?: string; slug?: string }
  include?: { author?: boolean; category?: boolean; tags?: boolean | { include?: { tag?: boolean } } }
  select?: Partial<Record<keyof BlogPost, boolean>>
}

/** Arguments for BlogPost.create */
export interface BlogPostCreateArgs {
  data: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
  include?: { author?: boolean; category?: boolean; tags?: boolean }
}

/** Arguments for BlogPost.update */
export interface BlogPostUpdateArgs {
  where: { id?: string; slug?: string }
  data: Partial<Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>>
  include?: { author?: boolean; category?: boolean; tags?: boolean }
}

/** Arguments for BlogPost.delete */
export interface BlogPostDeleteArgs {
  where: { id?: string; slug?: string }
}

/** Filter conditions for Tag queries */
export interface TagWhereInput {
  id?: string | { in?: string[] }
  name?: string | { contains?: string; mode?: 'insensitive' | 'default' }
  slug?: string
}

/** Arguments for Tag.upsert */
export interface TagUpsertArgs {
  where: { id?: string; slug?: string; name?: string }
  create: Omit<Tag, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
  update: Partial<Omit<Tag, 'id' | 'createdAt' | 'updatedAt'>>
}

/** Arguments for Tag.findMany */
export interface TagFindManyArgs {
  where?: TagWhereInput
  orderBy?: { name?: SortOrder; postCount?: SortOrder }
  skip?: number
  take?: number
}

/** Filter conditions for Category queries */
export interface CategoryWhereInput {
  id?: string | { in?: string[] }
  name?: string | { contains?: string; mode?: 'insensitive' | 'default' }
  slug?: string
  parentId?: string | null
}

/** Arguments for Category.findMany */
export interface CategoryFindManyArgs {
  where?: CategoryWhereInput
  orderBy?: { name?: SortOrder; postCount?: SortOrder }
  skip?: number
  take?: number
  include?: { parent?: boolean; children?: boolean }
}

/** Transaction client interface */
export interface TransactionClient {
  blogPost: {
    findMany: (args?: BlogPostFindManyArgs) => Promise<BlogPost[]>
    findUnique: (args: BlogPostFindUniqueArgs) => Promise<BlogPost | null>
    create: (args: BlogPostCreateArgs) => Promise<BlogPost>
    update: (args: BlogPostUpdateArgs) => Promise<BlogPost>
    delete: (args: BlogPostDeleteArgs) => Promise<BlogPost>
  }
  tag: {
    upsert: (args: TagUpsertArgs) => Promise<Tag>
    findMany: (args?: TagFindManyArgs) => Promise<Tag[]>
  }
  category: {
    findMany: (args?: CategoryFindManyArgs) => Promise<Category[]>
  }
}

// ===== PRISMA ERROR CLASSES =====

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

// ===== NAMESPACE FOR BACKWARDS COMPATIBILITY =====
// Allows code that imports Prisma.* types to continue working
export const Prisma = {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
}

// Re-export types under Prisma namespace for compatibility
export type {
  BlogPostWhereInput as PrismaBlogPostWhereInput,
  BlogPostOrderByWithRelationInput as PrismaBlogPostOrderByWithRelationInput,
  PostViewWhereInput as PrismaPostViewWhereInput,
  TransactionClient as PrismaTransactionClient,
}
