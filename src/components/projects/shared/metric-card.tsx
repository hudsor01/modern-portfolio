'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import type { MetricCardProps as DesignMetricCardProps } from '@/types/design-system'

const metricCardVariants = cva(
  'relative group rounded-xl border bg-card text-card-foreground transition-all duration-300 ease-out hover:shadow-md hover:-translate-y-1',
  {
    variants: {
      variant: {
        primary: 'border-primary/20 hover:border-primary/40 hover:shadow-primary/10',
        secondary: 'border-secondary/20 hover:border-secondary/40 hover:shadow-secondary/10',
        success: 'border-success/20 hover:border-success/30 hover:shadow-success/10',
        warning: 'border-warning/20 hover:border-warning/30 hover:shadow-warning/10',
        info: 'border-primary/20 hover:border-primary/30 hover:shadow-primary/10',
      },
      size: {
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
)

const iconVariants = cva('rounded-xl p-3 transition-colors duration-150 ease-out', {
  variants: {
    variant: {
      primary: 'bg-primary/10 text-primary',
      secondary: 'bg-secondary/10 text-secondary',
      success: 'bg-success/10 text-success',
      warning: 'bg-warning/10 text-warning',
      info: 'bg-primary/10 text-primary',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
})

const trendVariants = cva('inline-flex items-center gap-1 text-xs font-medium', {
  variants: {
    direction: {
      up: 'text-success',
      down: 'text-destructive',
      neutral: 'text-muted-foreground',
    },
  },
  defaultVariants: {
    direction: 'neutral',
  },
})

type MetricCardProps = DesignMetricCardProps &
  React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof metricCardVariants>

function getTrendIcon(direction: 'up' | 'down' | 'neutral' | undefined): typeof TrendingUp {
  switch (direction) {
    case 'up':
      return TrendingUp
    case 'down':
      return TrendingDown
    default:
      return Minus
  }
}

const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  (
    {
      className,
      variant,
      size,
      icon: Icon,
      label,
      value,
      subtitle,
      trend,
      animationDelay = 0,
      loading = false,
      ...props
    },
    ref
  ) => {
    const TrendIcon = getTrendIcon(trend?.direction)

    if (loading) {
      return (
        <div
          ref={ref}
          className={cn(metricCardVariants({ variant, size }), className)}
          style={{ animationDelay: `${animationDelay}ms` }}
          {...props}
        >
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-8 w-24 mb-2" />
          {subtitle && <Skeleton className="h-4 w-20" />}
          {trend && <Skeleton className="h-4 w-16 mt-2" />}
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(metricCardVariants({ variant, size }), 'animate-fade-in-up', className)}
        style={{ animationDelay: `${animationDelay}ms` }}
        {...props}
      >
        {/* Subtle glow effect */}
        <div
          className={cn(
            'absolute inset-0 rounded-xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 ease-out',
            variant === 'primary' && 'bg-gradient-to-r from-primary/20 to-primary/5',
            variant === 'secondary' && 'bg-gradient-to-r from-secondary/20 to-secondary/5',
            variant === 'success' && 'bg-gradient-to-r from-success/20 to-success/5',
            variant === 'warning' && 'bg-gradient-to-r from-warning/20 to-warning/5',
            variant === 'info' && 'bg-gradient-to-r from-primary/20 to-primary/5'
          )}
        />

        {/* Card content */}
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className={cn(iconVariants({ variant }))}>
              <Icon className="h-6 w-6" />
            </div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {label}
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-2xl font-semibold tracking-tight">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>

            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}

            {trend && (
              <div className={cn(trendVariants({ direction: trend.direction }))}>
                <TrendIcon className="h-3 w-3" />
                <span>{trend.value}</span>
                <span className="text-muted-foreground">{trend.label}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
)

MetricCard.displayName = 'MetricCard'

export { MetricCard, metricCardVariants }
