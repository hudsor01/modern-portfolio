/**
 * Blog system types for modern portfolio
 * Comprehensive type definitions for blog functionality, SEO, and content management
 * Part of the type-first architecture strategy
 *
 * NOTE: Enums are imported from @/lib/prisma-types which is the single source of truth.
 * This file contains interfaces only - no duplicate enums.
 */

import {
  PostStatus,
  ContentType,
  InteractionType,
  SEOEventType,
  SEOSeverity,
  ChangeFrequency,
} from '@/lib/prisma-types'

// =======================
// CORE BLOG TYPES
// =======================

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  contentType: ContentType;
  status: PostStatus;

  // SEO Fields
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];
  canonicalUrl?: string;

  // Social Media
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;

  // Content Structure
  featuredImage?: string;
  featuredImageAlt?: string;
  readingTime?: number;
  wordCount?: number;

  // Publishing
  publishedAt?: Date;
  scheduledAt?: Date;
  archivedAt?: Date;
  deletedAt?: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Relationships
  authorId: string;
  author?: Author;
  categoryId?: string;
  category?: Category;
  tags?: PostTag[];
  series?: PostSeries[];
  relatedPosts?: PostRelation[];

  // Version Control
  versions?: PostVersion[];
  currentVersion: number;

  // Analytics
  viewCount: number;
  likeCount: number;
  shareCount: number;
  commentCount: number;

  // SEO Analytics
  seoScore?: number;
  seoAnalysis?: SEOAnalysis;
  lastSeoCheck?: Date;
}

export interface Author {
  id: string;
  name: string;
  email: string;
  slug: string;
  bio?: string;
  avatar?: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;

  // SEO
  metaDescription?: string;

  // Analytics
  totalViews: number;
  totalPosts: number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Relationships
  posts?: BlogPost[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];

  // Hierarchy
  parentId?: string;
  parent?: Category;
  children?: Category[];

  // Analytics
  postCount: number;
  totalViews: number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Relationships
  posts?: BlogPost[];
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;

  // SEO
  metaDescription?: string;

  // Analytics
  postCount: number;
  totalViews: number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Relationships
  posts?: PostTag[];
}

// =======================
// RELATIONSHIP TYPES
// =======================

// PostTag uses composite primary key [postId, tagId] per Prisma schema
export interface PostTag {
  postId: string;
  tagId: string;
  post?: BlogPost;
  tag?: Tag;
  createdAt: Date;
}

// RelationType is NOT in Prisma - defined locally
export enum RelationType {
  RELATED = 'RELATED',
  SEQUEL = 'SEQUEL',
  PREQUEL = 'PREQUEL',
  UPDATE = 'UPDATE',
  REFERENCE = 'REFERENCE'
}

export interface PostRelation {
  id: string;
  originalPostId: string;
  relatedPostId: string;
  relationType: RelationType;
  originalPost?: BlogPost;
  relatedPost?: BlogPost;
  createdAt: Date;
}

export interface PostSeries {
  id: string;
  name: string;
  slug: string;
  description?: string;

  // SEO
  metaTitle?: string;
  metaDescription?: string;

  // Display
  coverImage?: string;
  color?: string;

  // Analytics
  totalPosts: number;
  totalViews: number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Relationships
  posts?: SeriesPost[];
}

export interface SeriesPost {
  seriesId: string;
  postId: string;
  order: number;
  series?: PostSeries;
  post?: BlogPost;
  createdAt: Date;
}

// =======================
// CONTENT MANAGEMENT TYPES
// =======================

// ChangeType is NOT in Prisma - defined locally
export enum ChangeType {
  MAJOR = 'MAJOR',
  MINOR = 'MINOR',
  PATCH = 'PATCH',
  CONTENT = 'CONTENT',
  SEO = 'SEO',
  STRUCTURE = 'STRUCTURE'
}

export interface PostVersion {
  id: string;
  postId: string;
  version: number;
  title: string;
  content: string;
  excerpt?: string;

  // Change tracking
  changeType: ChangeType;
  changeNotes?: string;

  // Author
  authorId: string;
  author?: Author;

  // Timestamps
  createdAt: Date;

