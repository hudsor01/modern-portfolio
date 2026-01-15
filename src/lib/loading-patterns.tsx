/**
 * Loading Patterns and Utilities
 *
 * Provides consistent loading state patterns and utilities for managing
 * loading, error, and empty states across all project pages.
 */

import * as React from 'react'

// ============================================================================
// LOADING STATE TYPES
// ============================================================================

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface LoadingConfig {
  initialState?: LoadingState
  timeout?: number
  retryAttempts?: number
  retryDelay?: number
}

export interface AsyncState<T = unknown> {
  data: T | null
  loading: boolean
  error: Error | string | null
  empty: boolean
}

// ============================================================================
// LOADING STATE HOOK
// ============================================================================

export function useLoadingState<T = unknown>(config: LoadingConfig = {}) {
  const { initialState = 'idle', timeout = 30000, retryAttempts = 3, retryDelay = 1000 } = config

  const [state, setState] = React.useState<AsyncState<T>>({
    data: null,
    loading: initialState === 'loading',
    error: null,
    empty: false,
  })

  const [retryCount, setRetryCount] = React.useState(0)
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const retryTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  // Set loading state
  const setLoading = React.useCallback((loading: boolean) => {
    setState((prev) => ({ ...prev, loading, error: loading ? null : prev.error }))
  }, [])

  // Set success state with data
  const setSuccess = React.useCallback((data: T, isEmpty = false) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setState({
      data,
      loading: false,
      error: null,
      empty: isEmpty,
    })
    setRetryCount(0)
  }, [])

  // Set error state
  const setError = React.useCallback((error: Error | string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setState((prev) => ({
      ...prev,
      loading: false,
      error,
    }))
  }, [])

  // Execute async operation with loading state management
  const execute = React.useCallback(
    async function <R>(
      operation: () => Promise<R>,
      options: {
        onSuccess?: (data: R) => void
        onError?: (error: Error) => void
        checkEmpty?: (data: R) => boolean
        skipLoading?: boolean
      } = {}
    ): Promise<R> {
      const { onSuccess, onError, checkEmpty, skipLoading = false } = options

      if (!skipLoading) {
        setLoading(true)
      }

      // Set timeout
      if (timeout > 0) {
        timeoutRef.current = setTimeout(() => {
          setError(new Error('Operation timed out'))
        }, timeout)
      }

      try {
        const result = await operation()
        const isEmpty = checkEmpty ? checkEmpty(result) : false

        setSuccess(result as T, isEmpty)
        onSuccess?.(result)

        return result
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error(String(error))
        setError(errorObj)
        onError?.(errorObj)
        throw errorObj
      }
    },
    [setLoading, setSuccess, setError, timeout]
  )

  // Retry with exponential backoff
  const retry = React.useCallback(
    async function <R>(
      operation: () => Promise<R>,
      options: Parameters<typeof execute>[1] = {}
    ): Promise<R | undefined> {
      if (retryCount >= retryAttempts) {
        setError(new Error(`Maximum retry attempts (${retryAttempts}) exceeded`))
        return
      }

      const delay = retryDelay * Math.pow(2, retryCount)
      setRetryCount((prev) => prev + 1)

      return new Promise<R>((resolve, reject) => {
        retryTimeoutRef.current = setTimeout(async () => {
          try {
            const result = await execute(operation, options)
            resolve(result)
          } catch (error) {
            reject(error)
          }
        }, delay)
      })
    },
    [execute, retryCount, retryAttempts, retryDelay, setError]
  )

  // Reset state
  const reset = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
    }
    setState({
      data: null,
      loading: false,
      error: null,
      empty: false,
    })
    setRetryCount(0)
  }, [])

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
    }
  }, [])

  return {
    ...state,
    retryCount,
    canRetry: retryCount < retryAttempts,
    setLoading,
    setSuccess,
    setError,
    execute,
    retry,
    reset,
  }
}

// ============================================================================
// LOADING PATTERN UTILITIES
// ============================================================================

/**
 * Determines the appropriate error variant based on error type
 */
export function getErrorVariant(
  error: Error | string
): 'default' | 'network' | 'not-found' | 'server' {
  const errorMessage = typeof error === 'string' ? error : error.message
  const lowerMessage = errorMessage.toLowerCase()

  if (
    lowerMessage.includes('network') ||
    lowerMessage.includes('connection') ||
    lowerMessage.includes('fetch')
  ) {
    return 'network'
  }

  if (lowerMessage.includes('not found') || lowerMessage.includes('404')) {
    return 'not-found'
  }

  if (
    lowerMessage.includes('server') ||
    lowerMessage.includes('500') ||
    lowerMessage.includes('internal')
  ) {
    return 'server'
  }

  return 'default'
}

