'use client'
import { memo } from 'react'

import { LazyBarChart as BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from '@/components/charts/lazy-charts'

// Performance incentive program data
const data = [
  {
    program: 'Q1 Sales Accelerator',
    participants: 34,
    budget: 45000,
    payout: 38750,
    effectiveness: 86.1,
    avgBonus: 1140,
    performanceLift: 28.4
  },
  {
    program: 'New Customer Bonus',
    participants: 28,
    budget: 35000,
    payout: 31200,
    effectiveness: 89.1,
    avgBonus: 1114,
    performanceLift: 42.3
  },
  {
    program: 'Product Mix Incentive',
    participants: 41,
    budget: 28000,
    payout: 24680,
    effectiveness: 88.1,
    avgBonus: 602,
    performanceLift: 19.7
  },
  {
    program: 'Territory Expansion',
    participants: 15,
    budget: 22000,
    payout: 18900,
    effectiveness: 85.9,
    avgBonus: 1260,
    performanceLift: 35.6
  },
]

const chartColors = {
  payout: 'var(--color-success)',
  budget: 'var(--color-primary)',
  effectiveness: 'var(--color-warning)',
  participants: 'var(--color-secondary)',
  grid: 'var(--color-border)',
  axis: 'var(--color-muted-foreground)',
}

const PerformanceIncentiveChart = memo(function PerformanceIncentiveChart() {
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
            dataKey="program"
            stroke={chartColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: chartColors.axis, strokeOpacity: 0.5 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            yAxisId="budget"
            stroke={chartColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: chartColors.axis, strokeOpacity: 0.5 }}
            tickFormatter={(value) => formatCurrency(value)}
          />
          <YAxis
            yAxisId="effectiveness"
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
              if (name === 'budget') return [formatCurrency(value), 'Budget']
              if (name === 'payout') return [formatCurrency(value), 'Payout']
              if (name === 'effectiveness') return [`${value}%`, 'Effectiveness']
              if (name === 'avgBonus') return [formatCurrency(value), 'Avg Bonus']
              if (name === 'performanceLift') return [`${value}%`, 'Performance Lift']
              if (name === 'participants') return [value, 'Participants']
              return [value, name]
            }}
            labelFormatter={(label) => `${label} Program`}
          />
          <Legend
            wrapperStyle={{
              paddingTop: '20px',
              fontSize: '12px'
            }}
          />
          <Bar 
            yAxisId="budget"
            dataKey="budget" 
            fill={chartColors.budget} 
            radius={[4, 4, 0, 0]} 
            name="budget"
          />
          <Bar 
            yAxisId="budget"
            dataKey="payout" 
            fill={chartColors.payout} 
            radius={[4, 4, 0, 0]} 
            name="payout"
          />
          <Bar 
            yAxisId="effectiveness"
            dataKey="effectiveness" 
            fill={chartColors.effectiveness} 
            radius={[4, 4, 0, 0]} 
            name="effectiveness"
          />
        </BarChart>
      </ResponsiveContainer>
      <p className="mt-4 text-center text-sm italic text-muted-foreground">
        Performance incentive program analysis showing budget allocation, payout efficiency, and effectiveness metrics across targeted partner programs
      </p>
    </div>
  )
})

PerformanceIncentiveChart.displayName = 'PerformanceIncentiveChart'

export default PerformanceIncentiveChart