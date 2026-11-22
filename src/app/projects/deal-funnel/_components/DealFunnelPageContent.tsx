'use client'

import { DollarSign, Clock, Target, BarChart3 } from 'lucide-react'

import { ProjectPageLayout } from '@/components/projects/project-page-layout'
import { MetricsGrid } from '@/components/projects/metrics-grid'
import { SectionCard } from '@/components/ui/section-card'
import { ProjectJsonLd } from '@/components/seo/json-ld/project-json-ld'
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/data-formatters'

import {
  initialFunnelStages,
  initialPartnerConversion,
  initialConversionRates,
} from '../data/constants'
import { ChartsGrid } from './ChartsGrid'
import { NarrativeSections } from './NarrativeSections'

export default function DealFunnel() {
  // Derived calculations
  const totalOpportunities = initialFunnelStages[0]?.count ?? 0
  const closedDeals =
    initialFunnelStages.length > 0
      ? (initialFunnelStages[initialFunnelStages.length - 1]?.count ?? 0)
      : 0
  const avgDealSize =
    initialFunnelStages.length > 0
      ? Math.round(initialFunnelStages[initialFunnelStages.length - 1]?.avg_deal_size ?? 0)
      : 0
  const totalRevenue = closedDeals * avgDealSize

  const avgSalesCycle =
    initialPartnerConversion.length > 0
      ? Math.round(
          initialPartnerConversion.reduce((sum, group) => sum + group.avg_sales_cycle_days, 0) /
            initialPartnerConversion.length
        )
      : 0

  const overallConversionRate =
    totalOpportunities > 0 ? ((closedDeals / totalOpportunities) * 100).toFixed(1) : '0.0'

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
        datePublished="2025-03-04T00:00:00-06:00"
        dateModified="2026-04-10T00:00:00-06:00"
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
        {/* Key Metrics using standardized MetricsGrid */}
        <MetricsGrid metrics={metrics} columns={4} className="mb-8" />

        {/* Charts Grid - Sales Funnel & Conversion Analytics */}
        <ChartsGrid
          funnelStages={initialFunnelStages}
          overallConversionRate={overallConversionRate}
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
