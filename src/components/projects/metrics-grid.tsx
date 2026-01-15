'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { MetricCard } from '@/components/ui/metric-card'
import type { MetricsGridProps } from '@/types/design-system'
import { designTokens } from '@/lib/tokens'

/**
 * Standardized Metrics Grid Component
 *
 * Provides consistent grid layout for metric cards with responsive behavior
 * and configurable column layouts. Implements design system spacing and
 * alignment patterns.
 */
export const MetricsGrid = React.forwardRef<HTMLDivElement, MetricsGridProps>(
  ({ metrics, columns = 3, loading = false, className, ...props }, ref) => {
    // Generate responsive grid classes based on column configuration
    const getGridClasses = (cols: number) => {
      const gridClasses: Record<number, string> = {
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      }
      return gridClasses[cols] || gridClasses[3]
    }

    // Generate loading skeleton cards
    const renderLoadingCards = () => {
      const cardCount = Math.min(columns * 2, 8) // Show reasonable number of loading cards
      return Array.from({ length: cardCount }, (_, index) => (
        <div
          key={`loading-${index}`}
          className="bg-card border border-border rounded-xl p-6 shadow-sm animate-pulse"
          style={{
            padding: designTokens.spacing.lg,
            borderRadius: designTokens.radius.xl,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className="h-10 w-10 bg-muted rounded-lg"
              style={{ borderRadius: designTokens.radius.lg }}
            />
            <div
              className="h-4 w-16 bg-muted rounded"
              style={{ borderRadius: designTokens.radius.sm }}
            />
          </div>
          <div className="space-y-2">
            <div
              className="h-8 w-24 bg-muted rounded"
              style={{ borderRadius: designTokens.radius.sm }}
            />
            <div
              className="h-4 w-20 bg-muted rounded"
              style={{ borderRadius: designTokens.radius.sm }}
            />
          </div>
        </div>
      ))
    }

    return (
      <div
        ref={ref}
        className={cn('grid gap-6', getGridClasses(columns), className)}
        style={{ gap: designTokens.spacing.lg }}
        data-testid="metrics-grid"
        {...props}
      >
        {loading
          ? renderLoadingCards()
          : metrics.map((metric, index) => (
              <MetricCard
                key={metric.id}
                icon={metric.icon!}
                label={metric.label}
                value={metric.value}
                subtitle={metric.subtitle}
                variant={metric.variant}
                trend={metric.trend}
                animationDelay={index * 100} // Stagger animations
                className="h-full" // Ensure consistent height across grid
              />
            ))}
      </div>
    )
  }
)

MetricsGrid.displayName = 'MetricsGrid'

/**
 * Utility function to create metric grid configurations
 * Helps maintain consistency across different project pages
 */
export function createMetricGridConfig(
  metrics: MetricsGridProps['metrics'],
  options?: {
    columns?: MetricsGridProps['columns']
    loading?: boolean
    className?: string
  }
): MetricsGridProps {
  return {
    metrics,
    columns: options?.columns || 3,
    loading: options?.loading || false,
    className: options?.className,
  }
}

/**
 * Responsive breakpoint utilities for metric grids
 * Provides consistent responsive behavior across all project pages
 */
export const metricGridBreakpoints = {
  mobile: 'grid-cols-1',
  tablet: 'md:grid-cols-2',
  desktop: 'lg:grid-cols-3',
  wide: 'xl:grid-cols-4',
} as const

/**
 * Predefined grid configurations for common use cases
 */
export const metricGridPresets = {
  compact: {
    columns: 2 as const,
    className: 'gap-4',
  },
  standard: {
    columns: 3 as const,
    className: 'gap-6',
  },
  expanded: {
    columns: 4 as const,
    className: 'gap-6',
  },
} as const
