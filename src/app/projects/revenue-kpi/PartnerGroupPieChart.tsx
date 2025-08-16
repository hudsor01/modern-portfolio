'use client'
import React from 'react'
import { ShadcnChartContainer } from '@/components/charts/shadcn-chart-container'
import { partnerGroupsData, type PartnerGroup } from '@/app/projects/data/partner-analytics'
import { chartColors as defaultChartColors } from '@/lib/constants/chart'
import type { ChartConfig } from '@/components/ui/chart'

// Transform data for chart
const data = partnerGroupsData.map((group: PartnerGroup) => ({
  name: group.name,
  value: group.value,
  revenue: group.value, // Use value as revenue for the chart
}))

// Chart configuration
const chartConfig: ChartConfig = {
  revenue: {
    label: 'Revenue %',
    color: defaultChartColors.primary,
  },
}

const PartnerGroupPieChart = React.memo(function PartnerGroupPieChart() {
  return (
    <ShadcnChartContainer
      title="Partner Revenue Contribution (%)"
      description="Percentage of total revenue contributed by each partner group"
      staticData={data}
      dataKey="revenue"
      xAxisKey="name"
      chartConfig={chartConfig}
      variant="default"
      height={320}
      valueFormatter={(value) => `${value}%`}
      className="portfolio-card"
    />
  )
})

export default PartnerGroupPieChart