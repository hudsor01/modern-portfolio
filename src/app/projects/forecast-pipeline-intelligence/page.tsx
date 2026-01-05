'use client'

import { TrendingUp, AlertTriangle, Zap, CheckCircle, BarChart3 } from 'lucide-react'

import { ProjectPageLayout } from '@/components/projects/project-page-layout'
import { LoadingState } from '@/components/projects/loading-state'
import { MetricsGrid } from '@/components/projects/metrics-grid'
import { SectionCard } from '@/components/ui/section-card'
import { useLoadingState } from '@/hooks/use-loading-state'
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatTrend,
} from '@/lib/utils/data-formatters'
import { ProjectJsonLd } from '@/components/seo/json-ld'

export default function ForecastPipelineIntelligenceProject() {
  const { isLoading, handleRefresh } = useLoadingState()

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
        onRefresh={handleRefresh}
        refreshButtonDisabled={isLoading}
      >
        {isLoading ? (
          <LoadingState />
        ) : (
          <>
            {/* Key Metrics using standardized MetricsGrid */}
            <MetricsGrid metrics={metrics} columns={4} loading={isLoading} className="mb-8" />

            {/* Intelligence Modules wrapped in SectionCard */}
            <SectionCard
              title="Intelligence Modules"
              description="Core components of the forecasting and pipeline intelligence system"
              className="mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {intelligenceModules.map((module, index) => (
                  <div
                    key={index}
                    className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all"
                  >
                    <h3 className="text-lg font-semibold mb-3">{module.title}</h3>
                    <p className="text-muted-foreground mb-4">{module.description}</p>
                    <ul className="space-y-2">
                      {module.capabilities.map((capability, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                          <span>{capability}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Business Impact wrapped in SectionCard */}
            <SectionCard
              title="Business Impact"
              description="Measurable improvements in forecasting accuracy and pipeline management"
              variant="gradient"
              className="mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-secondary mb-2">
                    {formatCurrency(12500000, { compact: true })}
                  </div>
                  <p className="text-muted-foreground">
                    Revenue protected through proactive pipeline management
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {formatPercentage(0.94)}
                  </div>
                  <p className="text-muted-foreground">Overall forecasting accuracy achieved</p>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-secondary mb-2">
                    {formatPercentage(0.31)}
                  </div>
                  <p className="text-muted-foreground">Improvement in revenue forecast accuracy</p>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {formatPercentage(0.26)}
                  </div>
                  <p className="text-muted-foreground">Reduction in deal slippage</p>
                </div>
              </div>
            </SectionCard>

            {/* Analytics Approach wrapped in SectionCard */}
            <SectionCard
              title="Analytics & Signals"
              description="Data signals and analytics approaches used for forecasting intelligence"
              className="mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Deal Health Signals (50+)</h3>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li>• Engagement level and trend</li>
                    <li>• Buying committee consensus</li>
                    <li>• Competitive threat assessment</li>
                    <li>• Budget confirmation status</li>
                    <li>• Timeline alignment</li>
                    <li>• Champion strength and risk</li>
                  </ul>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Forecasting Signals</h3>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li>• Historical stage progression rates</li>
                    <li>• Seasonal patterns and trends</li>
                    <li>• Deal size and complexity</li>
                    <li>• Rep experience and track record</li>
                    <li>• Customer industry and maturity</li>
                    <li>• Days in current stage</li>
                  </ul>
                </div>
              </div>
            </SectionCard>

            {/* Technologies wrapped in SectionCard */}
            <SectionCard
              title="Technologies & Tools"
              description="Technology stack and tools used for implementation"
            >
              <div className="flex flex-wrap gap-3">
                {[
                  'Python',
                  'Machine Learning',
                  'Time Series Analysis',
                  'Plotly',
                  'Recharts',
                  'PostgreSQL',
                  'Next.js',
                  'Predictive Analytics',
                ].map((tech) => (
                  <span
                    key={tech}
                    className="bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm text-primary hover:bg-primary/20 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </SectionCard>
          </>
        )}
      </ProjectPageLayout>
    </>
  )
}
