'use client'
import { ShadcnChartContainer } from '@/components/charts/shadcn-chart-container'
import { topPartnersData, type TopPartnerData } from '@/app/projects/data/partner-analytics'
import { chartColors } from '@/lib/constants/chart'
import type { ChartConfig } from '@/components/ui/chart'

// Transform the real data for the chart
const data = topPartnersData.map((partner: TopPartnerData) => ({
  name: partner.name,
  revenue: partner.revenue / 1000000,
  value: partner.revenue / 1000000, // Required by ChartData type
}))

// Chart configuration for shadcn/ui
const chartConfig: ChartConfig = {
  revenue: {
    label: 'Revenue',
    color: chartColors.primary,
  },
}

export default function TopPartnersChart() {
  return (
    <ShadcnChartContainer
      title="Top 5 Partners by Revenue ($M)"
      description="Revenue contribution from top 5 partner organizations"
      staticData={data}
      dataKey="revenue"
      xAxisKey="name"
      chartConfig={chartConfig}
      variant="default"
      height={300}
      valueFormatter={(value) => `$${value}M`}
      className="portfolio-card"
    />
  )
}