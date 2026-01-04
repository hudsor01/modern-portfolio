'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import type { LucideIcon } from 'lucide-react'
import { RefreshCw, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { Skeleton } from './skeleton'

const chartContainerVariants = cva(
  'relative rounded-xl border bg-card text-card-foreground transition-all duration-300 ease-out',
  {
    variants: {
      variant: {
        default: 'border-border shadow-sm',
        elevated: 'border-border shadow-md hover:shadow-lg',
        glass: 'border-border/50 backdrop-blur-sm bg-card/80',
      },
      padding: {
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
    },
  }
)

export interface ChartAction {
  label: string
  icon?: LucideIcon
  onClick: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

export interface ChartContainerProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof chartContainerVariants> {
  title: string
  description?: string
  children: React.ReactNode
  height?: number
  loading?: boolean
  error?: string
  actions?: ChartAction[]
  onRetry?: () => void
}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  (
    {
      className,
      variant,
      padding,
      title,
      description,
      children,
      height = 400,
      loading = false,
      error,
      actions,
      onRetry,
      ...props
    },
    ref
  ) => {
    if (loading) {
      return (
        <div
          ref={ref}
          className={cn(chartContainerVariants({ variant, padding }), className)}
          {...props}
        >
          <div className="space-y-4">
            {/* Header skeleton */}
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                {description && <Skeleton className="h-4 w-64" />}
              </div>
              {actions && actions.length > 0 && (
                <div className="flex gap-2">
                  {actions.map((_, index) => (
                    <Skeleton key={index} className="h-9 w-20" />
                  ))}
                </div>
              )}
            </div>

            {/* Chart skeleton */}
            <div
              className="w-full rounded-lg bg-muted/20 animate-pulse"
              style={{ height: `${height}px` }}
            >
              <div className="flex items-center justify-center h-full">
                <div className="text-muted-foreground text-sm">Loading chart...</div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (error) {
      return (
        <div
          ref={ref}
          className={cn(chartContainerVariants({ variant, padding }), className)}
          {...props}
        >
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold leading-none tracking-tight">{title}</h3>
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
              </div>
              {actions && actions.length > 0 && (
                <div className="flex gap-2">
                  {actions.map((action, index) => (
                    <Button
                      key={index}
                      variant={action.variant === 'primary' ? 'default' : 'outline'}
                      size="sm"
                      onClick={action.onClick}
                      disabled={action.disabled}
                    >
                      {action.icon && <action.icon className="h-4 w-4 mr-2" />}
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Error state */}
            <div
              className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-destructive/20 bg-destructive/5 text-destructive"
              style={{ height: `${height}px` }}
            >
              <AlertCircle className="h-8 w-8" />
              <div className="text-center space-y-2">
                <p className="font-medium">Failed to load chart</p>
                <p className="text-sm text-muted-foreground">{error}</p>
                {onRetry && (
                  <Button variant="outline" size="sm" onClick={onRetry} className="mt-2">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(chartContainerVariants({ variant, padding }), className)}
        {...props}
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold leading-none tracking-tight">{title}</h3>
              {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
            {actions && actions.length > 0 && (
              <div className="flex gap-2">
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant === 'primary' ? 'default' : 'outline'}
                    size="sm"
                    onClick={action.onClick}
                    disabled={action.disabled}
                  >
                    {action.icon && <action.icon className="h-4 w-4 mr-2" />}
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Chart content */}
          <div className="w-full" style={{ height: `${height}px` }}>
            {children}
          </div>
        </div>
      </div>
    )
  }
)

ChartContainer.displayName = 'ChartContainer'

export { ChartContainer, chartContainerVariants }
