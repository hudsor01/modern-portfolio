'use client'

import { useState, useEffect } from 'react'
import {
  ArrowLeft,
  RefreshCcw,
  TrendingDown,
  TrendingUp,
  Users,
  UserMinus,
  Activity,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'
import ChurnLineChart from './ChurnLineChart'
import RetentionHeatmap from './RetentionHeatmap'
import { motion } from 'framer-motion'

// Import static churn data
import {
  staticChurnData,
} from '@/app/projects/data/partner-analytics'

export default function ChurnAnalysis() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500)
  }, [])

  // Ensure data exists before accessing indices
  const currentMonth = staticChurnData?.[staticChurnData.length - 1] ?? null
  const previousMonth = staticChurnData?.[staticChurnData.length - 2] ?? null

  // Safe calculations
  const churnDifference =
    currentMonth && previousMonth
      ? (currentMonth.churn_rate - previousMonth.churn_rate).toFixed(1)
      : '0.0'

  const retentionDifference =
    currentMonth && previousMonth
      ? (
          (currentMonth.retained_partners /
            (currentMonth.retained_partners + currentMonth.churned_partners)) *
            100 -
          (previousMonth.retained_partners /
            (previousMonth.retained_partners + previousMonth.churned_partners)) *
            100
        ).toFixed(1)
      : '0.0'

  const totalPartners = currentMonth 
    ? currentMonth.retained_partners + currentMonth.churned_partners 
    : 0

  const retentionRate = currentMonth
    ? ((currentMonth.retained_partners / totalPartners) * 100).toFixed(1)
    : '0.0'

  return (
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
              setTimeout(() => setIsLoading(false), 500)
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
                    {currentMonth ? `${currentMonth.churn_rate}%` : 'N/A'}
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
                    {currentMonth ? currentMonth.churned_partners : 'N/A'}
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

            {/* Insights Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
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
          </>
        )}
      </div>
    </div>
  )
}