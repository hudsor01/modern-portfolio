'use client'
import React, { memo, useMemo } from 'react'
import { LazyLineChart as LineChart, Line, Legend } from '@/components/charts/lazy-charts'
import {
  ChartWrapper,
  ChartGrid,
  ChartXAxis,
  ChartYAxis,
  StandardTooltip,
} from '@/lib/charts/chart-components'
import { chartColors, chartConfig, chartTypeConfigs, formatters } from '@/lib/charts/chart-theme'
import type { YearOverYearData } from '@/lib/analytics/data-service'
import type { ExtendedRevenueData, TypedTooltipProps } from '@/types/chart'

// Transform the real data for the line chart with proper typing
// Calculate growth rates from year-over-year data
const calculateGrowthRate = (current: number, previous: number): number => {
  return previous > 0 ? ((current - previous) / previous) * 100 : 0;
};

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
        { name: 'Revenue', value: formatters.currency(dataPoint.revenue), color: chartColors.revenue },
        ...(dataPoint.transactions ? [{ name: 'Transactions', value: formatters.thousands(dataPoint.transactions), color: chartColors.transactions }] : []),
        ...(dataPoint.commissions ? [{ name: 'Commissions', value: formatters.currency(dataPoint.commissions), color: chartColors.commissions }] : []),
        ...(dataPoint.growth !== undefined && dataPoint.growth !== 0 ? [{ name: 'Growth', value: formatters.percentage(dataPoint.growth), color: chartColors.positive }] : []),
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
  // Memoize expensive data calculations
  const yearlyData = useMemo(() => {
    if (!data || data.length === 0) return []
    return data.map((yearData: YearOverYearSeries, index: number) => {
      const previousYear = index > 0 ? data[index - 1] : null;
      const growth = previousYear ? calculateGrowthRate(yearData.total_revenue, previousYear.total_revenue) : 0;
      
      return {
        name: yearData.year.toString(),
        value: yearData.total_revenue / 1000000,
        revenue: yearData.total_revenue / 1000000,
        transactions: yearData.total_transactions / 1000, // Convert to thousands
        commissions: yearData.total_commissions / 1000000, // Convert to millions
        period: new Date(yearData.year, 0, 1),
        growth,
        metadata: {
          tooltip: `Revenue: $${(yearData.total_revenue / 1000000).toFixed(1)}M`,
          source: 'Year-over-Year Analytics'
        }
      };
    });
  }, [data]);

  if (!yearlyData.length) {
    return (
      <div className="portfolio-card">
        <ChartWrapper title="Revenue Growth Metrics" caption="No data available" height="standard">
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
        title="Revenue Growth Metrics"
        caption="Year-over-year tracking of key metrics (Revenue in $M, Transactions in K, Commissions in $M)"
        height="standard"
      >
        <LineChart data={yearlyData} margin={chartConfig.margins.medium}>
          <ChartGrid />
          <ChartXAxis dataKey="name" />
          <ChartYAxis tickFormatter={(value) => formatters.number(typeof value === 'string' ? parseFloat(value) : value)} />
          <CustomTooltip />
          <Legend />
          <Line
            {...chartTypeConfigs.line}
            dataKey="revenue"
            stroke={chartColors.revenue}
            dot={{ ...chartTypeConfigs.line.dot, stroke: chartColors.revenue }}
            activeDot={{ ...chartTypeConfigs.line.activeDot, stroke: chartColors.revenue, fill: chartColors.revenue }}
            animationDuration={chartConfig.animation.duration}
            name="Revenue ($M)"
          />
          <Line
            {...chartTypeConfigs.line}
            dataKey="transactions"
            stroke={chartColors.transactions}
            dot={{ ...chartTypeConfigs.line.dot, stroke: chartColors.transactions }}
            activeDot={{ ...chartTypeConfigs.line.activeDot, stroke: chartColors.transactions, fill: chartColors.transactions }}
            animationDuration={chartConfig.animation.duration}
            animationBegin={chartConfig.animation.delay}
            name="Transactions (K)"
          />
          <Line
            {...chartTypeConfigs.line}
            dataKey="commissions"
            stroke={chartColors.commissions}
            dot={{ ...chartTypeConfigs.line.dot, stroke: chartColors.commissions }}
            activeDot={{ ...chartTypeConfigs.line.activeDot, stroke: chartColors.commissions, fill: chartColors.commissions }}
            animationDuration={chartConfig.animation.duration}
            animationBegin={chartConfig.animation.stagger}
            name="Commissions ($M)"
          />
        </LineChart>
      </ChartWrapper>
    </div>
  )
})

RevenueLineChart.displayName = 'RevenueLineChart'

export default RevenueLineChart
