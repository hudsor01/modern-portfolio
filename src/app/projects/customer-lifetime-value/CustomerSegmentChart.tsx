'use client'

import { memo } from 'react'
import { LazyBarChart as BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from '@/components/charts/lazy-charts'

// Customer segment data with CLV and count metrics
const data = [
  { 
    segment: 'Champions', 
    count: 628, 
    clv: 4850, 
    probability: 92,
    revenue: 3045800,
    color: 'var(--color-success)'
  },
  { 
    segment: 'Loyal', 
    count: 841, 
    clv: 3420, 
    probability: 87,
    revenue: 2876220,
    color: 'var(--color-primary)'
  },
  { 
    segment: 'Potential', 
    count: 1156, 
    clv: 2640, 
    probability: 74,
    revenue: 3051840,
    color: 'var(--color-secondary)'
  },
  { 
    segment: 'At Risk', 
    count: 892, 
    clv: 1890, 
    probability: 45,
    revenue: 1686480,
    color: 'var(--color-warning)'
  },
  { 
    segment: 'Can\'t Lose', 
    count: 770, 
    clv: 3850, 
    probability: 68,
    revenue: 2964500,
    color: 'var(--color-destructive)'
  },
]

const chartColors = {
  grid: 'var(--color-border)',
  axis: 'var(--color-muted-foreground)',
}

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
    <div className="h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={chartColors.grid} 
            vertical={false}
          />
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
              backgroundColor: 'var(--color-popover)',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              backdropFilter: 'blur(10px)',
              color: 'white',
            }}
            formatter={(value: number, name: string) => {
              if (name === 'count') return [value.toLocaleString(), 'Customer Count']
              if (name === 'clv') return [formatCurrency(value), 'Average CLV']
              if (name === 'probability') return [`${value}%`, 'Engagement Probability']
              return [value, name]
            }}
            labelFormatter={(label) => `Segment: ${label}`}
          />
          <Legend />
          <Bar 
            yAxisId="count"
            dataKey="count" 
            fill="#3b82f6" 
            radius={[4, 4, 0, 0]} 
            name="count"
          />
          <Bar 
            yAxisId="clv"
            dataKey="clv" 
            fill="#10b981" 
            radius={[4, 4, 0, 0]} 
            name="clv"
          />
        </BarChart>
      </ResponsiveContainer>
      <p className="mt-4 text-center text-sm italic text-muted-foreground">
        RFM-based customer segmentation showing distribution of customers and average CLV per segment
      </p>
    </div>
  )
})

CustomerSegmentChart.displayName = 'CustomerSegmentChart'

export default CustomerSegmentChart