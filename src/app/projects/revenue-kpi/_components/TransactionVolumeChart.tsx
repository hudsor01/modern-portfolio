'use client'
import type React from 'react'
import { memo, useMemo } from 'react'
import {
  LazyLineChart as LineChart,
  ChartWrapper,
  ChartGrid,
  ChartXAxis,
  ChartYAxis,
  StandardTooltip,
} from '@/components/charts/lazy-charts'
import { Line } from 'recharts'
import { formatCompactNumber, formatNumber } from '@/lib/data-formatters'
import { chartColors, chartConfig, chartTypeConfigs } from '@/lib/charts'
import type { YearOverYearData } from '@/types/analytics'

type YearOverYearSeries = Pick<
  YearOverYearData,
  'year' | 'total_revenue' | 'total_transactions' | 'total_commissions'
>

type TransactionVolumeChartProps = {
  data: YearOverYearSeries[]
}

type TooltipProps = {
  active?: boolean
  payload?: Array<{ payload?: { transactions: number } }>
  label?: string | number
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload || payload.length === 0) return null
  const point = payload[0]?.payload
  if (!point) return null
  return (
    <StandardTooltip
      active={active}
      payload={[
        {
          name: 'Transactions',
          value: formatNumber(point.transactions),
          color: chartColors.transactions,
        },
      ]}
      label={label}
    />
  )
}

const TransactionVolumeChart = memo(({ data }: TransactionVolumeChartProps): React.JSX.Element => {
  const series = useMemo(
    () =>
      (data ?? []).map((row) => ({
        name: row.year.toString(),
        transactions: row.total_transactions,
      })),
    [data]
  )

  if (!series.length) {
    return (
      <ChartWrapper
        headingLevel={2}
        title="Transaction Volume"
        description="No data available"
        size="sm"
      >
        <div className="flex items-center justify-center h-full text-muted-foreground">
          No data available
        </div>
      </ChartWrapper>
    )
  }

  return (
    <ChartWrapper
      headingLevel={2}
      title="Transaction Volume"
      description="Transactions per year"
      size="sm"
    >
      <LineChart data={series} margin={chartConfig.margins.medium}>
        <ChartGrid />
        <ChartXAxis dataKey="name" />
        <ChartYAxis
          tickFormatter={(value) => formatCompactNumber(Number(value))}
          label={{
            value: 'Transactions',
            angle: -90,
            position: 'insideLeft',
            fill: chartColors.transactions,
            fontSize: 12,
            fontWeight: 600,
          }}
        />
        <CustomTooltip />
        <Line
          {...chartTypeConfigs.line}
          dataKey="transactions"
          stroke={chartColors.transactions}
          dot={{ ...chartTypeConfigs.line.dot, stroke: chartColors.transactions }}
          activeDot={{
            ...chartTypeConfigs.line.activeDot,
            stroke: chartColors.transactions,
            fill: chartColors.transactions,
          }}
          animationDuration={chartConfig.animation.duration}
          name="Transactions"
        />
      </LineChart>
    </ChartWrapper>
  )
})

TransactionVolumeChart.displayName = 'TransactionVolumeChart'

export default TransactionVolumeChart
