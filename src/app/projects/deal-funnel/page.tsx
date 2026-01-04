'use client'

import { useState, useEffect } from 'react'
import { DollarSign, Clock, Target, BarChart3 } from 'lucide-react'

import { ProjectPageLayout } from '@/components/projects/project-page-layout'
import { LoadingState } from '@/components/projects/loading-state'
import { MetricsGrid } from '@/components/projects/metrics-grid'
import { SectionCard } from '@/components/ui/section-card'
import { ChartContainer } from '@/components/ui/chart-container'
import { getProject } from '@/lib/content/projects'
import { ProjectJsonLd } from '@/components/seo/json-ld'
import { createContextLogger } from '@/lib/monitoring/logger'
import { TIMING } from '@/lib/constants/spacing'
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/utils/data-formatters'

import {
  type FunnelStage,
  type PartnerConversion,
  type ConversionRate,
  initialFunnelStages,
  initialPartnerConversion,
  initialConversionRates,
} from './data/constants'
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
        logger.error(
          'Error loading project data',
          error instanceof Error ? error : new Error(String(error))
        )
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
  const closedDeals =
    localFunnelStages.length > 0 ? (localFunnelStages[localFunnelStages.length - 1]?.count ?? 0) : 0
  const avgDealSize =
    localFunnelStages.length > 0
      ? Math.round(localFunnelStages[localFunnelStages.length - 1]?.avg_deal_size ?? 0)
      : 0
  const totalRevenue = closedDeals * avgDealSize

  const avgSalesCycle =
    localPartnerConversion.length > 0
      ? Math.round(
          localPartnerConversion.reduce((sum, group) => sum + group.avg_sales_cycle_days, 0) /
            localPartnerConversion.length
        )
      : 0

  const overallConversionRate =
    totalOpportunities > 0 ? ((closedDeals / totalOpportunities) * 100).toFixed(1) : '0.0'

  const stageConversions =
    localConversionRates.length > 0
      ? [
          {
            stage: 'Leads → Qualified',
            conversion:
              localConversionRates[localConversionRates.length - 1]?.lead_to_qualified ?? 0,
            color: 'var(--color-primary)',
          },
          {
            stage: 'Qualified → Proposal',
            conversion:
              localConversionRates[localConversionRates.length - 1]?.qualified_to_proposal ?? 0,
            color: 'var(--color-secondary)',
          },
          {
            stage: 'Proposal → Negotiation',
            conversion:
              localConversionRates[localConversionRates.length - 1]?.proposal_to_negotiation ?? 0,
            color: 'var(--color-secondary)',
          },
          {
            stage: 'Negotiation → Closed',
            conversion:
              localConversionRates[localConversionRates.length - 1]?.negotiation_to_closed ?? 0,
            color: 'var(--color-chart-5)',
          },
        ]
      : []

  // Standardized metrics configuration using consistent data formatting
  const metrics = [
    {
      id: 'pipeline-opportunities',
      icon: BarChart3,
      label: 'Pipeline',
      value: formatNumber(totalOpportunities),
      subtitle: 'Total Opportunities',
      variant: 'primary' as const,
    },
    {
      id: 'closed-deals',
      icon: Target,
      label: 'Won',
      value: formatNumber(closedDeals),
      subtitle: 'Closed Deals',
      variant: 'secondary' as const,
    },
    {
      id: 'avg-deal-size',
      icon: DollarSign,
      label: 'Average',
      value: formatCurrency(avgDealSize, { compact: true }),
      subtitle: 'Deal Size',
      variant: 'primary' as const,
    },
    {
      id: 'sales-cycle',
      icon: Clock,
      label: 'Average',
      value: `${avgSalesCycle}d`,
      subtitle: 'Days to Close',
      variant: 'secondary' as const,
    },
  ]

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
          {
            label: `Conversion: ${formatPercentage(parseFloat(overallConversionRate) / 100)}`,
            variant: 'primary',
          },
          {
            label: `Avg Deal: ${formatCurrency(avgDealSize, { compact: true })}`,
            variant: 'secondary',
          },
          { label: `Sales Cycle: ${avgSalesCycle}d`, variant: 'primary' },
          {
            label: `Revenue: ${formatCurrency(totalRevenue, { compact: true })}`,
            variant: 'secondary',
          },
        ]}
        onRefresh={handleRefresh}
        refreshButtonDisabled={isLoading}
      >
        {isLoading ? (
          <LoadingState />
        ) : (
          <>
            {/* Key Metrics using standardized MetricsGrid */}
            <MetricsGrid metrics={metrics} columns={4} loading={isLoading} className="mb-8" />

            {/* Main Funnel Chart wrapped in SectionCard */}
            <SectionCard
              title="Sales Funnel Analysis"
              description="Visual representation of deal progression through each stage of the sales pipeline"
              className="mb-8"
            >
              <ChartContainer
                title="Deal Stage Funnel"
                description={`Overall conversion rate: ${overallConversionRate}%`}
                height={400}
              >
                <FunnelChart
                  stages={localFunnelStages}
                  overallConversionRate={overallConversionRate}
                />
              </ChartContainer>
            </SectionCard>

            {/* Conversion Analytics wrapped in SectionCard */}
            <SectionCard
              title="Conversion Analytics"
              description="Detailed analysis of stage-to-stage conversion rates and sales velocity"
              className="mb-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ChartContainer
                  title="Stage Conversion Rates"
                  description="Conversion rates between each stage of the sales funnel"
                  height={350}
                >
                  <ConversionChart stageConversions={stageConversions} />
                </ChartContainer>
                <ChartContainer
                  title="Sales Velocity by Partner"
                  description="Average sales cycle duration across different partner channels"
                  height={350}
                >
                  <VelocityChart partnerConversion={localPartnerConversion} />
                </ChartContainer>
              </div>
            </SectionCard>

            {/* Professional Narrative Sections wrapped in SectionCard */}
            <SectionCard
              title="Project Narrative"
              description="Comprehensive case study following the STAR methodology"
              className="mb-8"
            >
              <NarrativeSections />
            </SectionCard>

            {/* Revenue Impact wrapped in SectionCard */}
            <SectionCard
              title="Revenue Impact"
              description="Financial impact and business value generated from pipeline optimization"
            >
              <PipelineValue totalRevenue={totalRevenue} />
            </SectionCard>
          </>
        )}
      </ProjectPageLayout>
    </>
  )
}
