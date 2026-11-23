'use client'
import { memo } from 'react'

import {
  LazyBarChart as BarChart,
  ChartGrid,
  ChartXAxis,
  ChartYAxis,
  StandardTooltip,
} from '@/components/charts/lazy-charts'
import { Bar, ResponsiveContainer } from 'recharts'
import { chartColors, chartConfig, chartTypeConfigs } from '@/lib/charts'
import { formatCompactCurrency } from '@/lib/data-formatters'

// Real data based on partner analysis
const data = [
  { channel: 'Certified Partners', cac: 98, ltv: 687, customers: 1089 },
  { channel: 'Legacy Partners', cac: 156, ltv: 578, customers: 743 },
  { channel: 'Direct Sales', cac: 289, ltv: 534, customers: 201 },
  { channel: 'Inactive Partners', cac: 234, ltv: 445, customers: 67 },
]

// Chart data colors
const dataColors = {
  cac: chartColors.negative, // red for cost
  ltv: chartColors.positive, // green for value
}

const CACBreakdownChart = memo(function CACBreakdownChart() {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart data={data} margin={chartConfig.margins.medium}>
            <ChartGrid vertical={false} />
            <ChartXAxis dataKey="channel" angle={-45} textAnchor="end" height={80} />
            <ChartYAxis tickFormatter={(value) => formatCompactCurrency(Number(value))} />
            <StandardTooltip
              formatter={(value: string | number, name: string | number) => [
                formatCompactCurrency(Number(value ?? 0)),
                String(name ?? '') === 'cac' ? 'Customer Acquisition Cost' : 'Lifetime Value',
              ]}
            />
            <Bar dataKey="cac" fill={dataColors.cac} {...chartTypeConfigs.bar} name="cac" />
            <Bar dataKey="ltv" fill={dataColors.ltv} {...chartTypeConfigs.bar} name="ltv" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-4 text-center italic">
        Partner channel CAC optimization revealing 70% cost reduction through certified partner
        strategy vs direct sales acquisition
      </p>
    </div>
  )
})

CACBreakdownChart.displayName = 'CACBreakdownChart'

export default CACBreakdownChart
