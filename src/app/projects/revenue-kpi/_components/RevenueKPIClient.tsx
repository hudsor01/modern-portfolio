'use client'

import { useState, useMemo, Suspense } from 'react'
import { TrendingUp, DollarSign, Users, Activity } from 'lucide-react'

import { ProjectPageLayout } from '@/components/projects/project-page-layout'
import { MetricsGrid } from '@/components/projects/metrics-grid'
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/data-formatters'

import type { GrowthData, YearOverYearData, TopPartnerData } from '@/types/analytics'
import { timeframes } from '../data/constants'
import { calculateGrowth } from '../utils'
import { ChartsGrid } from './ChartsGrid'
import { NarrativeSections } from './NarrativeSections'

type YearOverYearSeries = Pick<
  YearOverYearData,
  'year' | 'total_revenue' | 'total_transactions' | 'total_commissions' | 'partner_count' | 'commission_growth_percentage'
>

type PartnerSeries = {
  name: string
  revenue: number
  tier?: string
}

// Chart loading skeleton
function ChartsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-[300px] w-full animate-pulse bg-muted rounded-lg" />
      ))}
    </div>
  )
}

type RevenueKPIClientProps = {
  yearOverYearData: YearOverYearSeries[]
  growthData: GrowthData[]
  topPartnersData: TopPartnerData[]
  monthlyRevenue: Array<{ month: string; revenue: number }>
  partnerGroupsData: Array<{ name: string; value: number }>
}

export function RevenueKPIClient({
  yearOverYearData,
  growthData,
  topPartnersData,
  monthlyRevenue,
  partnerGroupsData,
}: RevenueKPIClientProps) {
  const [activeTimeframe, setActiveTimeframe] = useState('All')

  // Memoize sorted year-over-year data
  const sortedYearOverYear = useMemo(
    () => [...yearOverYearData].sort((a, b) => a.year - b.year),
    [yearOverYearData]
  )

  // Memoize current and previous year data
  const { currentYearData, prevYearData } = useMemo(() => ({
    currentYearData: sortedYearOverYear[sortedYearOverYear.length - 1],
    prevYearData: sortedYearOverYear[sortedYearOverYear.length - 2],
  }), [sortedYearOverYear])

  // Memoize revenue trend data
  const revenueTrendData = useMemo(() => {
    if (growthData?.length) {
      return growthData.map((item: GrowthData) => ({
        label: item.quarter,
        revenue: item.revenue,
      }))
    }
    return monthlyRevenue.map((item) => ({
      label: item.month,
      revenue: item.revenue,
    }))
  }, [growthData, monthlyRevenue])

  // Memoize top partners
  const topPartners: PartnerSeries[] = useMemo(
    () => topPartnersData?.length ? topPartnersData : [],
    [topPartnersData]
  )

  // Memoize partner groups calculation
  const partnerGroups = useMemo(() => {
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
  }, [topPartners, partnerGroupsData])

  // Memoize growth calculations (handle undefined currentYearData)
  const { revenueGrowth, partnerGrowth, transactionGrowth } = useMemo(() => {
    if (!currentYearData) {
      return { revenueGrowth: 0, partnerGrowth: 0, transactionGrowth: 0 }
    }
    return {
      revenueGrowth: calculateGrowth(currentYearData.total_revenue, prevYearData?.total_revenue),
      partnerGrowth: calculateGrowth(currentYearData.partner_count, prevYearData?.partner_count),
      transactionGrowth: calculateGrowth(currentYearData.total_transactions, prevYearData?.total_transactions),
    }
  }, [currentYearData, prevYearData])

  // Memoize metrics array (handle undefined currentYearData)
  const metrics = useMemo(() => {
    if (!currentYearData) return []
    return [
      {
        id: 'revenue',
        icon: DollarSign,
        label: 'Revenue',
        value: formatCurrency(currentYearData.total_revenue),
        subtitle: `${revenueGrowth > 0 ? '+' : ''}${formatPercentage(revenueGrowth / 100)} vs last year`,
        variant: 'primary' as const,
        trend: {
          direction: revenueGrowth > 0 ? ('up' as const) : revenueGrowth < 0 ? ('down' as const) : ('neutral' as const),
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
          direction: partnerGrowth > 0 ? ('up' as const) : partnerGrowth < 0 ? ('down' as const) : ('neutral' as const),
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
          direction: transactionGrowth > 0 ? ('up' as const) : transactionGrowth < 0 ? ('down' as const) : ('neutral' as const),
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
  }, [currentYearData, revenueGrowth, partnerGrowth, transactionGrowth])

  // Early return after all hooks
  if (!currentYearData) {
    return <div>Error: Current year data not available.</div>
  }

  return (
    <ProjectPageLayout
      title="Revenue KPI Dashboard"
      description="Real-time revenue analytics, partner performance metrics, and business intelligence for data-driven growth strategies."
      tags={[
        { label: `Revenue: ${formatCurrency(currentYearData.total_revenue)}`, variant: 'primary' },
        { label: `Partners: ${formatNumber(currentYearData.partner_count)}`, variant: 'secondary' },
        { label: `Growth: +${formatPercentage(currentYearData.commission_growth_percentage / 100)}`, variant: 'primary' },
        { label: 'Accuracy: 94%', variant: 'secondary' },
      ]}
      showTimeframes={true}
      timeframes={timeframes}
      activeTimeframe={activeTimeframe}
      onTimeframeChange={setActiveTimeframe}
    >
      {/* KPI Cards using standardized MetricsGrid */}
      <div className="mb-8">
        <MetricsGrid metrics={metrics} columns={4} />
      </div>

      {/* Charts Grid with Suspense */}
      <Suspense fallback={<ChartsSkeleton />}>
        <ChartsGrid
          yearOverYearData={sortedYearOverYear}
          revenueTrendData={revenueTrendData}
          topPartners={topPartners}
          partnerGroups={partnerGroups}
        />
      </Suspense>

      {/* Narrative Sections */}
      <NarrativeSections totalRevenue={currentYearData.total_revenue} />
    </ProjectPageLayout>
  )
}
