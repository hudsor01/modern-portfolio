'use client'

import { ChartContainer } from '@/components/ui/chart-container'
import {
  ChartFrame,
  ChartTooltip,
  ChartTooltipContent,
  type ChartThemeConfig,
} from '@/components/ui/chart'
import { LazyPieChart as PieChart } from '@/components/charts/lazy-charts'
import { Pie, Cell, Legend } from 'recharts'
import { chartColors } from '@/lib/charts'

const COLORS = [chartColors.primary, chartColors.secondary, chartColors.chart3, chartColors.chart4]

/** Tier names carry colour meaning: gold reads copper, silver slate, bronze terracotta. */
const TIER_COLORS: Record<string, string> = {
  platinum: chartColors.primary,
  gold: chartColors.chart3,
  silver: chartColors.chart4,
  bronze: chartColors.destructive,
}

export function tierColor(name: string, index: number): string {
  return TIER_COLORS[name.toLowerCase()] ?? COLORS[index % COLORS.length] ?? chartColors.primary
}

type PartnerGroupPieChartProps = {
  groups: Array<{ name: string; value: number }>
}

export default function PartnerGroupPieChart({ groups }: PartnerGroupPieChartProps) {
  const chartData = (() => {
    if (!groups || groups.length === 0) return []
    return groups.map((group, index) => ({
      name: group.name,
      value: group.value,
      fill: tierColor(group.name, index),
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
      <ChartContainer
        title="Partner Revenue Contribution"
        description="No data available"
        size="auto"
        headingLevel={2}
      >
        {null}
      </ChartContainer>
    )
  }

  return (
    <ChartContainer
      title="Partner Revenue Contribution"
      description="Revenue distribution by partner tier"
      size="md"
      headingLevel={2}
    >
      <ChartFrame config={chartConfig} className="aspect-auto h-full w-full">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            innerRadius="45%"
            outerRadius="75%"
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            wrapperStyle={{ fontSize: 12 }}
            formatter={(name, entry) => (
              <span className="text-muted-foreground">
                {name}: {String((entry.payload as { value?: number } | undefined)?.value ?? '')}%
              </span>
            )}
          />
          <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
        </PieChart>
      </ChartFrame>
    </ChartContainer>
  )
}
