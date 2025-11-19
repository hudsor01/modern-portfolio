'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, Map, Database, Zap, Code } from 'lucide-react'
import { m as motion } from 'framer-motion'
import { ProjectJsonLd } from '@/components/seo/json-ld'

export default function QuotaTerritoryManagementProject() {
  const [_isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const metrics = [
    { label: 'Forecast Accuracy Improvement', value: '+28%', icon: TrendingUp, color: 'text-green-500' },
    { label: 'Quota Variance Reduction', value: '-32%', icon: Zap, color: 'text-blue-500' },
    { label: 'Territories Optimized', value: '47', icon: Map, color: 'text-purple-500' },
    { label: 'Data Points Analyzed', value: '2.5M+', icon: Database, color: 'text-amber-500' },
  ]

  const algorithmicApproaches = [
    {
      name: 'Fairness-First Quota Setting',
      description: 'Multi-factor model incorporating territory potential, historical performance, experience level, and market conditions',
      outcomes: [
        '18% reduction in sales rep churn',
        'Improved rep satisfaction scores by 24%',
        'Reduced turnover-related revenue impact'
      ]
    },
    {
      name: 'Predictive Territory Design',
      description: 'Machine learning models predicting territory revenue potential and optimal rep placement',
      outcomes: [
        '28% improvement in forecast accuracy',
        'Better territory-to-rep matching',
        'Optimized sales coverage'
      ]
    },
    {
      name: 'Dynamic Rebalancing',
      description: 'Quarterly territory optimization based on market changes, rep performance, and revenue trends',
      outcomes: [
        '23% average territory efficiency increase',
        'Continuous improvement over time',
        'Data-driven decision making'
      ]
    },
    {
      name: 'What-If Scenario Planning',
      description: 'Advanced simulation tools for evaluating different territory assignments and quota structures',
      outcomes: [
        'Reduced planning cycle by 60%',
        'Better executive visibility into trade-offs',
        'Faster implementation of changes'
      ]
    }
  ]

  return (
    <>
      <ProjectJsonLd
        title="Intelligent Quota Management & Territory Planning"
        description="Territory management system that improved forecast accuracy by 28% and reduced quota variance by 32%"
        slug="quota-territory-management"
        category="Revenue Operations"
        tags={['Quota Management', 'Territory Planning', 'Predictive Analytics', 'Revenue Operations']}
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
              Intelligent Quota Management & Territory Planning
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl">
              Advanced quota setting and territory assignment system using predictive analytics and fairness algorithms. Optimized territory design increased forecast accuracy by 28% and reduced quota attainment variance by 32%.
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

          {/* Algorithmic Approaches */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-8">Algorithmic Approaches</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {algorithmicApproaches.map((approach, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-8 hover:border-blue-500/50 transition-all"
                >
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <Code className="h-5 w-5 text-blue-400" />
                    {approach.name}
                  </h3>
                  <p className="text-slate-300 mb-6">{approach.description}</p>
                  <ul className="space-y-2">
                    {approach.outcomes.map((outcome, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-300">
                        <span className="text-green-400 mt-1">✓</span>
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Impact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-12 mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-8">Revenue Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-4xl font-bold text-green-400 mb-2">$8.7M</div>
                <p className="text-slate-300">Incremental revenue from optimized territories</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-400 mb-2">28%</div>
                <p className="text-slate-300">Improvement in forecast accuracy</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-400 mb-2">32%</div>
                <p className="text-slate-300">Reduction in quota attainment variance</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-amber-400 mb-2">23%</div>
                <p className="text-slate-300">Average territory efficiency increase</p>
              </div>
            </div>
          </motion.div>

          {/* Technical Implementation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-8">Technical Stack & Methodologies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-8">
                <h3 className="text-lg font-semibold text-white mb-4">Machine Learning Models</h3>
                <ul className="space-y-2 text-slate-300">
                  <li>• Regression models for revenue prediction</li>
                  <li>• Classification for territory potential</li>
                  <li>• Clustering for geographic optimization</li>
                  <li>• Time series forecasting</li>
                </ul>
              </div>
              <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-8">
                <h3 className="text-lg font-semibold text-white mb-4">Data & Analytics</h3>
                <ul className="space-y-2 text-slate-300">
                  <li>• 2.5M+ data points analyzed</li>
                  <li>• Multi-dimensional territory analysis</li>
                  <li>• Real-time performance tracking</li>
                  <li>• Historical trend analysis</li>
                </ul>
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
              {['Python', 'Machine Learning', 'Predictive Analytics', 'D3.js', 'Recharts', 'PostgreSQL', 'Next.js', 'Geospatial Analysis'].map((tech) => (
                <span
                  key={tech}
                  className="bg-blue-600/20 border border-blue-500/50 rounded-full px-4 py-2 text-sm text-blue-300 hover:bg-blue-600/30 transition-colors"
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
