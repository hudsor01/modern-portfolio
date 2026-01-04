'use client'

import dynamic from 'next/dynamic'
import { ChartContainer } from '@/components/ui/chart-container'

const RevenueBarChart = dynamic(() => import('../RevenueBarChart'), { ssr: false })
const RevenueLineChart = dynamic(() => import('../RevenueLineChart'), { ssr: false })
const TopPartnersChart = dynamic(() => import('../TopPartnersChart'), { ssr: false })
const PartnerGroupPieChart = dynamic(() => import('../PartnerGroupPieChart'), { ssr: false })

export function ChartsGrid() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Revenue Trends */}
      <ChartContainer
        title="Revenue Growth Trends"
        description="Monthly revenue progression and forecasting"
        height={200}
        variant="glass"
      >
        <RevenueLineChart />
      </ChartContainer>

      {/* Revenue Distribution */}
      <ChartContainer
        title="Monthly Revenue Analysis"
        description="Revenue breakdown by time period"
        height={200}
        variant="glass"
      >
        <RevenueBarChart />
      </ChartContainer>

      {/* Top Partners */}
      <ChartContainer
        title="Top Revenue Partners"
        description="Highest performing business partners"
        height={200}
        variant="glass"
      >
        <TopPartnersChart />
      </ChartContainer>

      {/* Partner Distribution */}
      <ChartContainer
        title="Partner Group Distribution"
        description="Revenue contribution by partner type"
        height={200}
        variant="glass"
      >
        <PartnerGroupPieChart />
      </ChartContainer>
    </div>
  )
}
