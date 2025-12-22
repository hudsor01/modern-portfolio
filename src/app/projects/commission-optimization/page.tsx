'use client'

import { useState, useEffect } from 'react'
import { DollarSign, Percent, TrendingUp, Calculator } from 'lucide-react'

import { ProjectPageLayout } from '@/components/projects/project-page-layout'
import { LoadingState } from '@/components/projects/loading-state'
import { TIMING } from '@/lib/constants/spacing'
import { commissionMetrics } from './data/constants'
import { formatCurrency, formatPercent } from './utils'
import { MetricCard } from './components/MetricCard'
import { ProcessingMetrics } from './components/ProcessingMetrics'
import { OverviewTab } from './components/OverviewTab'
import { TiersTab } from './components/TiersTab'
import { IncentivesTab } from './components/IncentivesTab'
import { AutomationTab } from './components/AutomationTab'
import { NarrativeSections } from './components/NarrativeSections'

const tabs = ['overview', 'tiers', 'incentives', 'automation'] as const
type Tab = typeof tabs[number]

export default function CommissionOptimization() {
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
      title="Commission & Incentive Optimization System"
      description="Advanced commission management and partner incentive optimization platform managing $254K+ commission structures. Automated tier adjustments with 23% average commission rate optimization and ROI-driven compensation strategy delivering 34% performance improvement and 87.5% automation efficiency."
      tags={[
        { label: `Commission Pool: ${formatCurrency(commissionMetrics.totalCommissionPool)}`, color: 'bg-primary/20 text-primary' },
        { label: `Avg Rate: ${formatPercent(commissionMetrics.averageCommissionRate)}`, color: 'bg-secondary/20 text-secondary' },
        { label: `Performance: +${formatPercent(commissionMetrics.performanceImprovement)}`, color: 'bg-primary/20 text-primary' },
        { label: `Automation: ${formatPercent(commissionMetrics.automationEfficiency)}`, color: 'bg-secondary/20 text-secondary' },
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
              label="Commission Pool"
              value={formatCurrency(commissionMetrics.totalCommissionPool)}
              subtitle="Annual Management"
              gradientFrom="from-emerald-600"
              gradientTo="to-green-600"
              iconBgClass="bg-emerald-500/20"
              iconColorClass="text-emerald-400"

            />
            <MetricCard
              icon={Percent}
              label="Avg Rate"
              value={formatPercent(commissionMetrics.averageCommissionRate)}
              subtitle="Commission Rate"
              gradientFrom="from-green-600"
              gradientTo="to-teal-600"
              iconBgClass="bg-success/20"
              iconColorClass="text-success"

            />
            <MetricCard
              icon={TrendingUp}
              label="Performance"
              value={`+${formatPercent(commissionMetrics.performanceImprovement)}`}
              subtitle="Improvement"
              gradientFrom="from-teal-600"
              gradientTo="to-cyan-600"
              iconBgClass="bg-teal-500/20"
              iconColorClass="text-teal-400"

            />
            <MetricCard
              icon={Calculator}
              label="Automation"
              value={formatPercent(commissionMetrics.automationEfficiency)}
              subtitle="Efficiency"
              gradientFrom="from-cyan-600"
              gradientTo="to-blue-600"
              iconBgClass="bg-primary/20"
              iconColorClass="text-primary"

            />
          </div>

          {/* Processing Metrics */}
          <ProcessingMetrics />

          {/* Tab Content */}
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'tiers' && <TiersTab />}
          {activeTab === 'incentives' && <IncentivesTab />}
          {activeTab === 'automation' && <AutomationTab />}

          {/* Professional Narrative Sections */}
          <NarrativeSections />
        </>
      )}
    </ProjectPageLayout>
  )
}
