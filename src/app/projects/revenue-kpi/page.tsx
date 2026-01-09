'use client'
export const dynamic = 'force-static'

import { useState } from 'react'
import { TrendingUp, DollarSign, Users, Activity } from 'lucide-react'

import { ProjectJsonLd } from '@/components/seo/json-ld'
import { createContextLogger } from '@/lib/monitoring/logger'
import { useAnalyticsData } from '@/hooks/use-analytics-data'
import {
  monthlyRevenue2024,
  partnerGroupsData,
  topPartnersData,
  yearOverYearGrowthExtended,
} from '@/app/projects/data/partner-analytics'
import { ProjectPageLayout } from '@/components/projects/project-page-layout'
import { MetricsGrid } from '@/components/projects/metrics-grid'
import { LoadingState } from '@/components/projects/loading-state'
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/utils/data-formatters'

import type { GrowthData, YearOverYearData } from '@/lib/analytics/data-service'
import { timeframes } from './data/constants'
import { calculateGrowth } from './utils'
import { ChartsGrid } from './components/ChartsGrid'
import { NarrativeSections } from './components/NarrativeSections'

const logger = createContextLogger('RevenueKPIPage')

type YearOverYearSeries = Pick<
  YearOverYearData,
  'year' | 'total_revenue' | 'total_transactions' | 'total_commissions' | 'partner_count' | 'commission_growth_percentage'
>

type PartnerSeries = {
  name: string
  revenue: number
  tier?: string
}

