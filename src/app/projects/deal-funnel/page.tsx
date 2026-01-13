'use client'
export const dynamic = 'force-static'

import { useState, useEffect, useRef } from 'react'
import { DollarSign, Clock, Target, BarChart3 } from 'lucide-react'

import { ProjectPageLayout } from '@/components/projects/project-page-layout'
import { LoadingState } from '@/components/projects/loading-state'
import { MetricsGrid } from '@/components/projects/metrics-grid'
import { SectionCard } from '@/components/ui/section-card'
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
import { ChartsGrid } from './_components/ChartsGrid'
import { NarrativeSections } from './_components/NarrativeSections'

const logger = createContextLogger('DealFunnelPage')

export default function DealFunnel() {
  const [isLoading, setIsLoading] = useState(true)
  const [localFunnelStages, setLocalFunnelStages] = useState<FunnelStage[]>([])
  const [localPartnerConversion, setLocalPartnerConversion] = useState<PartnerConversion[]>([])
  const [localConversionRates, setLocalConversionRates] = useState<ConversionRate[]>([])
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  useEffect(() => {
    async function loadProjectData() {
      try {
        await getProject('deal-funnel')
        setLocalFunnelStages(initialFunnelStages)
        setLocalPartnerConversion(initialPartnerConversion)
        setLocalConversionRates(initialConversionRates)
        timeoutRef.current = setTimeout(() => setIsLoading(false), TIMING.LOADING_STATE_RESET)
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
      >
        {isLoading ? (
          <LoadingState />
        ) : (
          <>
            {/* Key Metrics using standardized MetricsGrid */}
            <MetricsGrid metrics={metrics} columns={4} loading={isLoading} className="mb-8" />

            {/* Charts Grid - Sales Funnel & Conversion Analytics */}
            <ChartsGrid
              funnelStages={localFunnelStages}
              overallConversionRate={overallConversionRate}
              stageConversions={stageConversions}
              partnerConversion={localPartnerConversion}
            />

            {/* Professional Narrative Sections wrapped in SectionCard */}
            <SectionCard
              title="Project Narrative"
              description="Comprehensive case study following the STAR methodology"
              className="mb-8"
            >
              <NarrativeSections />
            </SectionCard>
          </>
        )}
      </ProjectPageLayout>
    </>
  )
}
