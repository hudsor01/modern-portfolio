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

const LABEL_MAX_CHARS = 15
const LABEL_MAX_LINES = 3

function ellipsize(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text
}

/**
 * Wraps a name into at most `maxLines` lines of at most `max` characters, breaking on
 * spaces, so no line can overflow the axis gutter. Anything that still does not fit
 * (one very long word, or more text than `maxLines` allows) is ellipsized on its line;
 * the full name stays available through the tick's <title> and the chart tooltip.
 */
export function wrapLabel(
  name: string,
  max = LABEL_MAX_CHARS,
  maxLines = LABEL_MAX_LINES
): string[] {
  // Each word is capped first, so a single long word can never overflow a line by itself.
  const words = name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => ellipsize(word, max))
  const lines: string[] = []
  let line = ''
  let index = 0
  for (; index < words.length; index += 1) {
    const word = words[index] as string
    const candidate = line ? `${line} ${word}` : word
    if (candidate.length <= max) {
      line = candidate
    } else if (lines.length < maxLines - 1) {
      lines.push(line)
      line = word
    } else {
      break
    }
  }
  // Out of lines: the last line absorbs what is left and is ellipsized.
  if (index < words.length) {
    line = ellipsize(`${line} ${words.slice(index).join(' ')}`, max)
  }
  if (line) lines.push(line)
  return lines.length > 0 ? lines : ['']
}

type TickProps = { x?: number; y?: number; payload?: { value: string } }

/** Partner name wrapped to fit the gutter; the full name is the element's <title>. */
export function PartnerTick({ x = 0, y = 0, payload }: TickProps) {
  const name = payload?.value ?? ''
  const lines = wrapLabel(name)
  const firstDy = `${(0.35 - (lines.length - 1) * 0.6).toFixed(2)}em`
  return (
    <text x={x} y={y} textAnchor="end" fill={chartColors.axis} fontSize={12}>
      <title>{name}</title>
      {lines.map((line, i) => (
        // Index key: lines are positional and can repeat.
        <tspan key={i} x={x} dy={i === 0 ? firstDy : '1.2em'}>
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
