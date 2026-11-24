'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { RefreshCw, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { Skeleton } from './skeleton'
import { CHART_BOX, type ChartBoxSize } from '@/components/charts/chart-skeleton'
import type {
  ChartAction as DesignChartAction,
  ChartContainerProps as DesignChartContainerProps,
} from '@/types/design-system'

const chartContainerVariants = cva(
  'relative rounded-xl border bg-card text-card-foreground transition-all duration-300 ease-out',
  {
    variants: {
      variant: {
        default: 'border-border shadow-sm',
        elevated: 'border-border shadow-md hover:shadow-lg',
        glass: 'border-border backdrop-blur-sm bg-card/80',
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

type ChartContainerProps = Omit<DesignChartContainerProps, 'title'> &
  Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> &
  VariantProps<typeof chartContainerVariants> & {
    title?: string
    /** Left-aligned footer line under the chart. */
    caption?: string
    /**
     * Chart box size. `'auto'` skips the CHART_BOX and uses natural height; only for
     * server-rendered, non-lazy content whose height is known at first paint.
     */
    size?: ChartBoxSize | 'auto'
    loading?: boolean
    error?: string
    actions?: DesignChartAction[]
    onRetry?: () => void
    /** Use 2 when the chart sits directly under the page h1; default 3 sits under an h2 section. */
    headingLevel?: 2 | 3
  }

interface ChartHeaderProps {
  title?: string
  description?: string
  actions?: DesignChartAction[]
  /** Use 2 when the chart sits directly under the page h1; default 3 sits under an h2 section. */
  headingLevel?: 2 | 3
  className?: string
}

const ChartHeader: React.FC<ChartHeaderProps> = ({
  title,
  description,
  actions,
  headingLevel = 3,
  className,
}) => {
  const hasActions = Boolean(actions && actions.length > 0)
  if (!title && !description && !hasActions) return null
  const Heading = headingLevel === 2 ? 'h2' : 'h3'
  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      <div>
        {title && (
          <Heading
            data-slot="chart-title"
            className="font-sans text-lg font-semibold leading-snug text-foreground"
          >
            {title}
          </Heading>
        )}
        {description && <p className="text-base text-muted-foreground mt-1">{description}</p>}
      </div>
      {hasActions && (
        <div className="flex gap-2">
          {actions?.map((action, index) => (
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
  )
}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  (
    {
      className,
      variant,
      padding,
      title,
      description,
      caption,
      children,
      size = 'lg',
      loading = false,
      error,
      actions,
      onRetry,
      headingLevel,
      ...props
    },
    ref
  ) => {
    // Mirror ChartHeader: it renders nothing without a title, description or
    // actions, so the skeleton must not reserve a header row either (no CLS).
    const hasActions = Boolean(actions && actions.length > 0)
    const hasHeader = Boolean(title || description || hasActions)

    if (loading) {
      return (
        <div
          ref={ref}
          aria-busy="true"
          className={cn(chartContainerVariants({ variant, padding }), className)}
          {...props}
        >
          <div className="space-y-4">
            {/* Header skeleton */}
            {hasHeader && (
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  {title && <Skeleton className="h-5 w-40" />}
                  {description && <Skeleton className="h-4 w-64" />}
                </div>
                {hasActions && (
                  <div className="flex gap-2">
                    {actions?.map((_, index) => (
                      <Skeleton key={index} className="h-9 w-20" />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Chart skeleton */}
            <div
              className={cn(
                CHART_BOX[size === 'auto' ? 'lg' : size],
                'rounded-lg bg-muted/20 animate-pulse'
              )}
            >
              <div className="flex items-center justify-center h-full">
                <div className="text-muted-foreground text-sm">Loading chart...</div>
              </div>
            </div>
          </div>
          {/* Reserve the caption row the loaded card adds below the box. */}
          {caption && <Skeleton className="mt-4 h-6 w-2/3" />}
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
            <ChartHeader
              title={title}
              description={description}
              actions={actions}
              headingLevel={headingLevel}
            />

            {/* Error state */}
            <div
              className={cn(
                CHART_BOX[size === 'auto' ? 'lg' : size],
                'flex flex-col items-center justify-center space-y-4 rounded-lg border border-destructive/20 bg-destructive/5 text-destructive'
              )}
            >
              <AlertCircle className="h-8 w-8" />
              <div className="text-center space-y-2">
                <p>Failed to load chart</p>
                <p>{error}</p>
                {onRetry && (
                  <Button variant="outline" size="sm" onClick={onRetry} className="mt-2">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                )}
              </div>
            </div>
          </div>
          {caption && <p className="text-base text-muted-foreground mt-4">{caption}</p>}
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
          <ChartHeader
            title={title}
            description={description}
            actions={actions}
            headingLevel={headingLevel}
          />

          {/* Chart content */}
          <div className={size === 'auto' ? undefined : cn(CHART_BOX[size], 'overflow-hidden')}>
            {children}
          </div>
        </div>
        {caption && <p className="text-base text-muted-foreground mt-4">{caption}</p>}
      </div>
    )
  }
)

ChartContainer.displayName = 'ChartContainer'

export { ChartContainer, ChartHeader }
