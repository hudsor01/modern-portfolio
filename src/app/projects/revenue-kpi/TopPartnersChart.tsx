'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { LazyBarChart as BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from '@/components/charts/lazy-charts'
import { chartColors } from '@/lib/chart-colors'

const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: chartColors.primary,
  },
} satisfies ChartConfig

// Gradient colors for visual hierarchy
const BAR_COLORS = [
  chartColors.primary,
  chartColors.chart1,
  chartColors.secondary,
  chartColors.chart3,
  chartColors.chart4,
]

type TopPartnersChartProps = {
  partners: Array<{ name: string; revenue: number }>
}

export default function TopPartnersChart({ partners }: TopPartnersChartProps) {
  const chartData = useMemo(() => {
    if (!partners || partners.length === 0) return []
    return partners
      .slice(0, 5)
      .sort((a, b) => b.revenue - a.revenue)
      .map((partner) => ({
        name: partner.name.length > 15 ? partner.name.slice(0, 15) + '...' : partner.name,
        fullName: partner.name,
        revenue: Math.round(partner.revenue / 1000), // in thousands
      }))
  }, [partners])

  if (!chartData.length) {
    return (
      <Card className="portfolio-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Top Partners</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="portfolio-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Top Partners by Revenue</CardTitle>
        <CardDescription>
          Leading revenue contributors this period
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[var(--chart-height-sm)] w-full">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 100, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={chartColors.grid} />
            <XAxis
              type="number"
              stroke={chartColors.axis}
              tick={{ fill: chartColors.axis, fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}K`}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke={chartColors.axis}
              tick={{ fill: chartColors.axis, fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={90}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              cursor={{ fill: chartColors.primary, fillOpacity: 0.1 }}
            />
            <Bar
              dataKey="revenue"
              radius={[0, 4, 4, 0]}
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
