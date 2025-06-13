'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  RefreshCcw, 
  TrendingUp, 
  DollarSign, 
  Users, 
  BarChart3,
  Target,
  Activity
} from 'lucide-react'
import { motion, Variants } from 'framer-motion'
import RevenueBarChart from './RevenueBarChart'
import RevenueLineChart from './RevenueLineChart'
import TopPartnersChart from './TopPartnersChart'
import PartnerGroupPieChart from './PartnerGroupPieChart'
import { yearOverYearGrowthExtended } from '@/app/projects/data/partner-analytics'

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
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  // Get the most recent year data from yearOverYearGrowthExtended
  const currentYearData: YearOverYearGrowth | undefined =
    yearOverYearGrowthExtended[yearOverYearGrowthExtended.length - 1]
  const prevYearData: YearOverYearGrowth | undefined =
    yearOverYearGrowthExtended[yearOverYearGrowthExtended.length - 2]

  // Handle undefined data for currentYearData or prevYearData
  if (!currentYearData) {
    console.error('currentYearData is undefined. Cannot render Revenue KPI dashboard.')
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
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <Link 
            href="/projects"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back to Projects</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-1">
              {['2020', '2022', '2024', 'All'].map((timeframe) => (
                <button
                  key={timeframe}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeTimeframe === timeframe 
                      ? 'bg-blue-500 text-white shadow-lg' 
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
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
                setTimeout(() => setIsLoading(false), 500)
              }}
              className="p-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              <RefreshCcw className="h-5 w-5 text-gray-300" />
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
          <p className="text-lg text-gray-400 max-w-3xl mb-4">
            Real-time revenue analytics, partner performance metrics, and business intelligence for data-driven growth strategies.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full">Revenue: ${formatCurrency(currentYearData.total_revenue)}</span>
            <span className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full">Partners: {currentYearData.partner_count}</span>
            <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full">Growth: +{currentYearData.commission_growth_percentage.toFixed(1)}%</span>
            <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full">Accuracy: 94%</span>
          </div>
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
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            >
              {/* Total Revenue */}
              <motion.div variants={fadeInUp} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-500/20 rounded-2xl">
                      <DollarSign className="h-6 w-6 text-blue-400" />
                    </div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Revenue</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">
                    {formatCurrency(currentYearData.total_revenue)}
                  </p>
                  <p className="text-sm text-gray-400">
                    {revenueGrowth > 0 ? '+' : ''}{revenueGrowth.toFixed(1)}% vs last year
                  </p>
                </div>
              </motion.div>

              {/* Partner Count */}
              <motion.div variants={fadeInUp} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-indigo-500/20 rounded-2xl">
                      <Users className="h-6 w-6 text-indigo-400" />
                    </div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Partners</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">
                    {currentYearData.partner_count.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-400">
                    {partnerGrowth > 0 ? '+' : ''}{partnerGrowth.toFixed(1)}% growth
                  </p>
                </div>
              </motion.div>

              {/* Total Transactions */}
              <motion.div variants={fadeInUp} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-500/20 rounded-2xl">
                      <Activity className="h-6 w-6 text-purple-400" />
                    </div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Volume</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">
                    {currentYearData.total_transactions.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-400">
                    {transactionGrowth > 0 ? '+' : ''}{transactionGrowth.toFixed(1)}% transactions
                  </p>
                </div>
              </motion.div>

              {/* Commission Growth */}
              <motion.div variants={fadeInUp} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-amber-500/20 rounded-2xl">
                      <TrendingUp className="h-6 w-6 text-amber-400" />
                    </div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Growth</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">
                    +{currentYearData.commission_growth_percentage.toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-400">Commission Growth</p>
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
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-bold mb-1">Revenue Growth Trends</h2>
                  <p className="text-sm text-gray-400">Monthly revenue progression and forecasting</p>
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
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-bold mb-1">Monthly Revenue Analysis</h2>
                  <p className="text-sm text-gray-400">Revenue breakdown by time period</p>
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
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-bold mb-1">Top Revenue Partners</h2>
                  <p className="text-sm text-gray-400">Highest performing business partners</p>
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
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-bold mb-1">Partner Group Distribution</h2>
                  <p className="text-sm text-gray-400">Revenue contribution by partner type</p>
                </div>
                <div className="h-[200px]">
                  <PartnerGroupPieChart />
                </div>
              </motion.div>
            </div>

            {/* Strategic Impact */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-sm border border-blue-500/20 rounded-3xl p-6"
            >
              <h2 className="text-xl font-bold mb-4 text-blue-400">Revenue Operations Excellence & Strategic Impact</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">{formatCurrency(4200000)}</div>
                  <div className="text-xs text-gray-300">Additional Revenue Generated</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-indigo-400 mb-1">94%</div>
                  <div className="text-xs text-gray-300">Forecast Accuracy & Operational Efficiency</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-cyan-400 mb-1">65%</div>
                  <div className="text-xs text-gray-300">Time Reduction in Manual Reporting</div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}