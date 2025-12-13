/**
 * MODERN TanStack Query Configuration
 * Ultimate performance configuration with no legacy support
 */

import { QueryClient } from '@tanstack/react-query'
import { createContextLogger } from '@/lib/monitoring/logger'

const queryLogger = createContextLogger('QueryConfig')

// Modern cache times optimized for different data types
export const MODERN_CACHE_CONFIG = {
  // Real-time data (analytics, live updates)
  REALTIME: {
    staleTime: 0,
    gcTime: 2 * 60 * 1000, // 2 minutes
  },
  
  // Dynamic content (user-generated, frequently changing)
  DYNAMIC: {
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  },
  
  // Standard content (blog posts, projects)
  STANDARD: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  },
  
  // Static content (categories, tags, settings)
  STATIC: {
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
  },
  
  // Prefetched content (hover prefetch, predictive loading)
  PREFETCHED: {
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 45 * 60 * 1000, // 45 minutes
  },
} as const

/**
 * Create ultimate QueryClient with modern best practices
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Smart default timing
        staleTime: MODERN_CACHE_CONFIG.STANDARD.staleTime,
        gcTime: MODERN_CACHE_CONFIG.STANDARD.gcTime,
        
        // Modern network strategies
        networkMode: 'offlineFirst',
        
        // Optimized refetch behavior
        refetchOnWindowFocus: false, // Prevent excessive refetches
        refetchOnReconnect: 'always', // Always refetch when reconnecting
        refetchOnMount: true,
        
        // Smart retry with exponential backoff
        retry: (failureCount, error) => {
          // Don't retry client errors (4xx)
          if (error && typeof error === 'object' && 'status' in error) {
            const status = error.status as number
            if (status >= 400 && status < 500) return false
          }
          return failureCount < 3
        },
        
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        
        // Performance optimizations
        refetchInterval: false, // Disable polling by default
        notifyOnChangeProps: 'all', // Only notify on relevant changes
      },
      
      mutations: {
        // Network-aware mutations
        networkMode: 'offlineFirst',
        
        // Smart retry for mutations
        retry: (failureCount, error) => {
          // Retry network errors but not client errors
          if (error && typeof error === 'object' && 'status' in error) {
            const status = error.status as number
            if (status >= 400 && status < 500) return false
          }
          return failureCount < 2
        },
        
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
      },
    },
  })
}

/**
 * Smart cache invalidation with dependency tracking
 */
export function createInvalidationMap() {
  return {
    // When a blog post changes, invalidate related caches
    'blog-post': [
      ['blog', 'posts'],
      ['blog', 'categories'], 
      ['blog', 'tags'],
      ['blog', 'analytics'],
    ],
    
    // When a project changes, invalidate project caches
    'project': [
      ['projects'],
      ['analytics', 'projects'],
    ],
    
    // When contact forms are submitted, invalidate analytics
    'contact': [
      ['analytics', 'contact'],
    ],
  } as const
}

/**
 * Performance monitoring for queries
 */
export function setupPerformanceMonitoring(queryClient: QueryClient) {
  const performanceData = {
    slowQueries: [] as Array<{ queryKey: string; duration: number; timestamp: Date }>,
    totalQueries: 0,
    averageResponseTime: 0,
  }
  
  // Monitor query performance
  queryClient.getQueryCache().subscribe((event) => {
    if (event.type === 'added') {
      performanceData.totalQueries++
    }
    
    if (event.type === 'updated' && event.action?.type === 'success') {
      const query = event.query
      const duration = Date.now() - query.state.dataUpdatedAt
      
      // Track slow queries (>3 seconds)
      if (duration > 3000) {
        performanceData.slowQueries.push({
          queryKey: JSON.stringify(query.queryKey),
          duration,
          timestamp: new Date(),
        })
        
        // Only keep last 50 slow queries
        if (performanceData.slowQueries.length > 50) {
          performanceData.slowQueries.shift()
        }
        
        queryLogger.warn('Slow query detected', {
          queryKey: query.queryKey,
          duration: `${duration}ms`,
        })
      }
    }
  })
  
  return performanceData
}

/**
 * Modern cache warming strategy
 */
export async function warmCriticalCaches(queryClient: QueryClient) {
  const criticalQueries = [
    // Core data that's needed immediately
    {
      queryKey: ['projects'],
      queryFn: () => fetch('/api/projects').then(res => res.json()),
      staleTime: MODERN_CACHE_CONFIG.STATIC.staleTime,
    },
    
    // Blog metadata for navigation
    {
      queryKey: ['blog', 'categories'],
      queryFn: () => fetch('/api/blog/categories').then(res => res.json()),
      staleTime: MODERN_CACHE_CONFIG.STATIC.staleTime,
    },
  ]
  
  // Prefetch all critical queries in parallel
  await Promise.allSettled(
    criticalQueries.map(query => queryClient.prefetchQuery(query))
  )
}

/**
 * Cleanup stale cache entries
 */
export function cleanupStaleCache(queryClient: QueryClient) {
  const cache = queryClient.getQueryCache()
  const queries = cache.getAll()
  
  // Remove inactive queries older than 1 hour
  const oneHourAgo = Date.now() - 60 * 60 * 1000
  
  queries.forEach(query => {
    if (!query.isActive() && query.state.dataUpdatedAt < oneHourAgo) {
      queryClient.removeQueries({ 
        queryKey: query.queryKey, 
        exact: true 
      })
    }
  })
}

export default createQueryClient