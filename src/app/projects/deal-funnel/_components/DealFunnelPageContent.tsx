'use client'

import { ogImageUrl } from '@/lib/absolute-url'
import { DollarSign, Clock, Target, BarChart3 } from 'lucide-react'

import { ProjectPageLayout } from '@/components/projects/project-page-layout'
import { MetricsGrid } from '@/components/projects/metrics-grid'
import { SectionCard } from '@/components/ui/section-card'
import { ProjectJsonLd } from '@/components/seo/json-ld/project-json-ld'
import { formatCurrency, formatNumber } from '@/lib/data-formatters'

import {
  initialFunnelStages,
  initialPartnerConversion,
  initialConversionRates,
} from '../data/constants'
import { ChartsGrid } from './ChartsGrid'
import { NarrativeSections } from './NarrativeSections'

export default function DealFunnel() {
  // Derived calculations. The export carries three stages (Working, Closed Won,
  // Closed Lost); "closed deals" and deal size are the Closed Won stage, not the
  // last array entry (that is Closed Lost).
  const totalOpportunities = initialFunnelStages.reduce((sum, stage) => sum + stage.count, 0)
  const wonStage = initialFunnelStages.find((stage) => stage.name === 'Closed Won')
  const lostStage = initialFunnelStages.find((stage) => stage.name === 'Closed Lost')
  const closedDeals = wonStage?.count ?? 0
  const avgDealSize = Math.round(wonStage?.avg_deal_size ?? 0)
  const totalRevenue = closedDeals * avgDealSize
  const closedTotal = closedDeals + (lostStage?.count ?? 0)

  // Unweighted mean of the per-tier medians. The export gives a median per
  // partner tier but no overall median, so this is labelled as what it is.
  const avgTierMedianDays =
    initialPartnerConversion.length > 0
      ? Math.round(
          initialPartnerConversion.reduce((sum, group) => sum + group.median_days_to_close, 0) /
            initialPartnerConversion.length
        )
      : 0

  // Win rate of deals that have closed (won / (won + lost)).
  const winRate = closedTotal > 0 ? ((closedDeals / closedTotal) * 100).toFixed(1) : '0.0'

  const stageConversions =
    initialConversionRates.length > 0
      ? [
          {
            stage: 'Leads → Qualified',
            conversion:
              initialConversionRates[initialConversionRates.length - 1]?.lead_to_qualified ?? 0,
            color: 'var(--color-primary)',
          },
          {
            stage: 'Qualified → Proposal',
            conversion:
              initialConversionRates[initialConversionRates.length - 1]?.qualified_to_proposal ?? 0,
            color: 'var(--color-secondary)',
          },
          {
            stage: 'Proposal → Negotiation',
            conversion:
              initialConversionRates[initialConversionRates.length - 1]?.proposal_to_negotiation ??
              0,
            color: 'var(--color-secondary)',
          },
          {
            stage: 'Negotiation → Closed',
            conversion:
              initialConversionRates[initialConversionRates.length - 1]?.negotiation_to_closed ?? 0,
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
      subtitle: 'Closed Won Deals',
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
      label: 'Avg. of tier medians',
      value: `${avgTierMedianDays}d`,
      subtitle: 'Avg. of Tier Median Days to Close',
      variant: 'secondary' as const,
    },
  ]

  return (
    <>
      <ProjectJsonLd
        title="Sales Funnel Optimization"
        description="Sales funnel case study: stage-level pipeline analytics that improved conversion 27%, cut the sales cycle by 31 days and raised forecast accuracy to 89%."
        slug="deal-funnel"
        image={ogImageUrl({
          title: 'Sales Funnel Optimization Case Study',
          subtitle: 'Revenue Operations Project',
          project: 'deal-funnel',
        })}
        category="Sales Operations"
        datePublished="2025-03-04T00:00:00-06:00"
        dateModified="2026-04-10T00:00:00-06:00"
        tags={['Sales Funnel', 'Deal Pipeline', 'Conversion Analysis', 'Sales Operations']}
      />
      <ProjectPageLayout
        title="Sales Funnel Optimization"
        description="Track deal progression through your sales funnel, identify bottlenecks, and optimize conversion rates at each stage."
        tags={[
          { label: `Won: ${formatNumber(closedDeals)} deals`, variant: 'primary' },
          {
            label: `Avg Deal: ${formatCurrency(avgDealSize, { compact: true })}`,
            variant: 'secondary',
          },
          { label: `Avg. Tier Median Cycle: ${avgTierMedianDays}d`, variant: 'primary' },
          {
            label: `Won Revenue: ${formatCurrency(totalRevenue, { compact: true })}`,
            variant: 'secondary',
          },
        ]}
      >
        {/* Key Metrics using standardized MetricsGrid */}
        <MetricsGrid metrics={metrics} columns={4} className="mb-8" />

        {/* Charts Grid - Sales Funnel & Conversion Analytics */}
        <ChartsGrid
          funnelStages={initialFunnelStages}
          winRate={winRate}
          stageConversions={stageConversions}
          partnerConversion={initialPartnerConversion}
        />

        {/* Professional Narrative Sections wrapped in SectionCard */}
        <SectionCard
          title="Project Narrative"
          description="Comprehensive case study following the STAR methodology"
          className="mb-8"
        >
          <NarrativeSections />
        </SectionCard>
      </ProjectPageLayout>
    </>
  )
}
