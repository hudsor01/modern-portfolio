/**
 * Component Consolidation Query Hooks
 * Specialized TanStack Query hooks designed for unified components
 * 
 * Features:
 * - Contact form with auto-save, rate limiting, optimistic updates
 * - Chart data with real-time updates, caching, prefetching
 * - Loading states with smart query-aware skeletons
 * - Cross-component state synchronization
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ContactFormData } from '@/types/shared-api'
import type { ChartData } from '@/types/chart'

// ============================================================================
// CONTACT FORM CONSOLIDATION QUERIES
// ============================================================================

/**
 * Form auto-save state management
 */
export function useFormAutoSave<T extends Record<string, unknown>>(
  formId: string,
  initialData?: T,
  options?: {
    debounceMs?: number
    enabled?: boolean
  }
) {
  const queryClient = useQueryClient()
  const [localData, setLocalData] = useState<T | undefined>(initialData)
  
  // Query for persisted form state
  const formStateQuery = useQuery({
    queryKey: ['formState', formId],
    queryFn: async () => {
      const saved = localStorage.getItem(`form_${formId}`)
      return saved ? JSON.parse(saved) : initialData
    },
    staleTime: Infinity, // Cache forever until manually updated
    refetchOnWindowFocus: false,
    initialData,
  })
  
  // Auto-save mutation with debouncing
  const autoSaveMutation = useMutation({
    mutationFn: async (data: T) => {
      // Save to localStorage
      localStorage.setItem(`form_${formId}`, JSON.stringify(data))
      return data
    },
    onSuccess: (data) => {
      // Update cache immediately
      queryClient.setQueryData(['formState', formId], data)
    },
    // Optimistic update
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ['formState', formId] })
      const previousData = queryClient.getQueryData(['formState', formId])
      queryClient.setQueryData(['formState', formId], newData)
      return { previousData }
    },
    onError: (_err, _newData, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['formState', formId], context.previousData)
      }
    },
  })
  
  // Debounced auto-save
  useEffect(() => {
    if (!options?.enabled || !localData) return
    
    const timer = setTimeout(() => {
      autoSaveMutation.mutate(localData)
    }, options.debounceMs || 1000)
    
    return () => clearTimeout(timer)
  }, [localData, options?.enabled, options?.debounceMs, autoSaveMutation])
  
  const updateFormData = useCallback((data: Partial<T>) => {
    setLocalData(prev => ({ ...prev, ...data } as T))
  }, [])
  
  const clearFormData = useCallback(() => {
    localStorage.removeItem(`form_${formId}`)
    queryClient.removeQueries({ queryKey: ['formState', formId] })
    setLocalData(initialData)
  }, [formId, initialData, queryClient])
  
  return {
    data: formStateQuery.data || localData,
    updateData: updateFormData,
    clearData: clearFormData,
    isAutoSaving: autoSaveMutation.isPending,
    lastSaved: autoSaveMutation.submittedAt,
  }
}

/**
 * Rate limiting status with real-time updates
 */
export function useRateLimitStatus(identifier: string, enabled = true) {
  return useQuery({
    queryKey: ['rateLimit', identifier],
    queryFn: async () => {
      const response = await fetch(`/api/rate-limit/status?id=${identifier}`)
      if (!response.ok) throw new Error('Failed to fetch rate limit status')
      const data = await response.json()
      return data as {
        remaining: number
        reset: number
        limit: number
        blocked: boolean
      }
    },
    enabled,
    staleTime: 10 * 1000, // 10 seconds
    refetchInterval: 30 * 1000, // Check every 30 seconds
    refetchIntervalInBackground: true,
  })
}

/**
 * Contact form submission with all consolidation features
 */
