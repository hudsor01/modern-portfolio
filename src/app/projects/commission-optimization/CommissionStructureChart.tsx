'use client'
import { memo } from 'react'

import { LazyBarChart as BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from '@/components/charts/lazy-charts'

// Commission structure data by tier
const data = [
  { 
    tier: 'Elite', 
    partners: 8, 
    commissionRate: 28.0, 
    totalEarnings: 89600, 
    avgEarnings: 11200,
    performanceBonus: 15.0 
  },
  { 
    tier: 'Premium', 
    partners: 12, 
    commissionRate: 25.0, 
    totalEarnings: 67800, 
    avgEarnings: 5650,
    performanceBonus: 10.0 
  },
  { 
    tier: 'Standard', 
    partners: 19, 
    commissionRate: 20.0, 
    totalEarnings: 45600, 
    avgEarnings: 2400,
    performanceBonus: 5.0 
  },
  { 
    tier: 'Growth', 
    partners: 8, 
    commissionRate: 15.0, 
    totalEarnings: 15450, 
    avgEarnings: 1931,
    performanceBonus: 0 
  },
]

const chartColors = {
  earnings: 'var(--color-success)',
  commissionRate: 'var(--color-primary)',
  bonus: 'var(--color-warning)',
  grid: 'var(--color-border)',
  axis: 'var(--color-muted-foreground)',
}

const CommissionStructureChart = memo(function CommissionStructureChart() {
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
            dataKey="tier"
            stroke={chartColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: chartColors.axis, strokeOpacity: 0.5 }}
          />
          <YAxis
            yAxisId="earnings"
            stroke={chartColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: chartColors.axis, strokeOpacity: 0.5 }}
            tickFormatter={(value) => formatCurrency(value)}
          />
          <YAxis
            yAxisId="rate"
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
              if (name === 'totalEarnings') return [formatCurrency(value), 'Total Earnings']
              if (name === 'avgEarnings') return [formatCurrency(value), 'Avg Earnings']
              if (name === 'commissionRate') return [`${value}%`, 'Commission Rate']
              if (name === 'performanceBonus') return [`${value}%`, 'Performance Bonus']
              if (name === 'partners') return [value, 'Partner Count']
              return [value, name]
            }}
            labelFormatter={(label) => `${label} Partners`}
          />
          <Bar 
            yAxisId="earnings"
            dataKey="totalEarnings" 
            fill={chartColors.earnings} 
            radius={[4, 4, 0, 0]} 
            name="totalEarnings"
          />
          <Bar 
            yAxisId="rate"
            dataKey="commissionRate" 
            fill={chartColors.commissionRate} 
            radius={[4, 4, 0, 0]} 
            name="commissionRate"
          />
        </BarChart>
      </ResponsiveContainer>
      <p className="mt-4 text-center text-sm italic text-muted-foreground">
        Commission tier structure showing earnings distribution and rate optimization across partner performance levels
      </p>
    </div>
  )
})

CommissionStructureChart.displayName = 'CommissionStructureChart'

export default CommissionStructureChart