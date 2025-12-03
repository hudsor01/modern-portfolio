/**
 * Shared API types for type-safe communication between frontend and backend
 * Part of the comprehensive type architecture strategy
 */

// Base API Response wrapper
export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

// API Error types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
  offset?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Note: Query keys have been moved to @/lib/queryKeys for better organization
// Import from there for all query key needs

// API Endpoint types
export interface ApiEndpoints {
  projects: {
    getAll: () => Promise<ApiResponse<ProjectData[]>>;
    getById: (id: string) => Promise<ApiResponse<ProjectData>>;
  };
  analytics: {
    getVitals: () => Promise<ApiResponse<AnalyticsData>>;
  };
  contact: {
    send: (data: ContactFormData) => Promise<ApiResponse<ContactResponse>>;
  };
  resume: {
    generate: () => Promise<ApiResponse<ResumeData>>;
  };
  blog: {
    getPosts: (params?: { filters?: BlogPostFilters; sort?: BlogPostSort; page?: number; limit?: number }) => Promise<PaginatedResponse<BlogPostData>>;
    getPost: (slug: string) => Promise<ApiResponse<BlogPostData>>;
    createPost: (data: Partial<BlogPostData>) => Promise<ApiResponse<BlogPostData>>;
    updatePost: (id: string, data: Partial<BlogPostData>) => Promise<ApiResponse<BlogPostData>>;
    deletePost: (id: string) => Promise<ApiResponse<{ success: boolean }>>;
    getCategories: () => Promise<ApiResponse<BlogCategoryData[]>>;
    getTags: () => Promise<ApiResponse<BlogTagData[]>>;
    getAnalytics: () => Promise<ApiResponse<BlogAnalyticsData>>;
    getRSSFeed: () => Promise<ApiResponse<RSSFeedData>>;
  };
}

// Import STAR types from project types
import type { STARData } from './project';

// Project-related API types
export interface ProjectData {
  id: string;
  title: string;
  slug?: string;
  description: string;
  longDescription?: string;
  content?: string;
  category: ProjectCategory;
  technologies: string[];
  tags?: string[];

  // Media & URLs
  imageUrl?: string;
  image?: string;
  demoUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  link?: string;

  featured: boolean;
  createdAt: string;
  updatedAt: string;

  // Additional project details
  client?: string;
  role?: string;
  metrics?: Record<string, string>;
  starData?: STARData;
  details?: {
    challenge: string;
    solution: string;
    impact: string;
  };
  charts?: Array<{
    type: 'line' | 'bar' | 'pie' | 'funnel' | 'heatmap';
    title: string;
    dataKey: string;
  }>;
}

export type ProjectCategory = 
  | 'analytics' 
  | 'dashboard' 
  | 'visualization' 
  | 'automation' 
  | 'integration';

// Analytics API types
export interface AnalyticsData {
  pageViews: number;
  visitors: number;
  bounceRate: number;
  avgSessionDuration: number;
  topPages: PageView[];
  vitals: WebVital[];
}

export interface PageView {
  page: string;
  views: number;
  uniqueViews: number;
}

export interface WebVital {
  name: 'FCP' | 'LCP' | 'CLS' | 'FID' | 'TTFB';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

// Contact Form API types - consolidated from all sources
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  company?: string;
  phone?: string;
  honeypot?: string; // Bot detection
}

export interface ContactResponse {
  id: string;
  status: 'sent' | 'failed' | 'pending';
  timestamp: string;
  createdAt: string; // Legacy compatibility
}

// Specific API response types for backward compatibility
export interface ContactApiResponse extends ApiResponse<ContactResponse> {}

// Newsletter API types
export interface NewsletterSubscriptionData {
  email: string;
  name?: string;
}

export interface NewsletterApiResponse extends ApiResponse<{
  id: string;
  createdAt: string;
}> {}

// Project API types
export interface ProjectApiResponse extends ApiResponse<{
  projects: ProjectData[];
}> {}

// Search API types
export interface SearchResultItem {
  id: string;
  title: string;
  description?: string;
  url: string;
}

export interface SearchApiResponse extends ApiResponse<{
  results: SearchResultItem[];
  totalResults: number;
}> {}

// Blog API types
export interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  contentType: 'MARKDOWN' | 'HTML' | 'RICH_TEXT';
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED';
  
  // SEO fields
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];
  canonicalUrl?: string;
  
  // Content metadata
  featuredImage?: string;
  featuredImageAlt?: string;
  readingTime?: number;
  wordCount?: number;
  
  // Publishing
  publishedAt?: string;
  scheduledAt?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  
  // Relationships
  authorId: string;
  author?: BlogAuthorData;
  categoryId?: string;
  category?: BlogCategoryData;
  tags?: BlogTagData[];
  
  // Analytics
  viewCount: number;
  likeCount: number;
  shareCount: number;
  commentCount: number;
}

export interface BlogAuthorData {
  id: string;
  name: string;
  email: string;
  slug: string;
  bio?: string;
  avatar?: string;
  website?: string;
  totalPosts: number;
  totalViews: number;
  createdAt: string;
}

export interface BlogCategoryData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  postCount: number;
  totalViews: number;
  createdAt: string;
}

export interface BlogTagData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  postCount: number;
  totalViews: number;
  createdAt: string;
}

export interface BlogPostFilters {
  status?: string | string[];
  authorId?: string;
  categoryId?: string;
  tagIds?: string[];
  search?: string;
  dateRange?: {
    from: string;
    to: string;
  };
  featured?: boolean;
  published?: boolean;
}

export interface BlogPostSort {
  field: 'title' | 'createdAt' | 'updatedAt' | 'publishedAt' | 'viewCount' | 'likeCount';
  order: 'asc' | 'desc';
}

export interface BlogAnalyticsData {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  totalInteractions: number;
  avgReadingTime: number;
  topPosts: BlogPostData[];
  topCategories: BlogCategoryData[];
  topTags: BlogTagData[];
  monthlyViews: Array<{ month: string; views: number }>;
  popularKeywords: Array<{ keyword: string; count: number }>;
}

export interface RSSFeedData {
  title: string;
  description: string;
  link: string;
  lastBuildDate: string;
  language: string;
  posts: Array<{
    title: string;
    link: string;
    description: string;
    pubDate: string;
    author: string;
    category?: string;
    guid: string;
  }>;
}

// Resume API types
export interface ResumeData {
  url: string;
  filename: string;
  size: number;
  generatedAt: string;
}

// HTTP Method types
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// Request configuration
export interface RequestConfig {
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  cache?: RequestCache;
  timeout?: number;
}

// Type guards for API responses
export function isApiResponse<T>(value: unknown): value is ApiResponse<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'success' in value &&
    typeof (value as ApiResponse<T>).success === 'boolean'
  );
}

export function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'code' in value &&
    'message' in value &&
    typeof (value as ApiError).code === 'string' &&
    typeof (value as ApiError).message === 'string'
  );
}

// API client configuration
export interface ApiClientConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  headers: Record<string, string>;
}