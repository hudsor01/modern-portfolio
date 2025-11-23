'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, AlertTriangle, Zap, CheckCircle, BarChart3 } from 'lucide-react'
import { m as motion } from 'framer-motion'
import { ProjectJsonLd } from '@/components/seo/json-ld'
import { TIMING_CONSTANTS } from '@/lib/constants/ui-thresholds'

export default function ForecastPipelineIntelligenceProject() {
  const [_isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), TIMING_CONSTANTS.LOADING_STATE_RESET)
    return () => clearTimeout(timer)
  }, [])

  const metrics = [
    { label: 'Forecast Accuracy Improvement', value: '+31%', icon: TrendingUp, color: 'text-green-500' },
    { label: 'Slippage Reduction', value: '-26%', icon: AlertTriangle, color: 'text-red-500' },
    { label: 'Deals Monitored', value: '4,200+', icon: BarChart3, color: 'text-blue-500' },
    { label: 'Early Warnings Detected', value: '89%', icon: Zap, color: 'text-amber-500' },
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

      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Link>

            <h1 className="text-5xl font-bold text-white mb-4">
              Forecast Accuracy & Pipeline Intelligence System
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl">
              Enterprise forecasting and pipeline intelligence platform combining predictive analytics, deal health monitoring, and early warning systems. Improved forecast accuracy by 31% and reduced slippage by 26%.
            </p>
          </motion.div>

          {/* Key Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {metrics.map((metric) => {
              const Icon = metric.icon
              return (
                <div
                  key={metric.label}
                  className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Icon className={`h-8 w-8 ${metric.color}`} />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{metric.value}</div>
                  <div className="text-sm text-slate-400">{metric.label}</div>
                </div>
              )
            })}
          </motion.div>

          {/* Intelligence Modules */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-8">Intelligence Modules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {intelligenceModules.map((module, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-8 hover:border-blue-500/50 transition-all"
                >
                  <h3 className="text-xl font-bold text-white mb-3">{module.title}</h3>
                  <p className="text-slate-300 mb-6">{module.description}</p>
                  <ul className="space-y-2">
                    {module.capabilities.map((capability, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-300">
                        <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span>{capability}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Business Impact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30 rounded-xl p-12 mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-8">Business Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-4xl font-bold text-green-400 mb-2">$12.5M</div>
                <p className="text-slate-300">Revenue protected through proactive pipeline management</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-400 mb-2">94%</div>
                <p className="text-slate-300">Overall forecasting accuracy achieved</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-400 mb-2">31%</div>
                <p className="text-slate-300">Improvement in revenue forecast accuracy</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-amber-400 mb-2">26%</div>
                <p className="text-slate-300">Reduction in deal slippage</p>
              </div>
            </div>
          </motion.div>

          {/* Analytics Approach */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-8">Analytics & Signals</h2>
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Deal Health Signals (50+)</h3>
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
                  <h3 className="text-lg font-semibold text-white mb-4">Forecasting Signals</h3>
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
          </motion.div>

          {/* Technologies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-8">Technologies & Tools</h2>
            <div className="flex flex-wrap gap-3">
              {['Python', 'Machine Learning', 'Time Series Analysis', 'Plotly', 'Recharts', 'PostgreSQL', 'Next.js', 'Predictive Analytics'].map((tech) => (
                <span
                  key={tech}
                  className="bg-green-600/20 border border-green-500/50 rounded-full px-4 py-2 text-sm text-green-300 hover:bg-green-600/30 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
