/**
 * TanStack Query Configuration
 * Centralized caching strategies and query client configuration
 * Following TanStack Query best practices for optimal performance
 */

import { QueryClient } from '@tanstack/react-query';
import type { QueryClientConfig } from '@tanstack/react-query';

/**
 * Cache Time Constants (in milliseconds)
 * Following best practices for different data types
 */
export const CACHE_TIMES = {
  // Static content that rarely changes (projects, resume data)
  STATIC_CONTENT: {
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  },
  
  // Dynamic content that changes occasionally (project lists with filters)
  DYNAMIC_CONTENT: {
    staleTime: 5 * 60 * 1000, // 5 minutes  
    gcTime: 30 * 60 * 1000, // 30 minutes
  },
  
  // Real-time content (analytics, contact forms)
  REALTIME_CONTENT: {
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 10 * 60 * 1000, // 10 minutes
  },
  
  // Prefetched content (hover prefetching)
  PREFETCH_CONTENT: {
    staleTime: 15 * 60 * 1000, // 15 minutes (longer for prefetched data)
    gcTime: 45 * 60 * 1000, // 45 minutes
  },
} as const;

/**
 * Query Client Configuration
 * Optimized defaults for portfolio application
 */
export const defaultQueryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      // Use dynamic content timing as default
      staleTime: CACHE_TIMES.DYNAMIC_CONTENT.staleTime,
      gcTime: CACHE_TIMES.DYNAMIC_CONTENT.gcTime,
      
      // Retry configuration
      retry: (failureCount, error: any) => {
        // Don't retry on 404s or client errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      
      // Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch configuration
      refetchOnMount: 'always',
      refetchOnWindowFocus: false, // Disable for better UX in portfolio
      refetchOnReconnect: 'always',
      
      // Network mode for offline support
      networkMode: 'online',
    },
    
    mutations: {
      retry: 1, // Retry mutations once
      networkMode: 'online',
    },
  },
};

/**
 * Create optimized QueryClient instance
 */
export function createQueryClient(): QueryClient {
  return new QueryClient(defaultQueryClientConfig);
}

/**
 * Server-side QueryClient factory
 * For SSR/RSC with no persisted cache
 */
export function createServerQueryClient(): QueryClient {
  return new QueryClient({
    ...defaultQueryClientConfig,
    defaultOptions: {
      ...defaultQueryClientConfig.defaultOptions,
      queries: {
        ...defaultQueryClientConfig.defaultOptions?.queries,
        // Shorter cache times for server-side rendering
        staleTime: 0, // Always fetch fresh data on server
        gcTime: 0, // Don't cache on server
      },
    },
  });
}

/**
 * Cache Invalidation Strategies
 * Type-safe cache invalidation helpers
 */
export const invalidationStrategies = {
  // Invalidate all project-related cache
  invalidateProjects: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ 
      queryKey: ['projects'],
      type: 'all' // Invalidate both active and inactive queries
    });
  },
  
  // Selective invalidation for specific project
  invalidateProject: (queryClient: QueryClient, slug: string) => {
    queryClient.invalidateQueries({ 
      queryKey: ['projects', 'detail', slug],
      exact: true 
    });
  },
  
  // Invalidate filtered lists but keep detail pages
  invalidateProjectLists: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ 
      queryKey: ['projects', 'list'],
      type: 'all'
    });
    queryClient.invalidateQueries({ 
      queryKey: ['projects', 'featured'],
      type: 'all'
    });
  },
  
  // Soft refresh - refetch without invalidating
  refreshProjects: (queryClient: QueryClient) => {
    queryClient.refetchQueries({ 
      queryKey: ['projects'],
      type: 'active' // Only refetch active queries
    });
  },
} as const;

/**
 * Optimistic Update Helpers
 * For future use with mutations
 */
export const optimisticUpdates = {
  // Example for contact form submission
  updateContactStatus: (queryClient: QueryClient, optimisticData: any) => {
    queryClient.setQueryData(['contact', 'submissions'], (old: any) => {
      return old ? [...old, optimisticData] : [optimisticData];
    });
  },
} as const;

/**
 * Performance Monitoring Helpers
 * For tracking query performance
 */
export const performanceHelpers = {
  // Log slow queries for monitoring
  logSlowQuery: (queryKey: unknown[], duration: number) => {
    if (duration > 3000) { // Log queries taking more than 3 seconds
      console.warn('Slow query detected:', {
        queryKey: JSON.stringify(queryKey),
        duration: `${duration}ms`,
        timestamp: new Date().toISOString(),
      });
    }
  },
  
  // Get cache statistics
  getCacheStats: (queryClient: QueryClient) => {
    const cache = queryClient.getQueryCache();
    return {
      totalQueries: cache.getAll().length,
      activeQueries: cache.getAll().filter(q => q.isActive()).length,
      staleQueries: cache.getAll().filter(q => q.isStale()).length,
      fetchingQueries: cache.getAll().filter(q => q.state.fetchStatus === 'fetching').length,
    };
  },
} as const;

export default createQueryClient;