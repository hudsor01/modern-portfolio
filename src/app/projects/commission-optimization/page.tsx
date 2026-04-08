'use client'
export const dynamic = 'force-static'

import { DollarSign, Percent, TrendingUp, Calculator } from 'lucide-react'
import { useQueryState } from 'nuqs'

import { safeJsonLdStringify } from '@/lib/json-ld-utils'
import { ProjectPageLayout } from '@/components/projects/project-page-layout'
import { MetricsGrid } from '@/components/projects/metrics-grid'
import { commissionMetrics } from './data/constants'
import { formatCurrency, formatPercentage } from '@/lib/data-formatters'
import { ProcessingMetrics } from './_components/ProcessingMetrics'
import { OverviewTab } from './_components/OverviewTab'
import { TiersTab } from './_components/TiersTab'
import { IncentivesTab } from './_components/IncentivesTab'
import { AutomationTab } from './_components/AutomationTab'
import { NarrativeSections } from './_components/NarrativeSections'
import type { MetricConfig } from '@/types/design-system'

const tabs = ['overview', 'tiers', 'incentives', 'automation'] as const
type Tab = (typeof tabs)[number]

export default function CommissionOptimization() {
  const [activeTab, setActiveTab] = useQueryState('tab', { defaultValue: 'overview' as Tab })

  // Standardized metrics configuration using design system types
  const metrics: MetricConfig[] = [
    {
      id: 'commission-pool',
      icon: DollarSign,
      label: 'Commission Pool',
      value: formatCurrency(commissionMetrics.totalCommissionPool),
      subtitle: 'Annual Management',
      variant: 'secondary',
    },
    {
      id: 'avg-rate',
      icon: Percent,
      label: 'Avg Rate',
      value: formatPercentage(commissionMetrics.averageCommissionRate / 100),
      subtitle: 'Commission Rate',
      variant: 'secondary',
    },
    {
      id: 'performance',
      icon: TrendingUp,
      label: 'Performance',
      value: `+${formatPercentage(commissionMetrics.performanceImprovement / 100)}`,
      subtitle: 'Improvement',
      variant: 'primary',
    },
    {
      id: 'automation',
      icon: Calculator,
      label: 'Automation',
      value: formatPercentage(commissionMetrics.automationEfficiency / 100),
      subtitle: 'Efficiency',
      variant: 'primary',
    },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify({
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: 'Commission Optimization',
          description: 'Advanced commission management and partner incentive optimization platform managing $254K+ commission structures with 34% performance improvement.',
          url: 'https://richardwhudsonjr.com/projects/commission-optimization',
          author: { '@type': 'Person', name: 'Richard Hudson', url: 'https://richardwhudsonjr.com' },
          genre: 'Revenue Operations',
          keywords: 'Commission Management, Sales Compensation, Incentive Design, Revenue Operations',
          inLanguage: 'en-US',
          isAccessibleForFree: true,
        }) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://richardwhudsonjr.com' },
            { '@type': 'ListItem', position: 2, name: 'Projects', item: 'https://richardwhudsonjr.com/projects' },
            { '@type': 'ListItem', position: 3, name: 'Commission Optimization', item: 'https://richardwhudsonjr.com/projects/commission-optimization' },
          ],
        }) }}
      />
    <ProjectPageLayout
      title="Commission & Incentive Optimization System"
      description="Advanced commission management and partner incentive optimization platform managing $254K+ commission structures. Automated tier adjustments with 23% average commission rate optimization and ROI-driven compensation strategy delivering 34% performance improvement and 87.5% automation efficiency."
      tags={[
        {
          label: `Commission Pool: ${formatCurrency(commissionMetrics.totalCommissionPool)}`,
          variant: 'primary',
        },
        {
          label: `Avg Rate: ${formatPercentage(commissionMetrics.averageCommissionRate / 100)}`,
          variant: 'secondary',
        },
        {
          label: `Performance: +${formatPercentage(commissionMetrics.performanceImprovement / 100)}`,
          variant: 'primary',
        },
        {
          label: `Automation: ${formatPercentage(commissionMetrics.automationEfficiency / 100)}`,
          variant: 'secondary',
        },
      ]}
      showTimeframes={true}
      timeframes={tabs.map((t) => t.charAt(0).toUpperCase() + t.slice(1))}
      activeTimeframe={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
      onTimeframeChange={(timeframe) => setActiveTab(timeframe.toLowerCase() as Tab)}
    >
          {/* Standardized Key Metrics Grid */}
          <MetricsGrid metrics={metrics} columns={4} className="mb-8" />

          {/* Processing Metrics */}
          <ProcessingMetrics />

          {/* Tab Content */}
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'tiers' && <TiersTab />}
          {activeTab === 'incentives' && <IncentivesTab />}
          {activeTab === 'automation' && <AutomationTab />}

          {/* Professional Narrative Sections */}
          <NarrativeSections />
    </ProjectPageLayout>
    </>
  )
}
