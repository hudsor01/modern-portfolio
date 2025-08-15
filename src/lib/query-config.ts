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
  
  // Chart data (expensive calculations, cache longer)
  CHART_DATA: {
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
  },
  
  // Image/Asset metadata
  ASSET_METADATA: {
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
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
      retry: (failureCount: number, error: unknown) => {
        // Don't retry on 404s or client errors
        if (typeof error === 'object' && error !== null && 'status' in error) {
          const status = (error as { status?: number }).status;
          if (status && status >= 400 && status < 500) {
            return false;
          }
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      
      // Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch configuration - optimized for performance
      refetchOnMount: false, // Changed to false to use cache when possible
      refetchOnWindowFocus: false, // Disable for better UX in portfolio
      refetchOnReconnect: 'always',
      refetchInterval: false, // Disable polling by default
      
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
  // Invalidate all project-related cache with performance tracking
  invalidateProjects: (queryClient: QueryClient) => {
    console.log('Invalidating all project caches');
    queryClient.invalidateQueries({ 
      queryKey: ['projects'],
      type: 'all' // Invalidate both active and inactive queries
    });
    
    // Warm critical caches after invalidation
    setTimeout(() => {
      cachingStrategies.warmCriticalCaches(queryClient);
    }, 100);
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
  updateContactStatus: <TItem = unknown>(queryClient: QueryClient, optimisticItem: TItem) => {
    queryClient.setQueryData<TItem[]>( // Specify that the data for this key is TItem[]
      ['contact', 'submissions'], 
      (oldItems): TItem[] => { // oldItems is inferred as TItem[] | undefined
        return oldItems ? [...oldItems, optimisticItem] : [optimisticItem];
      }
    );
  },
} as const;

/**
 * Advanced Caching Strategies
 */
export const cachingStrategies = {
  // Cache warming for critical data
  warmCriticalCaches: async (queryClient: QueryClient) => {
    const criticalQueries = [
      // Prefetch projects list
      queryClient.prefetchQuery({
        queryKey: ['projects', 'list'],
        queryFn: () => fetch('/api/projects').then(res => res.json()),
        staleTime: CACHE_TIMES.STATIC_CONTENT.staleTime,
      }),
      // Prefetch featured projects
      queryClient.prefetchQuery({
        queryKey: ['projects', 'featured'],
        queryFn: () => fetch('/api/projects?featured=true').then(res => res.json()),
        staleTime: CACHE_TIMES.STATIC_CONTENT.staleTime,
      }),
      // Prefetch project stats for dashboard
      queryClient.prefetchQuery({
        queryKey: ['projects', 'stats'],
        queryFn: () => fetch('/api/projects/stats').then(res => res.json()),
        staleTime: CACHE_TIMES.CHART_DATA.staleTime,
      }),
    ];

    await Promise.allSettled(criticalQueries);
  },

  // Intelligent cache revalidation
  smartRevalidation: (queryClient: QueryClient) => {
    const cache = queryClient.getQueryCache();
    const staleQueries = cache.getAll().filter(query => {
      const isStale = query.isStale();
      const lastFetch = query.state.dataUpdatedAt;
      const timeSinceLastFetch = Date.now() - lastFetch;
      
      // Revalidate if stale and hasn't been fetched in the last 5 minutes
      return isStale && timeSinceLastFetch > 5 * 60 * 1000;
    });

    staleQueries.forEach(query => {
      queryClient.refetchQueries({ queryKey: query.queryKey, exact: true });
    });
  },

  // Background sync for offline-first experience
  backgroundSync: (queryClient: QueryClient) => {
    if (typeof window !== 'undefined' && navigator.onLine) {
      // Sync any pending mutations when online
      queryClient.resumePausedMutations();
      
      // Refetch active queries that may have stale data
      queryClient.refetchQueries({
        type: 'active',
        stale: true,
      });
    }
  },

  // Prefetch strategy for hover interactions
  prefetchOnHover: (queryClient: QueryClient, slug: string) => {
    queryClient.prefetchQuery({
      queryKey: ['projects', 'detail', slug],
      queryFn: () => fetch(`/api/projects/${slug}`).then(res => res.json()),
      staleTime: CACHE_TIMES.PREFETCH_CONTENT.staleTime,
    });
  },
} as const;

/**
 * Query Performance Monitor
 */
export class QueryPerformanceMonitor {
  private static queryTimes = new Map<string, number>();
  private static performanceEntries: Array<{
    queryKey: string;
    duration: number;
    timestamp: Date;
    status: 'success' | 'error' | 'loading';
  }> = [];

  static startTiming(queryKey: unknown[]): void {
    const key = JSON.stringify(queryKey);
    this.queryTimes.set(key, performance.now());
  }

  static endTiming(queryKey: unknown[], status: 'success' | 'error' = 'success'): void {
    const key = JSON.stringify(queryKey);
    const startTime = this.queryTimes.get(key);
    
    if (startTime) {
      const duration = performance.now() - startTime;
      
      this.performanceEntries.push({
        queryKey: key,
        duration,
        timestamp: new Date(),
        status,
      });

      // Log slow queries
      if (duration > 3000) {
        console.warn('Slow query detected:', {
          queryKey: key,
          duration: `${duration.toFixed(2)}ms`,
          status,
          timestamp: new Date().toISOString(),
        });
      }

      this.queryTimes.delete(key);
    }
  }

  static getPerformanceReport(): {
    totalQueries: number;
    averageDuration: number;
    slowQueries: number;
    errorRate: number;
    topSlowestQueries: Array<{ queryKey: string; duration: number }>;
  } {
    const entries = this.performanceEntries;
    
    if (entries.length === 0) {
      return {
        totalQueries: 0,
        averageDuration: 0,
        slowQueries: 0,
        errorRate: 0,
        topSlowestQueries: [],
      };
    }

    const totalDuration = entries.reduce((sum, entry) => sum + entry.duration, 0);
    const slowQueries = entries.filter(entry => entry.duration > 3000).length;
    const errors = entries.filter(entry => entry.status === 'error').length;
    
    const topSlowest = entries
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 5)
      .map(entry => ({
        queryKey: entry.queryKey,
        duration: entry.duration,
      }));

    return {
      totalQueries: entries.length,
      averageDuration: totalDuration / entries.length,
      slowQueries,
      errorRate: (errors / entries.length) * 100,
      topSlowestQueries: topSlowest,
    };
  }

  static clearMetrics(): void {
    this.performanceEntries = [];
    this.queryTimes.clear();
  }
}

/**
 * Cache Management Utilities
 */
export const cacheManagement = {
  // Get detailed cache statistics
  getCacheStats: (queryClient: QueryClient) => {
    const cache = queryClient.getQueryCache();
    const queries = cache.getAll();
    
    const stats = {
      totalQueries: queries.length,
      activeQueries: queries.filter(q => q.isActive()).length,
      staleQueries: queries.filter(q => q.isStale()).length,
      fetchingQueries: queries.filter(q => q.state.fetchStatus === 'fetching').length,
      errorQueries: queries.filter(q => q.state.status === 'error').length,
      cacheSize: 0, // Will be calculated
      oldestQuery: null as Date | null,
      newestQuery: null as Date | null,
    };

    // Calculate cache dates
    const queryDates = queries
      .map(q => q.state.dataUpdatedAt)
      .filter(date => date > 0)
      .map(timestamp => new Date(timestamp));
    
    if (queryDates.length > 0) {
      stats.oldestQuery = new Date(Math.min(...queryDates.map(d => d.getTime())));
      stats.newestQuery = new Date(Math.max(...queryDates.map(d => d.getTime())));
    }

    return stats;
  },

  // Memory usage optimization
  optimizeMemoryUsage: (queryClient: QueryClient) => {
    const cache = queryClient.getQueryCache();
    const queries = cache.getAll();
    
    // Remove inactive queries older than 1 hour
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    
    queries.forEach(query => {
      if (!query.isActive() && query.state.dataUpdatedAt < oneHourAgo) {
        queryClient.removeQueries({ queryKey: query.queryKey, exact: true });
      }
    });
  },

  // Export cache for debugging
  exportCache: (queryClient: QueryClient) => {
    const cache = queryClient.getQueryCache();
    return cache.getAll().map(query => ({
      queryKey: query.queryKey,
      status: query.state.status,
      dataUpdatedAt: new Date(query.state.dataUpdatedAt).toISOString(),
      isActive: query.isActive(),
      isStale: query.isStale(),
    }));
  },
} as const;

/**
 * Performance Monitoring Helpers
 * Enhanced monitoring with detailed metrics
 */
export const performanceHelpers = {
  ...cacheManagement,
  
  // Monitor and log performance
  monitor: {
    startTiming: QueryPerformanceMonitor.startTiming.bind(QueryPerformanceMonitor),
    endTiming: QueryPerformanceMonitor.endTiming.bind(QueryPerformanceMonitor),
    getReport: QueryPerformanceMonitor.getPerformanceReport.bind(QueryPerformanceMonitor),
    clear: QueryPerformanceMonitor.clearMetrics.bind(QueryPerformanceMonitor),
  },
  
  // Legacy method for backward compatibility
  logSlowQuery: (queryKey: unknown[], duration: number) => {
    QueryPerformanceMonitor.endTiming(queryKey, duration > 3000 ? 'error' : 'success');
  },
} as const;

/**
 * Enhanced Query Client with Performance Monitoring
 */
export function createEnhancedQueryClient(): QueryClient {
  const queryClient = createQueryClient();
  
  // Add global query cache listeners for performance monitoring
  queryClient.getQueryCache().subscribe((event) => {
    if (event.type === 'observerAdded' && event.query) {
      QueryPerformanceMonitor.startTiming(event.query.queryKey);
    }
    
    if (event.type === 'observerRemoved' && event.query) {
      const status = event.query.state.status === 'error' ? 'error' : 'success';
      QueryPerformanceMonitor.endTiming(event.query.queryKey, status);
    }
  });

  // Mutation monitoring
  queryClient.getMutationCache().subscribe((event) => {
    if (event.type === 'added' && event.mutation) {
      console.log('Mutation started:', event.mutation.options.mutationKey);
    }
  });

  return queryClient;
}

export default createQueryClient;
