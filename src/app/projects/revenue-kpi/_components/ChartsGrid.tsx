'use client'

import dynamic from 'next/dynamic'
import { ChartSkeleton, type ChartBoxSize } from '@/components/charts/chart-skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { YearOverYearData } from '@/types/analytics'

// Card-shaped placeholder mirroring the loaded chart card so the box does not shift.
function ChartCardSkeleton({
  size,
  variant = 'card',
}: {
  size: ChartBoxSize
  variant?: 'card' | 'wrapper'
}) {
  if (variant === 'wrapper') {
    return (
      <div className="portfolio-card" aria-hidden="true">
        <div className="space-y-4">
          <Skeleton className="mx-auto h-7 w-48" />
          <ChartSkeleton height={size} />
          <Skeleton className="mx-auto h-4 w-3/4" />
        </div>
      </div>
    )
  }
  return (
    <Card className="portfolio-card" aria-hidden="true">
      <CardHeader className="pb-2">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </CardHeader>
      <CardContent>
        <ChartSkeleton height={size} />
      </CardContent>
    </Card>
  )
}

// Disable SSR for chart components — they require DOM measurements (ResponsiveContainer)
// and produce width(-1)/height(-1) warnings during static generation
const RevenueBarChart = dynamic(() => import('./RevenueBarChart'), {
  ssr: false,
  loading: () => <ChartCardSkeleton size="sm" />,
})
const RevenueLineChart = dynamic(() => import('./RevenueLineChart'), {
  ssr: false,
  loading: () => <ChartCardSkeleton size="md" variant="wrapper" />,
})
const TopPartnersChart = dynamic(() => import('./TopPartnersChart'), {
  ssr: false,
  loading: () => <ChartCardSkeleton size="sm" />,
})
const PartnerGroupPieChart = dynamic(() => import('./PartnerGroupPieChart'), {
  ssr: false,
  loading: () => <ChartCardSkeleton size="md" />,
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
