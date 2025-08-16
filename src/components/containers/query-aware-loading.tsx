'use client'

import { useQueryClient } from '@tanstack/react-query'
import { ShadcnSkeletonWrapper } from '@/components/ui/shadcn-skeleton-wrapper'

interface QueryAwareLoadingProps {
  // Query tracking
  queryKeys?: string[]
  trackGlobalLoading?: boolean
  showQueryStatus?: boolean
  
  // Cache awareness
  enableCacheIndicators?: boolean
  showStaleDataWarning?: boolean
  
  // Performance
  enableProgressiveLoading?: boolean
  
  // Pass-through to ShadcnSkeletonWrapper
  [key: string]: unknown
}

export function QueryAwareLoading({
  queryKeys = [],
  trackGlobalLoading = false,
  showQueryStatus = true,
  enableCacheIndicators = true,
  showStaleDataWarning = false,
  _enableProgressiveLoading = false,
  ...skeletonProps
}: QueryAwareLoadingProps) {
  const queryClient = useQueryClient()
  
  // Track specific query states
  const queryStates = queryKeys.map(key => {
    const queryState = queryClient.getQueryState([key])
    return {
      key,
      isLoading: queryState?.fetchStatus === 'fetching',
      hasData: queryState?.data !== undefined,
      isStale: false,
      error: queryState?.error,
    }
  })
  
  // Determine loading strategy
  const shouldShowSkeleton = trackGlobalLoading
    ? queryStates.some(state => state.isLoading)
    : queryStates.every(state => state.isLoading || !state.hasData)
  
  // Stale data warning
  const hasStaleData = showStaleDataWarning && queryStates.some(state => state.isStale && state.hasData)
  
  if (!shouldShowSkeleton) {
    return null
  }
  
  return (
    <div className="relative">
      {hasStaleData && (
        <div className="absolute top-0 left-0 right-0 z-20 p-2 bg-yellow-50 border-b border-yellow-200">
          <p className="text-xs text-yellow-800">
            Some data may be outdated. Refreshing...
          </p>
        </div>
      )}
      
      <ShadcnSkeletonWrapper
        layout="custom"
        queryKeys={queryKeys}
        showQueryStatus={showQueryStatus}
        enableCacheAwareness={enableCacheIndicators}
        {...skeletonProps}
      />
    </div>
  )
}