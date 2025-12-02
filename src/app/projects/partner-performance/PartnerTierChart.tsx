'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

// Partner tier performance data based on real CSV analysis
const data = [
  { tier: 'Certified', count: 12, revenue: 687420, roi: 8.2, winRate: 89.4 },
  { tier: 'Legacy', count: 15, revenue: 216967, roi: 3.1, winRate: 78.1 },
  { tier: 'New Partners', count: 13, revenue: 183033, roi: 2.4, winRate: 71.2 },
  { tier: 'Inactive', count: 7, revenue: 0, roi: 0, winRate: 0 },
]

const chartColors = {
  revenue: 'var(--color-primary)',
  roi: 'var(--color-success)',
  grid: 'var(--color-border)',
  axis: 'var(--color-muted-foreground)',
}

export default function PartnerTierChart() {
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
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
          />
          <YAxis
            yAxisId="roi"
            orientation="right"
            stroke={chartColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: chartColors.axis, strokeOpacity: 0.5 }}
            tickFormatter={(value) => `${value}x`}
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
              if (name === 'revenue') return [`$${(value / 1000).toFixed(0)}K`, 'Revenue']
              if (name === 'roi') return [`${value}x`, 'ROI Multiple']
              return [value, name]
            }}
          />
          <Bar 
            yAxisId="revenue"
            dataKey="revenue" 
            fill={chartColors.revenue} 
            radius={[4, 4, 0, 0]} 
            name="revenue"
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
        Partner tier performance showing certified partners deliver 8.2x ROI vs 2.4x for new partner acquisitions
      </p>
    </div>
  )
}