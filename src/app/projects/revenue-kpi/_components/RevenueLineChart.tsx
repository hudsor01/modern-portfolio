'use client'
import type React from 'react'
import { memo, useMemo } from 'react'
import {
  LazyLineChart as LineChart,
  ChartWrapper,
  ChartGrid,
  ChartXAxis,
  ChartYAxis,
  StandardTooltip,
} from '@/components/charts/lazy-charts'
import { Line, Legend } from 'recharts'
import { formatCompactCurrency } from '@/lib/data-formatters'
import { chartColors, chartConfig, chartTypeConfigs, formatters } from '@/lib/charts'
import type { YearOverYearData } from '@/types/analytics'
import type { ExtendedRevenueData, TypedTooltipProps } from '@/types/chart'

// Transform the real data for the line chart with proper typing
// Calculate growth rates from year-over-year data
const calculateGrowthRate = (current: number, previous: number): number => {
  return previous > 0 ? ((current - previous) / previous) * 100 : 0
}

// Note: This quarterly data is kept for potential future use
// const quarterlyData: ExtendedRevenueData[] = growthData.map((quarterData, index) => {
//   const previousQuarter = index > 0 ? growthData[index - 1] : null;
//   const baseGrowth = previousQuarter ? ((quarterData.revenue - previousQuarter.revenue) / previousQuarter.revenue) * 100 : 0;
//
//   return {
//     name: quarterData.quarter,
//     value: quarterData.revenue / 1000000,
//     revenue: quarterData.revenue / 1000000,
//     period: new Date(quarterData.quarter.replace('Q', '').replace(' ', '-01-')),
//     growth: baseGrowth,
//     metadata: {
//       tooltip: `Revenue: $${(quarterData.revenue / 1000000).toFixed(1)}M`,
//       source: 'Partner Analytics Data'
//     }
//   };
// });

// Add year-over-year data for additional context
// Move data calculation inside component to use useMemo

// Using centralized chart colors

// Custom tooltip for revenue data
function CustomTooltip({ active, payload, label }: TypedTooltipProps<ExtendedRevenueData>) {
  if (!active || !payload || payload.length === 0) return null

  const dataPoint = payload[0]?.payload
  if (!dataPoint) return null

  return (
    <StandardTooltip
      active={active}
      payload={[
        {
          name: 'Revenue',
          value: formatCompactCurrency(dataPoint.revenue * 1_000_000),
          color: chartColors.revenue,
        },
        ...(dataPoint.commissions
          ? [
              {
                name: 'Commissions',
                value: formatCompactCurrency(dataPoint.commissions * 1_000_000),
                color: chartColors.commissions,
              },
            ]
          : []),
        ...(dataPoint.growth !== undefined && dataPoint.growth !== 0
          ? [
              {
                name: 'Growth',
                value: formatters.percentage(dataPoint.growth),
                color: chartColors.positive,
              },
            ]
          : []),
      ]}
      label={label}
    />
  )
}

type YearOverYearSeries = Pick<
  YearOverYearData,
  'year' | 'total_revenue' | 'total_transactions' | 'total_commissions'
>

type RevenueLineChartProps = {
  data: YearOverYearSeries[]
}

const RevenueLineChart = memo(({ data }: RevenueLineChartProps): React.JSX.Element => {
  // Memoize data transformation to prevent recalculation on every render
  const yearlyData = useMemo(() => {
    if (!data || data.length === 0) return []
    return data.map((yearData: YearOverYearSeries, index: number) => {
      const previousYear = index > 0 ? data[index - 1] : null
      const growth = previousYear
        ? calculateGrowthRate(yearData.total_revenue, previousYear.total_revenue)
        : 0

      return {
        name: yearData.year.toString(),
        value: yearData.total_revenue / 1000000,
        revenue: yearData.total_revenue / 1000000,
        commissions: yearData.total_commissions / 1000000, // Convert to millions
        period: new Date(Date.UTC(yearData.year, 0, 1)),
        growth,
        metadata: {
          tooltip: `Revenue: ${formatCompactCurrency(yearData.total_revenue)}`,
          source: 'Year-over-Year Analytics',
        },
      }
    })
  }, [data])

  if (!yearlyData.length) {
    return (
      <div className="portfolio-card">
        <ChartWrapper
          headingLevel={2}
          title="Revenue Growth Metrics"
          caption="No data available"
          size="md"
        >
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No data available
          </div>
        </ChartWrapper>
      </div>
    )
  }

  return (
    <div className="portfolio-card">
      <ChartWrapper
        headingLevel={2}
        title="Revenue Growth Metrics"
        caption="Year-over-year revenue and commissions"
        size="md"
      >
        <LineChart data={yearlyData} margin={chartConfig.margins.medium}>
          <ChartGrid yAxisId="left" />
          <ChartXAxis dataKey="name" />
          <ChartYAxis
            yAxisId="left"
            tickFormatter={(value) => formatCompactCurrency(Number(value) * 1_000_000)}
            label={{
              value: 'Revenue',
              angle: -90,
              position: 'insideLeft',
              fill: chartColors.revenue,
              fontSize: 12,
              fontWeight: 600,
            }}
          />
          <ChartYAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={(value) => formatCompactCurrency(Number(value) * 1_000_000)}
            label={{
              value: 'Commissions',
              angle: 90,
              position: 'insideRight',
              fill: chartColors.commissions,
              fontSize: 12,
              fontWeight: 600,
            }}
          />
          <CustomTooltip />
          <Legend />
          <Line
            {...chartTypeConfigs.line}
            dataKey="revenue"
            yAxisId="left"
            stroke={chartColors.revenue}
            dot={{ ...chartTypeConfigs.line.dot, stroke: chartColors.revenue }}
            activeDot={{
              ...chartTypeConfigs.line.activeDot,
              stroke: chartColors.revenue,
              fill: chartColors.revenue,
            }}
            animationDuration={chartConfig.animation.duration}
            name="Revenue"
          />
          <Line
            {...chartTypeConfigs.line}
            dataKey="commissions"
            yAxisId="right"
            stroke={chartColors.commissions}
            dot={{ ...chartTypeConfigs.line.dot, stroke: chartColors.commissions }}
            activeDot={{
              ...chartTypeConfigs.line.activeDot,
              stroke: chartColors.commissions,
              fill: chartColors.commissions,
            }}
            animationDuration={chartConfig.animation.duration}
            animationBegin={chartConfig.animation.stagger}
            name="Commissions"
          />
        </LineChart>
      </ChartWrapper>
    </div>
  )
})

RevenueLineChart.displayName = 'RevenueLineChart'

export default RevenueLineChart
