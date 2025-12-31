'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Users, Zap, Target } from 'lucide-react'

import { ProjectPageLayout } from '@/components/projects/project-page-layout'
import { LoadingState } from '@/components/projects/loading-state'
import { ProjectJsonLd } from '@/components/seo/json-ld'
import { TIMING } from '@/lib/constants/spacing'
import { leadAttributionData } from '@/app/projects/data/partner-analytics'

import { leadConversionData, monthlyTrendData } from './data/constants'
import { MetricCard } from '@/components/projects/shared'
import { ChartsSection } from './components/ChartsSection'
import { TrendsChart } from './components/TrendsChart'
import { InsightsSection } from './components/InsightsSection'
import { NarrativeSections } from './components/NarrativeSections'

export default function LeadAttribution() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), TIMING.LOADING_STATE_RESET)
    return () => clearTimeout(timer)
  }, [])

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), TIMING.LOADING_STATE_RESET)
  }

  // Calculate totals safely
  const totalLeads = leadAttributionData?.reduce(
    (sum: number, source: { leads: number }) => sum + (source.leads || 0),
    0
  ) || 0
  const totalConversions = leadConversionData.reduce(
    (sum, source) => sum + (source.conversions || 0),
    0
  ) || 0

  // Calculate conversion rate safely
  const overallConversionRate = totalLeads > 0 ? (totalConversions / totalLeads) * 100 : 0

  // Find best performing source
  const bestSource = leadConversionData.reduce((best, current) =>
    current.conversion_rate > best.conversion_rate ? current : best
  )

  // Calculate month-over-month growth
  const lastMonth = monthlyTrendData[monthlyTrendData.length - 1]
  const prevMonth = monthlyTrendData[monthlyTrendData.length - 2]
  const monthlyGrowth = prevMonth && lastMonth ? ((lastMonth.leads - prevMonth.leads) / prevMonth.leads * 100).toFixed(1) : '0'

  return (
    <>
      <ProjectJsonLd
        title="Lead Attribution & Marketing Analytics - Multi-Touch Attribution"
        description="Comprehensive lead attribution analysis with multi-touch attribution modeling."
        slug="lead-attribution"
        category="Marketing Analytics"
        tags={['Lead Attribution', 'Marketing Analytics', 'Campaign Tracking', 'Multi-Touch Attribution']}
      />
      <ProjectPageLayout
        title="Lead Attribution Analytics"
        description="Understand your lead sources, optimize marketing spend, and improve conversion rates across all channels."
        tags={[
          { label: `Total Leads: ${totalLeads.toLocaleString()}`, color: 'bg-primary/20 text-primary' },
          { label: `Conversions: ${totalConversions}`, color: 'bg-secondary/20 text-secondary' },
          { label: `Conversion Rate: ${overallConversionRate.toFixed(1)}%`, color: 'bg-primary/20 text-primary' },
          { label: `Growth: +${monthlyGrowth}%`, color: 'bg-secondary/20 text-secondary' },
        ]}
        onRefresh={handleRefresh}
        refreshButtonDisabled={isLoading}
      >
        {isLoading ? (
          <LoadingState />
        ) : (
          <>
            {/* KPI Cards */}
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            >
              <MetricCard icon={Users} label="Total" value={totalLeads.toLocaleString()} subtitle="Leads Generated" variant="primary" animationDelay={0} />
              <MetricCard icon={Target} label="Success" value={totalConversions.toLocaleString()} subtitle="Total Conversions" variant="secondary" animationDelay={50} />
              <MetricCard icon={Zap} label="Overall" value={`${overallConversionRate.toFixed(1)}%`} subtitle="Conversion Rate" variant="primary" animationDelay={100} />
              <MetricCard icon={TrendingUp} label="MoM" value={`+${monthlyGrowth}%`} subtitle="Monthly Growth" variant="secondary" animationDelay={150} />
            </div>

            {/* Charts Section */}
            <ChartsSection bestSource={bestSource} />

            {/* Monthly Trends */}
            <TrendsChart />

            {/* Insights Section */}
            <InsightsSection bestConversionRate={bestSource.conversion_rate * 100} />

            {/* Professional Narrative Sections */}
            <NarrativeSections />
          </>
        )}
      </ProjectPageLayout>
    </>
  )
}
