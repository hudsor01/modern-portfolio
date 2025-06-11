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

// Query Key types for TanStack React Query
export const queryKeys = {
  projects: ['projects'] as const,
  project: (id: string) => ['projects', id] as const,
  analytics: ['analytics'] as const,
  contact: ['contact'] as const,
  resume: ['resume'] as const,
} as const;

export type QueryKey = typeof queryKeys[keyof typeof queryKeys];

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
}

// Project-related API types
export interface ProjectData {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  technologies: string[];
  imageUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
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

// Contact Form API types
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot?: string; // Bot detection
}

export interface ContactResponse {
  id: string;
  status: 'sent' | 'failed' | 'pending';
  timestamp: string;
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