  // Relationships
  post?: BlogPost;
}

// =======================
// ANALYTICS & TRACKING TYPES
// =======================

export interface PostView {
  id: string;
  postId: string;

  // Visitor tracking (anonymized)
  visitorId?: string;
  sessionId?: string;

  // Request details
  ipAddress?: string;
  userAgent?: string;
  referer?: string;

  // Location (anonymized)
  country?: string;
  region?: string;
  city?: string;

  // Engagement metrics
  readingTime?: number;
  scrollDepth?: number;

  // Timestamps
  viewedAt: Date;

  // Relationships
  post?: BlogPost;
}

export interface PostInteraction {
  id: string;
  postId: string;
  type: InteractionType;

  // Visitor tracking (anonymized)
  visitorId?: string;
  sessionId?: string;

  // Interaction details
  value?: string;
  metadata?: Record<string, unknown>;

  // Timestamps
  createdAt: Date;

  // Relationships
  post?: BlogPost;
}

// =======================
// SEO AUTOMATION TYPES
// =======================

export interface SEOEvent {
  id: string;
  postId?: string;
  type: SEOEventType;

  // Event details
  title: string;
  description?: string;
  severity: SEOSeverity;

  // Data
  oldValue?: string;
  newValue?: string;
  recommendations?: string;

  // Processing
  processed: boolean;
  processedAt?: Date;

  // Timestamps
  createdAt: Date;

  // Relationships
  post?: BlogPost;
}

export interface SEOKeyword {
  id: string;
  keyword: string;
  postId?: string;

  // Tracking data
  position?: number;
  searchVolume?: number;
  difficulty?: number;
  cpc?: number;

  // Performance
  clicks: number;
  impressions: number;
  ctr?: number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastChecked?: Date;

  // Relationships
  post?: BlogPost;
}

export interface SitemapEntry {
  id: string;
  url: string;
  lastMod: Date;
  changeFreq: ChangeFrequency;
  priority: number;

  // Content association
  postId?: string;
  post?: BlogPost;

  // Status
  included: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface SEOAnalysis {
  score: number;
  issues: SEOIssue[];
  opportunities: SEOOpportunity[];
  technicalChecks: TechnicalCheck[];
  contentAnalysis: ContentAnalysis;
  keywordAnalysis: KeywordAnalysis;
}

export interface SEOIssue {
  type: 'error' | 'warning' | 'info';
  category: string;
  message: string;
  description?: string;
  fix?: string;
  impact: 'high' | 'medium' | 'low';
}

export interface SEOOpportunity {
  type: string;
  message: string;
  description?: string;
  action: string;
  potential: 'high' | 'medium' | 'low';
}

export interface TechnicalCheck {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message?: string;
  details?: Record<string, unknown>;
}

export interface ContentAnalysis {
  wordCount: number;
  readingTime: number;
  readabilityScore?: number;
  sentimentScore?: number;
  keywordDensity: Record<string, number>;
  headingStructure: HeadingAnalysis[];
  internalLinks: number;
  externalLinks: number;
  images: number;
  imageAltTexts: number;
}

export interface HeadingAnalysis {
  level: number;
  text: string;
  wordCount: number;
}

export interface KeywordAnalysis {
  primary?: string;
  secondary: string[];
  density: Record<string, number>;
  prominence: Record<string, number>;
  suggestions: string[];
}

// =======================
// API TYPES
// =======================

export interface BlogPostCreateInput {
  title: string;
  content: string;
  excerpt?: string;
  contentType?: ContentType;
  status?: PostStatus;

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;

  // Social Media
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;

  // Content
  featuredImage?: string;
  featuredImageAlt?: string;

  // Publishing
  publishedAt?: Date;
  scheduledAt?: Date;

