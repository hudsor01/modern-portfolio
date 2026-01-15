'use client'
import { memo } from 'react'

import {
  LazyLineChart as LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from '@/components/charts/lazy-charts'
import { chartColors as baseChartColors, chartCssVars } from '@/lib/charts'

// Revenue overview data showing multi-channel performance
const data = [
  {
    month: 'Jan',
    direct: 2100000,
    partners: 980000,
    marketing: 450000,
    total: 3530000,
    target: 3200000,
  },
  {
    month: 'Feb',
    direct: 2250000,
    partners: 1120000,
    marketing: 520000,
    total: 3890000,
    target: 3400000,
  },
  {
    month: 'Mar',
    direct: 2400000,
    partners: 1280000,
    marketing: 580000,
    total: 4260000,
    target: 3600000,
  },
  {
    month: 'Apr',
    direct: 2350000,
    partners: 1450000,
    marketing: 620000,
    total: 4420000,
    target: 3800000,
  },
  {
    month: 'May',
    direct: 2600000,
    partners: 1620000,
    marketing: 680000,
    total: 4900000,
    target: 4000000,
  },
  {
    month: 'Jun',
    direct: 2750000,
    partners: 1780000,
    marketing: 740000,
    total: 5270000,
    target: 4200000,
  },
  {
    month: 'Jul',
    direct: 2850000,
    partners: 1920000,
    marketing: 780000,
    total: 5550000,
    target: 4400000,
  },
  {
    month: 'Aug',
    direct: 2950000,
    partners: 2080000,
    marketing: 820000,
    total: 5850000,
    target: 4600000,
  },
]

const chartColors = {
  direct: baseChartColors.primary,
  partners: baseChartColors.success,
  marketing: baseChartColors.secondary,
  total: baseChartColors.warning,
  target: baseChartColors.destructive,
  grid: baseChartColors.grid,
  axis: baseChartColors.axis,
}

const RevenueOverviewChart = memo(function RevenueOverviewChart() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: 'compact',
    }).format(value)
  }

  return (
    <div className="h-[var(--chart-height-md)]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
          <XAxis
            dataKey="month"
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
            tickFormatter={(value) => formatCurrency(value)}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: chartCssVars.popover,
              borderRadius: '12px',
              border: `1px solid ${chartCssVars.border}`,
              backdropFilter: 'blur(10px)',
              color: chartCssVars.cardForeground,
            }}
            formatter={(value: number | undefined, name: string | undefined) => {
              const safeName = name ?? ''
              if (value === undefined) return ['', safeName]
              const labels: Record<string, string> = {
                direct: 'Direct Sales',
                partners: 'Partner Channel',
                marketing: 'Marketing Driven',
                total: 'Total Revenue',
                target: 'Target',
              }
              return [formatCurrency(value), labels[safeName] || safeName]
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="direct"
            stroke={chartColors.direct}
            strokeWidth={3}
            dot={{ fill: chartColors.direct, strokeWidth: 2, r: 4 }}
            name="direct"
          />
          <Line
            type="monotone"
            dataKey="partners"
            stroke={chartColors.partners}
            strokeWidth={3}
            dot={{ fill: chartColors.partners, strokeWidth: 2, r: 4 }}
            name="partners"
          />
          <Line
            type="monotone"
            dataKey="marketing"
            stroke={chartColors.marketing}
            strokeWidth={3}
            dot={{ fill: chartColors.marketing, strokeWidth: 2, r: 4 }}
            name="marketing"
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke={chartColors.total}
            strokeWidth={4}
            dot={{ fill: chartColors.total, strokeWidth: 2, r: 6 }}
            name="total"
          />
          <Line
            type="monotone"
            dataKey="target"
            stroke={chartColors.target}
            strokeWidth={3}
            dot={{ fill: chartColors.target, strokeWidth: 2, r: 4 }}
            strokeDasharray="5 5"
            name="target"
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="mt-4 text-center text-sm italic text-muted-foreground">
        Multi-channel revenue performance tracking showing 34.2% YoY growth with consistent target
        outperformance
      </p>
    </div>
  )
})

RevenueOverviewChart.displayName = 'RevenueOverviewChart'

export default RevenueOverviewChart
