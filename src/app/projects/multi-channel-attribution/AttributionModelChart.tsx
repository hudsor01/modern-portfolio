'use client'
import { memo } from 'react'

import { LazyBarChart as BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from '@/components/charts/lazy-charts'

// Attribution model comparison data
const data = [
  { model: 'First-Touch', accuracy: 68.2, conversions: 1456, roi: 340000 },
  { model: 'Last-Touch', accuracy: 72.4, conversions: 1823, roi: 420000 },
  { model: 'Linear', accuracy: 78.9, conversions: 2104, roi: 580000 },
  { model: 'Time-Decay', accuracy: 84.6, conversions: 2456, roi: 720000 },
  { model: 'Position-Based', accuracy: 87.3, conversions: 2698, roi: 840000 },
  { model: 'Data-Driven (ML)', accuracy: 92.4, conversions: 2847, roi: 1200000 },
]

const chartColors = {
  accuracy: 'var(--color-warning)',
  conversions: 'var(--color-primary)',
  roi: 'var(--color-success)',
  grid: 'var(--color-border)',
  axis: 'var(--color-muted-foreground)',
}

const AttributionModelChart = memo(function AttributionModelChart() {
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
            dataKey="model"
            stroke={chartColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: chartColors.axis, strokeOpacity: 0.5 }}
            angle={-45}
            textAnchor="end"
            height={100}
          />
          <YAxis
            yAxisId="accuracy"
            stroke={chartColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: chartColors.axis, strokeOpacity: 0.5 }}
            tickFormatter={(value) => `${value}%`}
            domain={[60, 100]}
          />
          <YAxis
            yAxisId="roi"
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
              if (name === 'accuracy') return [`${value}%`, 'Attribution Accuracy']
              if (name === 'conversions') return [value.toLocaleString(), 'Attributed Conversions']
              if (name === 'roi') return [formatCurrency(value), 'Attributed ROI']
              return [value, name]
            }}
            labelFormatter={(label) => `Model: ${label}`}
          />
          <Bar 
            yAxisId="accuracy"
            dataKey="accuracy" 
            fill={chartColors.accuracy} 
            radius={[4, 4, 0, 0]} 
            name="accuracy"
          />
          <Bar 
            yAxisId="roi"
            dataKey="roi" 
            fill={chartColors.roi} 
            radius={[4, 4, 0, 0]} 
            name="roi"
          />
        </BarChart>
      </ResponsiveContainer>
      <p className="mt-4 text-center text-sm italic text-muted-foreground">
        Attribution model performance comparison showing ML-driven model achieving 92.4% accuracy vs traditional approaches
      </p>
    </div>
  )
})

AttributionModelChart.displayName = 'AttributionModelChart'

export default AttributionModelChart