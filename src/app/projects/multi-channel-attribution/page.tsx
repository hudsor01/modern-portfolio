'use client'

import { useState, useEffect } from 'react'
import { Target, Eye, Share2, DollarSign, TrendingUp } from 'lucide-react'

import { ProjectPageLayout } from '@/components/projects/project-page-layout'
import { LoadingState } from '@/components/projects/loading-state'
import { TIMING } from '@/lib/constants/spacing'
import { attributionMetrics } from './data/constants'
import { formatCurrency, formatPercent } from './utils'
import { MetricCard } from './components/MetricCard'
import { OverviewTab } from './components/OverviewTab'
import { ModelsTab } from './components/ModelsTab'
import { JourneysTab } from './components/JourneysTab'
import { ChannelsTab } from './components/ChannelsTab'
import { StrategicImpact } from './components/StrategicImpact'
import { NarrativeSections } from './components/NarrativeSections'

const tabs = ['overview', 'models', 'journeys', 'channels'] as const
type Tab = typeof tabs[number]

export default function MultiChannelAttribution() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), TIMING.LOADING_STATE_RESET)
    return () => clearTimeout(timer)
  }, [])

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), TIMING.LOADING_STATE_RESET)
  }

  return (
    <ProjectPageLayout
      title="Multi-Channel Attribution Analytics Dashboard"
      description="Advanced marketing attribution analytics platform using machine learning models to track customer journeys across 12+ touchpoints. Delivering 92.4% attribution accuracy and $2.3M ROI optimization through data-driven attribution modeling and cross-channel insights."
      tags={[
        { label: 'Attribution Accuracy: 92.4%', color: 'bg-primary/20 text-primary' },
        { label: `ROI Optimization: ${formatCurrency(attributionMetrics.totalROI)}`, color: 'bg-secondary/20 text-secondary' },
        { label: 'ML Attribution Models', color: 'bg-primary/20 text-primary' },
        { label: 'Customer Journey Analytics', color: 'bg-secondary/20 text-secondary' },
      ]}
      onRefresh={handleRefresh}
      refreshButtonDisabled={isLoading}
      showTimeframes={true}
      timeframes={tabs.map(t => t.charAt(0).toUpperCase() + t.slice(1))}
      activeTimeframe={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
      onTimeframeChange={(timeframe) => setActiveTab(timeframe.toLowerCase() as Tab)}
    >
      {isLoading ? (
        <LoadingState />
      ) : (
        <>
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <MetricCard
              icon={Target}
              label="Conversions"
              value={attributionMetrics.totalConversions.toLocaleString()}
              subtitle={
                <p className="typography-small text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-success" />
                  +{formatPercent(attributionMetrics.conversionLift)} lift
                </p>
              }
              gradientFrom="from-orange-600"
              gradientTo="to-red-600"
              iconBgClass="bg-orange-500/20"
              iconColorClass="text-orange-400"

            />
            <MetricCard
              icon={Eye}
              label="Accuracy"
              value={formatPercent(attributionMetrics.attributionAccuracy)}
              subtitle="ML Model Performance"
              gradientFrom="from-red-600"
              gradientTo="to-pink-600"
              iconBgClass="bg-destructive/20"
              iconColorClass="text-destructive"

            />
            <MetricCard
              icon={Share2}
              label="Channels"
              value={attributionMetrics.totalChannels.toString()}
              subtitle={`${attributionMetrics.avgTouchpoints.toFixed(1)} avg touchpoints`}
              gradientFrom="from-pink-600"
              gradientTo="to-purple-600"
              iconBgClass="bg-pink-500/20"
              iconColorClass="text-pink-400"

            />
            <MetricCard
              icon={DollarSign}
              label="ROI Impact"
              value={formatCurrency(attributionMetrics.totalROI)}
              subtitle="Optimization Value"
              gradientFrom="from-amber-600"
              gradientTo="to-orange-600"
              iconBgClass="bg-amber-500/20"
              iconColorClass="text-amber-400"

            />
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'models' && <ModelsTab />}
          {activeTab === 'journeys' && <JourneysTab />}
          {activeTab === 'channels' && <ChannelsTab />}

          {/* Strategic Impact */}
          <StrategicImpact />

          {/* Professional Narrative Sections */}
          <NarrativeSections />
        </>
      )}
    </ProjectPageLayout>
  )
}
