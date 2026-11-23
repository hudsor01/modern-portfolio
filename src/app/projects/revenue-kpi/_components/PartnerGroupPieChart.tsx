'use client'

import { ChartContainer as ChartCard } from '@/components/ui/chart-container'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartThemeConfig,
} from '@/components/ui/chart'
import { LazyPieChart as PieChart } from '@/components/charts/lazy-charts'
import { Pie, Cell } from 'recharts'
import { chartColors } from '@/lib/charts'

const COLORS = [chartColors.primary, chartColors.secondary, chartColors.chart3, chartColors.chart4]

type PartnerGroupPieChartProps = {
  groups: Array<{ name: string; value: number }>
}

export default function PartnerGroupPieChart({ groups }: PartnerGroupPieChartProps) {
  const chartData = (() => {
    if (!groups || groups.length === 0) return []
    return groups.map((group, index) => ({
      name: group.name,
      value: group.value,
      fill: COLORS[index % COLORS.length],
    }))
  })()

  const chartConfig = (() => {
    const config: ChartThemeConfig = {}
    chartData.forEach((item) => {
      config[item.name] = {
        label: item.name,
        color: item.fill,
      }
    })
    return config
  })()

  if (!chartData.length) {
    return (
      <ChartCard
        title={'Partner Revenue Contribution'}
        description="No data available"
        size="auto"
        headingLevel={2}
      >
        {null}
      </ChartCard>
    )
  }

  return (
    <ChartCard
      title="Partner Revenue Contribution"
      description="Revenue distribution by partner tier"
      size="md"
      headingLevel={2}
    >
      <ChartContainer config={chartConfig} className="aspect-auto h-full w-full">
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
          <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
        </PieChart>
      </ChartContainer>
    </ChartCard>
  )
}
