'use client'
import { memo } from 'react'

import { LazyLineChart as LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from '@/components/charts/lazy-charts'

// ROI optimization data showing commission investment efficiency
const data = [
  {
    quarter: 'Q1 2024',
    commissionInvestment: 62000,
    revenueGenerated: 278000,
    roi: 4.48,
    partnerCount: 42,
    avgROI: 3.2,
    topTierROI: 5.8
  },
  {
    quarter: 'Q2 2024',
    commissionInvestment: 58500,
    revenueGenerated: 295000,
    roi: 5.04,
    partnerCount: 44,
    avgROI: 3.6,
    topTierROI: 6.2
  },
  {
    quarter: 'Q3 2024',
    commissionInvestment: 65200,
    revenueGenerated: 324000,
    roi: 4.97,
    partnerCount: 47,
    avgROI: 3.8,
    topTierROI: 6.1
  },
  {
    quarter: 'Q4 2024',
    commissionInvestment: 68300,
    revenueGenerated: 356000,
    roi: 5.21,
    partnerCount: 47,
    avgROI: 4.2,
    topTierROI: 6.7
  },
]

const chartColors = {
  roi: 'var(--color-success)',
  avgROI: 'var(--color-primary)',
  topTierROI: 'var(--color-warning)',
  investment: 'var(--color-secondary)',
  grid: 'var(--color-border)',
  axis: 'var(--color-muted-foreground)',
}

const ROIOptimizationChart = memo(function ROIOptimizationChart() {
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
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={chartColors.grid} 
            vertical={false}
          />
          <XAxis
            dataKey="quarter"
            stroke={chartColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: chartColors.axis, strokeOpacity: 0.5 }}
          />
          <YAxis
            yAxisId="roi"
            stroke={chartColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: chartColors.axis, strokeOpacity: 0.5 }}
            tickFormatter={(value) => `${value}x`}
            domain={[0, 'dataMax + 1']}
          />
          <YAxis
            yAxisId="investment"
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
              if (name === 'commissionInvestment') return [formatCurrency(value), 'Commission Investment']
              if (name === 'revenueGenerated') return [formatCurrency(value), 'Revenue Generated']
              if (name === 'roi') return [`${value}x`, 'Overall ROI']
              if (name === 'avgROI') return [`${value}x`, 'Average ROI']
              if (name === 'topTierROI') return [`${value}x`, 'Top Tier ROI']
              if (name === 'partnerCount') return [value, 'Partner Count']
              return [value, name]
            }}
            labelFormatter={(label) => `${label} Performance`}
          />
          <Legend
            wrapperStyle={{
              paddingTop: '20px',
              fontSize: '12px'
            }}
          />
          <Line 
            yAxisId="roi"
            type="monotone" 
            dataKey="roi" 
            stroke={chartColors.roi} 
            strokeWidth={3}
            dot={{ fill: chartColors.roi, strokeWidth: 2, r: 6 }}
            activeDot={{ r: 8, stroke: chartColors.roi, strokeWidth: 2 }}
            name="roi"
          />
          <Line 
            yAxisId="roi"
            type="monotone" 
            dataKey="avgROI" 
            stroke={chartColors.avgROI} 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: chartColors.avgROI, strokeWidth: 2, r: 4 }}
            name="avgROI"
          />
          <Line 
            yAxisId="roi"
            type="monotone" 
            dataKey="topTierROI" 
            stroke={chartColors.topTierROI} 
            strokeWidth={2}
            strokeDasharray="8 3"
            dot={{ fill: chartColors.topTierROI, strokeWidth: 2, r: 4 }}
            name="topTierROI"
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="mt-4 text-center text-sm italic text-muted-foreground">
        Commission ROI optimization trends showing investment efficiency, revenue impact, and tier-based performance analysis across quarterly performance cycles
      </p>
    </div>
  )
})

ROIOptimizationChart.displayName = 'ROIOptimizationChart'

export default ROIOptimizationChart