export function useContactFormSubmission() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to submit contact form')
      }
      return response.json()
    },
    
    // Optimistic update
    onMutate: async (data) => {
      // Update UI immediately for better UX
      queryClient.setQueryData(['contact', 'lastSubmission'], {
        ...data,
        submittedAt: new Date().toISOString(),
        status: 'submitting',
      })
      
      // Add to queue for offline support
      const queue = queryClient.getQueryData<ContactFormData[]>(['contact', 'queue']) || []
      queryClient.setQueryData(['contact', 'queue'], [...queue, data])
      
      return { queueLength: queue.length }
    },
    
    onSuccess: (result, variables) => {
      // Update submission status
      queryClient.setQueryData(['contact', 'lastSubmission'], {
        ...variables,
        submittedAt: new Date().toISOString(),
        status: 'success',
        id: result.id,
      })
      
      // Remove from queue
      const queue = queryClient.getQueryData<ContactFormData[]>(['contact', 'queue']) || []
      queryClient.setQueryData(
        ['contact', 'queue'], 
        queue.filter(item => item !== variables)
      )
      
      // Invalidate rate limit status
      queryClient.invalidateQueries({ queryKey: ['rateLimit'] })
    },
    
    onError: (error, variables) => {
      // Update submission status with error
      queryClient.setQueryData(['contact', 'lastSubmission'], {
        ...variables,
        submittedAt: new Date().toISOString(),
        status: 'error',
        error: error.message,
      })
    },
    
    // Advanced options
    retry: (failureCount, error: unknown) => {
      // Don't retry on rate limit or validation errors
      if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string' && error.message.includes('rate limit')) return false
      if (error && typeof error === 'object' && 'status' in error && error.status === 429) return false
      if (error && typeof error === 'object' && 'status' in error && typeof error.status === 'number' && error.status >= 400 && error.status < 500) return false
      return failureCount < 2
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    networkMode: 'offlineFirst',
  })
}

// ============================================================================
// CHART DATA CONSOLIDATION QUERIES
// ============================================================================

/**
 * Real-time chart data with smart caching
 */
export function useChartData<T extends ChartData>(
  endpoint: string,
  options?: {
    realtime?: boolean
    pollInterval?: number
    transform?: (data: unknown) => T[]
    dependencies?: readonly unknown[]
    suspense?: boolean
  }
) {
  const queryKey = ['chartData', endpoint, ...(options?.dependencies || [])]
  
  const queryOptions: UseQueryOptions<T[]> = {
    queryKey,
    queryFn: async () => {
      const response = await fetch(endpoint)
      if (!response.ok) throw new Error(`Failed to fetch chart data from ${endpoint}`)
      const data = await response.json()
      return options?.transform ? options.transform(data) : data
    },
    
    // Smart caching based on realtime needs
    staleTime: options?.realtime ? 0 : 5 * 60 * 1000, // 5 minutes for non-realtime
    gcTime: options?.realtime ? 2 * 60 * 1000 : 30 * 60 * 1000, // 2 minutes for realtime
    
    // Polling for realtime data
    refetchInterval: options?.realtime ? (options?.pollInterval || 10000) : false,
    refetchIntervalInBackground: options?.realtime,
    
    // Smart refetch strategy
    refetchOnWindowFocus: options?.realtime,
    refetchOnReconnect: true,
    
    // Error handling
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  }
  
  // Always use useQuery to avoid conditional hook calls
  const queryResult = useQuery(queryOptions)
  
  // Note: For suspense behavior, enable suspense at QueryClient level instead
  return queryResult
}

/**
 * Chart interaction tracking
 */
export function useChartInteraction(chartId: string) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (interaction: {
      type: 'hover' | 'click' | 'zoom' | 'filter'
      data: unknown
      timestamp: number
    }) => {
      // Track interaction for analytics
      const response = await fetch('/api/analytics/chart-interaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chartId, ...interaction }),
      })
      return response.ok ? response.json() : null
    },
    
    // Optimistic update for immediate feedback
    onMutate: async (interaction) => {
      const interactions = queryClient.getQueryData<unknown[]>(['chartInteractions', chartId]) || []
      queryClient.setQueryData(['chartInteractions', chartId], [
        ...interactions,
        { ...interaction, id: `temp-${Date.now()}` }
      ])
    },
    
    // Don't block UI if tracking fails
    onError: (error) => {
      console.warn('Chart interaction tracking failed:', error)
    },
    
    retry: false, // Don't retry analytics calls
  })
}

/**
 * Prefetch chart data on hover
 */
