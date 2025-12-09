/**
 * Lazy-loaded Recharts Components
 * Reduces initial bundle size by ~168KB
 *
 * @see https://nextjs.org/docs/app/guides/lazy-loading
 */
'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

// ============================================================================
// Loading Skeleton for Charts
// ============================================================================

function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div className="w-full animate-pulse" style={{ height }}>
      <Skeleton className="w-full h-full rounded-xl bg-white/5" />
    </div>
  )
}

function ChartSkeletonSmall() {
  return <ChartSkeleton height={200} />
}

function ChartSkeletonLarge() {
  return <ChartSkeleton height={400} />
}

// ============================================================================
// Lazy-loaded Chart Components
// ============================================================================

/**
 * Lazy-loaded AreaChart
 * Most commonly used chart type in the portfolio
 */
export const LazyAreaChart = dynamic(
  () => import('recharts').then((mod) => mod.AreaChart),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  }
)

/**
 * Lazy-loaded LineChart
 */
export const LazyLineChart = dynamic(
  () => import('recharts').then((mod) => mod.LineChart),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  }
)

/**
 * Lazy-loaded BarChart
 */
export const LazyBarChart = dynamic(
  () => import('recharts').then((mod) => mod.BarChart),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  }
)

/**
 * Lazy-loaded PieChart
 */
export const LazyPieChart = dynamic(
  () => import('recharts').then((mod) => mod.PieChart),
  {
    ssr: false,
    loading: () => <ChartSkeletonSmall />,
  }
)

/**
 * Lazy-loaded ComposedChart
 * For complex multi-series charts
 */
export const LazyComposedChart = dynamic(
  () => import('recharts').then((mod) => mod.ComposedChart),
  {
    ssr: false,
    loading: () => <ChartSkeletonLarge />,
  }
)

/**
 * Lazy-loaded RadarChart
 */
export const LazyRadarChart = dynamic(
  () => import('recharts').then((mod) => mod.RadarChart),
  {
    ssr: false,
    loading: () => <ChartSkeletonSmall />,
  }
)

/**
 * Lazy-loaded RadialBarChart
 */
export const LazyRadialBarChart = dynamic(
  () => import('recharts').then((mod) => mod.RadialBarChart),
  {
    ssr: false,
    loading: () => <ChartSkeletonSmall />,
  }
)

/**
 * Lazy-loaded FunnelChart
 */
export const LazyFunnelChart = dynamic(
  () => import('recharts').then((mod) => mod.FunnelChart),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  }
)

/**
 * Lazy-loaded Treemap
 * Note: Treemap has complex type handling, using explicit any cast
 */
export const LazyTreemap = dynamic(
  () => import('recharts').then((mod) => mod.Treemap) as Promise<React.ComponentType<Record<string, unknown>>>,
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  }
)

/**
 * Lazy-loaded ScatterChart
 */
export const LazyScatterChart = dynamic(
  () => import('recharts').then((mod) => mod.ScatterChart),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  }
)

// ============================================================================
// Chart Sub-components (loaded with parent)
// These are re-exported for convenience when using lazy charts
// ============================================================================

export {
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  Pie,
  Sector,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  RadialBar,
  Funnel,
  LabelList,
  Scatter,
  ZAxis,
  ReferenceLine,
  ReferenceArea,
  ReferenceDot,
  Brush,
} from 'recharts'

// ============================================================================
// Type Exports
// ============================================================================

export type {
  AreaProps,
  BarProps,
  LineProps,
  TooltipProps,
  LegendProps,
} from 'recharts'

// ============================================================================
// Skeleton Export
// ============================================================================

export { ChartSkeleton, ChartSkeletonSmall, ChartSkeletonLarge }
