'use client'

import { useState, useEffect } from 'react'
import { DollarSign, Target, BarChart3, Users, Activity, TrendingUp } from 'lucide-react'

import { ProjectPageLayout } from '@/components/projects/project-page-layout'
import { LoadingState } from '@/components/projects/loading-state'
import { TIMING } from '@/lib/constants/spacing'
import { revenueMetrics } from './data/constants'
import { formatCurrency, formatPercent } from './utils'
import { MetricCard } from '@/components/projects/shared'
import { KPIAlerts } from './components/KPIAlerts'
import { OverviewTab } from './components/OverviewTab'
import { PipelineTab } from './components/PipelineTab'
import { ForecastingTab } from './components/ForecastingTab'
import { OperationsTab } from './components/OperationsTab'
import { StrategicImpact } from './components/StrategicImpact'
import { NarrativeSections } from './components/NarrativeSections'

const tabs = ['overview', 'pipeline', 'forecasting', 'operations'] as const
type Tab = typeof tabs[number]

export default function RevenueOperationsCenter() {
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
      title="Revenue Operations Command Center"
      description="Comprehensive revenue operations dashboard consolidating pipeline health, forecasting accuracy, partner performance, and operational KPIs. Real-time insights with 96.8% forecast accuracy and 89.7% operational efficiency across sales, marketing, and partner channels."
      tags={[
        { label: 'Forecast Accuracy: 96.8%', color: 'bg-primary/20 text-primary' },
        { label: 'Pipeline Health: 92.4%', color: 'bg-secondary/20 text-secondary' },
        { label: 'Revenue Growth: +34.2%', color: 'bg-primary/20 text-primary' },
        { label: 'Operations Dashboard', color: 'bg-secondary/20 text-secondary' },
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
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            <MetricCard
              icon={DollarSign}
              label="Total Revenue"
              value={formatCurrency(revenueMetrics.totalRevenue)}
              subtitle={
                <p className="typography-small text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-success" />
                  +{formatPercent(revenueMetrics.revenueGrowth)} YoY
                </p>
              }
              variant="primary"

            />
            <MetricCard
              icon={Target}
              label="Forecast"
              value={formatPercent(revenueMetrics.forecastAccuracy)}
              subtitle="Accuracy Rate"
              variant="primary"

            />
            <MetricCard
              icon={BarChart3}
              label="Pipeline"
              value={formatPercent(revenueMetrics.pipelineHealth)}
              subtitle="Health Score"
              variant="secondary"

            />
            <MetricCard
              icon={Users}
              label="Active Deals"
              value={revenueMetrics.activeDeals.toString()}
              subtitle={`${formatCurrency(revenueMetrics.avgDealSize)} avg`}
              variant="primary"

            />
            <MetricCard
              icon={Activity}
              label="Target"
              value={formatPercent(revenueMetrics.targetAttainment)}
              subtitle="Attainment"
              variant="primary"

            />
          </div>

          {/* KPI Alerts */}
          <KPIAlerts />

          {/* Tab Content */}
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'pipeline' && <PipelineTab />}
          {activeTab === 'forecasting' && <ForecastingTab />}
          {activeTab === 'operations' && <OperationsTab />}

          {/* Strategic Impact */}
          <StrategicImpact />

          {/* Professional Narrative Sections */}
          <NarrativeSections />
        </>
      )}
    </ProjectPageLayout>
  )
}
