'use client'

import { TrendingUp, AlertTriangle, Zap, BarChart3 } from 'lucide-react'

import { ProjectPageLayout } from '@/components/projects/project-page-layout'
import { MetricsGrid } from '@/components/projects/metrics-grid'
import { SectionCard } from '@/components/ui/section-card'
import { formatNumber, formatPercentage } from '@/lib/data-formatters'
import { ProjectJsonLd } from '@/components/seo/json-ld/project-json-ld'
import { ogImageUrl } from '@/lib/absolute-url'
import { NarrativeSections } from './NarrativeSections'
import { IntelligenceModulesGrid } from './IntelligenceModulesGrid'

export default function ForecastPipelineIntelligenceProject() {
  // Standardized metrics configuration using consistent data formatting
  const metrics = [
    {
      id: 'forecast-accuracy',
      icon: TrendingUp,
      label: 'Forecast Accuracy',
      value: formatPercentage(0.94),
      subtitle: 'From 63%',
      variant: 'success' as const,
    },
    {
      id: 'slippage-reduction',
      icon: AlertTriangle,
      label: 'Slippage',
      value: formatPercentage(0.19),
      subtitle: 'From 26%',
      variant: 'secondary' as const,
    },
    {
      id: 'deals-monitored',
      icon: BarChart3,
      label: 'Deals',
      value: formatNumber(4200, { suffix: '+' }),
      subtitle: 'Monitored',
      variant: 'primary' as const,
    },
    {
      id: 'early-warnings',
      icon: Zap,
      label: 'Early Warnings',
      value: formatPercentage(0.89),
      subtitle: 'Detected',
      variant: 'primary' as const,
    },
  ]

  const intelligenceModules = [
    {
      title: 'Deal Health Scoring System',
      description:
        'AI-powered system that scores deal health based on 50+ signals including engagement, buying consensus, and competitive threats',
      capabilities: [
        'Real-time deal health calculation',
        'Competitor activity tracking',
        'Buyer engagement monitoring',
        'Automated risk alerts',
      ],
    },
    {
      title: 'Predictive Close Dating',
      description:
        'Machine learning models that predict deal close dates with 94% accuracy based on historical patterns',
      capabilities: [
        '94% forecasting accuracy',
        'Stage progression time estimation',
        'Delay risk identification',
        'Optimized deal stage probabilities',
      ],
    },
    {
      title: 'Early Warning System',
      description: 'Automated detection of at-risk deals before they slip through the cracks',
      capabilities: [
        '89% of risks identified early',
        'Proactive intervention triggers',
        'Executive alerts and escalation',
        'Prevention recommendations',
      ],
    },
    {
      title: 'Pipeline Intelligence Dashboard',
      description:
        'Executive-facing dashboard with drill-down capabilities for pipeline analysis and decision-making',
      capabilities: [
        'Real-time pipeline visibility',
        'Scenario planning and forecasting',
        'Variance analysis and trend tracking',
        'Custom reporting and exports',
      ],
    },
  ]

  return (
    <>
      <ProjectJsonLd
        image={ogImageUrl({
          title: 'Forecast & Pipeline Intelligence Case Study',
          subtitle: 'Revenue Operations Project',
          project: 'forecast-pipeline-intelligence',
        })}
        title="Forecast & Pipeline Intelligence"
        description="Forecast and pipeline case study: predictive deal-health monitoring that raised forecast accuracy from 63% to 94% and cut deal slippage from 26% to 19%."
        slug="forecast-pipeline-intelligence"
        category="Revenue Operations"
        datePublished="2025-11-19T00:00:00-06:00"
        dateModified="2026-04-10T00:00:00-06:00"
        tags={[
          'Forecasting',
          'Pipeline Intelligence',
          'Predictive Analytics',
          'Revenue Operations',
        ]}
      />

      <ProjectPageLayout
        title="Forecast & Pipeline Intelligence"
        description="Enterprise forecasting and pipeline intelligence platform combining predictive analytics, deal health monitoring, and early warning systems. Improved forecast accuracy from 63% to 94% and reduced deal slippage from 26% to 19%."
        tags={[
          {
            label: `Accuracy: ${formatPercentage(0.63)} → ${formatPercentage(0.94)}`,
            variant: 'primary',
          },
          {
            label: `Slippage: ${formatPercentage(0.26)} → ${formatPercentage(0.19)}`,
            variant: 'secondary',
          },
          { label: `${formatNumber(4200)}+ Deals Monitored`, variant: 'primary' },
          { label: `${formatPercentage(0.89)} Early Warnings`, variant: 'secondary' },
        ]}
      >
        {/* Key Metrics using standardized MetricsGrid */}
        <MetricsGrid metrics={metrics} columns={4} className="mb-8" />

        {/* Intelligence Modules — IntelligenceModulesGrid renders its own titled SectionCard */}
        <IntelligenceModulesGrid modules={intelligenceModules} />

        {/* Professional Narrative Sections - STAR Method */}
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
