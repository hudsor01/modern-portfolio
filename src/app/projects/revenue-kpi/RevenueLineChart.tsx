'use client'
import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts'
// Corrected path and added type import for YearOverYearGrowthExtended
import { yearOverYearGrowthExtended, type YearOverYearGrowthExtended } from '@/app/projects/data/partner-analytics'
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
const yearlyData: ExtendedRevenueData[] = yearOverYearGrowthExtended.map((yearData: YearOverYearGrowthExtended, index: number) => { // Added types
  const previousYear = index > 0 ? yearOverYearGrowthExtended[index - 1] : null;
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

// V4 Chart Colors using CSS Custom Properties
const chartColors = {
  revenue: 'hsl(var(--chart-1))',
  transactions: 'hsl(var(--chart-2))',
  commissions: 'hsl(var(--chart-3))',
  grid: 'hsl(var(--border))',
  axis: 'hsl(var(--muted-foreground))',
}

// Type-safe tooltip component
function CustomTooltip({ active, payload, label }: TypedTooltipProps<ExtendedRevenueData>) {
  if (active && payload && payload.length > 0) {
    const dataPoint = payload[0]?.payload;
    if (!dataPoint) return null;
    
    return (
      <div
        className="rounded-lg border bg-card p-3 shadow-lg"
        style={{
          backgroundColor: 'hsl(var(--card))',
          borderColor: 'hsl(var(--border))',
          color: 'hsl(var(--card-foreground))',
        }}
      >
        <p className="font-medium">{`Period: ${label}`}</p>
        <p className="text-sm">
          Revenue: <span className="font-semibold">${dataPoint.revenue.toFixed(1)}M</span>
        </p>
        {dataPoint.growth !== undefined && dataPoint.growth !== 0 && (
          <p className="text-sm">
            Growth: <span className="font-semibold">{dataPoint.growth.toFixed(1)}%</span>
          </p>
        )}
        {dataPoint.transactions && (
          <p className="text-sm">
            Transactions: <span className="font-semibold">{dataPoint.transactions.toFixed(1)}K</span>
          </p>
        )}
        {dataPoint.commissions && (
          <p className="text-sm">
            Commissions: <span className="font-semibold">${dataPoint.commissions.toFixed(1)}M</span>
          </p>
        )}
      </div>
    );
  }
  return null;
}

export default function RevenueLineChart(): React.JSX.Element {
  return (
    <div className="portfolio-card">
      <h2 className="mb-4 text-xl font-semibold">
        Revenue Growth Metrics
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={yearlyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={chartColors.grid} 
            strokeOpacity={0.3} 
          />
          <XAxis
            dataKey="name"
            stroke={chartColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: chartColors.axis, strokeOpacity: 0.5 }}
          />
          <YAxis
            stroke={chartColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: chartColors.axis, strokeOpacity: 0.5 }}
            tickFormatter={(value) => {
              // Determine if the number is in whole units
              return Number.isInteger(value) ? `${value}` : value.toFixed(1)
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke={chartColors.revenue}
            strokeWidth={2}
            dot={{ stroke: chartColors.revenue, strokeWidth: 2, r: 4, fill: 'hsl(var(--background))' }}
            activeDot={{ r: 6, stroke: chartColors.revenue, strokeWidth: 2, fill: chartColors.revenue }}
            animationDuration={1500}
            name="Revenue ($M)"
          />
          <Line
            type="monotone"
            dataKey="transactions"
            stroke={chartColors.transactions}
            strokeWidth={2}
            dot={{ stroke: chartColors.transactions, strokeWidth: 2, r: 4, fill: 'hsl(var(--background))' }}
            activeDot={{ r: 6, stroke: chartColors.transactions, strokeWidth: 2, fill: chartColors.transactions }}
            animationDuration={1500}
            animationBegin={300}
            name="Transactions (K)"
          />
          <Line
            type="monotone"
            dataKey="commissions"
            stroke={chartColors.commissions}
            strokeWidth={2}
            dot={{ stroke: chartColors.commissions, strokeWidth: 2, r: 4, fill: 'hsl(var(--background))' }}
            activeDot={{ r: 6, stroke: chartColors.commissions, strokeWidth: 2, fill: chartColors.commissions }}
            animationDuration={1500}
            animationBegin={600}
            name="Commissions ($M)"
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="mt-4 text-center text-sm italic text-muted-foreground">
        Year-over-year tracking of key metrics (Revenue in $M, Transactions in K, Commissions in $M)
      </p>
    </div>
  )
}
