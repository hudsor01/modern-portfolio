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
      <div
        className="relative rounded-xl border border-border bg-card p-6 shadow-sm"
        aria-hidden="true"
      >
        <div className="space-y-4">
          <div>
            <Skeleton className="h-7 w-40" />
            <Skeleton className="mt-1 h-6 w-3/4" />
          </div>
          <ChartSkeleton height={size} />
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
  loading: () => <ChartCardSkeleton size="md" />,
})
const RevenueLineChart = dynamic(() => import('./RevenueLineChart'), {
  ssr: false,
  loading: () => <ChartCardSkeleton size="md" variant="wrapper" />,
})
const TransactionVolumeChart = dynamic(() => import('./TransactionVolumeChart'), {
  ssr: false,
  loading: () => <ChartCardSkeleton size="sm" variant="wrapper" />,
})
const TopPartnersChart = dynamic(() => import('./TopPartnersChart'), {
  ssr: false,
  loading: () => <ChartCardSkeleton size="md" />,
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

      {/* Transaction Volume */}
      <div className="lg:col-span-2">
        <TransactionVolumeChart data={yearOverYearData} />
      </div>
    </div>
  )
}
