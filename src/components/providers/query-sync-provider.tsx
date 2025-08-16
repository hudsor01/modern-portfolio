'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useSharedState } from '@/hooks/use-component-consolidation-queries'
import { ContactFormData } from '@/types/shared-api'

interface QuerySyncContextValue {
  // Global app state
  appState: AppState
  updateAppState: (updates: Partial<AppState>) => void
  
  // Cross-tab synchronization
  isOnline: boolean
  tabId: string
  
  // Query synchronization
  syncQuery: (key: string, data: unknown) => void
  getSharedQuery: (key: string) => unknown
  
  // Real-time features
  lastSyncTime: Date | null
  pendingSyncs: number
}

interface AppState {
  // User preferences
  theme: 'light' | 'dark' | 'auto'
  language: string
  
  // UI state
  sidebarOpen: boolean
  modalStack: string[]
  
  // Form states
  contactFormDraft: Partial<ContactFormData> | null
  searchQuery: string
  
  // Feature flags
  enableAnalytics: boolean
  enableRealtime: boolean
  enableAnimations: boolean
  
  // Performance
  prefetchEnabled: boolean
  cacheStrategy: 'aggressive' | 'conservative' | 'minimal'
}

const defaultAppState: AppState = {
  theme: 'dark',
  language: 'en',
  sidebarOpen: false,
  modalStack: [],
  contactFormDraft: null,
  searchQuery: '',
  enableAnalytics: true,
  enableRealtime: true,
  enableAnimations: true,
  prefetchEnabled: true,
  cacheStrategy: 'aggressive',
}

const QuerySyncContext = createContext<QuerySyncContextValue | null>(null)

interface QuerySyncProviderProps {
  children: React.ReactNode
  enableCrossTab?: boolean
  enableRealtime?: boolean
  syncInterval?: number
}

