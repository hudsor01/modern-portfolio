'use client'

import { ChartContainer as ChartCard } from '@/components/ui/chart-container'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartThemeConfig,
} from '@/components/ui/chart'
import { LazyBarChart as BarChart } from '@/components/charts/lazy-charts'
import { Bar, XAxis, YAxis, CartesianGrid, Cell } from 'recharts'
import { chartColors } from '@/lib/charts'
import { formatCompactCurrency } from '@/lib/data-formatters'

const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: chartColors.primary,
  },
} satisfies ChartThemeConfig

// Gradient colors for visual hierarchy
const BAR_COLORS = [
  chartColors.primary,
  chartColors.chart1,
  chartColors.secondary,
  chartColors.chart3,
  chartColors.chart4,
]

/** Splits a name into at most two lines of roughly `max` characters, breaking on spaces. */
export function wrapLabel(name: string, max = 16): string[] {
  const words = name.split(' ')
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    if (line && `${line} ${word}`.length > max && lines.length < 1) {
      lines.push(line)
      line = word
    } else {
      line = line ? `${line} ${word}` : word
    }
  }
  lines.push(line)
  return lines
}

type TickProps = { x?: number; y?: number; payload?: { value: string } }

/** Full partner name on up to two lines, never truncated. */
function PartnerTick({ x = 0, y = 0, payload }: TickProps) {
  const lines = wrapLabel(payload?.value ?? '')
  return (
    <text x={x} y={y} textAnchor="end" fill={chartColors.axis} fontSize={12}>
      {lines.map((line, i) => (
        <tspan key={line} x={x} dy={i === 0 ? (lines.length > 1 ? '-0.2em' : '0.35em') : '1.2em'}>
          {line}
        </tspan>
      ))}
    </text>
  )
}

type TopPartnersChartProps = {
  partners: Array<{ name: string; revenue: number }>
}

export default function TopPartnersChart({ partners }: TopPartnersChartProps) {
  const chartData = (() => {
    if (!partners || partners.length === 0) return []
    return partners
      .slice(0, 5)
      .sort((a, b) => b.revenue - a.revenue)
      .map((partner) => ({
        name: partner.name,
        revenue: partner.revenue,
      }))
  })()

  if (!chartData.length) {
    return (
      <ChartCard
        title={'Top Partners'}
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
      title="Top Partners by Revenue"
      description="Leading revenue contributors this period"
      size="md"
      headingLevel={2}
    >
      <ChartContainer config={chartConfig} className="aspect-auto h-full w-full">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 10, right: 24, left: 0, bottom: 10 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={true}
            vertical={false}
            stroke={chartColors.grid}
          />
          <XAxis
            type="number"
            stroke={chartColors.axis}
            tick={{ fill: chartColors.axis, fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => formatCompactCurrency(Number(value))}
          />
          <YAxis
            type="category"
            dataKey="name"
            stroke={chartColors.axis}
            tick={<PartnerTick />}
            tickLine={false}
            axisLine={false}
            interval={0}
            width={112}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value, name) => (
                  <span>
                    {name}: {formatCompactCurrency(Number(value))}
                  </span>
                )}
              />
            }
            cursor={{ fill: chartColors.primary, fillOpacity: 0.1 }}
          />
          <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </ChartCard>
  )
}
