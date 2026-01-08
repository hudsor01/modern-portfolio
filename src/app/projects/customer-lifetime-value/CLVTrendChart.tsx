'use client'
import { memo } from 'react'

import {
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Area,
  LazyComposedChart as ComposedChart,
} from '@/components/charts/lazy-charts'
import { chartColors, chartCssVars } from '@/lib/chart-colors'
import { clvTrendData } from './data/constants'

const trendChartColors = {
  actual: chartColors.success,
  predicted: chartColors.primary,
  confidence: `${chartColors.primary}33`, // 20% opacity hex
  grid: chartColors.grid,
  axis: chartColors.axis,
}

const CLVTrendChart = memo(function CLVTrendChart() {
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
        <ComposedChart data={clvTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={trendChartColors.grid} vertical={false} />
          <XAxis
            dataKey="month"
            stroke={trendChartColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: trendChartColors.axis, strokeOpacity: 0.5 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            stroke={trendChartColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: trendChartColors.axis, strokeOpacity: 0.5 }}
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
            formatter={(value: unknown, name: string | undefined) => {
              const safeName = name ?? ''
              if (value === null) return ['N/A', safeName]
              if (safeName === 'actual') return [formatCurrency(Number(value)), 'Actual CLV']
              if (name === 'predicted') return [formatCurrency(Number(value)), 'Predicted CLV']
              if (name === 'confidence_high')
                return [formatCurrency(Number(value)), 'Upper Confidence']
              if (name === 'confidence_low')
                return [formatCurrency(Number(value)), 'Lower Confidence']
              if (name === 'customers') return [Number(value).toLocaleString(), 'Customer Count']
              return [String(value), name]
            }}
          />
          <Legend />

          {/* Confidence interval area */}
          <Area
            type="monotone"
            dataKey="confidence_high"
            stroke="none"
            fill={trendChartColors.confidence}
            fillOpacity={0.3}
            name="Confidence Interval"
          />
          <Area
            type="monotone"
            dataKey="confidence_low"
            stroke="none"
            fill="white"
            fillOpacity={1}
            name=""
          />

          {/* Actual CLV line */}
          <Line
            type="monotone"
            dataKey="actual"
            stroke={trendChartColors.actual}
            strokeWidth={3}
            dot={{ fill: trendChartColors.actual, strokeWidth: 2, r: 4 }}
            connectNulls={false}
            name="actual"
          />

          {/* Predicted CLV line */}
          <Line
            type="monotone"
            dataKey="predicted"
            stroke={trendChartColors.predicted}
            strokeWidth={3}
            dot={{ fill: trendChartColors.predicted, strokeWidth: 2, r: 4 }}
            strokeDasharray="5 5"
            name="predicted"
          />
        </ComposedChart>
      </ResponsiveContainer>
      <p className="mt-4 text-center text-sm italic text-muted-foreground">
        CLV trend analysis with 24-month forecasting and 95% confidence intervals using BTYD
        predictive modeling
      </p>
    </div>
  )
})

CLVTrendChart.displayName = 'CLVTrendChart'

export default CLVTrendChart
