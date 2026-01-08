'use client'
import { memo } from 'react'
import { useState, useEffect } from 'react'
import {
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Area,
  LazyComposedChart as ComposedChart,
} from '@/components/charts/lazy-charts'
import { chartColors, chartCssVars } from '@/lib/chart-colors'

type ChurnDatum = {
  month: string
  churnRate: number
}

type ChurnLineChartProps = {
  data: ChurnDatum[]
}

const ChurnLineChart = memo(function ChurnLineChart({ data }: ChurnLineChartProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="h-[var(--chart-height-md)] flex items-center justify-center">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary/20 rounded-full" />
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-primary rounded-full animate-spin border-t-transparent" />
        </div>
      </div>
    )
  }

  const chartData = data.map((item) => ({
    month: item.month,
    churn: item.churnRate,
    retention: 100 - item.churnRate,
  }))

  return (
    <div className="h-[var(--chart-height-md)]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="churnGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColors.destructive} stopOpacity={0.3} />
              <stop offset="95%" stopColor={chartColors.destructive} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="retentionGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColors.success} stopOpacity={0.3} />
              <stop offset="95%" stopColor={chartColors.success} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
          <XAxis
            dataKey="month"
            stroke={chartColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: chartColors.muted }}
          />
          <YAxis
            stroke={chartColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: chartColors.muted }}
            domain={[0, 10]}
            ticks={[0, 2, 4, 6, 8, 10]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: chartCssVars.popover,
              borderRadius: '12px',
              border: `1px solid ${chartCssVars.border}`,
              backdropFilter: 'blur(10px)',
              color: chartCssVars.cardForeground,
            }}
            itemStyle={{ color: chartCssVars.cardForeground }}
            formatter={(value: number | undefined, name: string | undefined) => [
              `${(value ?? 0).toFixed(1)}%`,
              (name ?? '') === 'churn' ? 'Churn Rate' : 'Retention Rate',
            ]}
          />
          <Legend
            iconType="line"
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => (value === 'churn' ? 'Churn Rate' : 'Retention Rate')}
          />
          <Area
            type="monotone"
            dataKey="churn"
            stroke="transparent"
            fill="url(#churnGradient)"
            fillOpacity={1}
          />
          <Line
            type="monotone"
            dataKey="churn"
            stroke={chartColors.destructive}
            strokeWidth={3}
            dot={{ fill: chartColors.destructive, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: chartColors.destructive }}
            animationDuration={1500}
            name="churn"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
})

ChurnLineChart.displayName = 'ChurnLineChart'

export default ChurnLineChart
