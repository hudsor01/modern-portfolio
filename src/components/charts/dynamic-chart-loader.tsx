'use client'

import React, { Suspense, lazy, memo } from 'react'
import { ChartSkeletonWrapper } from '@/components/ui/shadcn-skeleton-wrapper'

// Modern chart loading component using shadcn/ui skeleton
const ChartLoader = memo(() => (
  <ChartSkeletonWrapper variant="detailed" />
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