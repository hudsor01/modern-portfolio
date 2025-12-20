'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, DollarSign, Users, Activity } from 'lucide-react'

import { ProjectJsonLd } from '@/components/seo/json-ld'
import { createContextLogger } from '@/lib/monitoring/logger'
import { TIMING } from '@/lib/constants/spacing'
import { yearOverYearGrowthExtended } from '@/app/projects/data/partner-analytics'
import { ProjectPageLayout } from '@/components/projects/project-page-layout'
import { LoadingState } from '@/components/projects/loading-state'

import { timeframes, type YearOverYearGrowth } from './data/constants'
import { formatCurrency, calculateGrowth } from './utils'
import { MetricCard } from './components/MetricCard'
import { ChartsGrid } from './components/ChartsGrid'
import { NarrativeSections } from './components/NarrativeSections'

const logger = createContextLogger('RevenueKPIPage')

export default function RevenueKPI() {
  const [activeTimeframe, setActiveTimeframe] = useState('All')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), TIMING.LOADING_STATE_RESET)
    return () => clearTimeout(timer)
  }, [])

  const currentYearData: YearOverYearGrowth | undefined =
    yearOverYearGrowthExtended[yearOverYearGrowthExtended.length - 1]
  const prevYearData: YearOverYearGrowth | undefined =
    yearOverYearGrowthExtended[yearOverYearGrowthExtended.length - 2]

  if (!currentYearData) {
    logger.error(
      'currentYearData is undefined. Cannot render Revenue KPI dashboard',
      new Error('Missing current year data')
    )
    return <div>Error: Current year data not available.</div>
  }

  const revenueGrowth = calculateGrowth(currentYearData.total_revenue, prevYearData?.total_revenue)
  const partnerGrowth = calculateGrowth(currentYearData.partner_count, prevYearData?.partner_count)
  const transactionGrowth = calculateGrowth(
    currentYearData.total_transactions,
    prevYearData?.total_transactions
  )

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), TIMING.LOADING_STATE_RESET)
  }

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
          { label: `Revenue: $${formatCurrency(currentYearData.total_revenue)}`, color: 'bg-primary/20 text-primary' },
          { label: `Partners: ${currentYearData.partner_count}`, color: 'bg-secondary/20 text-secondary' },
          { label: `Growth: +${currentYearData.commission_growth_percentage.toFixed(1)}%`, color: 'bg-primary/20 text-primary' },
          { label: 'Accuracy: 94%', color: 'bg-secondary/20 text-secondary' },
        ]}
        showTimeframes={true}
        timeframes={timeframes}
        activeTimeframe={activeTimeframe}
        onTimeframeChange={setActiveTimeframe}
        onRefresh={handleRefresh}
        refreshButtonDisabled={isLoading}
      >
        {isLoading ? (
          <LoadingState />
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <MetricCard
                icon={DollarSign}
                label="Revenue"
                value={formatCurrency(currentYearData.total_revenue)}
                subtitle={`${revenueGrowth > 0 ? '+' : ''}${revenueGrowth.toFixed(1)}% vs last year`}
                gradientFrom="from-blue-600"
                gradientTo="to-cyan-600"
                iconBgClass="bg-primary/20"
                iconColorClass="text-primary"
              />
              <MetricCard
                icon={Users}
                label="Partners"
                value={currentYearData.partner_count.toLocaleString()}
                subtitle={`${partnerGrowth > 0 ? '+' : ''}${partnerGrowth.toFixed(1)}% growth`}
                gradientFrom="from-blue-600"
                gradientTo="to-cyan-600"
                iconBgClass="bg-secondary/20"
                iconColorClass="text-secondary"
              />
              <MetricCard
                icon={Activity}
                label="Volume"
                value={currentYearData.total_transactions.toLocaleString()}
                subtitle={`${transactionGrowth > 0 ? '+' : ''}${transactionGrowth.toFixed(1)}% transactions`}
                gradientFrom="from-blue-600"
                gradientTo="to-cyan-600"
                iconBgClass="bg-primary/20"
                iconColorClass="text-primary"
              />
              <MetricCard
                icon={TrendingUp}
                label="Growth"
                value={`+${currentYearData.commission_growth_percentage.toFixed(1)}%`}
                subtitle="Commission Growth"
                gradientFrom="from-blue-600"
                gradientTo="to-cyan-600"
                iconBgClass="bg-secondary/20"
                iconColorClass="text-secondary"
              />
            </div>

            {/* Charts Grid */}
            <ChartsGrid />

            {/* Narrative Sections */}
            <NarrativeSections totalRevenue={currentYearData.total_revenue} />
          </>
        )}
      </ProjectPageLayout>
    </>
  )
}
