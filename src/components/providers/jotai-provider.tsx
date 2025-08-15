/**
 * Jotai Provider Component
 * Provides atomic state management with SSR support
 */

'use client'

import React, { useEffect, useMemo, useRef } from 'react'
import { Provider as JotaiRootProvider, createStore } from 'jotai'
import { DevTools } from 'jotai-devtools'
import {
  initializeAnalyticsAtom,
  analyticsEnabledAtom,
  setAnalyticsConsentAtom,
  systemThemeAtom,
  debugModeAtom
} from '@/lib/atoms'
import { isClient } from '@/lib/atoms/utils'
import type { AtomInitialValues, ErrorBoundaryProps, LogValue, RenderFunction } from '@/types/common'

interface JotaiProviderWrapperProps {
  children: React.ReactNode
  initialValues?: AtomInitialValues
}

/**
 * Jotai Provider with SSR support and initialization
 */
export function JotaiProviderWrapper({
  children,
  initialValues = {}
}: Readonly<JotaiProviderWrapperProps>) {
  // Create a stable store instance
  const store = useMemo(() => createStore(), [])
  const initialized = useRef(false)

  // Initialize atoms with SSR-safe values
  useEffect(() => {
    if (initialized.current || !isClient()) return
    initialized.current = true

    // Initialize system theme detection
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const systemTheme = mediaQuery.matches ? 'dark' : 'light'
    store.set(systemThemeAtom, systemTheme)

    // Listen for system theme changes
    const handleThemeChange = (e: MediaQueryListEvent) => {
      store.set(systemThemeAtom, e.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleThemeChange)

    // Initialize analytics if consent is already given
    const analyticsEnabled = store.get(analyticsEnabledAtom)
    if (analyticsEnabled) {
      store.set(initializeAnalyticsAtom)
    }

    // Initialize any custom values passed from server
    Object.entries(initialValues).forEach(([key, value]) => {
      // Only set if the atom exists and hasn't been set yet
      try {
        // This would require a registry of atoms by key
        // For now, we'll skip this feature to keep it simple
        console.debug(`Initial value for ${key}:`, value)
      } catch (error) {
        console.warn(`Failed to set initial value for ${key}:`, error)
      }
    })

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleThemeChange)
    }
  }, [store, initialValues])

  // Handle page visibility changes for analytics
  useEffect(() => {
    if (!isClient()) return

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Resume analytics tracking
        const analyticsEnabled = store.get(analyticsEnabledAtom)
        if (analyticsEnabled) {
          store.set(initializeAnalyticsAtom)
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [store])

  // Handle storage changes from other tabs
  useEffect(() => {
    if (!isClient()) return

    const handleStorageChange = (event: StorageEvent) => {
      // Handle changes to persisted atoms from other tabs
      if (event.key === 'analytics-consent' && event.newValue !== null) {
        const consent = JSON.parse(event.newValue)
        store.set(setAnalyticsConsentAtom, consent)
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [store])

  const showDevTools = useMemo(() => {
    if (typeof window === 'undefined') return false
    if (process.env.NODE_ENV !== 'development') return false

    try {
      return store.get(debugModeAtom)
    } catch {
      return false
    }
  }, [store])

  return (
    <JotaiRootProvider store={store}>
      {children}
      {showDevTools && <JotaiDevTools />}
    </JotaiRootProvider>
  )
}

/**
 * Jotai DevTools component (development only)
 */
function JotaiDevTools() {
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <DevTools
      theme="dark"
      position="bottom-right"
      isInitialOpen={false}
    />
  )
}

/**
 * SSR-safe hook for getting initial server state
 */
export function getServerState() {
  // This could be expanded to extract server-side state
  // For now, we'll return empty state for client-side hydration
  return {}
}

/**
 * Hook for hydrating client state after SSR
 */
export function useHydrateAtoms(initialValues: AtomInitialValues) {
  const store = useMemo(() => createStore(), [])
  const hydrated = useRef(false)

  useEffect(() => {
    if (hydrated.current || !isClient()) return
    hydrated.current = true

    // Hydrate atoms with initial values
    Object.entries(initialValues).forEach(([key, value]) => {
      try {
        // This would require a registry of atoms by key
        // For now, we'll log for debugging
        console.debug(`Hydrating ${key} with:`, value)
      } catch (error) {
        console.warn(`Failed to hydrate ${key}:`, error)
      }
    })
  }, [initialValues])

  return store
}

/**
 * Error Boundary for Jotai Provider
 */
interface JotaiErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class JotaiErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  JotaiErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): JotaiErrorBoundaryState {
    return { hasError: true, error }
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Jotai Provider Error:', error, errorInfo)

    // Log error to analytics if available
    if (isClient() && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: false
      })
    }
  }

  override render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return <FallbackComponent error={this.state.error!} />
    }

    return this.props.children
  }
}

/**
 * Default error fallback component
 */
function DefaultErrorFallback({ error }: Readonly<{ error: Error }>) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 dark:bg-red-900/20">
      <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex-shrink-0">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Application Error
            </h3>
          </div>
        </div>

        <div className="text-gray-600 dark:text-gray-300 mb-4">
          <p>Something went wrong with the application state management.</p>
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-2">
              <summary className="cursor-pointer text-sm font-medium">
                Error Details
              </summary>
              <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => window.location.reload()}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Reload Page
          </button>
          <button
            onClick={() => window.history.back()}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Main Jotai Provider with Error Boundary
 */
export function JotaiProvider({
  children,
  initialValues = {},
  errorFallback
}: JotaiProviderWrapperProps & {
  errorFallback?: React.ComponentType<{ error: Error }>
}) {
  return (
    <JotaiErrorBoundary fallback={errorFallback}>
      <JotaiProviderWrapper initialValues={initialValues}>
        {children}
      </JotaiProviderWrapper>
    </JotaiErrorBoundary>
  )
}

/**
 * Hook for debugging atoms in development
 */
export function useAtomDebugger() {
  const debugMode = process.env.NODE_ENV === 'development'

  const logAtomValue = React.useCallback((name: string, value: LogValue) => {
    if (debugMode) {
      }
  }, [debugMode])

  const logAtomUpdate = React.useCallback((name: string, oldValue: LogValue, newValue: LogValue) => {
    if (debugMode) {
      }
  }, [debugMode])

  return { logAtomValue, logAtomUpdate, debugMode }
}

/**
 * Performance monitoring hook for atoms
 */
export function useAtomPerformance() {
  const performanceEnabled = process.env.NODE_ENV === 'development'

  const measureAtomRender = React.useCallback((atomName: string, renderFn: RenderFunction) => {
    if (!performanceEnabled) return renderFn()

    const start = performance.now()
    const result = renderFn()
    const end = performance.now()

    return result
  }, [performanceEnabled])

  return { measureAtomRender }
}
