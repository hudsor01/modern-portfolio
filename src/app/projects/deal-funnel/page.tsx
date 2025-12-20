'use client'

import { useState, useEffect } from 'react'
import { DollarSign, Clock, Target, BarChart3 } from 'lucide-react'

import { ProjectPageLayout } from '@/components/projects/project-page-layout'
import { LoadingState } from '@/components/projects/loading-state'
import { getProject } from '@/lib/content/projects'
import { ProjectJsonLd } from '@/components/seo/json-ld'
import { createContextLogger } from '@/lib/monitoring/logger'
import { TIMING } from '@/lib/constants/spacing'

import {
  type FunnelStage,
  type PartnerConversion,
  type ConversionRate,
  initialFunnelStages,
  initialPartnerConversion,
  initialConversionRates
} from './data/constants'
import { MetricCard } from './components/MetricCard'
import { FunnelChart } from './components/FunnelChart'
import { ConversionChart } from './components/ConversionChart'
import { VelocityChart } from './components/VelocityChart'
import { PipelineValue } from './components/PipelineValue'
import { NarrativeSections } from './components/NarrativeSections'

const logger = createContextLogger('DealFunnelPage')

export default function DealFunnel() {
  const [isLoading, setIsLoading] = useState(true)
  const [localFunnelStages, setLocalFunnelStages] = useState<FunnelStage[]>([])
  const [localPartnerConversion, setLocalPartnerConversion] = useState<PartnerConversion[]>([])
  const [localConversionRates, setLocalConversionRates] = useState<ConversionRate[]>([])

  useEffect(() => {
    async function loadProjectData() {
      try {
        await getProject('deal-funnel')
        setLocalFunnelStages(initialFunnelStages)
        setLocalPartnerConversion(initialPartnerConversion)
        setLocalConversionRates(initialConversionRates)
        setTimeout(() => setIsLoading(false), TIMING.LOADING_STATE_RESET)
      } catch (error) {
        logger.error('Error loading project data', error instanceof Error ? error : new Error(String(error)))
        setIsLoading(false)
      }
    }
    loadProjectData()
  }, [])

  const handleRefresh = () => {
    setIsLoading(true)
    setLocalFunnelStages(initialFunnelStages)
    setLocalPartnerConversion(initialPartnerConversion)
    setLocalConversionRates(initialConversionRates)
    setTimeout(() => setIsLoading(false), TIMING.LOADING_STATE_RESET)
  }

  // Derived calculations
  const totalOpportunities = localFunnelStages?.[0]?.count ?? 0
  const closedDeals = localFunnelStages.length > 0 ? localFunnelStages[localFunnelStages.length - 1]?.count ?? 0 : 0
  const avgDealSize = localFunnelStages.length > 0 ? Math.round(localFunnelStages[localFunnelStages.length - 1]?.avg_deal_size ?? 0) : 0
  const totalRevenue = closedDeals * avgDealSize

  const avgSalesCycle = localPartnerConversion.length > 0
    ? Math.round(localPartnerConversion.reduce((sum, group) => sum + group.avg_sales_cycle_days, 0) / localPartnerConversion.length)
    : 0

  const overallConversionRate = totalOpportunities > 0 ? ((closedDeals / totalOpportunities) * 100).toFixed(1) : '0.0'

  const stageConversions = localConversionRates.length > 0
    ? [
        { stage: 'Leads → Qualified', conversion: localConversionRates[localConversionRates.length - 1]?.lead_to_qualified ?? 0, color: 'var(--color-primary)' },
        { stage: 'Qualified → Proposal', conversion: localConversionRates[localConversionRates.length - 1]?.qualified_to_proposal ?? 0, color: 'var(--color-secondary)' },
        { stage: 'Proposal → Negotiation', conversion: localConversionRates[localConversionRates.length - 1]?.proposal_to_negotiation ?? 0, color: 'var(--color-secondary)' },
        { stage: 'Negotiation → Closed', conversion: localConversionRates[localConversionRates.length - 1]?.negotiation_to_closed ?? 0, color: 'var(--color-chart-5)' },
      ]
    : []

  return (
    <>
      <ProjectJsonLd
        title="Sales Pipeline Funnel Analysis - Deal Stage Optimization"
        description="Interactive sales funnel dashboard showing deal progression, conversion rates, and sales cycle optimization."
        slug="deal-funnel"
        category="Sales Operations"
        tags={['Sales Funnel', 'Deal Pipeline', 'Conversion Analysis', 'Sales Operations']}
      />
      <ProjectPageLayout
        title="Deal Pipeline Analytics"
        description="Track deal progression through your sales funnel, identify bottlenecks, and optimize conversion rates at each stage."
        tags={[
          { label: `Conversion: ${overallConversionRate}%`, color: 'bg-primary/20 text-primary' },
          { label: `Avg Deal: $${avgDealSize.toLocaleString()}`, color: 'bg-secondary/20 text-secondary' },
          { label: `Sales Cycle: ${avgSalesCycle}d`, color: 'bg-primary/20 text-primary' },
          { label: `Revenue: $${(totalRevenue / 1000000).toFixed(1)}M`, color: 'bg-secondary/20 text-secondary' },
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
              <MetricCard icon={BarChart3} label="Pipeline" value={totalOpportunities.toLocaleString()} subtitle="Total Opportunities" gradientFrom="from-blue-600" gradientTo="to-cyan-600" iconBgClass="bg-primary/20" iconColorClass="text-primary" />
              <MetricCard icon={Target} label="Won" value={closedDeals.toLocaleString()} subtitle="Closed Deals" gradientFrom="from-blue-600" gradientTo="to-cyan-600" iconBgClass="bg-secondary/20" iconColorClass="text-secondary" />
              <MetricCard icon={DollarSign} label="Average" value={`$${(avgDealSize / 1000).toFixed(0)}K`} subtitle="Deal Size" gradientFrom="from-blue-600" gradientTo="to-cyan-600" iconBgClass="bg-primary/20" iconColorClass="text-primary" />
              <MetricCard icon={Clock} label="Average" value={avgSalesCycle.toString()} subtitle="Days to Close" gradientFrom="from-blue-600" gradientTo="to-cyan-600" iconBgClass="bg-secondary/20" iconColorClass="text-secondary" />
            </div>

            {/* Main Funnel Chart */}
            <FunnelChart stages={localFunnelStages} overallConversionRate={overallConversionRate} />

            {/* Conversion Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ConversionChart stageConversions={stageConversions} />
              <VelocityChart partnerConversion={localPartnerConversion} />
            </div>

            {/* Professional Narrative Sections */}
            <NarrativeSections />

            {/* Revenue Impact */}
            <PipelineValue totalRevenue={totalRevenue} />
          </>
        )}
      </ProjectPageLayout>
    </>
  )
}
