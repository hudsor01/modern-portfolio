'use client'

import dynamicImport from 'next/dynamic'
import { ChartContainer } from '@/components/ui/chart-container'

const PartnerTierChart = dynamicImport(() => import('./PartnerTierChart'), {
  loading: () => <div className="h-[var(--chart-height-md)] w-full animate-pulse bg-muted rounded-lg" />,
  ssr: true,
})
const RevenueContributionChart = dynamicImport(() => import('./RevenueContributionChart'), {
  loading: () => <div className="h-[var(--chart-height-md)] w-full animate-pulse bg-muted rounded-lg" />,
  ssr: true,
})

export function OverviewTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartContainer
        title="Partner Tier Performance Analysis"
        description="Revenue and ROI analysis across certified, legacy, and new partner tiers"
        height={250}
      >
        <PartnerTierChart />
      </ChartContainer>

      <ChartContainer
        title="Channel Revenue Contribution"
        description="Partner revenue distribution following industry 80/20 performance rule"
        height={250}
      >
        <RevenueContributionChart />
      </ChartContainer>
    </div>
  )
}
