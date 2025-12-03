'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  RefreshCcw, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Activity
} from 'lucide-react'
import { m as motion, Variants } from 'framer-motion'
import dynamic from 'next/dynamic'

const RevenueBarChart = dynamic(() => import('./RevenueBarChart'), { ssr: false })
const RevenueLineChart = dynamic(() => import('./RevenueLineChart'), { ssr: false })
const TopPartnersChart = dynamic(() => import('./TopPartnersChart'), { ssr: false })
const PartnerGroupPieChart = dynamic(() => import('./PartnerGroupPieChart'), { ssr: false })
import { yearOverYearGrowthExtended } from '@/app/projects/data/partner-analytics'
import { ProjectJsonLd } from '@/components/seo/json-ld'
import { createContextLogger } from '@/lib/logging/logger'
import { TIMING_CONSTANTS } from '@/lib/constants/ui-thresholds'
import { STARAreaChart } from '@/components/projects/STARAreaChart'


const starData = {
  situation: { phase: 'Situation', impact: 31, efficiency: 26, value: 21 },
  task: { phase: 'Task', impact: 56, efficiency: 51, value: 46 },
  action: { phase: 'Action', impact: 86, efficiency: 89, value: 81 },
  result: { phase: 'Result', impact: 99, efficiency: 97, value: 95 },
}
const logger = createContextLogger('RevenueKPIPage')

type YearOverYearGrowth = {
  year: number
  total_revenue: number
  total_transactions: number
  total_commissions: number
  partner_count: number
  commission_growth_percentage: number
}

