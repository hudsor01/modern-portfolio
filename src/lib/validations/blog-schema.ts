import { z } from 'zod'

// =======================
// ENUM VALIDATION SCHEMAS
// =======================

export const PostStatusSchema = z.enum([
  'DRAFT',
  'REVIEW', 
  'SCHEDULED',
  'PUBLISHED',
  'ARCHIVED',
  'DELETED'
])

export const ContentTypeSchema = z.enum([
  'MARKDOWN',
  'HTML',
  'RICH_TEXT'
])

export const RelationTypeSchema = z.enum([
  'RELATED',
  'SEQUEL',
  'PREQUEL', 
  'UPDATE',
  'REFERENCE'
])

export const ChangeTypeSchema = z.enum([
  'MAJOR',
  'MINOR',
  'PATCH',
  'CONTENT',
  'SEO',
  'STRUCTURE'
])

export const InteractionTypeSchema = z.enum([
  'LIKE',
  'SHARE',
  'COMMENT',
  'BOOKMARK',
  'SUBSCRIBE',
  'DOWNLOAD'
])

export const SEOEventTypeSchema = z.enum([
  'TITLE_CHANGE',
  'META_DESCRIPTION_CHANGE',
  'KEYWORD_UPDATE',
  'CONTENT_ANALYSIS',
  'PERFORMANCE_ALERT',
  'RANKING_CHANGE',
  'TECHNICAL_ISSUE',
  'OPPORTUNITY'
])

export const SEOSeveritySchema = z.enum([
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL',
  'INFO'
])

export const ChangeFrequencySchema = z.enum([
  'ALWAYS',
  'HOURLY',
  'DAILY',
  'WEEKLY',
  'MONTHLY',
  'YEARLY',
  'NEVER'
])

// =======================
// UTILITY SCHEMAS
// =======================

// Slug validation - lowercase alphanumeric with hyphens
export const slugSchema = z
  .string()
  .min(1, 'Slug is required')
  .max(100, 'Slug cannot exceed 100 characters')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens',
  })

// SEO meta description with character limits
export const metaDescriptionSchema = z
  .string()
  .max(160, 'Meta description cannot exceed 160 characters')
  .optional()

// Keywords array validation
export const keywordsSchema = z
  .array(z.string().min(1).max(50))
  .max(10, 'Cannot have more than 10 keywords')
  .default([])

// URL validation
export const urlSchema = z
  .string()
  .url('Must be a valid URL')
  .optional()

// Color hex validation
export const colorSchema = z
  .string()
  .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex color')
  .optional()

// Email validation
export const emailSchema = z
  .string()
  .email('Must be a valid email address')

// CUID validation
export const cuidSchema = z
  .string()
  .regex(/^c[^\s-]{8,}$/, 'Must be a valid CUID')

// =======================
// CORE ENTITY SCHEMAS
// =======================

export const authorCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: emailSchema,
  slug: slugSchema,
  bio: z.string().max(1000).optional(),
  avatar: urlSchema,
  website: urlSchema,
  twitter: z.string().max(50).optional(),
  linkedin: urlSchema,
  github: z.string().max(50).optional(),
  metaDescription: metaDescriptionSchema
})

export const authorUpdateSchema = authorCreateSchema.partial().extend({
  id: cuidSchema
})

export const categoryCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: slugSchema,
  description: z.string().max(500).optional(),
  color: colorSchema,
  icon: z.string().max(100).optional(),
  metaTitle: z.string().max(100).optional(),
  metaDescription: metaDescriptionSchema,
  keywords: keywordsSchema,
  parentId: cuidSchema.optional()
})

export const categoryUpdateSchema = categoryCreateSchema.partial().extend({
  id: cuidSchema
})

export const tagCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  slug: slugSchema,
  description: z.string().max(200).optional(),
  color: colorSchema,
  metaDescription: metaDescriptionSchema
})

export const tagUpdateSchema = tagCreateSchema.partial().extend({
  id: cuidSchema
})

export const postSeriesCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: slugSchema,
  description: z.string().max(1000).optional(),
  metaTitle: z.string().max(100).optional(),
  metaDescription: metaDescriptionSchema,
  coverImage: urlSchema,
  color: colorSchema
})

export const postSeriesUpdateSchema = postSeriesCreateSchema.partial().extend({
  id: cuidSchema
})

// =======================
// BLOG POST SCHEMAS
// =======================

