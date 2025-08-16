'use client'

import React, { ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface WithQueryFeaturesProps {
  children: ReactNode
  queryKey?: string[]
  enableOptimisticUpdates?: boolean
  enableCrossTabSync?: boolean
  enableErrorBoundary?: boolean
}

export function WithQueryFeatures({
  children,
  queryKey = [],
  // enableOptimisticUpdates = false,
  // enableCrossTabSync = false,
  enableErrorBoundary = true,
}: WithQueryFeaturesProps) {
  const queryClient = useQueryClient()
  
  // Error boundary for query-related errors
  const [hasError, setHasError] = React.useState(false)
  
  React.useEffect(() => {
    if (!enableErrorBoundary) return
    
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      // Handle cache events - simplified for TypeScript compatibility
      if (event) {
        setHasError(true)
        toast.error('A data loading error occurred')
      }
    })
    
    return unsubscribe
  }, [queryClient, queryKey, enableErrorBoundary])
  
  if (hasError && enableErrorBoundary) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-lg font-semibold text-destructive mb-2">
          Something went wrong
        </h3>
        <p className="text-muted-foreground mb-4">
          There was an error loading data for this component.
        </p>
        <button
          onClick={() => {
            setHasError(false)
            queryKey.forEach(key => {
              queryClient.invalidateQueries({ queryKey: [key] })
            })
          }}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    )
  }
  
  return <>{children}</>
}