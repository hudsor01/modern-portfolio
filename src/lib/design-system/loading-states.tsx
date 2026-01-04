/**
 * Standardized Loading States
 *
 * Provides consistent loading components and patterns for data refresh
 * functionality across all project pages.
 */

'use client'

import * as React from 'react'
import { Loader2, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { refreshVariants } from './interactive-elements'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

// ============================================================================
// LOADING SPINNER COMPONENT
// ============================================================================

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'primary' | 'muted'
  className?: string
}

export function LoadingSpinner({
  size = 'md',
  variant = 'default',
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  }

  const variantClasses = {
    default: 'text-foreground',
    primary: 'text-primary',
    muted: 'text-muted-foreground',
  }

  return (
    <Loader2
      className={cn('animate-spin', sizeClasses[size], variantClasses[variant], className)}
      aria-label="Loading..."
    />
  )
}

// ============================================================================
// REFRESH BUTTON COMPONENT
// ============================================================================

interface RefreshButtonProps {
  onRefresh: () => void | Promise<void>
  disabled?: boolean
  loading?: boolean
  size?: 'sm' | 'default' | 'lg'
  variant?: 'default' | 'ghost' | 'outline'
  showLabel?: boolean
  className?: string
}

export function RefreshButton({
  onRefresh,
  disabled = false,
  loading = false,
  size = 'default',
  variant = 'ghost',
  showLabel = false,
  className,
}: RefreshButtonProps) {
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  const handleRefresh = React.useCallback(async () => {
    if (disabled || loading || isRefreshing) return

    setIsRefreshing(true)
    try {
      await onRefresh()
    } finally {
      setIsRefreshing(false)
    }
  }, [onRefresh, disabled, loading, isRefreshing])

  const isLoading = loading || isRefreshing

  return (
    <Button
      onClick={handleRefresh}
      disabled={disabled || isLoading}
      variant={variant}
      size={size}
      className={cn(refreshVariants({ state: isLoading ? 'refreshing' : 'idle' }), className)}
      aria-label={showLabel ? undefined : 'Refresh data'}
    >
      <RefreshCw className={cn('w-4 h-4', isLoading && 'animate-spin')} />
      {showLabel && <span className="ml-2">{isLoading ? 'Refreshing...' : 'Refresh'}</span>}
    </Button>
  )
}

// ============================================================================
// DATA LOADING STATE COMPONENT
// ============================================================================

interface DataLoadingStateProps {
  loading?: boolean
  error?: string | null
  empty?: boolean
  emptyMessage?: string
  retryAction?: () => void
  children: React.ReactNode
  loadingComponent?: React.ReactNode
  className?: string
}

export function DataLoadingState({
  loading = false,
  error = null,
  empty = false,
  emptyMessage = 'No data available',
  retryAction,
  children,
  loadingComponent,
  className,
}: DataLoadingStateProps) {
  // Loading state
  if (loading) {
    return (
      <div className={cn('space-y-4', className)}>
        {loadingComponent || (
          <>
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </>
        )}
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center py-12 px-4 text-center',
          className
        )}
      >
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">Something went wrong</h3>
        <p className="text-muted-foreground mb-6 max-w-md">{error}</p>
        {retryAction && (
          <Button onClick={retryAction} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    )
  }

  // Empty state
  if (empty) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center py-12 px-4 text-center',
          className
        )}
      >
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <CheckCircle2 className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No data found</h3>
        <p className="text-muted-foreground max-w-md">{emptyMessage}</p>
      </div>
    )
  }

  // Success state - render children
  return <div className={className}>{children}</div>
}

// ============================================================================
// LOADING OVERLAY COMPONENT
// ============================================================================

interface LoadingOverlayProps {
  loading?: boolean
  message?: string
  children: React.ReactNode
  className?: string
}

export function LoadingOverlay({
  loading = false,
  message = 'Loading...',
  children,
  className,
}: LoadingOverlayProps) {
  return (
    <div className={cn('relative', className)}>
      {children}
      {loading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <LoadingSpinner size="lg" variant="primary" />
            <p className="text-sm text-muted-foreground font-medium">{message}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// SKELETON GRID COMPONENT
// ============================================================================

interface SkeletonGridProps {
  columns?: 1 | 2 | 3 | 4
  rows?: number
  itemHeight?: string
  gap?: 'sm' | 'md' | 'lg'
  className?: string
}

export function SkeletonGrid({
  columns = 3,
  rows = 3,
  itemHeight = 'h-24',
  gap = 'md',
  className,
}: SkeletonGridProps) {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  }

  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  const totalItems = columns * rows

  return (
    <div className={cn('grid', gridClasses[columns], gapClasses[gap], className)}>
      {Array.from({ length: totalItems }).map((_, index) => (
        <Skeleton key={index} className={cn('w-full', itemHeight)} />
      ))}
    </div>
  )
}

// ============================================================================
// PROGRESSIVE LOADING COMPONENT
// ============================================================================

interface ProgressiveLoadingProps {
  stages: Array<{
    id: string
    label: string
    completed: boolean
  }>
  currentStage?: string
  className?: string
}

export function ProgressiveLoading({ stages, currentStage, className }: ProgressiveLoadingProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {stages.map((stage, index) => {
        const isActive = stage.id === currentStage
        const isCompleted = stage.completed
        const isPending = !isCompleted && !isActive

        return (
          <div key={stage.id} className="flex items-center gap-3">
            <div
              className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ease-out',
                isCompleted && 'bg-primary text-primary-foreground',
                isActive && 'bg-primary/20 text-primary animate-pulse',
                isPending && 'bg-muted text-muted-foreground'
              )}
            >
              {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <span>{index + 1}</span>}
            </div>
            <span
              className={cn(
                'text-sm font-medium transition-colors duration-300 ease-out',
                isCompleted && 'text-foreground',
                isActive && 'text-primary',
                isPending && 'text-muted-foreground'
              )}
            >
              {stage.label}
            </span>
            {isActive && <LoadingSpinner size="sm" variant="primary" />}
          </div>
        )
      })}
    </div>
  )
}