export const blogPostCreateSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters long')
    .max(200, 'Title cannot exceed 200 characters'),
  slug: slugSchema,
  excerpt: z
    .string()
    .min(10, 'Excerpt must be at least 10 characters long')
    .max(500, 'Excerpt cannot exceed 500 characters')
    .optional(),
  content: z
    .string()
    .min(100, 'Content must be at least 100 characters long')
    .max(50000, 'Content cannot exceed 50,000 characters'),
  contentType: ContentTypeSchema.default('MARKDOWN'),
  status: PostStatusSchema.default('DRAFT'),
  
  // SEO Fields
  metaTitle: z.string().max(100).optional(),
  metaDescription: metaDescriptionSchema,
  keywords: keywordsSchema,
  canonicalUrl: urlSchema,
  
  // Social Media
  ogTitle: z.string().max(100).optional(),
  ogDescription: z.string().max(300).optional(),
  ogImage: urlSchema,
  twitterTitle: z.string().max(100).optional(),
  twitterDescription: z.string().max(200).optional(),
  twitterImage: urlSchema,
  
  // Content Structure
  featuredImage: urlSchema,
  featuredImageAlt: z.string().max(200).optional(),
  
  // Publishing
  publishedAt: z.date().optional(),
  scheduledAt: z.date().optional(),
  
  // Relationships
  authorId: cuidSchema,
  categoryId: cuidSchema.optional(),
  tagIds: z.array(cuidSchema).max(10).optional(),
  seriesId: cuidSchema.optional(),
  relatedPostIds: z.array(cuidSchema).max(5).optional()
})

export const blogPostUpdateSchema = blogPostCreateSchema.partial().extend({
  id: cuidSchema
})

// Blog post with auto-calculated fields for creation
export const blogPostDraftSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  authorId: cuidSchema
})

// =======================
// ANALYTICS SCHEMAS
// =======================

export const postViewCreateSchema = z.object({
  postId: cuidSchema,
  visitorId: z.string().max(100).optional(),
  sessionId: z.string().max(100).optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().max(500).optional(),
  referer: urlSchema,
  country: z.string().max(50).optional(),
  region: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  readingTime: z.number().int().min(0).max(3600).optional(),
  scrollDepth: z.number().min(0).max(1).optional()
})

export const postInteractionCreateSchema = z.object({
  postId: cuidSchema,
  type: InteractionTypeSchema,
  visitorId: z.string().max(100).optional(),
  sessionId: z.string().max(100).optional(),
  value: z.string().max(200).optional(),
  metadata: z.record(z.string(), z.unknown()).optional()
})

// =======================
// SEO SCHEMAS
// =======================

export const seoEventCreateSchema = z.object({
  postId: cuidSchema.optional(),
  type: SEOEventTypeSchema,
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  severity: SEOSeveritySchema.default('INFO'),
  oldValue: z.string().max(1000).optional(),
  newValue: z.string().max(1000).optional(),
  recommendations: z.string().max(1000).optional()
})

export const seoKeywordCreateSchema = z.object({
  keyword: z.string().min(1).max(100),
  postId: cuidSchema.optional(),
  position: z.number().int().min(1).optional(),
  searchVolume: z.number().int().min(0).optional(),
  difficulty: z.number().min(0).max(100).optional(),
  cpc: z.number().min(0).optional(),
  clicks: z.number().int().min(0).default(0),
  impressions: z.number().int().min(0).default(0),
  ctr: z.number().min(0).max(1).optional()
})

export const sitemapEntryCreateSchema = z.object({
  url: z.string().url(),
  lastMod: z.date(),
  changeFreq: ChangeFrequencySchema.default('WEEKLY'),
  priority: z.number().min(0).max(1).default(0.5),
  postId: cuidSchema.optional(),
  included: z.boolean().default(true)
})

// =======================
// QUERY & FILTER SCHEMAS
// =======================

export const blogPostFilterSchema = z.object({
  status: z.union([
    PostStatusSchema,
    z.array(PostStatusSchema)
  ]).optional(),
  authorId: cuidSchema.optional(),
  categoryId: cuidSchema.optional(),
  tagIds: z.array(cuidSchema).optional(),
  seriesId: cuidSchema.optional(),
  search: z.string().max(200).optional(),
  dateRange: z.object({
    from: z.date(),
    to: z.date()
  }).optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional()
})

export const blogPostSortSchema = z.object({
  field: z.enum(['title', 'createdAt', 'updatedAt', 'publishedAt', 'viewCount', 'likeCount']),
  order: z.enum(['asc', 'desc']).default('desc')
})

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10)
})

export const blogPostListParamsSchema = z.object({
  pagination: paginationSchema.optional(),
  filter: blogPostFilterSchema.optional(),
  sort: blogPostSortSchema.optional()
})

// =======================
// RESPONSE SCHEMAS
// =======================

