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
import { staticChurnData } from '@/app/projects/data/partner-analytics'

// Transform data for visualization
const data = staticChurnData.map((item) => ({
  month: item.month,
  churn: item.churnRate,
  retention: 100 - item.churnRate,
}))

const ChurnLineChart = memo(function ChurnLineChart() {
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

  return (
    <div className="h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="churnGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="retentionGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
          <XAxis
            dataKey="month"
            stroke="var(--color-muted-foreground)"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: 'var(--color-muted)' }}
          />
          <YAxis
            stroke="var(--color-muted-foreground)"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: 'var(--color-muted)' }}
            domain={[0, 10]}
            ticks={[0, 2, 4, 6, 8, 10]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-popover)',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              backdropFilter: 'blur(10px)',
              color: 'white',
            }}
            itemStyle={{ color: 'white' }}
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
            stroke="#ef4444"
            strokeWidth={3}
            dot={{ fill: 'var(--color-destructive)', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: 'var(--color-destructive)' }}
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
