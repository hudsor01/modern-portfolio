'use client'

import {
  BarChart,
  Bar,
  ChartWrapper,
  ChartGrid,
  ChartXAxis,
  ChartYAxis,
  StandardTooltip,
  chartColors,
  chartConfig,
  chartTypeConfigs,
} from '@/lib/charts'

// Real data based on partner analysis
const data = [
  { channel: 'Certified Partners', cac: 98, ltv: 687, customers: 1089 },
  { channel: 'Legacy Partners', cac: 156, ltv: 578, customers: 743 },
  { channel: 'Direct Sales', cac: 289, ltv: 534, customers: 201 },
  { channel: 'Inactive Partners', cac: 234, ltv: 445, customers: 67 },
]

// Chart data colors
const dataColors = {
  cac: chartColors.negative, // red for cost
  ltv: chartColors.positive, // green for value
}

export default function CACBreakdownChart() {
  return (
    <ChartWrapper
      caption="Partner channel CAC optimization revealing 70% cost reduction through certified partner strategy vs direct sales acquisition"
      height="large"
    >
      <BarChart data={data} margin={chartConfig.margins.medium}>
        <ChartGrid vertical={false} />
        <ChartXAxis
          dataKey="channel"
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <ChartYAxis
          tickFormatter={(value) => `$${value}`}
        />
        <StandardTooltip
          formatter={(value: number, name: string) => [
            `$${value}`, 
            name === 'cac' ? 'Customer Acquisition Cost' : 'Lifetime Value'
          ]}
        />
        <Bar 
          dataKey="cac" 
          fill={dataColors.cac} 
          {...chartTypeConfigs.bar}
          name="cac"
        />
        <Bar 
          dataKey="ltv" 
          fill={dataColors.ltv} 
          {...chartTypeConfigs.bar}
          name="ltv"
        />
      </BarChart>
    </ChartWrapper>
  )
}