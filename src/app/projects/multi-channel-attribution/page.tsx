'use client'

import { Target, Eye, Share2, DollarSign } from 'lucide-react'
import { useQueryState } from 'nuqs'

import { ProjectPageLayout } from '@/components/projects/project-page-layout'
import { LoadingState } from '@/components/projects/loading-state'
import { MetricsGrid } from '@/components/projects/metrics-grid'
import { SectionCard } from '@/components/ui/section-card'
import { useLoadingState } from '@/hooks/use-loading-state'
import { formatCurrency, formatNumber } from '@/lib/utils/data-formatters'
import { attributionMetrics } from './data/constants'
import { formatPercent } from './utils'
import { OverviewTab } from './components/OverviewTab'
import { ModelsTab } from './components/ModelsTab'
import { JourneysTab } from './components/JourneysTab'
import { ChannelsTab } from './components/ChannelsTab'
import { StrategicImpact } from './components/StrategicImpact'
import { NarrativeSections } from './components/NarrativeSections'

const tabs = ['overview', 'models', 'journeys', 'channels'] as const
type Tab = (typeof tabs)[number]

export default function MultiChannelAttribution() {
  const { isLoading, handleRefresh } = useLoadingState()
  const [activeTab, setActiveTab] = useQueryState('tab', { defaultValue: 'overview' as Tab })

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
      onRefresh={handleRefresh}
      refreshButtonDisabled={isLoading}
      showTimeframes={true}
      timeframes={tabs.map((t) => t.charAt(0).toUpperCase() + t.slice(1))}
      activeTimeframe={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
      onTimeframeChange={(timeframe) => setActiveTab(timeframe.toLowerCase() as Tab)}
    >
      {isLoading ? (
        <LoadingState />
      ) : (
        <>
          {/* Key Metrics using standardized MetricsGrid */}
          <MetricsGrid metrics={metrics} columns={4} loading={isLoading} className="mb-8" />

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
        </>
      )}
    </ProjectPageLayout>
  )
}
