'use client'
import { memo } from 'react'

import {
  LazyAreaChart as AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from '@/components/charts/lazy-charts'
import { chartColors, chartCssVars } from '@/lib/chart-colors'
import { paybackPeriodData } from '../data/constants'

const paybackColors = {
  certified: chartColors.success,
  legacy: chartColors.primary,
  direct: chartColors.destructive,
  grid: chartColors.grid,
  axis: chartColors.axis,
}

const PaybackPeriodChart = memo(function PaybackPeriodChart() {
  return (
    <div className="h-[var(--chart-height-md)]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={paybackPeriodData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="certifiedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={paybackColors.certified} stopOpacity={0.3} />
              <stop offset="95%" stopColor={paybackColors.certified} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="legacyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={paybackColors.legacy} stopOpacity={0.3} />
              <stop offset="95%" stopColor={paybackColors.legacy} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="directGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={paybackColors.direct} stopOpacity={0.3} />
              <stop offset="95%" stopColor={paybackColors.direct} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={paybackColors.grid} vertical={false} />
          <XAxis
            dataKey="cohort"
            stroke={paybackColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: paybackColors.axis, strokeOpacity: 0.5 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            stroke={paybackColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: paybackColors.axis, strokeOpacity: 0.5 }}
            tickFormatter={(value) => `${value} mo`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: chartCssVars.popover,
              borderRadius: '12px',
              border: `1px solid ${chartCssVars.border}`,
              backdropFilter: 'blur(10px)',
              color: chartCssVars.cardForeground,
            }}
            formatter={(value: number | undefined, name: string | undefined) => [
              `${(value ?? 0).toFixed(1)} months`,
              (name ?? '').replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()),
            ]}
          />
          <Area
            type="monotone"
            dataKey="directSales"
            stackId="1"
            stroke={paybackColors.direct}
            fill="url(#directGradient)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="legacyPartners"
            stackId="1"
            stroke={paybackColors.legacy}
            fill="url(#legacyGradient)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="certifiedPartners"
            stackId="1"
            stroke={paybackColors.certified}
            fill="url(#certifiedGradient)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
      <p className="mt-4 text-center text-sm italic text-muted-foreground">
        Customer acquisition payback period optimization showing certified partners achieve
        5.4-month ROI vs 11.9-month direct sales
      </p>
    </div>
  )
})

PaybackPeriodChart.displayName = 'PaybackPeriodChart'

export default PaybackPeriodChart
