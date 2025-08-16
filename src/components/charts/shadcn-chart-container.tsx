'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig 
} from '@/components/ui/chart'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, TrendingUp, TrendingDown, Minus, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useChartData, useChartInteraction } from '@/hooks/use-component-consolidation-queries'
import type { ChartDataPoint } from '@/types/chart'
import type { ChartData } from '@/types/project'

interface ShadcnChartContainerProps {
  // Data configuration
  endpoint?: string
  staticData?: ChartDataPoint[]
  dataTransform?: (rawData: ChartDataPoint[]) => ChartDataPoint[]
  
  // Chart configuration
  title: string
  description?: string
  dataKey: string
  xAxisKey?: string
  
  // shadcn/ui Chart configuration
  chartConfig: ChartConfig
  
  // Container behavior
  variant?: 'default' | 'minimal' | 'detailed'
  enableRealTime?: boolean
  pollInterval?: number
  
  // Visual options
  height?: number
  className?: string
  showGrid?: boolean
  showLegend?: boolean
  showTrend?: boolean
  
  // Event handlers
  onDataLoad?: (data: ChartDataPoint[]) => void
  onError?: (error: Error) => void
  
  // Formatting
  valueFormatter?: (value: number) => string
}

export function ShadcnChartContainer({
  endpoint,
  staticData,
  dataTransform,
  title,
  description,
  dataKey,
  xAxisKey = 'name',
  chartConfig,
  variant = 'default',
  enableRealTime = false,
  pollInterval = 30000,
  height = 350,
  className,
  showGrid = true,
  showLegend = false,
  showTrend = true,
  onDataLoad,
  onError,
  valueFormatter,
}: ShadcnChartContainerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  // TanStack Query for data fetching with advanced features
  const chartQuery = useChartData(endpoint || '', {
    realtime: enableRealTime,
    ...(enableRealTime && pollInterval && { pollInterval }),
    ...(dataTransform && { transform: dataTransform as ((data: unknown) => ChartData[]) }),
    suspense: false,
    dependencies: [endpoint, enableRealTime, pollInterval],
    // Keep only valid useChartData options
    // refetchOnWindowFocus: true,
    // refetchOnReconnect: true,
    // staleTime: 1000 * 60 * 5, // 5 minutes
    // gcTime: 1000 * 60 * 30, // 30 minutes
    // retry: 3,
    // retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // refetchInterval: enableRealTime ? pollInterval : undefined,
    // refetchIntervalInBackground: true,
    // networkMode: 'online',
    // placeholderData: staticData, // Use static data as placeholder
  })

  // Chart interaction tracking
  const chartInteraction = useChartInteraction(`shadcn-chart-${title.toLowerCase().replace(/\s+/g, '-')}`)

  // Determine data source - ensure it's always an array - memoized to prevent re-creation
  const chartData = useMemo(() => {
    return staticData || (endpoint && chartQuery?.data ? (chartQuery.data as ChartData[]) : []) || []
  }, [staticData, endpoint, chartQuery?.data])

  // Handle data updates
  useEffect(() => {
    if (chartData.length > 0) {
      onDataLoad?.(chartData as ChartData[])
    }
  }, [chartData, onDataLoad])

  // Handle errors
  useEffect(() => {
    if (chartQuery?.error) {
      const error = chartQuery.error as Error
      onError?.(error)
      toast.error(`Failed to load chart data: ${error.message}`)
    }
  }, [chartQuery?.error, onError])

  // Calculate trend
  const trend = showTrend && chartData.length >= 2 ? (() => {
    const values = chartData.map(item => Number(item[dataKey as keyof typeof item]) || 0)
    const first = values[0]
    const last = values[values.length - 1]
    
    if (first === undefined || last === undefined || first === 0) {
      return null
    }
    
    const change = ((last - first) / first) * 100
    
    return {
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
      percentage: Math.abs(change).toFixed(1),
      value: change
    }
  })() : null

  // Handle chart interactions
  const handleBarClick = useCallback((data: unknown) => {
    const chartData = data as Record<string, unknown>
    chartInteraction.mutate({
      type: 'click',
      data: { value: chartData[dataKey] },
      timestamp: Date.now(),
    })
  }, [chartInteraction, dataKey])

  // Loading state
  if (endpoint && chartQuery?.isLoading) {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              {description && <Skeleton className="h-4 w-64" />}
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full" style={{ height }} />
        </CardContent>
      </Card>
    )
  }

  // Error state
  if (chartQuery?.error) {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader>
          <CardTitle className="text-destructive">{title}</CardTitle>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </CardHeader>
        <CardContent className="flex items-center justify-center" style={{ height }}>
          <div className="text-center space-y-4">
            <p className="text-destructive">Failed to load chart data</p>
            <p className="text-sm text-muted-foreground">{chartQuery.error.message}</p>
            <Button
              variant="outline"
              onClick={() => chartQuery.refetch()}
              disabled={chartQuery.isFetching}
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", chartQuery.isFetching && "animate-spin")} />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // No data state
  if (chartData.length === 0) {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </CardHeader>
        <CardContent className="flex items-center justify-center" style={{ height }}>
          <div className="text-center">
            <p className="text-muted-foreground">No data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn(
      'w-full',
      isFullscreen && 'fixed inset-0 z-50 m-0 rounded-none',
      className
    )}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <CardTitle className="text-xl">{title}</CardTitle>
              
              {/* Trend indicator */}
              {trend && (
                <div className="flex items-center gap-1">
                  {trend.direction === 'up' && (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  )}
                  {trend.direction === 'down' && (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  {trend.direction === 'neutral' && (
                    <Minus className="h-4 w-4 text-gray-500" />
                  )}
                  <Badge variant={
                    trend.direction === 'up' ? 'default' : 
                    trend.direction === 'down' ? 'destructive' : 
                    'secondary'
                  }>
                    {trend.percentage}%
                  </Badge>
                </div>
              )}
              
              {/* Real-time indicator */}
              {enableRealTime && chartQuery?.isFetching && (
                <Badge variant="outline" className="animate-pulse">
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                  Live
                </Badge>
              )}
            </div>
            
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>

          {/* Chart controls */}
          <div className="flex items-center gap-2">
            {enableRealTime && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => chartQuery?.refetch()}
                disabled={chartQuery?.isFetching}
              >
                <RefreshCw className={cn(
                  "h-4 w-4",
                  chartQuery?.isFetching && "animate-spin"
                )} />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* shadcn/ui Chart component */}
        <ChartContainer config={chartConfig} className="w-full" style={{ height }}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            {showGrid && (
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
            )}
            
            <XAxis 
              dataKey={xAxisKey}
              tickLine={false}
              axisLine={false}
              className="text-xs"
            />
            
            <YAxis 
              tickLine={false}
              axisLine={false}
              className="text-xs"
              tickFormatter={valueFormatter}
            />
            
            <ChartTooltip 
              content={<ChartTooltipContent />} 
            />
            
            {showLegend && (
              <ChartLegend content={<ChartLegendContent />} />
            )}
            
            <Bar 
              dataKey={dataKey}
              fill={`var(--color-${dataKey})`}
              radius={[4, 4, 0, 0]}
              onClick={handleBarClick}
              className="cursor-pointer"
            />
          </BarChart>
        </ChartContainer>

        {/* Chart metadata for detailed variant */}
        {variant === 'detailed' && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {chartData.slice(0, 4).map((item, index) => (
              <div 
                key={index}
                className="text-center p-3 bg-muted/30 rounded-lg"
              >
                <div className="text-sm text-muted-foreground">
                  {String(item[xAxisKey as keyof typeof item] || '')}
                </div>
                <div className="text-lg font-semibold">
                  {valueFormatter ? valueFormatter(Number(item[dataKey as keyof typeof item]) || 0) : String(item[dataKey as keyof typeof item] || '')}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Fullscreen close button */}
      {isFullscreen && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsFullscreen(false)}
          className="absolute top-4 right-4"
        >
          ✕
        </Button>
      )}
    </Card>
  )
}