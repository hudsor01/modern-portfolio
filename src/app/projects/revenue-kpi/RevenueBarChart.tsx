'use client'
import React, { memo, useMemo } from 'react'
import { ShadcnChartContainer } from '@/components/charts/shadcn-chart-container'
import { monthlyRevenue2024, type MonthlyRevenueData } from '@/app/projects/data/partner-analytics'
import type { ChartConfig } from '@/components/ui/chart'
import { createContextLogger } from '@/lib/logging/logger'

const logger = createContextLogger('RevenueBarChart')

// shadcn/ui chart configuration
const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

const RevenueBarChart = memo(() => {
  // Memoize data transformation to prevent recalculation on every render
  const chartData = useMemo(() => {
    return monthlyRevenue2024.map((monthData: MonthlyRevenueData) => ({
      name: monthData.month, // Use 'name' for chart component
      revenue: Math.round(monthData.revenue / 1000000), // Convert to millions for readability
      value: Math.round(monthData.revenue / 1000000), // Required by ChartData type
    }))
  }, [])

  return (
    <div className="w-full">
      <ShadcnChartContainer
        staticData={chartData}
        title="Monthly Revenue 2024"
        description="Monthly revenue breakdown for the current year (in millions USD)"
        dataKey="revenue"
        xAxisKey="name"
        chartConfig={chartConfig}
        variant="detailed"
        height={300}
        showGrid={true}
        showTrend={true}
        valueFormatter={(value) => `$${value}M`}
        onDataLoad={(data) => {
          logger.info('Revenue chart data loaded', { dataPoints: data.length })
        }}
        className="border-0 shadow-none bg-transparent"
      />
    </div>
  )
})

RevenueBarChart.displayName = 'RevenueBarChart'

export default RevenueBarChart
