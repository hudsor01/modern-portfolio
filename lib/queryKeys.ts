import type { QueryClient } from '@tanstack/react-query'

export type QueryKeyFactories = {
  projects: {
    all: readonly ['projects']
    lists: () => readonly ['projects', 'list']
    list: (filters?: ProjectFilters) => readonly ['projects', 'list', ProjectFilters | undefined]
    details: () => readonly ['projects', 'detail'] 
    detail: (slug: string) => readonly ['projects', 'detail', string]
    featured: () => readonly ['projects', 'featured']
  }
  analytics: {
    all: readonly ['analytics']
    projects: () => readonly ['analytics', 'projects']
    project: (slug: string) => readonly ['analytics', 'projects', string]
    views: () => readonly ['analytics', 'views']
  }
  contact: {
    all: readonly ['contact']
    submissions: () => readonly ['contact', 'submissions']
  }
  resume: {
    all: readonly ['resume']
    data: () => readonly ['resume', 'data']
    pdf: () => readonly ['resume', 'pdf']
  }
}

// Project filter types for consistent filtering
export interface ProjectFilters {
  category?: string
  technology?: string
  featured?: boolean
  search?: string
}

/**
 * Project Query Keys
 * Hierarchical key factory for project-related queries
 */
export const projectKeys = {
  // Top-level key for all project queries
  all: () => ['projects'] as const, // Changed to a function
  
  // List queries with optional filtering
  lists: () => [...projectKeys.all(), 'list'] as const, // Call projectKeys.all()
  list: (filters?: ProjectFilters) => [...projectKeys.lists(), filters] as const,
  
  // Detail queries for individual projects
  details: () => [...projectKeys.all(), 'detail'] as const, // Call projectKeys.all()
  detail: (slug: string) => [...projectKeys.details(), slug] as const,
  
  // Featured projects subset
  featured: () => [...projectKeys.all(), 'featured'] as const, // Call projectKeys.all()
} as const

/**
 * Analytics Query Keys
 * For project analytics and user interaction data
 */
export const analyticsKeys = {
  all: () => ['analytics'] as const, // Changed to a function
  
  // Project analytics
  projects: () => [...analyticsKeys.all(), 'projects'] as const, // Call analyticsKeys.all()
  project: (slug: string) => [...analyticsKeys.projects(), slug] as const,
  
  // View analytics
  views: () => [...analyticsKeys.all(), 'views'] as const, // Call analyticsKeys.all()
} as const

/**
 * Contact Query Keys
 * For contact form and communication data
 */
export const contactKeys = {
  all: () => ['contact'] as const, // Changed to a function
  submissions: () => [...contactKeys.all(), 'submissions'] as const, // Call contactKeys.all()
} as const

/**
 * Resume Query Keys
 * For resume-related data and PDF generation
 */
export const resumeKeys = {
  all: () => ['resume'] as const, // Changed to a function
  data: () => [...resumeKeys.all(), 'data'] as const, // Call resumeKeys.all()
  pdf: () => [...resumeKeys.all(), 'pdf'] as const, // Call resumeKeys.all()
} as const

/**
 * Global Query Key Registry
 * Central registry for all query keys - useful for cache invalidation
 */
export const queryKeys = {
  projects: projectKeys,
  analytics: analyticsKeys,
  contact: contactKeys,
  resume: resumeKeys,
} as const

/**
 * Cache Invalidation Helpers
 * Utility functions for common cache invalidation patterns
 */
export const cacheInvalidation = {
  // Invalidate all project data
  invalidateAllProjects: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: projectKeys.all() }) // Call projectKeys.all()
  },
  
  // Invalidate specific project
  invalidateProject: (queryClient: QueryClient, slug: string) => {
    queryClient.invalidateQueries({ queryKey: projectKeys.detail(slug) })
  },
  
  // Invalidate project lists (after adding/removing projects)
  invalidateProjectLists: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
  },
  
  // Invalidate analytics
  invalidateAnalytics: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: analyticsKeys.all() }) // Call analyticsKeys.all()
  },
} as const

/**
 * Query Key Utilities
 * Helper functions for working with query keys
 */
export const queryKeyUtils = {
  // Check if a query key matches a pattern
  matches: (queryKey: readonly unknown[], pattern: readonly unknown[]): boolean => {
    return pattern.every((segment, index) => queryKey[index] === segment)
  },
  
  // Get the base key (first segment) from any query key
  getBaseKey: (queryKey: readonly unknown[]): string => {
    return queryKey[0] as string
  },
  
  // Create a string representation of a query key for debugging
  toString: (queryKey: readonly unknown[]): string => {
    return queryKey.filter(Boolean).join('.')
  },
} as const

/**
 * Type-safe query key type exports
 * These can be used for strict typing in components
 */
export type ProjectQueryKey = ReturnType<typeof projectKeys[keyof typeof projectKeys]>
export type AnalyticsQueryKey = ReturnType<typeof analyticsKeys[keyof typeof analyticsKeys]>
export type ContactQueryKey = ReturnType<typeof contactKeys[keyof typeof contactKeys]>
export type ResumeQueryKey = ReturnType<typeof resumeKeys[keyof typeof resumeKeys]>
export type AnyQueryKey = ProjectQueryKey | AnalyticsQueryKey | ContactQueryKey | ResumeQueryKey
