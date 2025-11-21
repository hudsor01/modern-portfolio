/**
 * shadcn/ui-Based Components Export Index
 * 
 * Simplified components built on proven shadcn/ui foundation
 * Reduces custom code by 90% while maintaining all functionality
 */

// ============================================================================
// PRIMARY COMPONENTS (shadcn/ui based)
// ============================================================================

// Charts
export { ShadcnChartContainer } from '@/components/charts/shadcn-chart-container'

// Forms
export { ShadcnContactForm } from '@/app/contact/components/shadcn-contact-form'

// Query-Aware Business Logic Containers
export { 
  QueryAwareChart,
  QueryAwareContactForm,
  QueryAwareLoading,
  WithQueryFeatures 
} from '@/components/containers/query-aware-containers'

// Loading States
export { 
  ShadcnSkeletonWrapper,
  FormSkeletonWrapper,
  ChartSkeletonWrapper,
  CardSkeletonWrapper,
  TextSkeletonWrapper,
} from '@/components/ui/shadcn-skeleton-wrapper'

// ============================================================================
// DIRECT shadcn/ui EXPORTS (for convenience)
// ============================================================================

// Core UI Components
export { Button } from '@/components/ui/button'
export { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
export { Input } from '@/components/ui/input'
export { Textarea } from '@/components/ui/textarea'
export { Label } from '@/components/ui/label'
export { Badge } from '@/components/ui/badge'
export { Skeleton } from '@/components/ui/skeleton'
export { Progress } from '@/components/ui/progress'
export { Separator } from '@/components/ui/separator'

// Form Components
export { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form'

// Chart Components
export { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig 
} from '@/components/ui/chart'

// Notification
export { toast } from 'sonner'

// ============================================================================
// MIGRATION ALIASES (for easier transition)
// ============================================================================

// Contact Forms
export { ShadcnContactForm as ContactForm } from '@/app/contact/components/shadcn-contact-form'
export { ShadcnContactForm as EnhancedContactForm } from '@/app/contact/components/shadcn-contact-form'
export { ShadcnContactForm as UnifiedContactForm } from '@/app/contact/components/shadcn-contact-form'

// Charts
export { ShadcnChartContainer as BarChart } from '@/components/charts/shadcn-chart-container'
export { ShadcnChartContainer as EnhancedBarChart } from '@/components/charts/shadcn-chart-container'
export { ShadcnChartContainer as UnifiedBarChart } from '@/components/charts/shadcn-chart-container'

// Loading Components
export { FormSkeletonWrapper as LoadingSpinner } from '@/components/ui/shadcn-skeleton-wrapper'
export { CardSkeletonWrapper as ProjectSkeleton } from '@/components/ui/shadcn-skeleton-wrapper'
export { CardSkeletonWrapper as BlogPostSkeleton } from '@/components/ui/shadcn-skeleton-wrapper'
export { ShadcnSkeletonWrapper as UnifiedSkeletonLoader } from '@/components/ui/shadcn-skeleton-wrapper'

// ============================================================================
// TYPED COMPONENT VARIANTS (pre-configured)
// ============================================================================

import React from 'react'
import { ShadcnContactForm } from '@/app/contact/components/shadcn-contact-form'
import { ShadcnChartContainer } from '@/components/charts/shadcn-chart-container'
import { ShadcnSkeletonWrapper } from '@/components/ui/shadcn-skeleton-wrapper'
import { 
  QueryAwareChart,
  QueryAwareContactForm,
  QueryAwareLoading
} from '@/components/containers/query-aware-containers'

// Contact Form Variants
export function MinimalContactForm(props: React.ComponentProps<typeof ShadcnContactForm>) {
  return React.createElement(ShadcnContactForm, { ...props, variant: "minimal" })
}

export function DetailedContactForm(props: React.ComponentProps<typeof ShadcnContactForm>) {
  return React.createElement(ShadcnContactForm, { ...props, variant: "detailed", showOptionalFields: true })
}

export function QuickContactForm(props: React.ComponentProps<typeof ShadcnContactForm>) {
  return React.createElement(ShadcnContactForm, { ...props, variant: "default", enableAutoSave: false })
}

// Chart Variants
export function SimpleChart(props: React.ComponentProps<typeof ShadcnChartContainer>) {
  return React.createElement(ShadcnChartContainer, { ...props, variant: "minimal", showTrend: false })
}

export function DetailedChart(props: React.ComponentProps<typeof ShadcnChartContainer>) {
  return React.createElement(ShadcnChartContainer, { ...props, variant: "detailed", showTrend: true, enableRealTime: true })
}

export function RealtimeChart(props: React.ComponentProps<typeof ShadcnChartContainer>) {
  return React.createElement(ShadcnChartContainer, { ...props, enableRealTime: true, pollInterval: 10000 })
}

// Query-Aware Container Variants
export function OptimisticChart(props: React.ComponentProps<typeof QueryAwareChart>) {
  return React.createElement(QueryAwareChart, { 
    ...props, 
    enableOptimisticUpdates: true, 
    enableCrossTabSync: true,
    enableRealTime: true 
  })
}

export function CachedChart(props: React.ComponentProps<typeof QueryAwareChart>) {
  return React.createElement(QueryAwareChart, { 
    ...props, 
    staleTime: 1000 * 60 * 10, // 10 minutes
    enableCrossTabSync: true
  })
}

export function SmartContactForm(props: React.ComponentProps<typeof QueryAwareContactForm>) {
  return React.createElement(QueryAwareContactForm, { 
    ...props, 
    enableOptimisticSubmission: true,
    enableCrossTabAutoSave: true,
    enableAnalyticsTracking: true,
    retryFailedSubmissions: true
  })
}

export function ProgressiveLoading(props: React.ComponentProps<typeof QueryAwareLoading>) {
  return React.createElement(QueryAwareLoading, { 
    ...props, 
    enableProgressiveLoading: true,
    showQueryStatus: true,
    enableCacheIndicators: true
  })
}

// Skeleton Variants
export function FormLoader(props: React.ComponentProps<typeof ShadcnSkeletonWrapper>) {
  return React.createElement(ShadcnSkeletonWrapper, { ...props, layout: "form" })
}

export function ChartLoader(props: React.ComponentProps<typeof ShadcnSkeletonWrapper>) {
  return React.createElement(ShadcnSkeletonWrapper, { ...props, layout: "chart" })
}

export function CardLoader(props: React.ComponentProps<typeof ShadcnSkeletonWrapper>) {
  return React.createElement(ShadcnSkeletonWrapper, { ...props, layout: "card" })
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Create chart configuration for shadcn/ui charts
 */
export function createChartConfig(dataKeys: string[], colors?: string[]) {
  const defaultColors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ]
  
  return dataKeys.reduce((config, key, index) => {
    config[key] = {
      label: key.charAt(0).toUpperCase() + key.slice(1),
      color: (colors?.[index] ?? defaultColors[index % defaultColors.length]) as string,
    }
    return config
  }, {} as Record<string, { label: string; color: string }>)
}

/**
 * Pre-built chart configurations for common use cases
 */
export const CHART_CONFIGS = {
  revenue: createChartConfig(['revenue'], ['hsl(var(--chart-1))']),
  growth: createChartConfig(['growth'], ['hsl(var(--chart-2))']),
  performance: createChartConfig(['performance'], ['hsl(var(--chart-3))']),
  multiMetric: createChartConfig(['revenue', 'growth', 'performance']),
} as const

// ============================================================================
// FEATURE FLAGS (for gradual migration)
// ============================================================================

export const SHADCN_MIGRATION_ENABLED = {
  CONTACT_FORMS: true,
  CHARTS: true,
  SKELETONS: true,
  FULL_MIGRATION: true,
} as const

/**
 * Check if shadcn/ui migration is enabled for a component type
 */
export function isShadcnEnabled(componentType: keyof typeof SHADCN_MIGRATION_ENABLED): boolean {
  return SHADCN_MIGRATION_ENABLED[componentType]
}

// ============================================================================
// PERFORMANCE UTILITIES
// ============================================================================

/**
 * Lazy load shadcn components for better performance
 */
export const LazyContactForm = React.lazy(() =>
  import('@/app/contact/components/shadcn-contact-form').then(m => ({ default: m.ShadcnContactForm }))
)

export const LazyChartContainer = React.lazy(() => 
  import('@/components/charts/shadcn-chart-container').then(m => ({ default: m.ShadcnChartContainer }))
)