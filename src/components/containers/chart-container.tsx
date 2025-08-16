'use client'

import { useState, useEffect, useMemo } from 'react'
import { ShadcnChartContainer } from '@/components/charts/shadcn-chart-container'
import { ShadcnSkeletonWrapper } from '@/components/ui/shadcn-skeleton-wrapper'
import { useChartData } from '@/hooks/use-component-consolidation-queries'
import type { ChartDataPoint } from '@/types/chart'
import type { ChartData } from '@/types/project'

interface ChartContainerProps {
  // Data source configuration
  endpoint?: string
  staticData?: ChartData[]
  dataTransform?: (rawData: ChartDataPoint[]) => ChartData[]
  
  // Chart configuration
  title: string
  dataKey: string
  xAxisKey?: string
  
  // Container behavior
  variant?: 'default' | 'minimal' | 'detailed'
  enablePrefetch?: boolean
  enableCaching?: boolean
  
  // Real-time options
  pollInterval?: number
  enableRealTime?: boolean
  
  // Visual configuration
  colors?: string[]
  height?: number
  className?: string
  
  // Event handlers
  onDataLoad?: (data: ChartData[]) => void
  onInteraction?: (type: string, data: ChartDataPoint) => void
  onError?: (error: Error) => void
  
  // Formatting
  valueFormatter?: (value: number) => string
}

export function ChartContainer({
  endpoint,
  staticData,
  dataTransform,
  title,
  dataKey,
  xAxisKey = 'name',
  variant = 'default',
  // enablePrefetch = true,
  enableCaching = true,
  pollInterval = 30000,
  enableRealTime = false,
  // colors,
  height,
  className,
  onDataLoad,
  // onInteraction,
  onError,
  valueFormatter,
}: ChartContainerProps) {
  const [chartState, setChartState] = useState<{
    lastUpdated: Date | null
    interactionCount: number
    error: string | null
  }>({
    lastUpdated: null,
    interactionCount: 0,
    error: null,
  })

  // Business logic hooks
  const chartQuery = useChartData(endpoint || '', {
    realtime: enableRealTime,
    ...(enableRealTime && pollInterval && { pollInterval }),
    ...(dataTransform && { transform: dataTransform as ((data: unknown) => ChartData[]) }),
    suspense: false,
    dependencies: [endpoint, enableRealTime, pollInterval],
  })

  // const chartInteraction = useChartInteraction(`chart-${title.toLowerCase().replace(/\s+/g, '-')}`)

  // Determine data source - memoized to prevent re-creation
  const chartData = useMemo(() => {
    return staticData || (endpoint && chartQuery?.data ? (chartQuery.data as ChartData[]) : []) || []
  }, [staticData, endpoint, chartQuery?.data])

  // Container logic - handle data updates
  useEffect(() => {
    if (chartData.length > 0) {
      setChartState(prev => ({
        ...prev,
        lastUpdated: new Date(),
        error: null,
      }))
      
      onDataLoad?.(chartData)
    }
  }, [chartData, onDataLoad])

  // Container logic - handle query errors
  useEffect(() => {
    if (chartQuery?.error) {
      const error = chartQuery.error as Error
      setChartState(prev => ({
        ...prev,
        error: error.message,
      }))
      
      onError?.(error)
    }
  }, [chartQuery?.error, onError])

  // Chart interactions disabled for simplification

  // Data updates disabled for simplification

  // Loading state with intelligent skeleton
  if (endpoint && chartQuery?.isLoading) {
    return (
      <ShadcnSkeletonWrapper
        layout="chart"
        variant={variant === 'minimal' ? 'compact' : variant}
        {...(className && { className })}
        // chartTitle={true}
        // chartControls={variant !== 'minimal'}
      />
    )
  }

  // Error state
  if (chartState.error) {
    return (
      <div className={`w-full ${className}`}>
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
          <h3 className="text-lg font-semibold text-red-400 mb-2">{title}</h3>
          <p className="text-red-400 mb-4">Failed to load chart data</p>
          <p className="text-sm text-gray-400 mb-4">{chartState.error}</p>
          {chartQuery?.refetch && (
            <button
              onClick={() => chartQuery.refetch()}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    )
  }

  // No data state
  if (chartData.length === 0) {
    return (
      <div className={`w-full ${className}`}>
        <div className="bg-gray-500/10 border border-gray-500/20 rounded-2xl p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-400 mb-2">{title}</h3>
          <p className="text-gray-400">No data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Chart metadata for enhanced variants */}
      {(variant === 'detailed') && (
        <div className="mb-4 flex items-center justify-between text-sm text-gray-400">
          <div>
            {chartState.lastUpdated && (
              <span>
                Last updated: {chartState.lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            {enableRealTime && chartQuery?.isFetching && (
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                Live
              </span>
            )}
            <span>{chartData.length} data points</span>
            {chartState.interactionCount > 0 && (
              <span>{chartState.interactionCount} interactions</span>
            )}
          </div>
        </div>
      )}

      {/* Unified chart component (presentation component) */}
      <ShadcnChartContainer
        staticData={chartData}
        title={title}
        dataKey={dataKey}
        xAxisKey={xAxisKey}
        chartConfig={{}}
        variant={variant}
        height={height}
        valueFormatter={valueFormatter}
        // onBarClick={handleBarClick}
        // onDataUpdate={handleDataUpdate}
      />

      {/* Performance metrics for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-gray-800/50 rounded-lg text-xs text-gray-400">
          <h4 className="font-semibold mb-2">Performance Metrics:</h4>
          <div className="grid grid-cols-2 gap-2">
            <div>Data Points: {chartData.length}</div>
            <div>Interactions: {chartState.interactionCount}</div>
            <div>Real-time: {enableRealTime ? 'Yes' : 'No'}</div>
            <div>Cache: {enableCaching ? 'Enabled' : 'Disabled'}</div>
            <div>Last Update: {chartState.lastUpdated?.toLocaleTimeString() || 'Never'}</div>
            <div>Status: {chartQuery?.isFetching ? 'Fetching' : 'Idle'}</div>
          </div>
        </div>
      )}
    </div>
  )
}