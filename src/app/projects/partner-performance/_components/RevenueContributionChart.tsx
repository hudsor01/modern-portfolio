'use client'
import { memo } from 'react'

import {
  LazyPieChart as PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from '@/components/charts/lazy-charts'
import { chartColors as baseChartColors, chartCssVars } from '@/lib/charts'

// Partner revenue distribution demonstrating 80/20 rule
const data = [
  {
    name: 'Top 20% Partners',
    value: 80.2,
    revenue: 725840,
    count: 7,
    color: baseChartColors.primary,
  },
  {
    name: 'Middle 60% Partners',
    value: 17.1,
    revenue: 154689,
    count: 20,
    color: baseChartColors.secondary,
  },
  {
    name: 'Bottom 20% Partners',
    value: 2.7,
    revenue: 23858,
    count: 7,
    color: baseChartColors.chart4,
  },
]

const COLORS = data.map((item) => item.color)

const RevenueContributionChart = memo(function RevenueContributionChart() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="h-[var(--chart-height-md)]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}%`}
            outerRadius={100}
            fill={baseChartColors.chart3}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: chartCssVars.popover,
              borderRadius: '12px',
              border: `1px solid ${chartCssVars.border}`,
              backdropFilter: 'blur(10px)',
              color: chartCssVars.cardForeground,
            }}
            formatter={(value: number | undefined, name: string | undefined, props: unknown) => {
              if (value === undefined) return ['', name]
              const payload = (props as { payload?: (typeof data)[0] })?.payload
              if (!payload) return [String(value), name]
              return [
                [`${value}% (${formatCurrency(payload.revenue)})`, `${payload.count} partners`],
                name,
              ]
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{ color: chartCssVars.mutedForeground }}
          />
        </PieChart>
      </ResponsiveContainer>
      <p className="mt-4 text-center text-sm italic text-muted-foreground">
        Channel revenue distribution following Pareto Principle: top 20% of partners generate 80.2%
        of revenue
      </p>
    </div>
  )
})

RevenueContributionChart.displayName = 'RevenueContributionChart'

export default RevenueContributionChart
