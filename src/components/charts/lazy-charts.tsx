/**
 * Lazy-loaded Recharts Components
 * Reduces initial bundle size by ~168KB
 *
 * @see https://nextjs.org/docs/app/guides/lazy-loading
 */
'use client'

import type React from 'react'
import dynamic from 'next/dynamic'
import { cn } from '@/lib/utils'
import { CHART_BOX, ChartSkeleton, type ChartBoxSize } from './chart-skeleton'
import {
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  type YAxisProps,
} from 'recharts'
import { tooltipStyles, gridStyles, axisStyles } from '@/lib/charts'

// ============================================================================
// Lazy-loaded Chart Components
// ============================================================================

/**
 * Lazy-loaded AreaChart
 * Most commonly used chart type in the portfolio
 */
export const LazyAreaChart = dynamic(() => import('recharts').then((mod) => mod.AreaChart), {
  ssr: false,
  loading: () => <ChartSkeleton />,
})

/**
 * Lazy-loaded LineChart
 */
export const LazyLineChart = dynamic(() => import('recharts').then((mod) => mod.LineChart), {
  ssr: false,
  loading: () => <ChartSkeleton />,
})

/**
 * Lazy-loaded BarChart
 */
export const LazyBarChart = dynamic(() => import('recharts').then((mod) => mod.BarChart), {
  ssr: false,
  loading: () => <ChartSkeleton />,
})

/**
 * Lazy-loaded PieChart
 */
export const LazyPieChart = dynamic(() => import('recharts').then((mod) => mod.PieChart), {
  ssr: false,
  loading: () => <ChartSkeleton height="sm" />,
})

/**
 * Lazy-loaded ComposedChart
 * For complex multi-series charts
 */
export const LazyComposedChart = dynamic(
  () => import('recharts').then((mod) => mod.ComposedChart),
  {
    ssr: false,
    loading: () => <ChartSkeleton height="lg" />,
  }
)

/**
 * Lazy-loaded RadarChart
 */
export const LazyRadarChart = dynamic(() => import('recharts').then((mod) => mod.RadarChart), {
  ssr: false,
  loading: () => <ChartSkeleton height="sm" />,
})

/**
 * Lazy-loaded ScatterChart
 */
export const LazyScatterChart = dynamic(() => import('recharts').then((mod) => mod.ScatterChart), {
  ssr: false,
  loading: () => <ChartSkeleton />,
})

// ============================================================================
// Helper Components (consolidated from chart-components.tsx)
// ============================================================================

// Props interfaces
interface ChartContainerProps {
  children: React.ReactNode
  size?: ChartBoxSize
  className?: string
}

interface ChartGridProps {
  vertical?: boolean
  horizontal?: boolean
  yAxisId?: string | number
}

interface ChartAxisProps {
  dataKey?: string
  domain?: [number | string, number | string]
  tickFormatter?: (value: string | number) => string
  angle?: number
  textAnchor?: 'start' | 'middle' | 'end'
  height?: number
  width?: number
  yAxisId?: string | number
  orientation?: 'left' | 'right'
  label?: YAxisProps['label']
}

// Standardized chart container
function ChartContainer({ children, size = 'md', className = '' }: ChartContainerProps) {
  return (
    <div className={cn(CHART_BOX[size], className)}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        {children as React.ReactElement}
      </ResponsiveContainer>
    </div>
  )
}

// Standardized grid component
export function ChartGrid({ vertical = false, horizontal = true, yAxisId }: ChartGridProps) {
  return (
    <CartesianGrid
      {...gridStyles}
      vertical={vertical}
      horizontal={horizontal}
      {...(yAxisId !== undefined && { yAxisId })}
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
}: Omit<ChartAxisProps, 'orientation' | 'label' | 'yAxisId'>) {
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
export function ChartYAxis({ tickFormatter, domain, width, ...props }: ChartAxisProps) {
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
  return <Tooltip contentStyle={tooltipStyles} {...props} />
}

// Chart wrapper with standard styling and caption
interface ChartWrapperProps {
  children: React.ReactNode
  title?: string
  caption?: string
  size?: ChartBoxSize
  className?: string
  /** Use 2 when the chart sits directly under the page h1; default 3 sits under an h2 section. */
  headingLevel?: 2 | 3
}

export function ChartWrapper({
  children,
  title,
  caption,
  size = 'md',
  className = '',
  headingLevel = 3,
}: ChartWrapperProps) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3'
  return (
    <div className={`space-y-4 ${className}`}>
      {title && <Heading className="typography-h4 text-center leading-snug">{title}</Heading>}

      <ChartContainer size={size}>{children}</ChartContainer>

      {caption && <p className="text-center italic mt-4">{caption}</p>}
    </div>
  )
}
