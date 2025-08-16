'use client'

import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useQueryClient, useIsFetching } from '@tanstack/react-query'

interface ShadcnSkeletonWrapperProps {
  layout: 'form' | 'chart' | 'card' | 'text' | 'custom'
  variant?: 'default' | 'compact' | 'detailed'
  count?: number
  className?: string
  children?: React.ReactNode
  // TanStack Query integration
  queryKeys?: string[]
  showQueryStatus?: boolean
  enableCacheAwareness?: boolean
}

// Form skeleton layout
const FormSkeleton = ({ variant = 'default' }: { variant?: string }) => (
  <Card className="w-full max-w-2xl mx-auto">
    <CardHeader className="text-center space-y-2">
      <Skeleton className="h-8 w-48 mx-auto" />
      <Skeleton className="h-4 w-64 mx-auto" />
    </CardHeader>
    <CardContent className="space-y-6">
      {/* Name and Email row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      
      {/* Subject */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      
      {/* Message */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className={cn(
          "w-full",
          variant === 'detailed' ? "h-48" : "h-32"
        )} />
      </div>
      
      {/* Submit button */}
      <Skeleton className="h-12 w-full" />
    </CardContent>
  </Card>
)

// Chart skeleton layout
const ChartSkeleton = ({ variant = 'default' }: { variant?: string }) => (
  <Card className="w-full">
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <Skeleton className="w-full h-[350px]" />
      {variant === 'detailed' && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="text-center p-3 bg-muted/30 rounded-lg">
              <Skeleton className="h-4 w-16 mx-auto mb-2" />
              <Skeleton className="h-6 w-12 mx-auto" />
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
)

// Card skeleton layout
const CardSkeleton = ({ variant = 'default' }: { variant?: string }) => (
  <Card className="w-full">
    <CardHeader>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </CardHeader>
    <CardContent className="space-y-4">
      {variant === 'detailed' && (
        <>
          <Skeleton className="h-32 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </>
      )}
      <div className="flex justify-between">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-16" />
      </div>
    </CardContent>
  </Card>
)

// Text skeleton layout
const TextSkeleton = ({ variant = 'default' }: { variant?: string }) => {
  const lines = variant === 'compact' ? 2 : variant === 'detailed' ? 6 : 4
  
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={cn(
            "h-4",
            i === lines - 1 ? "w-3/4" : "w-full"
          )} 
        />
      ))}
    </div>
  )
}

export function ShadcnSkeletonWrapper({
  layout,
  variant = 'default',
  count = 1,
  className,
  children,
  queryKeys = [],
  showQueryStatus = false,
  enableCacheAwareness = false,
}: ShadcnSkeletonWrapperProps) {
  const queryClient = useQueryClient()
  const isFetching = useIsFetching({ 
    queryKey: queryKeys.length > 0 ? queryKeys : undefined 
  })
  
  // Cache awareness - check if we have cached data
  const hasCachedData = enableCacheAwareness && queryKeys.some(key => {
    const data = queryClient.getQueryData([key])
    return data !== undefined
  })
  
  // Query status indicator
  const QueryStatusBadge = () => {
    if (!showQueryStatus || (!isFetching && !hasCachedData)) return null
    
    return (
      <div className="absolute top-2 right-2 z-10">
        <Badge 
          variant={isFetching ? "default" : "secondary"}
          className={cn(
            "text-xs",
            isFetching && "animate-pulse"
          )}
        >
          {isFetching ? "Loading..." : hasCachedData ? "Cached" : ""}
        </Badge>
      </div>
    )
  }
  
  // Custom layout with children
  if (layout === 'custom' && children) {
    return <div className={className}>{children}</div>
  }
  
  // Render appropriate skeleton layout
  const renderSkeleton = () => {
    switch (layout) {
      case 'form':
        return <FormSkeleton variant={variant} />
      
      case 'chart':
        return <ChartSkeleton variant={variant} />
      
      case 'card':
        return <CardSkeleton variant={variant} />
      
      case 'text':
        return <TextSkeleton variant={variant} />
      
      default:
        return <TextSkeleton variant={variant} />
    }
  }
  
  // Single skeleton with query status
  if (count === 1) {
    return (
      <div className={cn("relative", className)}>
        <QueryStatusBadge />
        {renderSkeleton()}
      </div>
    )
  }
  
  // Multiple skeletons with grid layout
  const gridClasses: Record<string, string> = {
    form: '',
    chart: '',
    card: 'grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    text: 'space-y-4',
    custom: '',
  }
  
  return (
    <div className={cn("relative", gridClasses[layout] || '', className)}>
      <QueryStatusBadge />
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  )
}

// Convenience components for common use cases
export const FormSkeletonWrapper = (props: Omit<ShadcnSkeletonWrapperProps, 'layout'>) => 
  <ShadcnSkeletonWrapper {...props} layout="form" />

export const ChartSkeletonWrapper = (props: Omit<ShadcnSkeletonWrapperProps, 'layout'>) => 
  <ShadcnSkeletonWrapper {...props} layout="chart" />

export const CardSkeletonWrapper = (props: Omit<ShadcnSkeletonWrapperProps, 'layout'>) => 
  <ShadcnSkeletonWrapper {...props} layout="card" />

export const TextSkeletonWrapper = (props: Omit<ShadcnSkeletonWrapperProps, 'layout'>) => 
  <ShadcnSkeletonWrapper {...props} layout="text" />