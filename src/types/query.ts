/**
 * Query Keys and Filter Types - Centralized
 * Consolidated from src/lib/queryKeys.ts
 */

export interface ProjectFilters {
  category?: string
  search?: string
  featured?: boolean
  technology?: string
}

export interface QueryKeyFactories {
  projects: {
    all: readonly ['projects']
    lists: readonly ['projects', 'list']
    list: (filters: ProjectFilters) => readonly ['projects', 'list', ProjectFilters]
    details: readonly ['projects', 'detail']
    detail: (slug: string) => readonly ['projects', 'detail', string]
    slugs: readonly ['projects', 'slugs']
  }
  analytics: {
    all: readonly ['analytics']
    vitals: readonly ['analytics', 'vitals']
    webVitals: () => readonly ['analytics', 'web-vitals']
    custom: (key: string) => readonly ['analytics', string]
  }
  contact: {
    all: readonly ['contact']
    submission: () => readonly ['contact', 'submission']
  }
  resume: {
    all: readonly ['resume']
    data: () => readonly ['resume', 'data']
  }
  blog: {
    all: readonly ['blog']
    lists: readonly ['blog', 'list']
    list: (params?: BlogListParams) => readonly ['blog', 'list', BlogListParams | undefined]
    details: readonly ['blog', 'detail']
    detail: (slug: string) => readonly ['blog', 'detail', string]
    slugs: readonly ['blog', 'slugs']
    categories: readonly ['blog', 'categories']
    tags: readonly ['blog', 'tags']
    analytics: readonly ['blog', 'analytics']
  }
}

// Blog list params type
export interface BlogListParams {
  page?: number
  limit?: number
  status?: string | string[]
  categoryId?: string
  tagIds?: string[]
  search?: string
  sort?: {
    field: string
    order: 'asc' | 'desc'
  }
}

// Query key types
export type ProjectQueryKey = ReturnType<QueryKeyFactories['projects']['detail']> | readonly ['projects']
export type AnalyticsQueryKey = ReturnType<QueryKeyFactories['analytics']['webVitals']> | readonly ['analytics']
export type ContactQueryKey = ReturnType<QueryKeyFactories['contact']['submission']> | readonly ['contact']
export type ResumeQueryKey = ReturnType<QueryKeyFactories['resume']['data']> | readonly ['resume']
export type BlogQueryKey = ReturnType<QueryKeyFactories['blog']['detail']> | readonly ['blog']

export type AnyQueryKey = ProjectQueryKey | AnalyticsQueryKey | ContactQueryKey | ResumeQueryKey | BlogQueryKey

// Cache invalidation types
export interface CacheInvalidationConfig {
  projects: {
    all: readonly ['projects']
    lists: readonly ['projects', 'list']
    slugs: readonly ['projects', 'slugs']
  }
  analytics: {
    all: readonly ['analytics']
    vitals: readonly ['analytics', 'vitals']
  }
  contact: {
    all: readonly ['contact']
  }
  resume: {
    all: readonly ['resume']
  }
  blog: {
    all: readonly ['blog']
    lists: readonly ['blog', 'list']
    slugs: readonly ['blog', 'slugs']
    categories: readonly ['blog', 'categories']
    tags: readonly ['blog', 'tags']
    analytics: readonly ['blog', 'analytics']
  }
}
