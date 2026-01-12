'use client'

import { memo } from 'react'
import {
  LazyBarChart as BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from '@/components/charts/lazy-charts'
import { chartColors, chartCssVars } from '@/lib/chart-colors'
import { customerSegmentChartData } from '../data/constants'

const CustomerSegmentChart = memo(function CustomerSegmentChart() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="h-[var(--chart-height-md)]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={customerSegmentChartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
          <XAxis
            dataKey="segment"
            stroke={chartColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: chartColors.axis, strokeOpacity: 0.5 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            yAxisId="count"
            stroke={chartColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: chartColors.axis, strokeOpacity: 0.5 }}
            tickFormatter={(value) => `${(value / 1000).toFixed(1)}K`}
          />
          <YAxis
            yAxisId="clv"
            orientation="right"
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
              const safeValue = value ?? 0
              const safeName = name ?? ''
              if (safeName === 'count') return [safeValue.toLocaleString(), 'Customer Count']
              if (safeName === 'clv') return [formatCurrency(safeValue), 'Average CLV']
              if (safeName === 'probability') return [`${safeValue}%`, 'Engagement Probability']
              return [safeValue, safeName]
            }}
            labelFormatter={(label) => `Segment: ${label}`}
          />
          <Legend />
          <Bar yAxisId="count" dataKey="count" fill={chartColors.primary} radius={[4, 4, 0, 0]} name="count" />
          <Bar yAxisId="clv" dataKey="clv" fill={chartColors.success} radius={[4, 4, 0, 0]} name="clv" />
        </BarChart>
      </ResponsiveContainer>
      <p className="mt-4 text-center text-sm italic text-muted-foreground">
        RFM-based customer segmentation showing distribution of customers and average CLV per
        segment
      </p>
    </div>
  )
})

CustomerSegmentChart.displayName = 'CustomerSegmentChart'

export default CustomerSegmentChart
