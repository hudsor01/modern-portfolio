'use client'

/**
 * TanStack Query Provider
 * Production-grade setup with advanced features
 */

import React, { useState, useEffect } from 'react'
import { ContactFormData } from '@/types/shared-api'
import {
  QueryClient,
  QueryClientProvider,
  QueryErrorResetBoundary,
  onlineManager,
  focusManager,
} from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { createContextLogger } from '@/lib/monitoring/logger'

const queryLogger = createContextLogger('TanStackQuery')

// ============================================================================
// QUERY CLIENT FACTORY
// ============================================================================

function makeQueryClient() {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes
        retry: (failureCount, error: unknown) => {
          if (
            error &&
            typeof error === 'object' &&
            'status' in error &&
            typeof error.status === 'number' &&
            error.status >= 400 &&
            error.status < 500
          )
            return false
          return failureCount < 2
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        networkMode: 'online',
      },
      mutations: {
        retry: 2,
        networkMode: 'online',
      },
    },
  })

  // ADVANCED: Global error handler
  client.setMutationDefaults(['contact'], {
    mutationFn: async (data: ContactFormData) => {
      // Add global headers
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Version': process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Mutation failed')
      return response.json()
    },
  })

  // ADVANCED: Global query observer
  client.getQueryCache().subscribe((event) => {
    // Track slow queries
    if (event.type === 'updated' && event.action?.type === 'success') {
      const query = event.query
      const fetchTime = Date.now() - query.state.dataUpdatedAt
      if (fetchTime > 3000) {
        queryLogger.warn('Slow query detected', {
          queryKey: query.queryKey,
          duration: fetchTime,
        })
      }
    }
  })

  // ADVANCED: Mutation observer for offline queue
  client.getMutationCache().subscribe((event) => {
    if (event.type === 'updated' && event.action?.type === 'pending') {
      if (!navigator.onLine) {
        queryLogger.info('Mutation queued for offline sync', { mutation: event.mutation })
      }
    }
  })

  return client
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    // Browser: make client if we don't already have one
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

// ============================================================================
// ERROR FALLBACK COMPONENT
// ============================================================================

function QueryErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error
  resetErrorBoundary: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-destructive/5 dark:bg-destructive-bg p-8 rounded-lg max-w-md">
        <h2 className="typography-h4 text-destructive dark:text-destructive-foreground mb-4">
          Data Fetching Error
        </h2>
        <p className="text-destructive dark:text-destructive mb-4">
          {error.message || 'Something went wrong while fetching data'}
        </p>
        <div className="flex gap-4">
          <button
            onClick={resetErrorBoundary}
            className="px-4 py-2 bg-destructive text-foreground rounded-xs hover:bg-destructive transition"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-muted text-foreground rounded-xs hover:bg-muted transition"
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// NETWORK STATUS MANAGER
// ============================================================================

function NetworkStatusManager() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // Setup online/offline detection
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      onlineManager.setOnline(true)
      queryLogger.info('Back online - resuming queries')
    }

    const handleOffline = () => {
      setIsOnline(false)
      onlineManager.setOnline(false)
      queryLogger.info('Gone offline - pausing queries')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Show offline indicator
  if (!isOnline) {
    return (
      <div className="fixed bottom-4 left-4 bg-warning text-foreground px-4 py-2 rounded-lg shadow-lg z-50">
        <span className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
            />
          </svg>
          Offline Mode - Changes will sync when reconnected
        </span>
      </div>
    )
  }

  return null
}

// ============================================================================
// FOCUS MANAGER
// ============================================================================

function FocusManager() {
  useEffect(() => {
    // Custom focus detection
    focusManager.setEventListener((handleFocus) => {
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          handleFocus()
        }
      }

      // Node.js 24 Fix: Store stable function reference for proper cleanup
      // Previously created new function each time, causing memory leak
      const handleWindowFocus = () => handleFocus()

      // Listen to visibilitychange and focus
      document.addEventListener('visibilitychange', handleVisibilityChange)
      window.addEventListener('focus', handleWindowFocus)

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange)
        window.removeEventListener('focus', handleWindowFocus)
      }
    })
  }, [])

  return null
}

// ============================================================================
// MAIN PROVIDER COMPONENT
// ============================================================================

export function TanStackQueryProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(() => getQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            FallbackComponent={QueryErrorFallback}
            onError={(error) => {
              queryLogger.error('Query Error Boundary', error)
            }}
          >
            {children}
            <NetworkStatusManager />
            <FocusManager />
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </QueryClientProvider>
  )
}

// ============================================================================
// SUSPENSE PROVIDER (OPTIONAL)
// ============================================================================

export function TanStackSuspenseProvider({ children }: { children: React.ReactNode }) {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
        </div>
      }
    >
      {children}
    </React.Suspense>
  )
}