/**
 * Creates a standardized loading skeleton configuration for different content types
 */
export function createSkeletonConfig(
  contentType: 'metrics' | 'chart' | 'table' | 'cards' | 'mixed'
) {
  switch (contentType) {
    case 'metrics':
      return {
        component: 'SkeletonGrid',
        props: {
          columns: 3 as const,
          rows: 1,
          itemHeight: 'h-24',
        },
      }

    case 'chart':
      return {
        component: 'SkeletonChart',
        props: {
          height: 300,
          showTitle: true,
          showDescription: false,
        },
      }

    case 'table':
      return {
        component: 'SkeletonGrid',
        props: {
          columns: 1 as const,
          rows: 5,
          itemHeight: 'h-12',
        },
      }

    case 'cards':
      return {
        component: 'SkeletonGrid',
        props: {
          columns: 2 as const,
          rows: 2,
          itemHeight: 'h-32',
        },
      }

    case 'mixed':
    default:
      return {
        component: 'mixed',
        props: {
          showMetrics: true,
          showChart: true,
          metricsColumns: 3,
          chartHeight: 300,
        },
      }
  }
}

/**
 * Standardized empty state messages for different contexts
 */
export const EMPTY_STATE_MESSAGES = {
  projects: {
    title: 'No projects found',
    message: 'There are no projects to display at the moment.',
  },
  metrics: {
    title: 'No metrics available',
    message: 'Metrics data is not available for the selected time period.',
  },
  charts: {
    title: 'No chart data',
    message: 'There is no data available to display in the chart.',
  },
  search: {
    title: 'No results found',
    message: 'Try adjusting your search criteria or filters.',
  },
  data: {
    title: 'No data available',
    message: 'Data is not available at the moment.',
  },
} as const

/**
 * Standardized error messages for different error types
 */
export const ERROR_MESSAGES = {
  network: {
    title: 'Connection Error',
    message: 'Unable to connect to the server. Please check your internet connection.',
  },
  server: {
    title: 'Server Error',
    message: 'An internal server error occurred. Please try again later.',
  },
  notFound: {
    title: 'Not Found',
    message: 'The requested resource could not be found.',
  },
  timeout: {
    title: 'Request Timeout',
    message: 'The request took too long to complete. Please try again.',
  },
  default: {
    title: 'Something went wrong',
    message: 'An unexpected error occurred. Please try again.',
  },
} as const

// ============================================================================
// LOADING STATE CONTEXT
// ============================================================================

interface LoadingContextValue {
  globalLoading: boolean
  setGlobalLoading: (loading: boolean) => void
  loadingStates: Record<string, boolean>
  setLoadingState: (key: string, loading: boolean) => void
}

const LoadingContext = React.createContext<LoadingContextValue | null>(null)

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [globalLoading, setGlobalLoading] = React.useState(false)
  const [loadingStates, setLoadingStates] = React.useState<Record<string, boolean>>({})

  const setLoadingState = React.useCallback((key: string, loading: boolean) => {
    setLoadingStates((prev) => ({
      ...prev,
      [key]: loading,
    }))
  }, [])

  const value = React.useMemo(
    () => ({
      globalLoading,
      setGlobalLoading,
      loadingStates,
      setLoadingState,
    }),
    [globalLoading, loadingStates, setLoadingState]
  )

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
}

export function useLoadingContext() {
  const context = React.useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoadingContext must be used within a LoadingProvider')
  }
  return context
}

// ============================================================================
// LOADING STATE UTILITIES
// ============================================================================

/**
 * Utility to check if data is empty based on common patterns
 */
export function isDataEmpty(data: unknown): boolean {
  if (data === null || data === undefined) return true
  if (Array.isArray(data)) return data.length === 0
  if (typeof data === 'object') return Object.keys(data).length === 0
  if (typeof data === 'string') return data.trim().length === 0
  return false
}

/**
 * Utility to create consistent loading delays for better UX
 */
export function createLoadingDelay(minDelay = 300) {
  return new Promise((resolve) => setTimeout(resolve, minDelay))
}

/**
 * Utility to wrap async operations with consistent error handling
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  errorHandler?: (error: Error) => void
): Promise<T | null> {
  try {
    return await operation()
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error))
    errorHandler?.(errorObj)
    console.error('Operation failed:', errorObj)
    return null
  }
}
