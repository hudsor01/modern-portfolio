'use client'

import dynamic from 'next/dynamic'
import type { YearOverYearData } from '@/types/analytics'

// Chart loading skeleton
function ChartSkeleton() {
  return <div className="h-[300px] w-full animate-pulse bg-muted rounded-lg" />
}

// Disable SSR for chart components — they require DOM measurements (ResponsiveContainer)
// and produce width(-1)/height(-1) warnings during static generation
const RevenueBarChart = dynamic(() => import('./RevenueBarChart'), {
  ssr: false,
  loading: () => <ChartSkeleton />,
})
const RevenueLineChart = dynamic(() => import('./RevenueLineChart'), {
  ssr: false,
  loading: () => <ChartSkeleton />,
})
const TopPartnersChart = dynamic(() => import('./TopPartnersChart'), {
  ssr: false,
  loading: () => <ChartSkeleton />,
})
const PartnerGroupPieChart = dynamic(() => import('./PartnerGroupPieChart'), {
  ssr: false,
  loading: () => <ChartSkeleton />,
})

type RevenueTrendDatum = {
  label: string
  revenue: number
}

type PartnerGroupDatum = {
  name: string
  value: number
}

type PartnerSeries = {
  name: string
  revenue: number
  tier?: string
}

type YearOverYearSeries = Pick<
  YearOverYearData,
  'year' | 'total_revenue' | 'total_transactions' | 'total_commissions'
>

type ChartsGridProps = {
  yearOverYearData: YearOverYearSeries[]
  revenueTrendData: RevenueTrendDatum[]
  topPartners: PartnerSeries[]
  partnerGroups: PartnerGroupDatum[]
}

export function ChartsGrid({
  yearOverYearData,
  revenueTrendData,
  topPartners,
  partnerGroups,
}: ChartsGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Revenue Trends */}
      <RevenueLineChart data={yearOverYearData} />

      {/* Revenue Distribution */}
      <RevenueBarChart data={revenueTrendData} />

      {/* Top Partners */}
      <TopPartnersChart partners={topPartners} />

      {/* Partner Distribution */}
      <PartnerGroupPieChart groups={partnerGroups} />
    </div>
  )
}
