'use client'
export const dynamic = 'force-static'

import { DollarSign, Target, BarChart3, Users, Activity } from 'lucide-react'
import { useQueryState } from 'nuqs'

import { ProjectPageLayout } from '@/components/projects/project-page-layout'
import { revenueMetrics } from './data/constants'
import { formatCurrency, formatPercent } from './utils'
import { MetricsGrid } from '@/components/projects/metrics-grid'
import { KPIAlerts } from './_components/KPIAlerts'
import { OverviewTab } from './_components/OverviewTab'
import { PipelineTab } from './_components/PipelineTab'
import { ForecastingTab } from './_components/ForecastingTab'
import { OperationsTab } from './_components/OperationsTab'
import { StrategicImpact } from './_components/StrategicImpact'
import { NarrativeSections } from './_components/NarrativeSections'

const tabs = ['overview', 'pipeline', 'forecasting', 'operations'] as const
type Tab = (typeof tabs)[number]

export default function RevenueOperationsCenter() {
  const [activeTab, setActiveTab] = useQueryState('tab', { defaultValue: 'overview' as Tab })

  const metrics = [
    {
      id: 'total-revenue',
      icon: DollarSign,
      label: 'Total Revenue',
      value: formatCurrency(revenueMetrics.totalRevenue),
      subtitle: `+${formatPercent(revenueMetrics.revenueGrowth)} YoY`,
      variant: 'primary' as const,
    },
    {
      id: 'forecast-accuracy',
      icon: Target,
      label: 'Forecast',
      value: formatPercent(revenueMetrics.forecastAccuracy),
      subtitle: 'Accuracy Rate',
      variant: 'primary' as const,
    },
    {
      id: 'pipeline-health',
      icon: BarChart3,
      label: 'Pipeline',
      value: formatPercent(revenueMetrics.pipelineHealth),
      subtitle: 'Health Score',
      variant: 'secondary' as const,
    },
    {
      id: 'active-deals',
      icon: Users,
      label: 'Active Deals',
      value: revenueMetrics.activeDeals.toString(),
      subtitle: `${formatCurrency(revenueMetrics.avgDealSize)} avg`,
      variant: 'primary' as const,
    },
    {
      id: 'target-attainment',
      icon: Activity,
      label: 'Target',
      value: formatPercent(revenueMetrics.targetAttainment),
      subtitle: 'Attainment',
      variant: 'primary' as const,
    },
  ]

  return (
    <ProjectPageLayout
      title="Revenue Operations Command Center"
      description="Comprehensive revenue operations dashboard consolidating pipeline health, forecasting accuracy, partner performance, and operational KPIs. Real-time insights with 96.8% forecast accuracy and 89.7% operational efficiency across sales, marketing, and partner channels."
      tags={[
        { label: 'Forecast Accuracy: 96.8%', variant: 'primary' },
        { label: 'Pipeline Health: 92.4%', variant: 'secondary' },
        { label: 'Revenue Growth: +34.2%', variant: 'primary' },
        { label: 'Operations Dashboard', variant: 'secondary' },
      ]}
      showTimeframes={true}
      timeframes={tabs.map((t) => t.charAt(0).toUpperCase() + t.slice(1))}
      activeTimeframe={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
      onTimeframeChange={(timeframe) => setActiveTab(timeframe.toLowerCase() as Tab)}
    >
          {/* Key Metrics using standardized MetricsGrid */}
          <MetricsGrid metrics={metrics} columns={4} className="mb-12" />

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
    </ProjectPageLayout>
  )
}
