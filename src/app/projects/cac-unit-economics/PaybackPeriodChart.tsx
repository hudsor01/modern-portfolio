'use client'

import { LazyAreaChart as AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from '@/components/charts/lazy-charts'

// Payback period by customer cohort
const data = [
  { cohort: 'Jan 2024', certifiedPartners: 6.2, legacyPartners: 8.9, directSales: 14.2 },
  { cohort: 'Feb 2024', certifiedPartners: 6.1, legacyPartners: 8.7, directSales: 13.8 },
  { cohort: 'Mar 2024', certifiedPartners: 5.9, legacyPartners: 8.4, directSales: 13.1 },
  { cohort: 'Apr 2024', certifiedPartners: 5.8, legacyPartners: 8.2, directSales: 12.7 },
  { cohort: 'May 2024', certifiedPartners: 5.6, legacyPartners: 8.0, directSales: 12.3 },
  { cohort: 'Jun 2024', certifiedPartners: 5.4, legacyPartners: 7.8, directSales: 11.9 },
]

const chartColors = {
  certified: 'var(--color-success)',
  legacy: 'var(--color-primary)',
  direct: 'var(--color-destructive)',
  grid: 'var(--color-border)',
  axis: 'var(--color-muted-foreground)',
}

export default function PaybackPeriodChart() {
  return (
    <div className="h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="certifiedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColors.certified} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={chartColors.certified} stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="legacyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColors.legacy} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={chartColors.legacy} stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="directGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColors.direct} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={chartColors.direct} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={chartColors.grid} 
            vertical={false}
          />
          <XAxis
            dataKey="cohort"
            stroke={chartColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: chartColors.axis, strokeOpacity: 0.5 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            stroke={chartColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: chartColors.axis, strokeOpacity: 0.5 }}
            tickFormatter={(value) => `${value} mo`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-popover)',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              backdropFilter: 'blur(10px)',
              color: 'white',
            }}
            formatter={(value: number, name: string) => [
              `${value.toFixed(1)} months`, 
              name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
            ]}
          />
          <Area
            type="monotone"
            dataKey="directSales"
            stackId="1"
            stroke={chartColors.direct}
            fill="url(#directGradient)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="legacyPartners"
            stackId="1"
            stroke={chartColors.legacy}
            fill="url(#legacyGradient)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="certifiedPartners"
            stackId="1"
            stroke={chartColors.certified}
            fill="url(#certifiedGradient)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
      <p className="mt-4 text-center text-sm italic text-muted-foreground">
        Customer acquisition payback period optimization showing certified partners achieve 5.4-month ROI vs 11.9-month direct sales
      </p>
    </div>
  )
}