'use client'
export const dynamic = 'force-static'

import { TrendingUp, AlertTriangle, Zap, BarChart3 } from 'lucide-react'

import { ProjectPageLayout } from '@/components/projects/project-page-layout'
import { MetricsGrid } from '@/components/projects/metrics-grid'
import { formatNumber, formatPercentage, formatTrend } from '@/lib/utils/data-formatters'
import { ProjectJsonLd } from '@/components/seo/json-ld'
import { NarrativeSections } from './components/NarrativeSections'
import { IntelligenceModulesGrid } from './components/IntelligenceModulesGrid'

export default function ForecastPipelineIntelligenceProject() {

  // Standardized metrics configuration using consistent data formatting
  const metrics = [
    {
      id: 'forecast-accuracy',
      icon: TrendingUp,
      label: 'Forecast Accuracy',
      value: formatTrend(0.31, { format: 'percentage', showArrow: false }),
      subtitle: 'Improvement',
      variant: 'success' as const,
    },
    {
      id: 'slippage-reduction',
      icon: AlertTriangle,
      label: 'Slippage',
      value: formatTrend(-0.26, { format: 'percentage', showArrow: false }),
      subtitle: 'Reduction',
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
        title="Forecast Accuracy & Pipeline Intelligence System"
        description="Forecasting system that improved accuracy by 31% and reduced slippage by 26%"
        slug="forecast-pipeline-intelligence"
        category="Revenue Operations"
        tags={[
          'Forecasting',
          'Pipeline Intelligence',
          'Predictive Analytics',
          'Revenue Operations',
        ]}
      />

      <ProjectPageLayout
        title="Forecast Accuracy & Pipeline Intelligence System"
        description="Enterprise forecasting and pipeline intelligence platform combining predictive analytics, deal health monitoring, and early warning systems. Improved forecast accuracy by 31% and reduced slippage by 26%."
        tags={[
          {
            label: `Accuracy: ${formatTrend(0.31, { format: 'percentage', showArrow: false })}`,
            variant: 'primary',
          },
          {
            label: `Slippage: ${formatTrend(-0.26, { format: 'percentage', showArrow: false })}`,
            variant: 'secondary',
          },
          { label: `${formatNumber(4200)}+ Deals Monitored`, variant: 'primary' },
          { label: `${formatPercentage(0.89)} Early Warnings`, variant: 'secondary' },
        ]}
      >
            {/* Key Metrics using standardized MetricsGrid */}
            <MetricsGrid metrics={metrics} columns={4} className="mb-8" />

            {/* Intelligence Modules, Business Impact, and Analytics */}
            <IntelligenceModulesGrid modules={intelligenceModules} />

            {/* Professional Narrative Sections - STAR Method */}
            <NarrativeSections />
      </ProjectPageLayout>
    </>
  )
}
