'use client'

import * as React from 'react'
import { Loader2, RefreshCw, AlertCircle, CheckCircle2, FileX, WifiOff } from 'lucide-react'
import { cn } from '@/lib/utils'
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
// SKELETON COMPONENTS
// ============================================================================

interface SkeletonCardProps {
  showImage?: boolean
  showTitle?: boolean
  showDescription?: boolean
  showMetrics?: boolean
  metricsCount?: number
  className?: string
}

export function SkeletonCard({
  showImage = true,
  showTitle = true,
  showDescription = true,
  showMetrics = false,
  metricsCount = 3,
  className,
}: SkeletonCardProps) {
  return (
    <div className={cn('bg-card border border-border rounded-xl overflow-hidden', className)}>
      {showImage && <Skeleton className="aspect-16/10 w-full rounded-none" />}
      <div className="p-6 space-y-4">
        {showTitle && <Skeleton className="h-6 w-3/4" />}
        {showDescription && (
          <>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </>
        )}
        {showMetrics && (
          <div className="grid grid-cols-3 gap-4 pt-4">
            {Array.from({ length: metricsCount }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-12" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

interface SkeletonMetricCardProps {
  className?: string
}

export function SkeletonMetricCard({ className }: SkeletonMetricCardProps) {
  return (
    <div className={cn('bg-card border border-border rounded-xl p-6', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="w-10 h-10 rounded-lg" />
      </div>
    </div>
  )
}

interface SkeletonChartProps {
  height?: number
  showTitle?: boolean
  showDescription?: boolean
  className?: string
}

export function SkeletonChart({
  height = 300,
  showTitle = true,
  showDescription = false,
  className,
}: SkeletonChartProps) {
  return (
    <div className={cn('bg-card border border-border rounded-xl p-6', className)}>
      {(showTitle || showDescription) && (
        <div className="mb-6 space-y-2">
          {showTitle && <Skeleton className="h-6 w-48" />}
          {showDescription && <Skeleton className="h-4 w-64" />}
        </div>
      )}
      <Skeleton className="w-full rounded-lg" style={{ height }} />
    </div>
  )
}

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
// ERROR COMPONENTS
// ============================================================================

interface ErrorDisplayProps {
  title?: string
  message?: string
  error?: Error | string
  onRetry?: () => void
  retryLabel?: string
  showDetails?: boolean
  variant?: 'default' | 'network' | 'not-found' | 'server'
  className?: string
}

export function ErrorDisplay({
  title,
  message,
  error,
  onRetry,
  retryLabel = 'Try Again',
  showDetails = false,
  variant = 'default',
  className,
}: ErrorDisplayProps) {
  const getErrorConfig = () => {
    switch (variant) {
      case 'network':
        return {
          icon: WifiOff,
          defaultTitle: 'Connection Error',
          defaultMessage: 'Unable to connect to the server. Please check your internet connection.',
          iconColor: 'text-warning',
        }
      case 'not-found':
        return {
          icon: FileX,
          defaultTitle: 'Not Found',
          defaultMessage: 'The requested resource could not be found.',
          iconColor: 'text-muted-foreground',
        }
      case 'server':
        return {
          icon: AlertCircle,
          defaultTitle: 'Server Error',
          defaultMessage: 'An internal server error occurred. Please try again later.',
          iconColor: 'text-destructive',
        }
      default:
        return {
          icon: AlertCircle,
          defaultTitle: 'Something went wrong',
          defaultMessage: 'An unexpected error occurred. Please try again.',
          iconColor: 'text-destructive',
        }
    }
  }

  const config = getErrorConfig()
  const Icon = config.icon
  const errorMessage = typeof error === 'string' ? error : error?.message

  return (
    <div
      className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}
    >
      <div
        className={cn(
          'w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-6',
          variant === 'network' && 'bg-warning/10',
          variant === 'server' && 'bg-destructive/10',
          variant === 'not-found' && 'bg-muted/20'
        )}
      >
        <Icon className={cn('w-8 h-8', config.iconColor)} />
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-2">{title || config.defaultTitle}</h3>

      <p className="text-muted-foreground mb-6 max-w-md">
        {message || errorMessage || config.defaultMessage}
      </p>

      {showDetails &&
        error &&
        typeof error !== 'string' &&
        process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-destructive/5 border border-destructive/20 rounded-lg text-left max-w-md w-full">
            <p className="text-sm text-destructive font-mono">{error.message}</p>
            {error.stack && (
              <pre className="text-xs text-destructive/80 mt-2 overflow-auto max-h-32">
                {error.stack}
              </pre>
            )}
          </div>
        )}

      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="min-w-32">
          <RefreshCw className="w-4 h-4 mr-2" />
          {retryLabel}
        </Button>
      )}
    </div>
  )
}

// ============================================================================
// EMPTY STATE COMPONENTS
// ============================================================================

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>
  title?: string
  message?: string
  action?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'outline' | 'ghost'
  }
  variant?: 'default' | 'search' | 'data'
  className?: string
}

export function EmptyState({
  icon: Icon = CheckCircle2,
  title = 'No data found',
  message = 'There is no data to display at the moment.',
  action,
  variant = 'default',
  className,
}: EmptyStateProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'search':
        return {
          iconBg: 'bg-primary/10',
          iconColor: 'text-primary',
        }
      case 'data':
        return {
          iconBg: 'bg-muted/50',
          iconColor: 'text-muted-foreground',
        }
      default:
        return {
          iconBg: 'bg-muted/50',
          iconColor: 'text-muted-foreground',
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <div
      className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}
    >
      <div
        className={cn(
          'w-16 h-16 rounded-full flex items-center justify-center mb-6',
          styles.iconBg
        )}
      >
        <Icon className={cn('w-8 h-8', styles.iconColor)} />
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>

      <p className="text-muted-foreground mb-6 max-w-md">{message}</p>

      {action && (
        <Button onClick={action.onClick} variant={action.variant || 'outline'} className="min-w-32">
          {action.label}
        </Button>
      )}
    </div>
  )
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
// DATA LOADING STATE COMPONENT
// ============================================================================

interface DataLoadingStateProps {
  loading?: boolean
  error?: string | Error | null
  empty?: boolean
  emptyMessage?: string
  emptyAction?: {
    label: string
    onClick: () => void
  }
  retryAction?: () => void
  children: React.ReactNode
  loadingComponent?: React.ReactNode
  errorVariant?: 'default' | 'network' | 'not-found' | 'server'
  className?: string
}

export function DataLoadingState({
  loading = false,
  error = null,
  empty = false,
  emptyMessage = 'No data available',
  emptyAction,
  retryAction,
  children,
  loadingComponent,
  errorVariant = 'default',
  className,
}: DataLoadingStateProps) {
  // Loading state
  if (loading) {
    return (
      <div className={cn('space-y-4', className)}>
        {loadingComponent || (
          <>
            <SkeletonGrid columns={3} rows={1} itemHeight="h-24" />
            <SkeletonChart height={300} />
          </>
        )}
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <ErrorDisplay
        error={error}
        onRetry={retryAction}
        variant={errorVariant}
        className={className}
      />
    )
  }

  // Empty state
  if (empty) {
    return (
      <EmptyState
        message={emptyMessage}
        action={emptyAction}
        variant="data"
        className={className}
      />
    )
  }

  // Success state - render children
  return <div className={className}>{children}</div>
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
      className={cn('transition-all duration-200', isLoading && 'opacity-75', className)}
      aria-label={showLabel ? undefined : 'Refresh data'}
    >
      <RefreshCw className={cn('w-4 h-4', isLoading && 'animate-spin')} />
      {showLabel && <span className="ml-2">{isLoading ? 'Refreshing...' : 'Refresh'}</span>}
    </Button>
  )
}
