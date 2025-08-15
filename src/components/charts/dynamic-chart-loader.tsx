'use client'

import React, { Suspense, lazy, memo } from 'react'
import { Loader2 } from 'lucide-react'

// Chart loading component
const ChartLoader = memo(() => (
  <div className="flex items-center justify-center p-8 bg-white/5 backdrop-blur border border-white/10 rounded-xl">
    <div className="flex flex-col items-center space-y-3">
      <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      <p className="text-gray-300 text-sm">Loading chart...</p>
    </div>
  </div>
))

ChartLoader.displayName = 'ChartLoader'

// Dynamic chart imports with error boundaries
export const DynamicRevenueBarChart = lazy(() =>
  import('@/app/projects/revenue-kpi/RevenueBarChart').then(module => ({
    default: module.default
  }))
)

export const DynamicRevenueLineChart = lazy(() =>
  import('@/app/projects/revenue-kpi/RevenueLineChart').then(module => ({
    default: module.default
  }))
)

export const DynamicTopPartnersChart = lazy(() =>
  import('@/app/projects/revenue-kpi/TopPartnersChart').then(module => ({
    default: module.default
  }))
)

export const DynamicPartnerGroupPieChart = lazy(() =>
  import('@/app/projects/revenue-kpi/PartnerGroupPieChart').then(module => ({
    default: module.default
  }))
)

// Reusable chart wrapper with suspense
interface ChartWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export const ChartWrapper = memo(({ children, fallback = <ChartLoader /> }: ChartWrapperProps) => (
  <Suspense fallback={fallback}>
    {children}
  </Suspense>
))

ChartWrapper.displayName = 'ChartWrapper'

// Higher-order component for lazy chart loading
export function withDynamicChart<T extends object>(
  importFunction: () => Promise<{ default: React.ComponentType<T> }>,
  fallback?: React.ReactNode
) {
  const LazyChart = lazy(importFunction)
  
  return memo((props: T) => (
    <ChartWrapper fallback={fallback}>
      <LazyChart {...props} />
    </ChartWrapper>
  ))
}