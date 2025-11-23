'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import {
  ArrowLeft,
  RefreshCcw,
  TrendingDown,
  Users,
  Activity,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'
import { ChartSkeleton } from '@/components/projects/charts/chart-skeleton'
import { m as motion } from 'framer-motion'
import { ProjectJsonLd } from '@/components/seo/json-ld'
import { TIMING_CONSTANTS } from '@/lib/constants/ui-thresholds'

// Lazy-load chart components with Suspense fallback
const ChurnLineChart = dynamic(() => import('./ChurnLineChart'), {
  loading: () => <ChartSkeleton height={350} showTitle={false} />,
  ssr: true
})
const RetentionHeatmap = dynamic(() => import('./RetentionHeatmap'), {
  loading: () => <ChartSkeleton height={350} showTitle={false} />,
  ssr: true
})

// Import static churn data
import {
  staticChurnData,
} from '@/app/projects/data/partner-analytics'

export default function ChurnAnalysis() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), TIMING_CONSTANTS.LOADING_STATE_RESET)
  }, [])

  // Ensure data exists before accessing indices
  const currentMonth = staticChurnData?.[staticChurnData.length - 1] ?? null
  const previousMonth = staticChurnData?.[staticChurnData.length - 2] ?? null

  // Safe calculations
  const churnDifference =
    currentMonth && previousMonth
      ? (currentMonth.churnRate - previousMonth.churnRate).toFixed(1)
      : '0.0'


  const totalPartners = currentMonth 
    ? currentMonth.retained + currentMonth.churned 
    : 0

  const retentionRate = currentMonth
    ? ((currentMonth.retained / totalPartners) * 100).toFixed(1)
    : '0.0'

  return (
    <>
      <ProjectJsonLd 
        title="Customer Churn & Retention Analysis - Predictive Analytics"
        description="Advanced churn prediction and retention analysis dashboard with customer lifecycle metrics, retention heatmaps, and predictive modeling for customer success optimization."
        slug="churn-retention"
        category="Customer Analytics"
        tags={['Churn Analysis', 'Customer Retention', 'Predictive Analytics', 'Customer Success', 'Lifecycle Management', 'Customer Analytics', 'Data Science', 'Machine Learning']}
      />
      <div className="min-h-screen bg-[#0f172a] text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <Link 
            href="/projects"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back to Projects</span>
          </Link>
          <button 
            onClick={() => {
              setIsLoading(true)
              setTimeout(() => setIsLoading(false), TIMING_CONSTANTS.LOADING_STATE_RESET)
            }}
            className="p-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
          >
            <RefreshCcw className="h-5 w-5 text-gray-300" />
          </button>
        </div>

        {/* Title Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent mb-4">
            Churn & Retention Analysis
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl">
            Track partner churn rates and retention patterns to identify at-risk segments and improve partner success strategies.
          </p>
        </motion.div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-500/20 rounded-full" />
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 rounded-full animate-spin border-t-transparent" />
            </div>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            >
              {/* Current Churn Rate */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-red-500/20 rounded-2xl">
                      <TrendingDown className="h-6 w-6 text-red-400" />
                    </div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Current</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">
                    {currentMonth ? `${currentMonth.churnRate}%` : 'N/A'}
                  </p>
                  <p className="text-sm text-gray-400">Churn Rate</p>
                </div>
              </div>

              {/* Retention Rate */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-500/20 rounded-2xl">
                      <Users className="h-6 w-6 text-green-400" />
                    </div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Current</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">{retentionRate}%</p>
                  <p className="text-sm text-gray-400">Retention Rate</p>
                </div>
              </div>

              {/* Churn Trend */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-500/20 rounded-2xl">
                      <Activity className="h-6 w-6 text-blue-400" />
                    </div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">vs Last Month</span>
                  </div>
                  <p className={`text-3xl font-bold mb-1 ${
                    parseFloat(churnDifference) > 0 ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {parseFloat(churnDifference) > 0 ? '+' : ''}{churnDifference}%
                  </p>
                  <p className="text-sm text-gray-400">Churn Change</p>
                </div>
              </div>

              {/* At Risk Partners */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-amber-500/20 rounded-2xl">
                      <AlertCircle className="h-6 w-6 text-amber-400" />
                    </div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">This Month</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">
                    {currentMonth ? currentMonth.churned : 'N/A'}
                  </p>
                  <p className="text-sm text-gray-400">Partners Churned</p>
                </div>
              </div>
            </motion.div>

            {/* Charts Section */}
            <div className="space-y-8">
              {/* Retention Heatmap */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/[0.07] transition-all duration-300"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">Partner Retention Patterns</h2>
                  <p className="text-gray-400">Monthly retention rates by partner cohort</p>
                </div>
                <RetentionHeatmap />
              </motion.div>

              {/* Churn Trends */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/[0.07] transition-all duration-300"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">Churn Rate Trends</h2>
                  <p className="text-gray-400">Historical churn rate analysis and projections</p>
                </div>
                <ChurnLineChart />
              </motion.div>
            </div>

            {/* Professional Narrative Sections */}
            <div className="space-y-12 mt-12">
              {/* Project Overview */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
              >
                <h2 className="text-2xl font-bold mb-6 text-blue-400">Project Overview</h2>
                <div className="space-y-4 text-gray-300">
                  <p className="text-lg leading-relaxed">
                    Developed a predictive churn analysis system to identify at-risk partners and implement proactive retention strategies. This analytics solution became critical for maintaining partner relationships and optimizing lifetime value across the entire partner ecosystem.
                  </p>
                  <p className="leading-relaxed">
                    The system processes partner engagement patterns, transaction histories, and performance metrics to predict churn probability with 89% accuracy, enabling data-driven retention interventions.
                  </p>
                </div>
              </motion.div>

              {/* Challenge */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
              >
                <h2 className="text-2xl font-bold mb-6 text-amber-400">Challenge</h2>
                <div className="space-y-4 text-gray-300">
                  <p className="leading-relaxed">
                    Partner churn was reactive rather than proactive, resulting in significant revenue loss and missed retention opportunities:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>No early warning system for partners at risk of churning</li>
                    <li>Partners often churned without any engagement attempt from the retention team</li>
                    <li>High-value partners were leaving due to unaddressed concerns</li>
                    <li>Retention efforts were costly and unfocused, targeting the wrong segments</li>
                    <li>No understanding of churn patterns or leading indicators</li>
                    <li>Manual tracking was impossible at scale with growing partner base</li>
                  </ul>
                  <p className="leading-relaxed">
                    The reactive approach meant losing partners who could have been retained with timely intervention, significantly impacting long-term revenue.
                  </p>
                </div>
              </motion.div>

              {/* Solution */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
              >
                <h2 className="text-2xl font-bold mb-6 text-green-400">Solution</h2>
                <div className="space-y-4 text-gray-300">
                  <p className="leading-relaxed">
                    Built a comprehensive churn prediction and retention analytics platform using machine learning algorithms and real-time data analysis:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <h3 className="font-semibold text-blue-400 mb-3">Predictive Analytics</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Machine learning models for churn probability scoring</li>
                        <li>Real-time partner engagement tracking</li>
                        <li>Behavioral pattern analysis and anomaly detection</li>
                        <li>Cohort analysis for retention rate optimization</li>
                        <li>Predictive lifecycle modeling</li>
                      </ul>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <h3 className="font-semibold text-green-400 mb-3">Retention Operations</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Automated alert system for at-risk partners</li>
                        <li>Segmented retention campaign workflows</li>
                        <li>Partner health score monitoring</li>
                        <li>Success team task prioritization</li>
                        <li>ROI tracking for retention initiatives</li>
                      </ul>
                    </div>
                  </div>

                  <p className="leading-relaxed mt-4">
                    The solution integrated with CRM systems, partner portals, and communication platforms to provide a 360-degree view of partner health and automated intervention triggers.
                  </p>
                </div>
              </motion.div>

              {/* Results & Impact */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
              >
                <h2 className="text-2xl font-bold mb-6 text-emerald-400">Results & Impact</h2>
                <div className="space-y-6 text-gray-300">
                  <p className="leading-relaxed">
                    The churn prediction system transformed partner retention from reactive firefighting to proactive relationship management:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 text-center">
                      <div className="text-3xl font-bold text-blue-400 mb-2">23%</div>
                      <div className="text-sm text-gray-300">Churn Rate Reduction</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6 text-center">
                      <div className="text-3xl font-bold text-green-400 mb-2">89%</div>
                      <div className="text-sm text-gray-300">Prediction Accuracy</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 text-center">
                      <div className="text-3xl font-bold text-purple-400 mb-2">$830K</div>
                      <div className="text-sm text-gray-300">Revenue Saved from Retention</div>
                    </div>
                    <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6 text-center">
                      <div className="text-3xl font-bold text-amber-400 mb-2">67%</div>
                      <div className="text-sm text-gray-300">Success Rate of Interventions</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-emerald-400">Quantified Business Outcomes:</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Reduced partner churn rate from 14.2% to 10.9% quarterly</li>
                      <li>Increased retention rate for high-value partners to 92%</li>
                      <li>Achieved 67% success rate for at-risk partner interventions</li>
                      <li>Saved $830K in annual revenue through proactive retention</li>
                      <li>Improved partner satisfaction scores by 18% through proactive outreach</li>
                      <li>Reduced retention team workload by 34% through targeted interventions</li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Key Learnings */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
              >
                <h2 className="text-2xl font-bold mb-6 text-purple-400">Key Learnings</h2>
                <div className="space-y-4 text-gray-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h3 className="font-semibold text-purple-400">Customer Success Insights</h3>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>Early engagement is 3x more effective than late-stage retention efforts</li>
                        <li>Partners with declining engagement patterns show churn intent 60-90 days before actual churn</li>
                        <li>Personalized retention approaches significantly outperform generic campaigns</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-semibold text-blue-400">Technical Implementation Insights</h3>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>Real-time data processing is crucial for actionable churn predictions</li>
                        <li>Model accuracy improves significantly with multi-dimensional engagement data</li>
                        <li>Automated workflows reduce response time from days to hours</li>
                      </ul>
                    </div>
                  </div>
                  <p className="leading-relaxed mt-4">
                    This project highlighted that retention is fundamentally about relationship health, not just transactional metrics. The most successful interventions addressed underlying business challenges rather than just engagement gaps.
                  </p>
                </div>
              </motion.div>

              {/* Technologies Used */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.3 }}
                className="bg-gradient-to-br from-gray-500/10 to-slate-500/10 backdrop-blur-sm border border-gray-500/20 rounded-3xl p-8"
              >
                <h2 className="text-2xl font-bold mb-6 text-gray-300">Technologies Used</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    'React 19', 'TypeScript', 'Recharts', 'Machine Learning',
                    'Predictive Analytics', 'Data Modeling', 'Real-time Processing', 'CRM Integration',
                    'Behavioral Analytics', 'Cohort Analysis', 'Automation Workflows', 'Customer Success'
                  ].map((tech, index) => (
                    <span key={index} className="bg-white/10 text-gray-300 px-3 py-2 rounded-lg text-sm text-center border border-white/20 hover:bg-white/20 transition-colors">
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Insights Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.4 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-sm border border-blue-500/20 rounded-3xl p-6">
                  <h3 className="text-lg font-semibold mb-2 text-blue-400">Key Insight</h3>
                  <p className="text-gray-300 text-sm">
                    Partners with less than 3 months tenure show 2x higher churn risk. Focus onboarding efforts here.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-green-500/20 rounded-3xl p-6">
                  <h3 className="text-lg font-semibold mb-2 text-green-400">Opportunity</h3>
                  <p className="text-gray-300 text-sm">
                    Implementing proactive engagement for at-risk segments could reduce churn by up to 15%.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-sm border border-amber-500/20 rounded-3xl p-6">
                  <h3 className="text-lg font-semibold mb-2 text-amber-400">Action Required</h3>
                  <p className="text-gray-300 text-sm">
                    Schedule quarterly business reviews with top 20% of partners to maintain retention rates.
                  </p>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </div>
      </div>
    </>
  )
}
