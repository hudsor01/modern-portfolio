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
import { chartColors, chartCssVars } from '@/lib/chart-colors'
import { unitEconomicsTrendData } from './data/constants'

const unitEconColors = {
  ltv: chartColors.success,
  cac: chartColors.destructive,
  ratio: chartColors.primary,
  grid: chartColors.grid,
  axis: chartColors.axis,
}

const UnitEconomicsChart = memo(function UnitEconomicsChart() {
  return (
    <div className="h-[var(--chart-height-md)]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={unitEconomicsTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={unitEconColors.grid} vertical={false} />
          <XAxis
            dataKey="month"
            stroke={unitEconColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: unitEconColors.axis, strokeOpacity: 0.5 }}
          />
          <YAxis
            yAxisId="currency"
            stroke={unitEconColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: unitEconColors.axis, strokeOpacity: 0.5 }}
            tickFormatter={(value) => `$${value}`}
          />
          <YAxis
            yAxisId="ratio"
            orientation="right"
            stroke={unitEconColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: unitEconColors.axis, strokeOpacity: 0.5 }}
            tickFormatter={(value) => `${value}:1`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: chartCssVars.popover,
              borderRadius: '12px',
              border: `1px solid ${chartCssVars.border}`,
              backdropFilter: 'blur(10px)',
              color: chartCssVars.cardForeground,
            }}
            formatter={(value: number | undefined, name: string | undefined) => {
              const safeValue = value ?? 0
              const safeName = name ?? ''
              if (safeName === 'ratio') return [`${safeValue.toFixed(1)}:1`, 'LTV:CAC Ratio']
              if (safeName === 'payback') return [`${safeValue.toFixed(1)} mo`, 'Payback Period']
              return [`${safeValue}`, safeName.toUpperCase()]
            }}
          />
          <Legend />
          <Line
            yAxisId="currency"
            type="monotone"
            dataKey="ltv"
            stroke={unitEconColors.ltv}
            strokeWidth={3}
            dot={{ fill: unitEconColors.ltv, strokeWidth: 2, r: 4 }}
            name="LTV"
          />
          <Line
            yAxisId="currency"
            type="monotone"
            dataKey="cac"
            stroke={unitEconColors.cac}
            strokeWidth={3}
            dot={{ fill: unitEconColors.cac, strokeWidth: 2, r: 4 }}
            name="CAC"
          />
          <Line
            yAxisId="ratio"
            type="monotone"
            dataKey="ratio"
            stroke={unitEconColors.ratio}
            strokeWidth={3}
            dot={{ fill: unitEconColors.ratio, strokeWidth: 2, r: 4 }}
            name="LTV:CAC Ratio"
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="mt-4 text-center text-sm italic text-muted-foreground">
        LTV:CAC ratio optimization achieving industry-benchmark 3.6:1+ efficiency through strategic
        partner channel management
      </p>
    </div>
  )
})

UnitEconomicsChart.displayName = 'UnitEconomicsChart'

export default UnitEconomicsChart
