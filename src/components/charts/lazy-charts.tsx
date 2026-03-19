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
import { Tooltip, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import {
  tooltipStyles,
  gridStyles,
  axisStyles,
  chartConfig,
} from '@/lib/charts'

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
 * Using proper type definition for Treemap component
 */
export const LazyTreemap = dynamic(
  () => import('recharts').then((mod) => mod.Treemap as React.ComponentType<Record<string, unknown>>),
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
// Skeleton Export
// ============================================================================

export { ChartSkeleton, ChartSkeletonSmall, ChartSkeletonLarge }

// ============================================================================
// Helper Components (consolidated from chart-components.tsx)
// ============================================================================

// Props interfaces
interface ChartContainerProps {
  children: React.ReactNode
  height?: keyof typeof chartConfig.heights | number
  className?: string
}

interface ChartTooltipProps {
  active?: boolean
  payload?: Array<{ value: number; name: string; color?: string; payload?: Record<string, unknown> }>
  label?: string
  formatter?: (value: number, name: string) => [string, string]
  labelFormatter?: (label: string) => string
}

interface ChartGridProps {
  vertical?: boolean
  horizontal?: boolean
}

interface ChartAxisProps {
  dataKey?: string
  domain?: [number | string, number | string]
  tickFormatter?: (value: string | number) => string
  angle?: number
  textAnchor?: 'start' | 'middle' | 'end'
  height?: number
  width?: number
}

// Standardized chart container
export function ChartContainer({
  children,
  height = 'standard',
  className = '',
}: ChartContainerProps) {
  const containerHeight = typeof height === 'number'
    ? height
    : chartConfig.heights[height]

  return (
    <div className={`w-full ${className}`} style={{ height: containerHeight }}>
      <ResponsiveContainer width="100%" height="100%">
        {children as React.ReactElement}
      </ResponsiveContainer>
    </div>
  )
}

// Standardized tooltip component
export function ChartTooltip({
  active,
  payload,
  label,
  formatter,
  labelFormatter,
}: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  const formatLabel = labelFormatter || ((l: string) => `Period: ${l}`)
  const formatValue = formatter || ((value: number, name: string) => [
    `${value}`,
    name.charAt(0).toUpperCase() + name.slice(1),
  ])

  return (
    <div
      className="rounded-lg border bg-card p-3 shadow-lg"
      style={tooltipStyles}
    >
      <p className="font-medium mb-2">{formatLabel(label || '')}</p>
      {payload.map((entry, index) => {
        const [formattedValue, formattedName] = formatValue(entry.value, entry.name)
        return (
          <p key={index} className="text-sm">
            <span style={{ color: entry.color }}>{formattedName}:</span>
            <span className="font-semibold ml-1">{formattedValue}</span>
          </p>
        )
      })}
    </div>
  )
}

// Standardized grid component
export function ChartGrid({ vertical = false, horizontal = true }: ChartGridProps) {
  return (
    <CartesianGrid
      {...gridStyles}
      vertical={vertical}
      horizontal={horizontal}
    />
  )
}

// Standardized X-axis component
export function ChartXAxis({
  dataKey,
  tickFormatter,
  angle,
  textAnchor,
  height,
  ...props
}: ChartAxisProps) {
  return (
    <XAxis
      dataKey={dataKey}
      {...axisStyles}
      tickFormatter={tickFormatter}
      {...(angle && { angle })}
      {...(textAnchor && { textAnchor })}
      {...(height && { height })}
      {...props}
    />
  )
}

// Standardized Y-axis component
export function ChartYAxis({
  tickFormatter,
  domain,
  width,
  ...props
}: ChartAxisProps) {
  return (
    <YAxis
      {...axisStyles}
      tickFormatter={tickFormatter}
      {...(domain && { domain })}
      {...(width && { width })}
      {...props}
    />
  )
}

// Standard Recharts Tooltip with theme
export function StandardTooltip(props: Record<string, unknown>) {
  return (
    <Tooltip
      contentStyle={tooltipStyles}
      {...props}
    />
  )
}

// Chart wrapper with standard styling and caption
interface ChartWrapperProps {
  children: React.ReactNode
  title?: string
  caption?: string
  height?: keyof typeof chartConfig.heights | number
  className?: string
}

export function ChartWrapper({
  children,
  title,
  caption,
  height = 'standard',
  className = '',
}: ChartWrapperProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {title && (
        <h3 className="typography-h4 text-center">{title}</h3>
      )}

      <ChartContainer height={height}>
        {children}
      </ChartContainer>

      {caption && (
        <p className="text-center text-sm italic text-muted-foreground mt-4">
          {caption}
        </p>
      )}
    </div>
  )
}
