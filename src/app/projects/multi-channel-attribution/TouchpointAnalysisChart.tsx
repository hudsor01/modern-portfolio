'use client'
import { memo } from 'react'

import {
  LazyLineChart as LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from '@/components/charts/lazy-charts'

// Touchpoint sequence analysis data
const data = [
  {
    position: '1st Touch',
    paidSearch: 38.2,
    email: 12.4,
    social: 28.6,
    organic: 15.8,
    direct: 5.0,
  },
  {
    position: '2nd Touch',
    paidSearch: 22.1,
    email: 18.7,
    social: 24.3,
    organic: 19.4,
    direct: 15.5,
  },
  {
    position: '3rd Touch',
    paidSearch: 15.8,
    email: 24.2,
    social: 18.9,
    organic: 22.1,
    direct: 19.0,
  },
  {
    position: '4th Touch',
    paidSearch: 12.3,
    email: 28.5,
    social: 14.2,
    organic: 24.8,
    direct: 20.2,
  },
  {
    position: '5th Touch',
    paidSearch: 8.9,
    email: 31.2,
    social: 11.5,
    organic: 26.4,
    direct: 22.0,
  },
  { position: '6th Touch', paidSearch: 6.4, email: 33.8, social: 9.1, organic: 28.1, direct: 22.6 },
  { position: '7th Touch', paidSearch: 4.2, email: 35.4, social: 7.8, organic: 29.2, direct: 23.4 },
  {
    position: 'Final Touch',
    paidSearch: 2.1,
    email: 38.6,
    social: 5.2,
    organic: 31.5,
    direct: 22.6,
  },
]

const channelColors = {
  paidSearch: 'var(--color-warning)',
  email: 'var(--color-success)',
  social: 'var(--color-secondary)',
  organic: 'var(--color-primary)',
  direct: 'var(--color-destructive)',
  grid: 'var(--color-border)',
  axis: 'var(--color-muted-foreground)',
}

const TouchpointAnalysisChart = memo(function TouchpointAnalysisChart() {
  return (
    <div className="h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={channelColors.grid} vertical={false} />
          <XAxis
            dataKey="position"
            stroke={channelColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: channelColors.axis, strokeOpacity: 0.5 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            stroke={channelColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: channelColors.axis, strokeOpacity: 0.5 }}
            tickFormatter={(value) => `${value}%`}
            domain={[0, 40]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-popover)',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              backdropFilter: 'blur(10px)',
              color: 'white',
            }}
            formatter={(value: number | undefined, name: string | undefined) => {
              const safeName = name ?? ''
              if (value === undefined) return ['', safeName]
              const labels: Record<string, string> = {
                paidSearch: 'Paid Search',
                email: 'Email Marketing',
                social: 'Social Media',
                organic: 'Organic Search',
                direct: 'Direct Traffic',
              }
              return [`${value}%`, labels[safeName] || safeName]
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="paidSearch"
            stroke={channelColors.paidSearch}
            strokeWidth={3}
            dot={{ fill: channelColors.paidSearch, strokeWidth: 2, r: 4 }}
            name="paidSearch"
          />
          <Line
            type="monotone"
            dataKey="email"
            stroke={channelColors.email}
            strokeWidth={3}
            dot={{ fill: channelColors.email, strokeWidth: 2, r: 4 }}
            name="email"
          />
          <Line
            type="monotone"
            dataKey="social"
            stroke={channelColors.social}
            strokeWidth={3}
            dot={{ fill: channelColors.social, strokeWidth: 2, r: 4 }}
            name="social"
          />
          <Line
            type="monotone"
            dataKey="organic"
            stroke={channelColors.organic}
            strokeWidth={3}
            dot={{ fill: channelColors.organic, strokeWidth: 2, r: 4 }}
            name="organic"
          />
          <Line
            type="monotone"
            dataKey="direct"
            stroke={channelColors.direct}
            strokeWidth={3}
            dot={{ fill: channelColors.direct, strokeWidth: 2, r: 4 }}
            name="direct"
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="mt-4 text-center text-sm italic text-muted-foreground">
        Touchpoint sequence analysis showing channel contribution evolution across customer journey
        positions
      </p>
    </div>
  )
})

TouchpointAnalysisChart.displayName = 'TouchpointAnalysisChart'

export default TouchpointAnalysisChart
