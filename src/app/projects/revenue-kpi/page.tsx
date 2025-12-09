'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, RefreshCcw, TrendingUp, DollarSign, Users, Activity } from 'lucide-react'
import { m as motion } from 'framer-motion'
import { ProjectJsonLd } from '@/components/seo/json-ld'
import { createContextLogger } from '@/lib/monitoring/logger'
import { TIMING_CONSTANTS } from '@/lib/constants/ui-thresholds'
import { yearOverYearGrowthExtended } from '@/app/projects/data/partner-analytics'

import { staggerContainer, timeframes, type YearOverYearGrowth } from './data/constants'
import { formatCurrency, calculateGrowth } from './utils'
import { MetricCard } from './components/MetricCard'
import { ChartsGrid } from './components/ChartsGrid'
import { NarrativeSections } from './components/NarrativeSections'

const logger = createContextLogger('RevenueKPIPage')

export default function RevenueKPI() {
  const [activeTimeframe, setActiveTimeframe] = useState('All')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), TIMING_CONSTANTS.LOADING_STATE_RESET)
    return () => clearTimeout(timer)
  }, [])

  const currentYearData: YearOverYearGrowth | undefined =
    yearOverYearGrowthExtended[yearOverYearGrowthExtended.length - 1]
  const prevYearData: YearOverYearGrowth | undefined =
    yearOverYearGrowthExtended[yearOverYearGrowthExtended.length - 2]

  if (!currentYearData) {
    logger.error(
      'currentYearData is undefined. Cannot render Revenue KPI dashboard',
      new Error('Missing current year data')
    )
    return <div>Error: Current year data not available.</div>
  }

  const revenueGrowth = calculateGrowth(currentYearData.total_revenue, prevYearData?.total_revenue)
  const partnerGrowth = calculateGrowth(currentYearData.partner_count, prevYearData?.partner_count)
  const transactionGrowth = calculateGrowth(
    currentYearData.total_transactions,
    prevYearData?.total_transactions
  )

  return (
    <>
      <ProjectJsonLd
        title="Revenue KPI Dashboard - Partner Analytics & Business Intelligence"
        description="Real-time revenue analytics dashboard featuring partner performance metrics, growth trends, and business intelligence for data-driven decision making. Built with React, TypeScript, and Recharts."
        slug="revenue-kpi"
        category="Business Intelligence"
        tags={[
          'Revenue Analytics',
          'Partner Management',
          'KPI Dashboard',
          'Business Intelligence',
          'Data Visualization',
          'Recharts',
          'React',
          'TypeScript',
        ]}
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
                {timeframes.map((timeframe) => (
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
              Real-time revenue analytics, partner performance metrics, and business intelligence
              for data-driven growth strategies.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="bg-primary/20 text-primary px-3 py-1 rounded-full">
                Revenue: ${formatCurrency(currentYearData.total_revenue)}
              </span>
              <span className="bg-secondary/20 text-secondary px-3 py-1 rounded-full">
                Partners: {currentYearData.partner_count}
              </span>
              <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full">
                Growth: +{currentYearData.commission_growth_percentage.toFixed(1)}%
              </span>
              <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full">
                Accuracy: 94%
              </span>
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
                <MetricCard
                  icon={DollarSign}
                  label="Revenue"
                  value={formatCurrency(currentYearData.total_revenue)}
                  subtitle={`${revenueGrowth > 0 ? '+' : ''}${revenueGrowth.toFixed(1)}% vs last year`}
                  gradientFrom="from-blue-600"
                  gradientTo="to-cyan-600"
                  iconBgClass="bg-primary/20"
                  iconColorClass="text-primary"
                />
                <MetricCard
                  icon={Users}
                  label="Partners"
                  value={currentYearData.partner_count.toLocaleString()}
                  subtitle={`${partnerGrowth > 0 ? '+' : ''}${partnerGrowth.toFixed(1)}% growth`}
                  gradientFrom="from-indigo-600"
                  gradientTo="to-purple-600"
                  iconBgClass="bg-secondary/20"
                  iconColorClass="text-secondary"
                />
                <MetricCard
                  icon={Activity}
                  label="Volume"
                  value={currentYearData.total_transactions.toLocaleString()}
                  subtitle={`${transactionGrowth > 0 ? '+' : ''}${transactionGrowth.toFixed(1)}% transactions`}
                  gradientFrom="from-purple-600"
                  gradientTo="to-pink-600"
                  iconBgClass="bg-purple-500/20"
                  iconColorClass="text-purple-400"
                />
                <MetricCard
                  icon={TrendingUp}
                  label="Growth"
                  value={`+${currentYearData.commission_growth_percentage.toFixed(1)}%`}
                  subtitle="Commission Growth"
                  gradientFrom="from-amber-600"
                  gradientTo="to-orange-600"
                  iconBgClass="bg-amber-500/20"
                  iconColorClass="text-amber-400"
                />
              </motion.div>

              {/* Charts Grid */}
              <ChartsGrid />

              {/* Narrative Sections */}
              <NarrativeSections totalRevenue={currentYearData.total_revenue} />
            </>
          )}
        </div>
      </div>
    </>
  )
}
