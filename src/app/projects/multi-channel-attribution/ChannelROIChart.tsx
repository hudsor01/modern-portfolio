'use client'

import { LazyScatterChart as ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from '@/components/charts/lazy-charts'

// Channel performance data for scatter plot
const data = [
  { channel: 'Email Marketing', attribution: 25.5, roi: 30.0, cost: 95000, revenue: 2850000, size: 2104 },
  { channel: 'Organic Search', attribution: 17.7, roi: 33.8, cost: 65000, revenue: 2200000, size: 1456 },
  { channel: 'Paid Search', attribution: 22.4, roi: 8.2, cost: 285000, revenue: 2340000, size: 1847 },
  { channel: 'Social Media', attribution: 15.0, roi: 8.7, cost: 180000, revenue: 1560000, size: 1234 },
  { channel: 'Direct Traffic', attribution: 12.0, roi: 999, cost: 0, revenue: 1890000, size: 987 },
  { channel: 'Display Ads', attribution: 9.2, roi: 4.5, cost: 220000, revenue: 980000, size: 756 },
]

// Normalize ROI for visualization (cap at 50 for direct traffic)
const normalizedData = data.map(d => ({
  ...d,
  displayROI: d.roi === 999 ? 50 : d.roi
}))

const getChannelColor = (channel: string) => {
  const colors: Record<string, string> = {
    'Email Marketing': 'var(--color-success)',
    'Organic Search': 'var(--color-primary)',
    'Paid Search': 'var(--color-warning)',
    'Social Media': 'var(--color-secondary)',
    'Direct Traffic': 'var(--color-destructive)',
    'Display Ads': 'var(--color-secondary)'
  }
  return colors[channel] || 'var(--color-muted-foreground)'
}

const chartColors = {
  grid: 'var(--color-border)',
  axis: 'var(--color-muted-foreground)',
}

export default function ChannelROIChart() {
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
        <ScatterChart data={normalizedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={chartColors.grid} 
          />
          <XAxis
            type="number"
            dataKey="attribution"
            stroke={chartColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: chartColors.axis, strokeOpacity: 0.5 }}
            tickFormatter={(value) => `${value}%`}
            domain={[5, 30]}
            label={{ value: 'Attribution %', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fill: chartColors.axis } }}
          />
          <YAxis
            type="number"
            dataKey="displayROI"
            stroke={chartColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: chartColors.axis, strokeOpacity: 0.5 }}
            tickFormatter={(value) => value === 50 ? '∞' : `${value}x`}
            domain={[0, 50]}
            label={{ value: 'ROI', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: chartColors.axis } }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-popover)',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              backdropFilter: 'blur(10px)',
              color: 'white',
            }}
            formatter={(value: number, name: string, props: unknown) => {
              const payload = (props as { payload?: typeof normalizedData[0] })?.payload
              if (!payload) return [String(value), name]
              return [
                [
                  `Attribution: ${payload.attribution}%`,
                  `ROI: ${payload.roi === 999 ? '∞' : `${payload.roi}x`}`,
                  `Cost: ${formatCurrency(payload.cost)}`,
                  `Revenue: ${formatCurrency(payload.revenue)}`,
                  `Conversions: ${payload.size.toLocaleString()}`
                ],
                payload.channel
              ]
            }}
            labelFormatter={() => ''}
          />
          <Scatter
            name="Channels"
            data={normalizedData}
            fill="#8884d8"
          >
            {normalizedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getChannelColor(entry.channel)} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      <p className="mt-4 text-center text-sm italic text-muted-foreground">
        Channel attribution vs ROI scatter analysis revealing optimal investment allocation and performance optimization opportunities
      </p>
    </div>
  )
}