export default function RevenueKPI() {
  const [activeTimeframe, setActiveTimeframe] = useState('All')
  const {
    data: analyticsData,
    isLoading,
    error: analyticsError,
  } = useAnalyticsData()

  const yearOverYearData: YearOverYearSeries[] = analyticsData?.yearOverYear?.length
    ? analyticsData.yearOverYear
    : yearOverYearGrowthExtended

  const sortedYearOverYear = [...yearOverYearData].sort((a, b) => a.year - b.year)

  const currentYearData: YearOverYearSeries | undefined =
    sortedYearOverYear[sortedYearOverYear.length - 1]
  const prevYearData: YearOverYearSeries | undefined =
    sortedYearOverYear[sortedYearOverYear.length - 2]

  const revenueTrendData = (() => {
    if (analyticsData?.growth?.length) {
      return analyticsData.growth.map((item: GrowthData) => ({
        label: item.quarter,
        revenue: item.revenue,
      }))
    }

    return monthlyRevenue2024.map((item) => ({
      label: item.month,
      revenue: item.revenue,
    }))
  })()

  const topPartners: PartnerSeries[] = analyticsData?.topPartners?.length
    ? analyticsData.topPartners
    : topPartnersData

  const partnerGroups = (() => {
    const byTier = new Map<string, number>()
    let hasTier = false

    topPartners.forEach((partner) => {
      if (partner.tier) {
        hasTier = true
        const currentValue = byTier.get(partner.tier) || 0
        byTier.set(partner.tier, currentValue + partner.revenue)
      }
    })

    if (!hasTier) {
      return partnerGroupsData.map((group) => ({ name: group.name, value: group.value }))
    }

    const totalRevenue = Array.from(byTier.values()).reduce((sum, value) => sum + value, 0)

    return Array.from(byTier.entries())
      .map(([tier, revenue]) => ({
        name: tier.charAt(0).toUpperCase() + tier.slice(1),
        value: totalRevenue > 0 ? Math.round((revenue / totalRevenue) * 1000) / 10 : 0,
      }))
      .sort((a, b) => b.value - a.value)
  })()

  if (!currentYearData) {
    logger.error(
      'currentYearData is undefined. Cannot render Revenue KPI dashboard',
      analyticsError || new Error('Missing current year data')
    )
    return <div>Error: Current year data not available.</div>
  }

  const revenueGrowth = calculateGrowth(currentYearData.total_revenue, prevYearData?.total_revenue)
  const partnerGrowth = calculateGrowth(currentYearData.partner_count, prevYearData?.partner_count)
  const transactionGrowth = calculateGrowth(
    currentYearData.total_transactions,
    prevYearData?.total_transactions
  )

  // Prepare metrics data for standardized MetricsGrid
  const metrics = [
    {
      id: 'revenue',
      icon: DollarSign,
      label: 'Revenue',
      value: formatCurrency(currentYearData.total_revenue),
      subtitle: `${revenueGrowth > 0 ? '+' : ''}${formatPercentage(revenueGrowth / 100)} vs last year`,
      variant: 'primary' as const,
      trend: {
        direction:
          revenueGrowth > 0
            ? ('up' as const)
            : revenueGrowth < 0
              ? ('down' as const)
              : ('neutral' as const),
        value: formatPercentage(Math.abs(revenueGrowth) / 100),
        label: 'vs last year',
      },
    },
    {
      id: 'partners',
      icon: Users,
      label: 'Partners',
      value: formatNumber(currentYearData.partner_count),
      subtitle: `${partnerGrowth > 0 ? '+' : ''}${formatPercentage(partnerGrowth / 100)} growth`,
      variant: 'secondary' as const,
      trend: {
        direction:
          partnerGrowth > 0
            ? ('up' as const)
            : partnerGrowth < 0
              ? ('down' as const)
              : ('neutral' as const),
        value: formatPercentage(Math.abs(partnerGrowth) / 100),
        label: 'growth',
      },
    },
    {
      id: 'volume',
      icon: Activity,
      label: 'Volume',
      value: formatNumber(currentYearData.total_transactions),
      subtitle: `${transactionGrowth > 0 ? '+' : ''}${formatPercentage(transactionGrowth / 100)} transactions`,
      variant: 'primary' as const,
      trend: {
        direction:
          transactionGrowth > 0
            ? ('up' as const)
            : transactionGrowth < 0
              ? ('down' as const)
              : ('neutral' as const),
        value: formatPercentage(Math.abs(transactionGrowth) / 100),
        label: 'transactions',
      },
    },
    {
      id: 'growth',
      icon: TrendingUp,
      label: 'Growth',
      value: `+${formatPercentage(currentYearData.commission_growth_percentage / 100)}`,
      subtitle: 'Commission Growth',
      variant: 'secondary' as const,
      trend: {
        direction: 'up' as const,
        value: formatPercentage(currentYearData.commission_growth_percentage / 100),
        label: 'Commission Growth',
      },
    },
  ]


  return (
    <>
      <ProjectJsonLd
        title="Revenue KPI Dashboard - Partner Analytics & Business Intelligence"
        description="Real-time revenue analytics dashboard featuring partner performance metrics, growth trends, and business intelligence for data-driven decision making. Built with React, TypeScript, and Recharts."
        slug="revenue-kpi"
        category="Business Intelligence"
        tags={[
          'Revenue Analytics',
          'Partner Management',
          'KPI Dashboard',
          'Business Intelligence',
          'Data Visualization',
          'Recharts',
          'React',
          'TypeScript',
        ]}
      />
      <ProjectPageLayout
        title="Revenue KPI Dashboard"
        description="Real-time revenue analytics, partner performance metrics, and business intelligence for data-driven growth strategies."
        tags={[
          {
            label: `Revenue: ${formatCurrency(currentYearData.total_revenue)}`,
            variant: 'primary',
          },
          {
            label: `Partners: ${formatNumber(currentYearData.partner_count)}`,
            variant: 'secondary',
          },
          {
            label: `Growth: +${formatPercentage(currentYearData.commission_growth_percentage / 100)}`,
            variant: 'primary',
          },
          { label: 'Accuracy: 94%', variant: 'secondary' },
        ]}
        showTimeframes={true}
        timeframes={timeframes}
        activeTimeframe={activeTimeframe}
        onTimeframeChange={setActiveTimeframe}
      >
        {isLoading ? (
          <LoadingState />
        ) : (
          <>
            {/* KPI Cards using standardized MetricsGrid */}
            <div className="mb-8">
              <MetricsGrid metrics={metrics} columns={4} loading={isLoading} />
            </div>

            {/* Charts Grid */}
            <ChartsGrid
              yearOverYearData={sortedYearOverYear}
              revenueTrendData={revenueTrendData}
              topPartners={topPartners}
              partnerGroups={partnerGroups}
            />

            {/* Narrative Sections */}
            <NarrativeSections totalRevenue={currentYearData.total_revenue} />
          </>
        )}
      </ProjectPageLayout>
    </>
  )
}
