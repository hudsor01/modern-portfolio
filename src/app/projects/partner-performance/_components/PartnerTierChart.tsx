'use client'
import { memo } from 'react'

import { LazyBarChart as BarChart } from '@/components/charts/lazy-charts'
import { Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { formatCompactCurrency } from '@/lib/data-formatters'
import { chartColors as baseChartColors, chartCssVars } from '@/lib/charts'
import { partnerProgramMetrics } from '@/data/partner-program-metrics'

// Real figures, derived from the 2024 partner-platform export by
// scripts/derive-partner-metrics.ts. Only tiers with actual transaction
// activity are charted — the rest carry $0 and would just be empty bars.
//
// The previous hard-coded array claimed an "ROI multiple" per tier. That is not
// derivable from this export (it carries no cost data), so it has been replaced
// with revenue per active partner, which is.
const data = partnerProgramMetrics.partnerTiers
  .filter((t) => t.revenueUsd > 0 && t.activePartners > 0)
  .map((t) => ({
    tier: t.tier,
    revenue: t.revenueUsd,
    perPartner: Math.round(t.revenueUsd / t.activePartners),
  }))
  .sort((a, b) => b.revenue - a.revenue)

const chartColors = {
  revenue: baseChartColors.primary,
  perPartner: baseChartColors.success,
  grid: baseChartColors.grid,
  axis: baseChartColors.axis,
}

const PartnerTierChart = memo(function PartnerTierChart() {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
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
            tickFormatter={(value) => formatCompactCurrency(Number(value))}
          />
          <YAxis
            yAxisId="perPartner"
            orientation="right"
            stroke={chartColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: chartColors.axis, strokeOpacity: 0.5 }}
            tickFormatter={(value) => formatCompactCurrency(Number(value))}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: chartCssVars.popover,
              borderRadius: '12px',
              border: `1px solid ${chartCssVars.border}`,
              backdropFilter: 'blur(10px)',
              color: chartCssVars.cardForeground,
            }}
            formatter={(value, name) => {
              const safeName = String(name ?? '')
              const safeValue = Number(value ?? 0)
              if (safeName === 'revenue') return [formatCompactCurrency(safeValue), 'Revenue']
              if (safeName === 'perPartner')
                return [formatCompactCurrency(safeValue), 'Revenue / active partner']
              return [safeValue, safeName]
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
            yAxisId="perPartner"
            dataKey="perPartner"
            fill={chartColors.perPartner}
            radius={[4, 4, 0, 0]}
            name="perPartner"
          />
        </BarChart>
      </ResponsiveContainer>
      <p className="mt-4 text-center italic">
        Certified partners drove $
        {(
          partnerProgramMetrics.partnerTiers.find((t) => t.tier === 'Certified')?.revenueUsd ?? 0
        ).toLocaleString()}{' '}
        across {partnerProgramMetrics.totals.transactions.toLocaleString()} transactions — legacy
        partners show the highest revenue per active partner
      </p>
    </div>
  )
})

PartnerTierChart.displayName = 'PartnerTierChart'

export default PartnerTierChart
