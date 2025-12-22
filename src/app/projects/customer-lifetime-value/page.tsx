'use client'

import { useState, useEffect } from 'react'
import { DollarSign, Brain, Users, Calendar } from 'lucide-react'

import { ProjectPageLayout } from '@/components/projects/project-page-layout'
import { LoadingState } from '@/components/projects/loading-state'
import { TIMING } from '@/lib/constants/spacing'
import { clvMetrics } from './data/constants'
import { formatCurrency, formatPercent } from './utils'
import { MetricCard } from './components/MetricCard'
import { OverviewTab } from './components/OverviewTab'
import { SegmentsTab } from './components/SegmentsTab'
import { PredictionsTab } from './components/PredictionsTab'
import { StrategicImpact } from './components/StrategicImpact'
import { NarrativeSections } from './components/NarrativeSections'

const tabs = ['overview', 'segments', 'predictions'] as const
type Tab = typeof tabs[number]

export default function CustomerLifetimeValueAnalytics() {
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
      title="Customer Lifetime Value Predictive Analytics Dashboard"
      description="Advanced CLV analytics platform leveraging BTYD (Buy Till You Die) predictive modeling framework. Achieving 94.3% prediction accuracy through machine learning algorithms and real-time customer behavior tracking across 5 distinct customer segments."
      tags={[
        { label: 'Prediction Accuracy: 94.3%', color: 'bg-primary/20 text-primary' },
        { label: `Avg CLV: ${formatCurrency(clvMetrics.averageCLV)}`, color: 'bg-secondary/20 text-secondary' },
        { label: 'Machine Learning', color: 'bg-primary/20 text-primary' },
        { label: 'BTYD Framework', color: 'bg-secondary/20 text-secondary' },
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
              label="Average CLV"
              value={formatCurrency(clvMetrics.averageCLV)}
              subtitle="Predicted Value"
              gradientFrom="from-emerald-600"
              gradientTo="to-teal-600"
              iconBgClass="bg-emerald-500/20"
              iconColorClass="text-emerald-400"

            />
            <MetricCard
              icon={Brain}
              label="ML Accuracy"
              value={formatPercent(clvMetrics.predictionAccuracy)}
              subtitle="Model Performance"
              gradientFrom="from-teal-600"
              gradientTo="to-cyan-600"
              iconBgClass="bg-teal-500/20"
              iconColorClass="text-teal-400"

            />
            <MetricCard
              icon={Users}
              label="High Value"
              value={clvMetrics.highValueCustomers.toLocaleString()}
              subtitle="Premium Customers"
              gradientFrom="from-cyan-600"
              gradientTo="to-blue-600"
              iconBgClass="bg-primary/20"
              iconColorClass="text-primary"

            />
            <MetricCard
              icon={Calendar}
              label="Forecast"
              value={`${clvMetrics.forecastHorizon} mo`}
              subtitle="Prediction Window"
              gradientFrom="from-blue-600"
              gradientTo="to-purple-600"
              iconBgClass="bg-primary/20"
              iconColorClass="text-primary"

            />
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'segments' && <SegmentsTab />}
          {activeTab === 'predictions' && <PredictionsTab />}

          {/* Strategic Impact */}
          <StrategicImpact />

          {/* Professional Narrative Sections */}
          <NarrativeSections />
        </>
      )}
    </ProjectPageLayout>
  )
}
