'use client'

import { TrendingUp, DollarSign, Target, Calculator } from 'lucide-react'
import { useQueryState } from 'nuqs'

import { safeJsonLdStringify } from '@/lib/json-ld-utils'
import { ProjectPageLayout } from '@/components/projects/project-page-layout'
import { MetricsGrid } from '@/components/projects/metrics-grid'
import { SectionCard } from '@/components/ui/section-card'
import { cacMetrics } from './data/constants'
import { formatCurrency } from '@/lib/data-formatters'
import { OverviewTab } from './_components/OverviewTab'
import { ChannelsTab } from './_components/ChannelsTab'
import { ProductsTab } from './_components/ProductsTab'
import { StrategicImpact } from './_components/StrategicImpact'
import { NarrativeSections } from './_components/NarrativeSections'

const tabs = ['overview', 'channels', 'products'] as const
type Tab = (typeof tabs)[number]

export default function CACUnitEconomics() {
  const [activeTab, setActiveTab] = useQueryState('tab', { defaultValue: 'overview' as Tab })

  // Standardized metrics configuration using consistent data formatting
  const metrics = [
    {
      id: 'blended-cac',
      icon: DollarSign,
      label: 'Blended CAC',
      value: formatCurrency(cacMetrics.blendedCAC),
      subtitle: 'Cost to Acquire',
      variant: 'primary' as const,
    },
    {
      id: 'lifetime-value',
      icon: TrendingUp,
      label: 'Lifetime Value',
      value: formatCurrency(cacMetrics.averageLTV),
      subtitle: 'Average LTV',
      variant: 'primary' as const,
    },
    {
      id: 'ltv-cac-ratio',
      icon: Calculator,
      label: 'LTV:CAC',
      value: `${cacMetrics.ltv_cac_ratio.toFixed(1)}:1`,
      subtitle: 'Efficiency Ratio',
      variant: 'secondary' as const,
    },
    {
      id: 'payback-period',
      icon: Target,
      label: 'Payback',
      value: `${cacMetrics.paybackPeriod} mo`,
      subtitle: 'Payback Period',
      variant: 'primary' as const,
    },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify({
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: 'CAC & Unit Economics Analysis',
          description: 'Comprehensive CAC analysis and LTV:CAC ratio optimization that achieved 32% cost reduction through strategic partner channel optimization.',
          url: 'https://richardwhudsonjr.com/projects/cac-unit-economics',
          author: { '@type': 'Person', name: 'Richard Hudson', url: 'https://richardwhudsonjr.com' },
          genre: 'Data Analytics',
          keywords: 'Customer Acquisition Cost, Unit Economics, LTV:CAC Ratio, Revenue Operations',
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
            { '@type': 'ListItem', position: 3, name: 'CAC & Unit Economics Analysis', item: 'https://richardwhudsonjr.com/projects/cac-unit-economics' },
          ],
        }) }}
      />
    <ProjectPageLayout
      title="Customer Acquisition Cost Optimization & Unit Economics Dashboard"
      description="Comprehensive CAC analysis and LTV:CAC ratio optimization that achieved 32% cost reduction through strategic partner channel optimization. Industry-benchmark 3.6:1 efficiency ratio with 8.4-month payback period across multi-tier SaaS products."
      tags={[
        { label: 'CAC Reduction: 32%', variant: 'primary' },
        { label: 'LTV:CAC Ratio: 3.6:1', variant: 'secondary' },
        { label: 'ROI Optimization', variant: 'primary' },
        { label: 'Unit Economics', variant: 'secondary' },
      ]}
      showTimeframes={true}
      timeframes={tabs.map((t) => t.charAt(0).toUpperCase() + t.slice(1))}
      activeTimeframe={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
      onTimeframeChange={(timeframe) => setActiveTab(timeframe.toLowerCase() as Tab)}
    >
      {/* Key Metrics using standardized MetricsGrid */}
      <MetricsGrid metrics={metrics} columns={4} className="mb-8" />

          {/* Tab Content wrapped in SectionCard */}
          <SectionCard
            title="Analysis Details"
            description="Detailed breakdown of CAC optimization across channels and products"
            className="mb-8"
          >
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'channels' && <ChannelsTab />}
            {activeTab === 'products' && <ProductsTab />}
          </SectionCard>

          {/* Strategic Impact wrapped in SectionCard */}
          <SectionCard
            title="Strategic Impact"
            description="Business impact and strategic outcomes from CAC optimization initiatives"
            className="mb-8"
          >
            <StrategicImpact />
          </SectionCard>

          {/* Professional Narrative Sections wrapped in SectionCard */}
      <SectionCard
        title="Project Narrative"
        description="Comprehensive case study following the STAR methodology"
      >
        <NarrativeSections />
      </SectionCard>
    </ProjectPageLayout>
    </>
  )
}