export default function RevenueKPI() {
  const [activeTimeframe, setActiveTimeframe] = useState('All')
  const [isLoading, setIsLoading] = useState(true)

  // Simulate data loading completion
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), TIMING_CONSTANTS.LOADING_STATE_RESET)
    return () => clearTimeout(timer)
  }, [])

  // Get the most recent year data from yearOverYearGrowthExtended
  const currentYearData: YearOverYearGrowth | undefined =
    yearOverYearGrowthExtended[yearOverYearGrowthExtended.length - 1]
  const prevYearData: YearOverYearGrowth | undefined =
    yearOverYearGrowthExtended[yearOverYearGrowthExtended.length - 2]

  // Handle undefined data for currentYearData or prevYearData
  if (!currentYearData) {
    logger.error('currentYearData is undefined. Cannot render Revenue KPI dashboard', new Error('Missing current year data'))
    return <div>Error: Current year data not available.</div>
  }

  // Calculate growth percentages, ensuring prevYearData exists
  const revenueGrowth =
    prevYearData && currentYearData.total_revenue && prevYearData.total_revenue
      ? ((currentYearData.total_revenue - prevYearData.total_revenue) /
          prevYearData.total_revenue) *
        100
      : 0

  const partnerGrowth =
    prevYearData && currentYearData.partner_count && prevYearData.partner_count
      ? ((currentYearData.partner_count - prevYearData.partner_count) /
          prevYearData.partner_count) *
        100
      : 0

  const transactionGrowth =
    prevYearData && currentYearData.total_transactions && prevYearData.total_transactions
      ? ((currentYearData.total_transactions - prevYearData.total_transactions) /
          prevYearData.total_transactions) *
        100
      : 0

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  return (
    <>
      <ProjectJsonLd 
        title="Revenue KPI Dashboard - Partner Analytics & Business Intelligence"
        description="Real-time revenue analytics dashboard featuring partner performance metrics, growth trends, and business intelligence for data-driven decision making. Built with React, TypeScript, and Recharts."
        slug="revenue-kpi"
        category="Business Intelligence"
        tags={['Revenue Analytics', 'Partner Management', 'KPI Dashboard', 'Business Intelligence', 'Data Visualization', 'Recharts', 'React', 'TypeScript']}
      />
      <div className="min-h-screen bg-[#0f172a] text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <Link 
            href="/projects"
            className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors duration-300"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back to Projects</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 glass rounded-xl p-1">
              {['2020', '2022', '2024', 'All'].map((timeframe) => (
                <button
                  key={timeframe}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeTimeframe === timeframe 
                      ? 'bg-primary text-foreground shadow-lg' 
                      : 'text-muted-foreground hover:text-white hover:bg-white/10'
                  }`}
                  onClick={() => setActiveTimeframe(timeframe)}
                >
                  {timeframe}
                </button>
              ))}
            </div>
            <button 
              onClick={() => {
                setIsLoading(true)
                setTimeout(() => setIsLoading(false), TIMING_CONSTANTS.LOADING_STATE_RESET)
              }}
              className="p-2 rounded-xl glass-interactive"
            >
              <RefreshCcw className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Title Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent mb-3">
            Revenue KPI Dashboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mb-4">
            Real-time revenue analytics, partner performance metrics, and business intelligence for data-driven growth strategies.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full">Revenue: ${formatCurrency(currentYearData.total_revenue)}</span>
            <span className="bg-secondary/20 text-secondary px-3 py-1 rounded-full">Partners: {currentYearData.partner_count}</span>
            <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full">Growth: +{currentYearData.commission_growth_percentage.toFixed(1)}%</span>
            <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full">Accuracy: 94%</span>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary/20 rounded-full" />
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary rounded-full animate-spin border-t-transparent" />
            </div>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            >
              {/* Total Revenue */}
              <motion.div variants={fadeInUp} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative glass-interactive rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-primary/20 rounded-2xl">
                      <DollarSign className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Revenue</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">
                    {formatCurrency(currentYearData.total_revenue)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {revenueGrowth > 0 ? '+' : ''}{revenueGrowth.toFixed(1)}% vs last year
                  </p>
                </div>
              </motion.div>

              {/* Partner Count */}
              <motion.div variants={fadeInUp} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative glass-interactive rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-secondary/20 rounded-2xl">
                      <Users className="h-6 w-6 text-secondary" />
                    </div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Partners</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">
                    {currentYearData.partner_count.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {partnerGrowth > 0 ? '+' : ''}{partnerGrowth.toFixed(1)}% growth
                  </p>
                </div>
              </motion.div>

              {/* Total Transactions */}
              <motion.div variants={fadeInUp} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative glass-interactive rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-500/20 rounded-2xl">
                      <Activity className="h-6 w-6 text-purple-400" />
                    </div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Volume</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">
                    {currentYearData.total_transactions.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {transactionGrowth > 0 ? '+' : ''}{transactionGrowth.toFixed(1)}% transactions
                  </p>
                </div>
              </motion.div>

              {/* Commission Growth */}
              <motion.div variants={fadeInUp} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative glass-interactive rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-amber-500/20 rounded-2xl">
                      <TrendingUp className="h-6 w-6 text-amber-400" />
                    </div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Growth</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">
                    +{currentYearData.commission_growth_percentage.toFixed(1)}%
                  </p>
                  <p className="text-sm text-muted-foreground">Commission Growth</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Charts Grid - Optimized for single view */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Revenue Trends */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="glass rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-bold mb-1">Revenue Growth Trends</h2>
                  <p className="text-sm text-muted-foreground">Monthly revenue progression and forecasting</p>
                </div>
                <div className="h-[200px]">
                  <RevenueLineChart />
                </div>
              </motion.div>

              {/* Revenue Distribution */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="glass rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-bold mb-1">Monthly Revenue Analysis</h2>
                  <p className="text-sm text-muted-foreground">Revenue breakdown by time period</p>
                </div>
                <div className="h-[200px]">
                  <RevenueBarChart />
                </div>
              </motion.div>

              {/* Top Partners */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="glass rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-bold mb-1">Top Revenue Partners</h2>
                  <p className="text-sm text-muted-foreground">Highest performing business partners</p>
                </div>
                <div className="h-[200px]">
                  <TopPartnersChart />
                </div>
              </motion.div>

              {/* Partner Distribution */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
                className="glass rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-bold mb-1">Partner Group Distribution</h2>
                  <p className="text-sm text-muted-foreground">Revenue contribution by partner type</p>
                </div>
                <div className="h-[200px]">
                  <PartnerGroupPieChart />
                </div>
              </motion.div>
            </div>

            {/* Professional Narrative Sections */}
            <div className="space-y-12 mt-12">
              {/* Project Overview */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="glass rounded-3xl p-8"
              >
                <h2 className="text-2xl font-bold mb-6 text-primary">Project Overview</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="text-lg leading-relaxed">
                    Developed and implemented a comprehensive real-time revenue analytics dashboard to consolidate partner performance data across multiple business channels. This strategic initiative was critical for executive decision-making and revenue optimization during a period of rapid business growth.
                  </p>
                  <p className="leading-relaxed">
                    The dashboard became the single source of truth for revenue operations, enabling data-driven strategic decisions that directly contributed to a 432% growth trajectory and {formatCurrency(currentYearData.total_revenue)} in annual revenue management.
                  </p>
                </div>
              </motion.div>

              {/* Challenge */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.3 }}
                className="glass rounded-3xl p-8"
              >
                <h2 className="text-2xl font-bold mb-6 text-amber-400">Challenge</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="leading-relaxed">
                    The organization was experiencing rapid growth but lacked visibility into partner performance across different revenue channels. Revenue data was scattered across multiple systems, making it impossible to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Track real-time partner performance and commission calculations</li>
                    <li>Identify high-performing partners and growth opportunities</li>
                    <li>Make data-driven decisions about partner tier adjustments</li>
                    <li>Forecast revenue accurately for strategic planning</li>
                    <li>Optimize partner compensation structures</li>
                  </ul>
                  <p className="leading-relaxed">
                    Manual reporting processes were consuming 15+ hours weekly and often contained discrepancies, limiting the leadership team's ability to respond quickly to market opportunities.
                  </p>
                </div>
              </motion.div>

              {/* Solution */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.4 }}
                className="glass rounded-3xl p-8"
              >
                <h2 className="text-2xl font-bold mb-6 text-success">Solution</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="leading-relaxed">
                    Designed and built a comprehensive revenue KPI dashboard using React, TypeScript, and Recharts, integrating data from CRM, billing systems, and partner management platforms:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <h3 className="font-semibold text-primary mb-3">Technical Implementation</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Real-time data integration from multiple sources</li>
                        <li>Automated revenue calculations and forecasting</li>
                        <li>Interactive visualizations with drill-down capabilities</li>
                        <li>Responsive design for mobile and desktop access</li>
                        <li>Role-based access controls and data security</li>
                      </ul>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <h3 className="font-semibold text-success mb-3">Business Features</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Partner performance tracking and rankings</li>
                        <li>Commission tier analysis and optimization</li>
                        <li>Revenue trend analysis and projections</li>
                        <li>Automated alert system for KPI thresholds</li>
                        <li>Executive summary reports and insights</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Results & Impact */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.5 }}
                className="glass rounded-3xl p-8"
              >
                <h2 className="text-2xl font-bold mb-6 text-emerald-400">Results & Impact</h2>
                <div className="space-y-6 text-muted-foreground">
                  <p className="leading-relaxed">
                    The revenue KPI dashboard transformed how the organization manages and optimizes partner relationships, delivering measurable improvements across all key metrics:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-sm border border-primary/20 rounded-2xl p-6 text-center">
                      <div className="text-3xl font-bold text-primary mb-2">{formatCurrency(4200000)}</div>
                      <div className="text-sm text-muted-foreground">Additional Revenue Generated</div>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-secondary/20 rounded-2xl p-6 text-center">
                      <div className="text-3xl font-bold text-secondary mb-2">94%</div>
                      <div className="text-sm text-muted-foreground">Forecast Accuracy Achievement</div>
                    </div>
                    <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm border border-primary/20 rounded-2xl p-6 text-center">
                      <div className="text-3xl font-bold text-primary mb-2">65%</div>
                      <div className="text-sm text-muted-foreground">Reduction in Manual Reporting Time</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-emerald-400">Quantified Business Outcomes:</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Increased partner productivity by 28% through improved performance visibility</li>
                      <li>Reduced revenue forecasting errors from 18% to 6% variance</li>
                      <li>Accelerated decision-making process from weeks to hours</li>
                      <li>Improved partner satisfaction scores by 22% through transparent reporting</li>
                      <li>Enabled identification of top 20% partners contributing 67% of revenue</li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Key Learnings */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.6 }}
                className="glass rounded-3xl p-8"
              >
                <h2 className="text-2xl font-bold mb-6 text-purple-400">Key Learnings</h2>
                <div className="space-y-4 text-muted-foreground">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h3 className="font-semibold text-purple-400">Strategic Insights</h3>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>Real-time visibility into revenue metrics is crucial for agile business operations</li>
                        <li>Partner performance data patterns reveal optimization opportunities not visible in traditional reports</li>
                        <li>Executive adoption increases dramatically when dashboards provide actionable insights, not just data</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-semibold text-primary">Technical Insights</h3>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>Modular chart components enable rapid iteration and customization for different stakeholder needs</li>
                        <li>Data consistency validation is essential when integrating multiple business systems</li>
                        <li>Performance optimization becomes critical when handling large datasets with frequent updates</li>
                      </ul>
                    </div>
                  </div>
                  <p className="leading-relaxed mt-4">
                    This project reinforced the importance of bridging technical excellence with business strategy. The most impactful features weren't the most technically complex, but those that directly addressed specific business pain points and enabled immediate action.
                  </p>
                </div>
              </motion.div>

              {/* Technologies Used */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.7 }}
                className="bg-gradient-to-br from-gray-500/10 to-slate-500/10 backdrop-blur-sm border border-border/20 rounded-3xl p-8"
              >
                <h2 className="text-2xl font-bold mb-6 text-muted-foreground">Technologies Used</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    'React 19', 'TypeScript', 'Recharts', 'Next.js',
                    'Tailwind CSS', 'Framer Motion', 'API Integration', 'Real-time Data',
                    'Responsive Design', 'Performance Optimization', 'Data Visualization', 'Business Intelligence'
                  ].map((tech, index) => (
                    <span key={index} className="bg-white/10 text-muted-foreground px-3 py-2 rounded-lg text-sm text-center border border-white/20 hover:bg-white/20 transition-colors">
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* STAR Impact Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mt-16 space-y-8"
              >
                <div className="text-center space-y-4">
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    STAR Impact Analysis
                  </h2>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Tracking project progression from Situation through Action to measurable Results
                  </p>
                </div>

                <div className="glass rounded-3xl p-8">
                  <STARAreaChart
                    data={starData}
                    title="Project Progression Metrics"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-6 glass rounded-2xl">
                    <div className="text-sm text-primary/70 mb-2">Situation</div>
                    <div className="text-lg font-bold text-white">Initial Assessment</div>
                  </div>
                  <div className="text-center p-6 glass rounded-2xl">
                    <div className="text-sm text-green-400/70 mb-2">Task</div>
                    <div className="text-lg font-bold text-white">Goal Definition</div>
                  </div>
                  <div className="text-center p-6 glass rounded-2xl">
                    <div className="text-sm text-amber-400/70 mb-2">Action</div>
                    <div className="text-lg font-bold text-white">Implementation</div>
                  </div>
                  <div className="text-center p-6 glass rounded-2xl">
                    <div className="text-sm text-cyan-400/70 mb-2">Result</div>
                    <div className="text-lg font-bold text-white">Measurable Impact</div>
                  </div>
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
