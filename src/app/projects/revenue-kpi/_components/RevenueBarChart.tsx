'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartThemeConfig,
} from '@/components/ui/chart'
import {
  LazyAreaChart as AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from '@/components/charts/lazy-charts'
import { chartColors } from '@/lib/charts'

const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: chartColors.primary,
  },
} satisfies ChartThemeConfig

type RevenueBarChartProps = {
  data: Array<{ label: string; revenue: number }>
}

export default function RevenueBarChart({ data }: RevenueBarChartProps) {
  const chartData = (() => {
    if (!data || data.length === 0) return []
    return data.map((period) => ({
      name: period.label,
      // Convert to thousands (e.g., 284K, 365K)
      revenue: Math.round(period.revenue / 1000),
    }))
  })()

  if (!chartData.length) {
    return (
      <Card className="portfolio-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Monthly Revenue 2024</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="portfolio-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Monthly Revenue 2024</CardTitle>
        <CardDescription>
          Revenue trend showing consistent growth through the current year
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[var(--chart-height-sm)] w-full">
          <AreaChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.4} />
                <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartColors.grid} />
            <XAxis
              dataKey="name"
              stroke={chartColors.axis}
              tick={{ fill: chartColors.axis, fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke={chartColors.axis}
              tick={{ fill: chartColors.axis, fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}K`}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              cursor={{ stroke: chartColors.primary, strokeOpacity: 0.3 }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke={chartColors.primary}
              strokeWidth={2}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