export function QuerySyncProvider({
  children,
  enableCrossTab = true,
  enableRealtime = true,
  syncInterval = 5000,
}: QuerySyncProviderProps) {
  const queryClient = useQueryClient()
  const [tabId] = useState(() => crypto.randomUUID())
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true)
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)
  const [pendingSyncs, setPendingSyncs] = useState(0)

  // Shared app state across components and tabs
  const { data: appState, updateData: updateAppState } = useSharedState<AppState>(
    'app-state',
    defaultAppState,
    { 
      persist: true, 
      sync: enableCrossTab 
    }
  )

  // Shared query cache for cross-component synchronization
  const { data: sharedQueries, updateData: updateSharedQueries } = useSharedState<Record<string, unknown>>(
    'shared-queries',
    {},
    { 
      persist: false, 
      sync: enableCrossTab 
    }
  )

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Cross-tab query synchronization
  useEffect(() => {
    if (!enableCrossTab) return

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'shared_shared-queries' && e.newValue) {
        try {
          const newQueries = JSON.parse(e.newValue)
          
          // Sync important queries to local query cache
          Object.entries(newQueries).forEach(([key, data]) => {
            if (shouldSyncQuery(key)) {
              queryClient.setQueryData(JSON.parse(key), data)
            }
          })
          
          setLastSyncTime(new Date())
        } catch (error) {
          console.warn('Failed to sync queries across tabs:', error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [enableCrossTab, queryClient])

  // Query synchronization helpers  
  const syncQuery = useCallback((key: string, data: unknown) => {
    const current = sharedQueries || {}
    updateSharedQueries({
      ...current,
      [key]: data
    })
    setPendingSyncs(prev => prev + 1)
  }, [sharedQueries, updateSharedQueries])

  // Real-time query synchronization
  useEffect(() => {
    if (!enableRealtime) return

    const interval = setInterval(() => {
      // Sync critical queries periodically
      const cache = queryClient.getQueryCache()
      const queries = cache.getAll()
      
      let synced = 0
      queries.forEach(query => {
        if (shouldSyncQuery(query.queryKey) && query.state.data) {
          syncQuery(JSON.stringify(query.queryKey), query.state.data)
          synced++
        }
      })
      
      if (synced > 0) {
        setLastSyncTime(new Date())
        setPendingSyncs(prev => Math.max(0, prev - synced))
      }
    }, syncInterval)

    return () => clearInterval(interval)
  }, [enableRealtime, syncInterval, queryClient, syncQuery])

  const getSharedQuery = (key: string) => {
    return sharedQueries?.[key]
  }

  // Determine which queries should be synchronized
  const shouldSyncQuery = (queryKey: unknown): boolean => {
    const key = Array.isArray(queryKey) ? queryKey : [queryKey]
    const keyStr = JSON.stringify(key)
    
    // Sync important data that should be consistent across components/tabs
    const syncableKeys = [
      'projects',
      'blog',
      'analytics',
      'app-state',
      'user-preferences',
      'form-state',
    ]
    
    return syncableKeys.some(syncKey => keyStr.includes(syncKey))
  }

  // Enhanced app state update with validation and side effects
  const handleAppStateUpdate = (updates: Partial<AppState>) => {
    const newState = { ...appState, ...updates }
    
    // Validate state updates
    if (updates.theme && !['light', 'dark', 'auto'].includes(updates.theme)) {
      console.warn('Invalid theme value:', updates.theme)
      return
    }
    
    if (updates.cacheStrategy && !['aggressive', 'conservative', 'minimal'].includes(updates.cacheStrategy)) {
      console.warn('Invalid cache strategy:', updates.cacheStrategy)
      return
    }
    
    // Apply side effects based on state changes
    if (updates.cacheStrategy) {
      updateQueryCacheConfig(updates.cacheStrategy)
    }
    
    if (updates.prefetchEnabled !== undefined) {
      updatePrefetchBehavior(updates.prefetchEnabled)
    }
    
    if (updates.enableRealtime !== undefined) {
      updateRealtimeBehavior(updates.enableRealtime)
    }
    
    updateAppState(newState)
  }

  // Update query cache configuration based on cache strategy
  const updateQueryCacheConfig = (strategy: AppState['cacheStrategy']) => {
    const configs = {
      aggressive: {
        defaultOptions: {
          queries: {
            staleTime: 10 * 60 * 1000, // 10 minutes
            gcTime: 60 * 60 * 1000, // 1 hour
          }
        }
      },
      conservative: {
        defaultOptions: {
          queries: {
            staleTime: 2 * 60 * 1000, // 2 minutes
            gcTime: 15 * 60 * 1000, // 15 minutes
          }
        }
      },
      minimal: {
        defaultOptions: {
          queries: {
            staleTime: 0, // Always stale
            gcTime: 5 * 60 * 1000, // 5 minutes
          }
        }
      }
    }
    
    // Apply new configuration
    queryClient.setDefaultOptions(configs[strategy].defaultOptions)
  }

  const updatePrefetchBehavior = (enabled: boolean) => {
    // Could integrate with prefetch hooks to enable/disable prefetching
    console.log('Prefetch behavior updated:', enabled)
  }

  const updateRealtimeBehavior = (enabled: boolean) => {
    // Could pause/resume polling queries
    if (!enabled) {
      // Pause all polling queries
      const cache = queryClient.getQueryCache()
      cache.getAll().forEach(query => {
        if (query.observers.some(observer => observer.options.refetchInterval)) {
          query.observers.forEach(_observer => {
            // observer.updateOptions({ refetchInterval: false })
          })
        }
      })
    }
  }

  const contextValue: QuerySyncContextValue = {
    appState: appState || defaultAppState,
    updateAppState: handleAppStateUpdate,
    isOnline,
    tabId,
    syncQuery,
    getSharedQuery,
    lastSyncTime,
    pendingSyncs,
  }

  return (
    <QuerySyncContext.Provider value={contextValue}>
      {children}
      
      {/* Debug panel for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-50">
          <details className="bg-gray-900/90 backdrop-blur border border-white/10 rounded-lg p-3 text-xs text-white max-w-sm">
            <summary className="cursor-pointer font-semibold mb-2">
              Query Sync Debug
            </summary>
            <div className="space-y-2">
              <div>Tab ID: {tabId.slice(0, 8)}...</div>
              <div>Online: {isOnline ? 'Yes' : 'No'}</div>
              <div>Last Sync: {lastSyncTime?.toLocaleTimeString() || 'Never'}</div>
              <div>Pending: {pendingSyncs}</div>
              <div>Cache Strategy: {appState?.cacheStrategy}</div>
              <div>Realtime: {appState?.enableRealtime ? 'On' : 'Off'}</div>
              <div>Prefetch: {appState?.prefetchEnabled ? 'On' : 'Off'}</div>
              <div>Shared Queries: {Object.keys(sharedQueries || {}).length}</div>
            </div>
          </details>
        </div>
      )}
    </QuerySyncContext.Provider>
  )
}

export function useQuerySync() {
  const context = useContext(QuerySyncContext)
  if (!context) {
    throw new Error('useQuerySync must be used within a QuerySyncProvider')
  }
  return context
}

// Helper hook for component-specific state synchronization
export function useSyncedComponentState<T>(
  componentId: string,
  initialState: T
): [T, (updates: Partial<T>) => void] {
  const { appState, updateAppState } = useQuerySync()
  
  const stateKey = `component_${componentId}`
  const currentState = ((appState as unknown) as Record<string, unknown>)[stateKey] as T || initialState
  
  const updateState = (updates: Partial<T>) => {
    updateAppState({
      [stateKey]: { ...currentState, ...updates }
    } as Partial<AppState>)
  }
  
  return [currentState, updateState]
}