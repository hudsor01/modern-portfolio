'use client'

import React from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ShadcnChartContainer } from '@/components/charts/shadcn-chart-container'
import { toast } from 'sonner'
import type { ChartConfig } from '@/components/ui/chart'
import type { ChartDataPoint } from '@/types/chart'

interface QueryAwareChartProps {
  // Required props
  title: string
  dataKey: string
  chartConfig: ChartConfig
  
  // Data source
  endpoint?: string
  queryKey?: string[]
  staticData?: ChartDataPoint[]
  
  // Chart behavior
  enableRealTime?: boolean
  enableOptimisticUpdates?: boolean
  enableCrossTabSync?: boolean
  
  // TanStack Query options
  staleTime?: number
  refetchInterval?: number
  retryOnError?: boolean
  
  // Event handlers
  onDataChange?: (data: ChartDataPoint[]) => void
  onError?: (error: Error) => void
  
  // Pass-through to ShadcnChartContainer
  [key: string]: unknown
}

export function QueryAwareChart({
  title,
  dataKey,
  chartConfig,
  endpoint,
  queryKey = ['chart-data'],
  staticData,
  enableRealTime = false,
  _enableOptimisticUpdates = false,
  enableCrossTabSync = false,
  staleTime = 1000 * 60 * 5, // 5 minutes
  refetchInterval = enableRealTime ? 30000 : undefined,
  retryOnError = true,
  onDataChange,
  onError,
  ...chartProps
}: QueryAwareChartProps) {
  const queryClient = useQueryClient()
  
  // Advanced query with business logic
  const chartQuery = useQuery({
    queryKey: [...queryKey, endpoint],
    queryFn: endpoint ? async () => {
      const response = await fetch(endpoint)
      if (!response.ok) {
        throw new Error(`Failed to fetch chart data: ${response.statusText}`)
      }
      return response.json()
    } : undefined,
    enabled: !!endpoint,
    staleTime,
    refetchInterval,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: retryOnError ? 3 : false,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    select: (data) => {
      // Transform data and trigger callbacks
      const transformedData = data || staticData || []
      onDataChange?.(transformedData)
      return transformedData
    },
  })
  
  // Handle query errors in TanStack Query v5 style
  React.useEffect(() => {
    if (chartQuery?.error) {
      console.error('Chart query error:', chartQuery.error)
      onError?.(chartQuery.error as Error)
      toast.error(`Chart loading failed: ${(chartQuery.error as Error).message}`)
    }
  }, [chartQuery?.error, onError])
  
  // Cross-tab synchronization
  React.useEffect(() => {
    if (!enableCrossTabSync) return
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `query-${queryKey.join('-')}` && e.newValue) {
        try {
          const newData = JSON.parse(e.newValue)
          queryClient.setQueryData(queryKey, newData)
        } catch (error) {
          console.warn('Failed to sync chart data across tabs:', error)
        }
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [enableCrossTabSync, queryKey, queryClient])
  
  // Sync data to localStorage for cross-tab communication
  React.useEffect(() => {
    if (enableCrossTabSync && chartQuery.data) {
      localStorage.setItem(`query-${queryKey.join('-')}`, JSON.stringify(chartQuery.data))
    }
  }, [enableCrossTabSync, chartQuery.data, queryKey])
  
  return (
    <ShadcnChartContainer
      title={title}
      dataKey={dataKey}
      chartConfig={chartConfig}
      endpoint={endpoint}
      staticData={chartQuery.data || staticData || []}
      enableRealTime={enableRealTime}
      onError={onError}
      {...chartProps}
    />
  )
}