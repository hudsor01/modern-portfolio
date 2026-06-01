'use client'

import { Target, Eye, Share2, DollarSign } from 'lucide-react'
import { useTabQueryState } from '@/components/projects/use-tab-query-state'

import { ProjectPageLayout } from '@/components/projects/project-page-layout'
import { MetricsGrid } from '@/components/projects/metrics-grid'
import { SectionCard } from '@/components/ui/section-card'
import { ProjectJsonLd } from '@/components/seo/json-ld/project-json-ld'
import { formatCurrency, formatNumber } from '@/lib/data-formatters'
import { attributionMetrics } from '../data/constants'
import { formatPercent } from '../utils'
import { OverviewTab } from './OverviewTab'
import { ModelsTab } from './ModelsTab'
import { JourneysTab } from './JourneysTab'
import { ChannelsTab } from './ChannelsTab'
import { StrategicImpact } from './StrategicImpact'
import { NarrativeSections } from './NarrativeSections'

const tabs = ['overview', 'models', 'journeys', 'channels'] as const

export default function MultiChannelAttribution() {
  const { activeTab, timeframes, activeTimeframe, onTimeframeChange } = useTabQueryState(tabs)

  // Standardized metrics configuration using consistent data formatting
  const metrics = [
    {
      id: 'total-conversions',
      icon: Target,
      label: 'Conversions',
      value: formatNumber(attributionMetrics.totalConversions),
      subtitle: `+${formatPercent(attributionMetrics.conversionLift)} lift`,
      variant: 'primary' as const,
      trend: {
        direction: 'up' as const,
        value: formatPercent(attributionMetrics.conversionLift),
        label: 'lift',
      },
    },
    {
      id: 'attribution-accuracy',
      icon: Eye,
      label: 'Accuracy',
      value: formatPercent(attributionMetrics.attributionAccuracy),
      subtitle: 'ML Model Performance',
      variant: 'secondary' as const,
    },
    {
      id: 'total-channels',
      icon: Share2,
      label: 'Channels',
      value: formatNumber(attributionMetrics.totalChannels),
      subtitle: `${attributionMetrics.avgTouchpoints.toFixed(1)} avg touchpoints`,
      variant: 'primary' as const,
    },
    {
      id: 'roi-impact',
      icon: DollarSign,
      label: 'ROI Impact',
      value: formatCurrency(attributionMetrics.totalROI, { compact: true }),
      subtitle: 'Optimization Value',
      variant: 'secondary' as const,
    },
  ]

  return (
    <>
      <ProjectJsonLd
        title="Multi-Channel Attribution Analytics Dashboard"
        description="ML-powered marketing attribution analytics tracking customer journeys across 12+ touchpoints with 92.4% attribution accuracy and $2.3M ROI optimization."
        slug="multi-channel-attribution"
        category="Marketing Analytics"
        datePublished="2025-11-19T00:00:00-06:00"
        dateModified="2026-05-06T00:00:00-06:00"
        tags={['Multi-Touch Attribution', 'Marketing Analytics', 'ML Models', 'Customer Journey']}
      />
      <ProjectPageLayout
        title="Multi-Channel Attribution Analytics Dashboard"
        description="Advanced marketing attribution analytics platform using machine learning models to track customer journeys across 12+ touchpoints. Delivering 92.4% attribution accuracy and $2.3M ROI optimization through data-driven attribution modeling and cross-channel insights."
        tags={[
          {
            label: `Attribution Accuracy: ${formatPercent(attributionMetrics.attributionAccuracy)}`,
            variant: 'primary',
          },
          {
            label: `ROI Optimization: ${formatCurrency(attributionMetrics.totalROI, { compact: true })}`,
            variant: 'secondary',
          },
          { label: 'ML Attribution Models', variant: 'primary' },
          { label: 'Customer Journey Analytics', variant: 'secondary' },
        ]}
        showTimeframes={true}
        timeframes={timeframes}
        activeTimeframe={activeTimeframe}
        onTimeframeChange={onTimeframeChange}
      >
        {/* Key Metrics using standardized MetricsGrid */}
        <MetricsGrid metrics={metrics} columns={4} className="mb-8" />

        {/* Tab Content wrapped in SectionCard */}
        <SectionCard
          title="Attribution Analysis"
          description="Detailed multi-channel attribution analysis and insights"
          className="mb-8"
        >
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'models' && <ModelsTab />}
          {activeTab === 'journeys' && <JourneysTab />}
          {activeTab === 'channels' && <ChannelsTab />}
        </SectionCard>

        {/* Strategic Impact wrapped in SectionCard */}
        <SectionCard
          title="Strategic Impact"
          description="Business impact and strategic outcomes from attribution optimization"
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
