'use client'
export const dynamic = 'force-static'

import { DollarSign, Brain, Users, Calendar } from 'lucide-react'
import { useQueryState } from 'nuqs'

import { ProjectPageLayout } from '@/components/projects/project-page-layout'
import { MetricsGrid } from '@/components/projects/metrics-grid'
import { SectionCard } from '@/components/ui/section-card'
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/data-formatters'
import { clvMetrics } from './data/constants'
import { OverviewTab } from './_components/OverviewTab'
import { SegmentsTab } from './_components/SegmentsTab'
import { PredictionsTab } from './_components/PredictionsTab'
import { StrategicImpact } from './_components/StrategicImpact'
import { NarrativeSections } from './_components/NarrativeSections'

const tabs = ['overview', 'segments', 'predictions'] as const
type Tab = (typeof tabs)[number]

export default function CustomerLifetimeValueAnalytics() {
  const [activeTab, setActiveTab] = useQueryState('tab', { defaultValue: 'overview' as Tab })

  // Standardized metrics configuration using consistent data formatting
  const metrics = [
    {
      id: 'average-clv',
      icon: DollarSign,
      label: 'Average CLV',
      value: formatCurrency(clvMetrics.averageCLV, { compact: true }),
      subtitle: 'Predicted Value',
      variant: 'primary' as const,
    },
    {
      id: 'ml-accuracy',
      icon: Brain,
      label: 'ML Accuracy',
      value: formatPercentage(clvMetrics.predictionAccuracy / 100),
      subtitle: 'Model Performance',
      variant: 'secondary' as const,
    },
    {
      id: 'high-value-customers',
      icon: Users,
      label: 'High Value',
      value: formatNumber(clvMetrics.highValueCustomers),
      subtitle: 'Premium Customers',
      variant: 'primary' as const,
    },
    {
      id: 'forecast-horizon',
      icon: Calendar,
      label: 'Forecast',
      value: `${clvMetrics.forecastHorizon} mo`,
      subtitle: 'Prediction Window',
      variant: 'secondary' as const,
    },
  ]

  return (
    <ProjectPageLayout
      title="Customer Lifetime Value Predictive Analytics Dashboard"
      description="Advanced CLV analytics platform leveraging BTYD (Buy Till You Die) predictive modeling framework. Achieving 94.3% prediction accuracy through machine learning algorithms and real-time customer behavior tracking across 5 distinct customer segments."
      tags={[
        {
          label: `Prediction Accuracy: ${formatPercentage(clvMetrics.predictionAccuracy / 100)}`,
          variant: 'primary',
        },
        {
          label: `Avg CLV: ${formatCurrency(clvMetrics.averageCLV, { compact: true })}`,
          variant: 'secondary',
        },
        { label: 'Machine Learning', variant: 'primary' },
        { label: 'BTYD Framework', variant: 'secondary' },
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
            title="CLV Analytics"
            description="Comprehensive customer lifetime value analysis and insights"
            className="mb-8"
          >
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'segments' && <SegmentsTab />}
            {activeTab === 'predictions' && <PredictionsTab />}
          </SectionCard>

          {/* Strategic Impact wrapped in SectionCard */}
          <SectionCard
            title="Strategic Impact"
            description="Business impact and strategic outcomes from CLV optimization"
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
  )
}
