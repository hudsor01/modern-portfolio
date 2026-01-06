'use client'
import { memo } from 'react'
import { useState, useEffect } from 'react'
import {
  LazyBarChart as BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from '@/components/charts/lazy-charts'
import { chartColors, chartCssVars } from '@/lib/chart-colors'

type ChurnDatum = {
  month: string
  retained: number
  churned: number
}

type RetentionHeatmapProps = {
  data: ChurnDatum[]
}

const RetentionHeatmap = memo(function RetentionHeatmap({ data }: RetentionHeatmapProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="h-[350px] flex items-center justify-center">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary/20 rounded-full" />
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-primary rounded-full animate-spin border-t-transparent" />
        </div>
      </div>
    )
  }

  const chartData = data.slice(-6).map((item) => ({
    month: item.month,
    retained: parseFloat(((item.retained / (item.retained + item.churned)) * 100).toFixed(1)),
    churned: parseFloat(((item.churned / (item.retained + item.churned)) * 100).toFixed(1)),
  }))

  return (
    <div className="h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="retentionBarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartColors.success} stopOpacity={1} />
              <stop offset="100%" stopColor={chartColors.success} stopOpacity={1} />
            </linearGradient>
            <linearGradient id="churnBarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartColors.destructive} stopOpacity={1} />
              <stop offset="100%" stopColor={chartColors.destructive} stopOpacity={1} />
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
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
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
            formatter={(value: number | undefined) => `${(value ?? 0).toFixed(1)}%`}
          />
          <Legend iconType="rect" wrapperStyle={{ paddingTop: '20px' }} />
          <Bar
            dataKey="retained"
            name="Retained"
            stackId="a"
            fill="url(#retentionBarGradient)"
            radius={[0, 0, 0, 0]}
            animationDuration={1500}
          />
          <Bar
            dataKey="churned"
            name="Churned"
            stackId="a"
            fill="url(#churnBarGradient)"
            radius={[8, 8, 0, 0]}
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
})

RetentionHeatmap.displayName = 'RetentionHeatmap'

export default RetentionHeatmap
