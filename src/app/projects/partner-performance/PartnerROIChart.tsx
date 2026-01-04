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

// Partner ROI trends over time showing optimization results
const data = [
  { month: 'Jan', certified: 6.8, legacy: 2.9, newPartners: 1.8, quickRatio: 3.2 },
  { month: 'Feb', certified: 7.1, legacy: 3.0, newPartners: 2.0, quickRatio: 3.6 },
  { month: 'Mar', certified: 7.4, legacy: 3.1, newPartners: 2.1, quickRatio: 3.9 },
  { month: 'Apr', certified: 7.7, legacy: 3.1, newPartners: 2.2, quickRatio: 4.1 },
  { month: 'May', certified: 7.9, legacy: 3.1, newPartners: 2.3, quickRatio: 4.3 },
  { month: 'Jun', certified: 8.2, legacy: 3.1, newPartners: 2.4, quickRatio: 4.7 },
]

const chartColors = {
  certified: 'var(--color-success)',
  legacy: 'var(--color-primary)',
  newPartners: 'var(--color-secondary)',
  quickRatio: 'var(--color-warning)',
  grid: 'var(--color-border)',
  axis: 'var(--color-muted-foreground)',
}

const PartnerROIChart = memo(function PartnerROIChart() {
  return (
    <div className="h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
          <XAxis
            dataKey="month"
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
          />
          <YAxis
            yAxisId="ratio"
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
            formatter={(value: number | undefined, name: string | undefined) => {
              const safeName = name ?? ''
              if (value === undefined) return ['', safeName]
              const labels: Record<string, string> = {
                certified: 'Certified Partners ROI',
                legacy: 'Legacy Partners ROI',
                newPartners: 'New Partners ROI',
                quickRatio: 'SaaS Quick Ratio',
              }
              return [`${value}x`, labels[safeName] || safeName]
            }}
          />
          <Legend />
          <Line
            yAxisId="roi"
            type="monotone"
            dataKey="certified"
            stroke={chartColors.certified}
            strokeWidth={3}
            dot={{ fill: chartColors.certified, strokeWidth: 2, r: 4 }}
            name="certified"
          />
          <Line
            yAxisId="roi"
            type="monotone"
            dataKey="legacy"
            stroke={chartColors.legacy}
            strokeWidth={3}
            dot={{ fill: chartColors.legacy, strokeWidth: 2, r: 4 }}
            name="legacy"
          />
          <Line
            yAxisId="roi"
            type="monotone"
            dataKey="newPartners"
            stroke={chartColors.newPartners}
            strokeWidth={3}
            dot={{ fill: chartColors.newPartners, strokeWidth: 2, r: 4 }}
            name="newPartners"
          />
          <Line
            yAxisId="ratio"
            type="monotone"
            dataKey="quickRatio"
            stroke={chartColors.quickRatio}
            strokeWidth={3}
            dot={{ fill: chartColors.quickRatio, strokeWidth: 2, r: 4 }}
            strokeDasharray="5 5"
            name="quickRatio"
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="mt-4 text-center text-sm italic text-muted-foreground">
        Partner ROI optimization achieving 4.7x SaaS Quick Ratio benchmark through strategic tier
        management
      </p>
    </div>
  )
})

PartnerROIChart.displayName = 'PartnerROIChart'

export default PartnerROIChart
