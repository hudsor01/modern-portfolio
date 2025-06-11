'use client'

import { useState, useEffect } from 'react'
import {
  ArrowLeft,
  RefreshCcw,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  DollarSign,
  BarChart3,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import RevenueOverviewChart from './RevenueOverviewChart'
import PipelineHealthChart from './PipelineHealthChart'
import ForecastAccuracyChart from './ForecastAccuracyChart'
import OperationalMetricsChart from './OperationalMetricsChart'

// Comprehensive revenue operations metrics
const revenueMetrics = {
  totalRevenue: 12847600,
  revenueGrowth: 34.2,
  forecastAccuracy: 96.8,
  pipelineHealth: 92.4,
  operationalEfficiency: 89.7,
  activeDeals: 247,
  avgDealSize: 52000,
  salesCycleLength: 73,
  winRate: 83.2,
  quarterlyTarget: 13500000,
  targetAttainment: 95.2
}

const kpiAlerts = [
  { type: 'success', icon: CheckCircle, message: 'Q4 forecast accuracy exceeds 95% target', severity: 'low' },
  { type: 'warning', icon: AlertTriangle, message: 'Pipeline velocity down 8% from last quarter', severity: 'medium' },
  { type: 'info', icon: Activity, message: 'Deal stage progression improved 12% this month', severity: 'low' },
  { type: 'warning', icon: Clock, message: 'Average sales cycle extended by 6 days', severity: 'medium' },
]

const departmentMetrics = [
  {
    department: 'Sales',
    metrics: [
      { name: 'Revenue', value: '$8.2M', change: '+28%', positive: true },
      { name: 'Win Rate', value: '83.2%', change: '+5.4%', positive: true },
      { name: 'Cycle Length', value: '73 days', change: '+6 days', positive: false },
      { name: 'Pipeline Value', value: '$24.8M', change: '+18%', positive: true },
    ]
  },
  {
    department: 'Partners',
    metrics: [
      { name: 'Partner Revenue', value: '$4.6M', change: '+67%', positive: true },
      { name: 'Partner Count', value: '47', change: '+12', positive: true },
      { name: 'Partner ROI', value: '4.7x', change: '+0.8x', positive: true },
      { name: 'Channel Health', value: '89%', change: '+12%', positive: true },
    ]
  },
  {
    department: 'Operations',
    metrics: [
      { name: 'Efficiency Score', value: '89.7%', change: '+7.2%', positive: true },
      { name: 'Data Quality', value: '94.3%', change: '+2.1%', positive: true },
      { name: 'Process Automation', value: '78%', change: '+15%', positive: true },
      { name: 'Cost per Lead', value: '$127', change: '-23%', positive: true },
    ]
  }
]

const alertTypeStyles = {
  success: 'bg-green-500/20 text-green-400 border-green-500/30',
  warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  error: 'bg-red-500/20 text-red-400 border-red-500/30',
  info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
}

export default function RevenueOperationsCenter() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: value >= 1000000 ? 1 : 0,
      notation: value >= 1000000 ? 'compact' : 'standard',
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
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

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-1">
              {['overview', 'pipeline', 'forecasting', 'operations'].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 capitalize ${
                    activeTab === tab
                      ? 'bg-violet-500 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                setIsLoading(true)
                setTimeout(() => setIsLoading(false), 600)
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
          className="mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-violet-400 to-purple-600 bg-clip-text text-transparent mb-4">
            Revenue Operations Command Center
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mb-6">
            Comprehensive executive revenue operations dashboard consolidating pipeline health, forecasting accuracy, partner performance, and operational KPIs. Real-time insights with 96.8% forecast accuracy and 89.7% operational efficiency across sales, marketing, and partner channels.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="bg-violet-500/20 text-violet-400 px-3 py-1 rounded-full">Forecast Accuracy: 96.8%</span>
            <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full">Pipeline Health: 92.4%</span>
            <span className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full">Revenue Growth: +34.2%</span>
            <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full">Executive Dashboard</span>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-violet-500/20 rounded-full" />
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-violet-500 rounded-full animate-spin border-t-transparent" />
            </div>
          </div>
        ) : (
          <>
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
              {/* Total Revenue */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-violet-500/20 rounded-2xl">
                      <DollarSign className="h-6 w-6 text-violet-400" />
                    </div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Total Revenue</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">
                    {formatCurrency(revenueMetrics.totalRevenue)}
                  </p>
                  <p className="text-sm text-gray-400 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    +{formatPercent(revenueMetrics.revenueGrowth)} YoY
                  </p>
                </div>
              </motion.div>

              {/* Forecast Accuracy */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-500/20 rounded-2xl">
                      <Target className="h-6 w-6 text-purple-400" />
                    </div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Forecast</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">
                    {formatPercent(revenueMetrics.forecastAccuracy)}
                  </p>
                  <p className="text-sm text-gray-400">Accuracy Rate</p>
                </div>
              </motion.div>

              {/* Pipeline Health */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-indigo-500/20 rounded-2xl">
                      <BarChart3 className="h-6 w-6 text-indigo-400" />
                    </div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Pipeline</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">
                    {formatPercent(revenueMetrics.pipelineHealth)}
                  </p>
                  <p className="text-sm text-gray-400">Health Score</p>
                </div>
              </motion.div>

              {/* Active Deals */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-500/20 rounded-2xl">
                      <Users className="h-6 w-6 text-blue-400" />
                    </div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Active Deals</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">
                    {revenueMetrics.activeDeals}
                  </p>
                  <p className="text-sm text-gray-400">{formatCurrency(revenueMetrics.avgDealSize)} avg</p>
                </div>
              </motion.div>

              {/* Target Attainment */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-cyan-500/20 rounded-2xl">
                      <Activity className="h-6 w-6 text-cyan-400" />
                    </div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Target</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">
                    {formatPercent(revenueMetrics.targetAttainment)}
                  </p>
                  <p className="text-sm text-gray-400">Attainment</p>
                </div>
              </motion.div>
            </div>

            {/* KPI Alerts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 mb-12"
            >
              <h3 className="text-lg font-semibold mb-4">Real-Time Revenue Operations Alerts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {kpiAlerts.map((alert, index) => {
                  const IconComponent = alert.icon
                  return (
                    <div key={index} className={`flex items-center gap-3 p-4 rounded-xl border ${alertTypeStyles[alert.type as keyof typeof alertTypeStyles]}`}>
                      <IconComponent className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm">{alert.message}</span>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Revenue Overview */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/[0.07] transition-all duration-300"
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2">Revenue Performance Overview</h2>
                    <p className="text-gray-400">Multi-channel revenue tracking with growth trends and target progress</p>
                  </div>
                  <RevenueOverviewChart />
                </motion.div>

                {/* Operational Efficiency */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/[0.07] transition-all duration-300"
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2">Operational Efficiency Metrics</h2>
                    <p className="text-gray-400">Key operational KPIs across sales, marketing, and partner channels</p>
                  </div>
                  <OperationalMetricsChart />
                </motion.div>
              </div>
            )}

            {activeTab === 'pipeline' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/[0.07] transition-all duration-300 mb-12"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">Pipeline Health & Velocity Analysis</h2>
                  <p className="text-gray-400">Real-time pipeline tracking with stage progression and bottleneck identification</p>
                </div>
                <PipelineHealthChart />
              </motion.div>
            )}

            {activeTab === 'forecasting' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/[0.07] transition-all duration-300 mb-12"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">Revenue Forecasting & Accuracy Analysis</h2>
                  <p className="text-gray-400">Predictive revenue modeling with confidence intervals and scenario planning</p>
                </div>
                <ForecastAccuracyChart />
              </motion.div>
            )}

            {activeTab === 'operations' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="space-y-8 mb-12"
              >
                {departmentMetrics.map((dept, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/[0.07] transition-all duration-300">
                    <h3 className="text-xl font-bold mb-6">{dept.department} Operations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {dept.metrics.map((metric, metricIndex) => (
                        <div key={metricIndex} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                          <p className="text-sm text-gray-400 mb-2">{metric.name}</p>
                          <p className="text-2xl font-bold mb-1">{metric.value}</p>
                          <p className={`text-sm flex items-center gap-1 ${
                            metric.positive ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {metric.positive ?
                              <TrendingUp className="w-4 h-4" /> :
                              <TrendingDown className="w-4 h-4" />
                            }
                            {metric.change}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Strategic Impact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 backdrop-blur-sm border border-violet-500/20 rounded-3xl p-8"
            >
              <h2 className="text-2xl font-bold mb-6 text-violet-400">Revenue Operations Excellence & Strategic Impact</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-violet-400 mb-2">96.8%</div>
                  <div className="text-sm text-gray-300">Revenue Forecast Accuracy (Industry: 75-85%)</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">+34.2%</div>
                  <div className="text-sm text-gray-300">YoY Revenue Growth (Target: 25%)</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-indigo-400 mb-2">89.7%</div>
                  <div className="text-sm text-gray-300">Operational Efficiency Score</div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}
