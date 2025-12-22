'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, AlertTriangle, Zap, CheckCircle, BarChart3 } from 'lucide-react'

import { ProjectPageLayout } from '@/components/projects/project-page-layout'
import { LoadingState } from '@/components/projects/loading-state'
import { TIMING } from '@/lib/constants/spacing'
import { ProjectJsonLd } from '@/components/seo/json-ld'

export default function ForecastPipelineIntelligenceProject() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), TIMING.LOADING_STATE_RESET)
    return () => clearTimeout(timer)
  }, [])

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), TIMING.LOADING_STATE_RESET)
  }

  const metrics = [
    { label: 'Forecast Accuracy Improvement', value: '+31%', icon: TrendingUp, color: 'text-success' },
    { label: 'Slippage Reduction', value: '-26%', icon: AlertTriangle, color: 'text-secondary' },
    { label: 'Deals Monitored', value: '4,200+', icon: BarChart3, color: 'text-primary' },
    { label: 'Early Warnings Detected', value: '89%', icon: Zap, color: 'text-primary' },
  ]

  const intelligenceModules = [
    {
      title: 'Deal Health Scoring System',
      description: 'AI-powered system that scores deal health based on 50+ signals including engagement, buying consensus, and competitive threats',
      capabilities: [
        'Real-time deal health calculation',
        'Competitor activity tracking',
        'Buyer engagement monitoring',
        'Automated risk alerts'
      ]
    },
    {
      title: 'Predictive Close Dating',
      description: 'Machine learning models that predict deal close dates with 94% accuracy based on historical patterns',
      capabilities: [
        '94% forecasting accuracy',
        'Stage progression time estimation',
        'Delay risk identification',
        'Optimized deal stage probabilities'
      ]
    },
    {
      title: 'Early Warning System',
      description: 'Automated detection of at-risk deals before they slip through the cracks',
      capabilities: [
        '89% of risks identified early',
        'Proactive intervention triggers',
        'Executive alerts and escalation',
        'Prevention recommendations'
      ]
    },
    {
      title: 'Pipeline Intelligence Dashboard',
      description: 'Executive-facing dashboard with drill-down capabilities for pipeline analysis and decision-making',
      capabilities: [
        'Real-time pipeline visibility',
        'Scenario planning and forecasting',
        'Variance analysis and trend tracking',
        'Custom reporting and exports'
      ]
    }
  ]

  return (
    <>
      <ProjectJsonLd
        title="Forecast Accuracy & Pipeline Intelligence System"
        description="Forecasting system that improved accuracy by 31% and reduced slippage by 26%"
        slug="forecast-pipeline-intelligence"
        category="Revenue Operations"
        tags={['Forecasting', 'Pipeline Intelligence', 'Predictive Analytics', 'Revenue Operations']}
      />

      <ProjectPageLayout
        title="Forecast Accuracy & Pipeline Intelligence System"
        description="Enterprise forecasting and pipeline intelligence platform combining predictive analytics, deal health monitoring, and early warning systems. Improved forecast accuracy by 31% and reduced slippage by 26%."
        tags={[
          { label: 'Accuracy: +31%', color: 'bg-primary/20 text-primary' },
          { label: 'Slippage: -26%', color: 'bg-secondary/20 text-secondary' },
          { label: '4,200+ Deals Monitored', color: 'bg-primary/20 text-primary' },
          { label: '89% Early Warnings', color: 'bg-secondary/20 text-secondary' },
        ]}
        onRefresh={handleRefresh}
        refreshButtonDisabled={isLoading}
      >
        {isLoading ? (
          <LoadingState />
        ) : (
          <>
            {/* Key Metrics */}
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
            >
              {metrics.map((metric) => {
                const Icon = metric.icon
                return (
                  <div
                    key={metric.label}
                    className="glass rounded-2xl p-6 hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Icon className={`h-8 w-8 ${metric.color}`} />
                    </div>
                    <div className="typography-h2 border-none pb-0 text-2xl text-foreground mb-2">{metric.value}</div>
                    <div className="text-sm text-slate-400">{metric.label}</div>
                  </div>
                )
              })}
            </div>

            {/* Intelligence Modules */}
            <div
              className="mb-16"
            >
              <h2 className="typography-h2 border-none pb-0 text-2xl text-foreground mb-8">Intelligence Modules</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {intelligenceModules.map((module, index) => (
                  <div
                    key={index}
                    className="glass rounded-2xl p-8 hover:border-primary/50 transition-all"
                  >
                    <h3 className="typography-h4 text-foreground mb-3">{module.title}</h3>
                    <p className="text-slate-300 mb-6">{module.description}</p>
                    <ul className="space-y-2">
                      {module.capabilities.map((capability, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-300">
                          <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                          <span>{capability}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Impact */}
            <div
              className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-success/30 rounded-xl p-12 mb-16"
            >
              <h2 className="typography-h2 border-none pb-0 text-2xl text-foreground mb-8">Business Impact</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="typography-h1 text-xl text-success mb-2">$12.5M</div>
                  <p className="text-slate-300">Revenue protected through proactive pipeline management</p>
                </div>
                <div>
                  <div className="typography-h1 text-xl text-primary mb-2">94%</div>
                  <p className="text-slate-300">Overall forecasting accuracy achieved</p>
                </div>
                <div>
                  <div className="typography-h1 text-xl text-secondary mb-2">31%</div>
                  <p className="text-slate-300">Improvement in revenue forecast accuracy</p>
                </div>
                <div>
                  <div className="typography-h1 text-xl text-primary mb-2">26%</div>
                  <p className="text-slate-300">Reduction in deal slippage</p>
                </div>
              </div>
            </div>

            {/* Analytics Approach */}
            <div
              className="mb-16"
            >
              <h2 className="typography-h2 border-none pb-0 text-2xl text-foreground mb-8">Analytics & Signals</h2>
              <div className="glass rounded-2xl p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="typography-large text-foreground mb-4">Deal Health Signals (50+)</h3>
                    <ul className="space-y-2 text-slate-300 text-sm">
                      <li>• Engagement level and trend</li>
                      <li>• Buying committee consensus</li>
                      <li>• Competitive threat assessment</li>
                      <li>• Budget confirmation status</li>
                      <li>• Timeline alignment</li>
                      <li>• Champion strength and risk</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="typography-large text-foreground mb-4">Forecasting Signals</h3>
                    <ul className="space-y-2 text-slate-300 text-sm">
                      <li>• Historical stage progression rates</li>
                      <li>• Seasonal patterns and trends</li>
                      <li>• Deal size and complexity</li>
                      <li>• Rep experience and track record</li>
                      <li>• Customer industry and maturity</li>
                      <li>• Days in current stage</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Technologies */}
            <div
              className="mb-16"
            >
              <h2 className="typography-h2 border-none pb-0 text-2xl text-foreground mb-8">Technologies & Tools</h2>
              <div className="flex flex-wrap gap-3">
                {['Python', 'Machine Learning', 'Time Series Analysis', 'Plotly', 'Recharts', 'PostgreSQL', 'Next.js', 'Predictive Analytics'].map((tech) => (
                  <span
                    key={tech}
                    className="bg-success/20 border border-success/50 rounded-full px-4 py-2 text-sm text-success hover:bg-success/30 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </ProjectPageLayout>
    </>
  )
}
