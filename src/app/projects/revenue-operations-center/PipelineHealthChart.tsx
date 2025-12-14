'use client'

import { LazyBarChart as BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from '@/components/charts/lazy-charts'

// Pipeline health data across stages
const data = [
  { 
    stage: 'Lead', 
    count: 2847, 
    value: 142350000, 
    health: 95.2, 
    velocity: 3.2,
    conversion: 24.8 
  },
  { 
    stage: 'Qualified', 
    count: 1456, 
    value: 75712000, 
    health: 92.7, 
    velocity: 8.7,
    conversion: 42.3 
  },
  { 
    stage: 'Demo', 
    count: 892, 
    value: 46276000, 
    health: 89.4, 
    velocity: 12.4,
    conversion: 58.1 
  },
  { 
    stage: 'Proposal', 
    count: 456, 
    value: 23712000, 
    health: 87.9, 
    velocity: 18.6,
    conversion: 72.4 
  },
  { 
    stage: 'Negotiation', 
    count: 234, 
    value: 12168000, 
    health: 85.3, 
    velocity: 24.1,
    conversion: 83.2 
  },
  { 
    stage: 'Closed Won', 
    count: 89, 
    value: 4628000, 
    health: 100, 
    velocity: 0,
    conversion: 100 
  },
]

const chartColors = {
  count: 'var(--color-primary)',
  value: 'var(--color-success)',
  health: 'var(--color-secondary)',
  grid: 'var(--color-border)',
  axis: 'var(--color-muted-foreground)',
}

export default function PipelineHealthChart() {
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
    <div className="h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={chartColors.grid} 
            vertical={false}
          />
          <XAxis
            dataKey="stage"
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
            yAxisId="health"
            orientation="right"
            stroke={chartColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: chartColors.axis, strokeOpacity: 0.5 }}
            tickFormatter={(value) => `${value}%`}
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
              if (name === 'count') return [value.toLocaleString(), 'Deal Count']
              if (name === 'value') return [formatCurrency(value), 'Pipeline Value']
              if (name === 'health') return [`${value}%`, 'Health Score']
              if (name === 'conversion') return [`${value}%`, 'Conversion Rate']
              if (name === 'velocity') return [`${value} days`, 'Avg Days in Stage']
              return [value, name]
            }}
            labelFormatter={(label) => `Stage: ${label}`}
          />
          <Bar 
            yAxisId="count"
            dataKey="count" 
            fill={chartColors.count} 
            radius={[4, 4, 0, 0]} 
            name="count"
          />
          <Bar 
            yAxisId="health"
            dataKey="health" 
            fill={chartColors.health} 
            radius={[4, 4, 0, 0]} 
            name="health"
          />
        </BarChart>
      </ResponsiveContainer>
      <p className="mt-4 text-center text-sm italic text-muted-foreground">
        Pipeline stage analysis showing 92.4% overall health score with optimized velocity and conversion tracking
      </p>
    </div>
  )
}