export const blogPostResponseSchema = z.object({
  id: cuidSchema,
  title: z.string(),
  slug: z.string(),
  excerpt: z.string().optional(),
  content: z.string(),
  contentType: ContentTypeSchema,
  status: PostStatusSchema,
  
  // SEO Fields
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.array(z.string()),
  canonicalUrl: z.string().optional(),
  
  // Social Media
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().optional(),
  twitterTitle: z.string().optional(),
  twitterDescription: z.string().optional(),
  twitterImage: z.string().optional(),
  
  // Content Structure
  featuredImage: z.string().optional(),
  featuredImageAlt: z.string().optional(),
  readingTime: z.number().optional(),
  wordCount: z.number().optional(),
  
  // Publishing
  publishedAt: z.date().optional(),
  scheduledAt: z.date().optional(),
  archivedAt: z.date().optional(),
  
  // Timestamps
  createdAt: z.date(),
  updatedAt: z.date(),
  
  // Analytics
  viewCount: z.number(),
  likeCount: z.number(),
  shareCount: z.number(),
  commentCount: z.number(),
  
  // SEO Analytics
  seoScore: z.number().optional(),
  lastSeoCheck: z.date().optional(),
  
  // Relationships (when included)
  author: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    avatar: z.string().optional()
  }).optional(),
  category: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    color: z.string().optional()
  }).optional(),
  tags: z.array(z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    color: z.string().optional()
  })).optional(),
  series: z.array(z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string()
  })).optional()
})

export const blogPostListResponseSchema = z.object({
  posts: z.array(blogPostResponseSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
    hasNext: z.boolean(),
    hasPrev: z.boolean()
  }),
  filters: blogPostFilterSchema.optional()
})

// =======================
// TYPE EXPORTS
// =======================

export type PostStatus = z.infer<typeof PostStatusSchema>
export type ContentType = z.infer<typeof ContentTypeSchema>
export type RelationType = z.infer<typeof RelationTypeSchema>
export type ChangeType = z.infer<typeof ChangeTypeSchema>
export type InteractionType = z.infer<typeof InteractionTypeSchema>
export type SEOEventType = z.infer<typeof SEOEventTypeSchema>
export type SEOSeverity = z.infer<typeof SEOSeveritySchema>
export type ChangeFrequency = z.infer<typeof ChangeFrequencySchema>

export type AuthorCreateInput = z.infer<typeof authorCreateSchema>
export type AuthorUpdateInput = z.infer<typeof authorUpdateSchema>
export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>
export type TagCreateInput = z.infer<typeof tagCreateSchema>
export type TagUpdateInput = z.infer<typeof tagUpdateSchema>
export type PostSeriesCreateInput = z.infer<typeof postSeriesCreateSchema>
export type PostSeriesUpdateInput = z.infer<typeof postSeriesUpdateSchema>

export type BlogPostCreateInput = z.infer<typeof blogPostCreateSchema>
export type BlogPostUpdateInput = z.infer<typeof blogPostUpdateSchema>
export type BlogPostDraftInput = z.infer<typeof blogPostDraftSchema>
export type BlogPostResponse = z.infer<typeof blogPostResponseSchema>
export type BlogPostListResponse = z.infer<typeof blogPostListResponseSchema>

export type PostViewCreateInput = z.infer<typeof postViewCreateSchema>
export type PostInteractionCreateInput = z.infer<typeof postInteractionCreateSchema>
export type SEOEventCreateInput = z.infer<typeof seoEventCreateSchema>
export type SEOKeywordCreateInput = z.infer<typeof seoKeywordCreateSchema>
export type SitemapEntryCreateInput = z.infer<typeof sitemapEntryCreateSchema>

export type BlogPostFilter = z.infer<typeof blogPostFilterSchema>
export type BlogPostSort = z.infer<typeof blogPostSortSchema>
export type Pagination = z.infer<typeof paginationSchema>
export type BlogPostListParams = z.infer<typeof blogPostListParamsSchema>

// =======================
// VALIDATION HELPERS
// =======================

export function validateBlogPostCreate(data: unknown) {
  return blogPostCreateSchema.safeParse(data)
}

export function validateBlogPostUpdate(data: unknown) {
  return blogPostUpdateSchema.safeParse(data)
}

export function validateBlogPostFilter(data: unknown) {
  return blogPostFilterSchema.safeParse(data)
}

export function validatePagination(data: unknown) {
  return paginationSchema.safeParse(data)
}

// Legacy export for backward compatibility
export const blogPostSchema = blogPostCreateSchema
export type BlogPost = BlogPostCreateInput