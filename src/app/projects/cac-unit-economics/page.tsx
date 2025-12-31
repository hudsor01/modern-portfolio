'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, DollarSign, Target, Calculator } from 'lucide-react'

import { ProjectPageLayout } from '@/components/projects/project-page-layout'
import { LoadingState } from '@/components/projects/loading-state'
import { TIMING } from '@/lib/constants/spacing'
import { cacMetrics } from './data/constants'
import { formatCurrency } from './utils'
import { MetricCard } from '@/components/projects/shared'
import { OverviewTab } from './components/OverviewTab'
import { ChannelsTab } from './components/ChannelsTab'
import { ProductsTab } from './components/ProductsTab'
import { StrategicImpact } from './components/StrategicImpact'
import { NarrativeSections } from './components/NarrativeSections'

const tabs = ['overview', 'channels', 'products'] as const
type Tab = typeof tabs[number]

export default function CACUnitEconomics() {
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
      title="Customer Acquisition Cost Optimization & Unit Economics Dashboard"
      description="Comprehensive CAC analysis and LTV:CAC ratio optimization that achieved 32% cost reduction through strategic partner channel optimization. Industry-benchmark 3.6:1 efficiency ratio with 8.4-month payback period across multi-tier SaaS products."
      tags={[
        { label: 'CAC Reduction: 32%', color: 'bg-primary/20 text-primary' },
        { label: 'LTV:CAC Ratio: 3.6:1', color: 'bg-secondary/20 text-secondary' },
        { label: 'ROI Optimization', color: 'bg-primary/20 text-primary' },
        { label: 'Unit Economics', color: 'bg-secondary/20 text-secondary' },
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
              icon={DollarSign}
              label="Blended CAC"
              value={formatCurrency(cacMetrics.blendedCAC)}
              subtitle="Cost to Acquire"
              variant="primary"

            />
            <MetricCard
              icon={TrendingUp}
              label="Lifetime Value"
              value={formatCurrency(cacMetrics.averageLTV)}
              subtitle="Average LTV"
              variant="primary"

            />
            <MetricCard
              icon={Calculator}
              label="LTV:CAC"
              value={`${cacMetrics.ltv_cac_ratio.toFixed(1)}:1`}
              subtitle="Efficiency Ratio"
              variant="secondary"

            />
            <MetricCard
              icon={Target}
              label="Payback"
              value={`${cacMetrics.paybackPeriod} mo`}
              subtitle="Payback Period"
              variant="primary"

            />
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'channels' && <ChannelsTab />}
          {activeTab === 'products' && <ProductsTab />}

          {/* Strategic Impact */}
          <StrategicImpact />

          {/* Professional Narrative Sections */}
          <NarrativeSections />
        </>
      )}
    </ProjectPageLayout>
  )
}