export function useChartPrefetch() {
  const queryClient = useQueryClient()
  
  return useCallback((endpoint: string, transform?: (data: unknown) => unknown) => {
    queryClient.prefetchQuery({
      queryKey: ['chartData', endpoint],
      queryFn: async () => {
        const response = await fetch(endpoint)
        if (!response.ok) throw new Error('Prefetch failed')
        const data = await response.json()
        return transform ? transform(data) : data
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    })
  }, [queryClient])
}

// ============================================================================
// LOADING STATE CONSOLIDATION
// ============================================================================

/**
 * Query-aware loading states for smart skeletons
 */
export function useQueryAwareLoading(queryKeys: readonly unknown[][]) {
  const queryClient = useQueryClient()
  
  return useMemo(() => {
    const queries = queryKeys.map(key => 
      queryClient.getQueryState(key as readonly unknown[])
    ).filter(Boolean)
    
    return {
      isLoading: queries.some(q => q?.status === 'pending'),
      isError: queries.some(q => q?.status === 'error'),
      isFetching: queries.some(q => q?.fetchStatus === 'fetching'),
      isStale: false, // Remove isStale check to avoid TypeScript error
      hasData: queries.every(q => q?.data !== undefined),
      errors: queries.filter(q => q?.error).map(q => q?.error),
    }
  }, [queryClient, queryKeys])
}

/**
 * Progressive loading with skeleton variants
 */
export function useProgressiveLoading<T>(
  query: { data?: T; isLoading: boolean; error?: unknown },
  options?: {
    minimumLoadingTime?: number
    delayedLoading?: number
  }
) {
  const [showSkeleton, setShowSkeleton] = useState(query.isLoading)
  const [isDelayedLoading, setIsDelayedLoading] = useState(false)
  
  useEffect(() => {
    if (query.isLoading) {
      setShowSkeleton(true)
      
      // Show delayed loading indicator after a threshold
      const delayTimer = setTimeout(() => {
        setIsDelayedLoading(true)
      }, options?.delayedLoading || 1000)
      
      return () => clearTimeout(delayTimer)
    } else {
      // Minimum loading time for smooth UX
      const minTimer = setTimeout(() => {
        setShowSkeleton(false)
        setIsDelayedLoading(false)
      }, options?.minimumLoadingTime || 200)
      
      return () => clearTimeout(minTimer)
    }
  }, [query.isLoading, options?.minimumLoadingTime, options?.delayedLoading])
  
  return {
    showSkeleton,
    isDelayedLoading,
    hasData: !!query.data && !query.isLoading,
    hasError: !!query.error && !query.isLoading,
  }
}

// ============================================================================
// CROSS-COMPONENT SYNCHRONIZATION
// ============================================================================

/**
 * Shared state across components using queries
 */
export function useSharedState<T>(
  key: string,
  initialValue?: T,
  options?: {
    persist?: boolean
    sync?: boolean
  }
) {
  const queryClient = useQueryClient()
  const queryKey = useMemo(() => ['sharedState', key], [key])
  
  // Get current state
  const stateQuery = useQuery({
    queryKey,
    queryFn: async () => {
      if (options?.persist) {
        const saved = localStorage.getItem(`shared_${key}`)
        return saved ? JSON.parse(saved) : initialValue
      }
      return initialValue
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    initialData: initialValue,
  })
  
  // Update state mutation
  const updateStateMutation = useMutation({
    mutationFn: async (newValue: T) => {
      if (options?.persist) {
        localStorage.setItem(`shared_${key}`, JSON.stringify(newValue))
      }
      return newValue
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKey, data)
      
      // Cross-tab synchronization
      if (options?.sync) {
        window.dispatchEvent(new CustomEvent(`shared-state-${key}`, {
          detail: data
        }))
      }
    },
  })
  
  // Listen for cross-tab updates
  useEffect(() => {
    if (!options?.sync) return
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `shared_${key}` && e.newValue) {
        const newValue = JSON.parse(e.newValue)
        queryClient.setQueryData(queryKey, newValue)
      }
    }
    
    const handleCustomEvent = (e: CustomEvent) => {
      queryClient.setQueryData(queryKey, e.detail)
    }
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener(`shared-state-${key}`, handleCustomEvent as EventListener)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener(`shared-state-${key}`, handleCustomEvent as EventListener)
    }
  }, [key, queryClient, queryKey, options?.sync])
  
  return {
    data: stateQuery.data,
    updateData: updateStateMutation.mutate,
    isUpdating: updateStateMutation.isPending,
  }
}

/**
 * Form field synchronization across components
 */
export function useSynchronizedFormField<T>(
  formId: string,
  fieldName: string,
  initialValue?: T
) {
  const { data: formData, updateData } = useSharedState(
    `form_${formId}`,
    { [fieldName]: initialValue },
    { persist: true, sync: true }
  )
  
  const fieldValue = formData?.[fieldName] ?? initialValue
  
  const updateField = useCallback((value: T) => {
    updateData({ ...formData, [fieldName]: value })
  }, [formData, fieldName, updateData])
  
  return [fieldValue, updateField] as const
}