'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { LazyPieChart as PieChart, Pie, Cell, ResponsiveContainer } from '@/components/charts/lazy-charts'
import { chartColors } from '@/lib/chart-colors'

const COLORS = [chartColors.primary, chartColors.secondary, chartColors.chart3, chartColors.chart4]

type PartnerGroupPieChartProps = {
  groups: Array<{ name: string; value: number }>
}

export default function PartnerGroupPieChart({ groups }: PartnerGroupPieChartProps) {
  const chartData = useMemo(() => {
    if (!groups || groups.length === 0) return []
    return groups.map((group, index) => ({
      name: group.name,
      value: group.value,
      fill: COLORS[index % COLORS.length],
    }))
  }, [groups])

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {}
    chartData.forEach((item) => {
      config[item.name] = {
        label: item.name,
        color: item.fill,
      }
    })
    return config
  }, [chartData])

  if (!chartData.length) {
    return (
      <Card className="portfolio-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Partner Revenue Contribution</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="portfolio-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Partner Revenue Contribution</CardTitle>
        <CardDescription>
          Revenue distribution by partner tier
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
                label={({ name, value }) => `${name}: ${value}%`}
                labelLine={{ stroke: chartColors.axis, strokeWidth: 1 }}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip
                content={<ChartTooltipContent nameKey="name" />}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
