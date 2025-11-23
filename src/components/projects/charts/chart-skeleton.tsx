'use client'

import { Skeleton } from '@/components/ui/skeleton'

export interface ChartSkeletonProps {
  height?: number
  showTitle?: boolean
  showDescription?: boolean
}

/**
 * Skeleton loader for chart components
 * Provides visual feedback while charts are being loaded
 */
export function ChartSkeleton({ 
  height = 350, 
  showTitle = true,
  showDescription = true 
}: ChartSkeletonProps) {
  return (
    <div className="space-y-4">
      {showTitle && (
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          {showDescription && <Skeleton className="h-4 w-96" />}
        </div>
      )}
      
      {/* Chart skeleton */}
      <div 
        className="w-full rounded-lg bg-gradient-to-r from-slate-800 to-slate-700 animate-pulse"
        style={{ height: `${height}px` }}
      >
        <div className="h-full flex items-center justify-center">
          <div className="space-y-3 w-full px-6">
            {/* Simulate chart bars */}
            <div className="flex items-end justify-around gap-2 h-64">
              <Skeleton className="h-32 w-8" />
              <Skeleton className="h-48 w-8" />
              <Skeleton className="h-24 w-8" />
              <Skeleton className="h-40 w-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer text skeleton */}
      <div className="pt-2">
        <Skeleton className="h-3 w-full" />
      </div>
    </div>
  )
}
