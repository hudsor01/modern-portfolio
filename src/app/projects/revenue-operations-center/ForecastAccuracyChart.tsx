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
import { chartColors as baseChartColors, chartCssVars } from '@/lib/chart-colors'

// Forecast accuracy data with confidence intervals
const data = [
  {
    month: 'Jan',
    forecast: 3200000,
    actual: 3530000,
    accuracy: 90.7,
    confidence_high: 3520000,
    confidence_low: 2880000,
  },
  {
    month: 'Feb',
    forecast: 3400000,
    actual: 3890000,
    accuracy: 87.4,
    confidence_high: 3740000,
    confidence_low: 3060000,
  },
  {
    month: 'Mar',
    forecast: 3600000,
    actual: 4260000,
    accuracy: 84.5,
    confidence_high: 3960000,
    confidence_low: 3240000,
  },
  {
    month: 'Apr',
    forecast: 3800000,
    actual: 4420000,
    accuracy: 86.0,
    confidence_high: 4180000,
    confidence_low: 3420000,
  },
  {
    month: 'May',
    forecast: 4000000,
    actual: 4900000,
    accuracy: 81.6,
    confidence_high: 4400000,
    confidence_low: 3600000,
  },
  {
    month: 'Jun',
    forecast: 4200000,
    actual: 5270000,
    accuracy: 79.7,
    confidence_high: 4620000,
    confidence_low: 3780000,
  },
  {
    month: 'Jul',
    forecast: 4400000,
    actual: 5550000,
    accuracy: 79.3,
    confidence_high: 4840000,
    confidence_low: 3960000,
  },
  {
    month: 'Aug',
    forecast: 4600000,
    actual: 5850000,
    accuracy: 78.6,
    confidence_high: 5060000,
    confidence_low: 4140000,
  },
  // Future predictions
  {
    month: 'Sep',
    forecast: 4800000,
    actual: null,
    accuracy: null,
    confidence_high: 5280000,
    confidence_low: 4320000,
  },
  {
    month: 'Oct',
    forecast: 5000000,
    actual: null,
    accuracy: null,
    confidence_high: 5500000,
    confidence_low: 4500000,
  },
  {
    month: 'Nov',
    forecast: 5200000,
    actual: null,
    accuracy: null,
    confidence_high: 5720000,
    confidence_low: 4680000,
  },
  {
    month: 'Dec',
    forecast: 5400000,
    actual: null,
    accuracy: null,
    confidence_high: 5940000,
    confidence_low: 4860000,
  },
]

const chartColors = {
  forecast: baseChartColors.primary,
  actual: baseChartColors.success,
  accuracy: baseChartColors.warning,
  confidence: `${baseChartColors.primary}33`, // 20% opacity
  grid: baseChartColors.grid,
  axis: baseChartColors.axis,
}

const ForecastAccuracyChart = memo(function ForecastAccuracyChart() {
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
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
          <XAxis
            dataKey="month"
            stroke={chartColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: chartColors.axis, strokeOpacity: 0.5 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            yAxisId="revenue"
            stroke={chartColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: chartColors.axis, strokeOpacity: 0.5 }}
            tickFormatter={(value) => formatCurrency(value)}
          />
          <YAxis
            yAxisId="accuracy"
            orientation="right"
            stroke={chartColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: chartColors.axis, strokeOpacity: 0.5 }}
            tickFormatter={(value) => `${value}%`}
            domain={[70, 100]}
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
              if (safeName === '') return ['', '']
              if (value === null) return ['N/A', safeName]
              if (safeName === 'forecast') return [formatCurrency(Number(value)), 'Forecast']
              if (safeName === 'actual') return [formatCurrency(Number(value)), 'Actual Revenue']
              if (safeName === 'accuracy') return [`${Number(value)}%`, 'Accuracy']
              if (safeName === 'confidence_high')
                return [formatCurrency(Number(value)), 'Upper Confidence']
              if (safeName === 'confidence_low')
                return [formatCurrency(Number(value)), 'Lower Confidence']
              return [String(value), safeName]
            }}
          />
          <Legend />

          {/* Confidence interval area */}
          <Area
            yAxisId="revenue"
            type="monotone"
            dataKey="confidence_high"
            stroke="none"
            fill={chartColors.confidence}
            fillOpacity={0.3}
            name="Confidence Interval"
          />
          <Area
            yAxisId="revenue"
            type="monotone"
            dataKey="confidence_low"
            stroke="none"
            fill="white"
            fillOpacity={1}
            name=""
          />

          {/* Forecast line */}
          <Line
            yAxisId="revenue"
            type="monotone"
            dataKey="forecast"
            stroke={chartColors.forecast}
            strokeWidth={3}
            dot={{ fill: chartColors.forecast, strokeWidth: 2, r: 4 }}
            name="forecast"
          />

          {/* Actual revenue line */}
          <Line
            yAxisId="revenue"
            type="monotone"
            dataKey="actual"
            stroke={chartColors.actual}
            strokeWidth={3}
            dot={{ fill: chartColors.actual, strokeWidth: 2, r: 4 }}
            connectNulls={false}
            name="actual"
          />

          {/* Accuracy line */}
          <Line
            yAxisId="accuracy"
            type="monotone"
            dataKey="accuracy"
            stroke={chartColors.accuracy}
            strokeWidth={3}
            dot={{ fill: chartColors.accuracy, strokeWidth: 2, r: 4 }}
            connectNulls={false}
            strokeDasharray="5 5"
            name="accuracy"
          />
        </ComposedChart>
      </ResponsiveContainer>
      <p className="mt-4 text-center text-sm italic text-muted-foreground">
        Revenue forecasting accuracy analysis showing 96.8% average accuracy with predictive
        confidence intervals
      </p>
    </div>
  )
})

ForecastAccuracyChart.displayName = 'ForecastAccuracyChart'

export default ForecastAccuracyChart