  // Relationships
  authorId: string;
  categoryId?: string;
  tagIds?: string[];
  seriesId?: string;
  relatedPostIds?: string[];
}

export interface BlogPostUpdateInput extends Partial<BlogPostCreateInput> {
  id: string;
}

export interface BlogPostFilter {
  status?: PostStatus | PostStatus[];
  authorId?: string;
  categoryId?: string;
  tagIds?: string[];
  seriesId?: string;
  search?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
  published?: boolean;
}

export interface BlogPostSort {
  field: 'title' | 'createdAt' | 'updatedAt' | 'publishedAt' | 'viewCount' | 'likeCount';
  order: 'asc' | 'desc';
}

export interface BlogPostListParams {
  page?: number;
  limit?: number;
  filter?: BlogPostFilter;
  sort?: BlogPostSort;
}

export interface BlogAnalytics {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  totalInteractions: number;
  avgReadingTime: number;
  topPosts: BlogPost[];
  topCategories: Category[];
  topTags: Tag[];
  recentActivity: AnalyticsActivity[];
  seoSummary: SEOSummary;
}

export interface AnalyticsActivity {
  id: string;
  type: 'post_created' | 'post_published' | 'post_viewed' | 'seo_event';
  title: string;
  description?: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface SEOSummary {
  averageScore: number;
  totalIssues: number;
  criticalIssues: number;
  opportunities: number;
  lastAnalysis: Date;
  topKeywords: SEOKeyword[];
}

// =======================
// TYPE GUARDS
// =======================

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
    typeof (value as BlogPost).content === 'string' &&
    Object.values(PostStatus).includes((value as BlogPost).status)
  );
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
  );
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
  );
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
  );
}

// =======================
// UTILITY TYPES
// =======================

export type BlogPostWithRelations = BlogPost & {
  author: Author;
  category?: Category;
  tags: Array<PostTag & { tag: Tag }>;
  series: Array<SeriesPost & { series: PostSeries }>;
  relatedPosts: Array<PostRelation & { relatedPost: BlogPost }>;
};

export type CategoryWithPosts = Category & {
  posts: BlogPost[];
  children?: Category[];
};

export type TagWithPosts = Tag & {
  posts: Array<PostTag & { post: BlogPost }>;
};

export type AuthorWithPosts = Author & {
  posts: BlogPost[];
};

export type SeriesWithPosts = PostSeries & {
  posts: Array<SeriesPost & { post: BlogPost }>;
};

// Prisma-compatible input types
export type BlogPostCreateData = Omit<BlogPostCreateInput, 'tagIds' | 'relatedPostIds'> & {
  tags?: {
    create: Array<{ tag: { connect: { id: string } } }>;
  };
  relatedPosts?: {
    create: Array<{ relatedPost: { connect: { id: string } }; relationType: RelationType }>;
  };
};

export type BlogPostUpdateData = Partial<BlogPostCreateData> & {
  tags?: {
    deleteMany: {};
    create: Array<{ tag: { connect: { id: string } } }>;
  };
  relatedPosts?: {
    deleteMany: {};
    create: Array<{ relatedPost: { connect: { id: string } }; relationType: RelationType }>;
  };
};

// =======================
// COMPONENT TYPE ALIASES
// =======================

// Import API types for consistency
import type { BlogPostData, BlogPostSummary as APIBlogPostSummary } from './shared-api';

// Type aliases used by existing blog components
export interface BlogFilters {
  category?: string;
  tags?: string[];
  author?: string;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: 'publishedAt' | 'title' | 'viewCount' | 'commentCount';
  sortOrder?: 'asc' | 'desc';
}

export type BlogCategory = Category;
export type BlogTag = Tag;
export type BlogAuthor = Author;

export interface BlogListResponse {
  posts: APIBlogPostSummary[];
  totalCount: number;
  hasMore: boolean;
}

export interface BlogPostCardProps {
  post: BlogPostData | APIBlogPostSummary;
  variant?: 'default' | 'compact' | 'featured';
  showCategory?: boolean;
  showTags?: boolean;
  showReadingTime?: boolean;
  showViewCount?: boolean;
  showCommentCount?: boolean;
  showAuthor?: boolean;
  className?: string;
  onClick?: (post: BlogPostData | APIBlogPostSummary) => void;
}

export interface BlogComment {
  id: string;
  content: string;
  postId: string;
  authorName: string;
  authorEmail: string;
  authorWebsite?: string;
  approved: boolean;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
  replies?: BlogComment[];
}
