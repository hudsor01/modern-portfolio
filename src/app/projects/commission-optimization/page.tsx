'use client'

import { useState, useEffect } from 'react'
import {
  ArrowLeft,
  RefreshCcw,
  TrendingUp,
  Target,
  DollarSign,
  Calculator,
  Award,
  Percent,
  Clock,
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import CommissionStructureChart from './CommissionStructureChart'
import PerformanceIncentiveChart from './PerformanceIncentiveChart'
import ROIOptimizationChart from './ROIOptimizationChart'
import CommissionTierChart from './CommissionTierChart'

// Commission management metrics
const commissionMetrics = {
  totalCommissionPool: 254000,
  averageCommissionRate: 23.0,
  performanceImprovement: 34.2,
  automationEfficiency: 87.5,
  partnerCount: 47,
  totalPayouts: 218450,
  pendingPayouts: 35550,
  averagePartnerEarnings: 5403
}

const commissionTiers = [
  {
    tier: 'Elite Partners',
    count: 8,
    commissionRate: 28.0,
    totalEarnings: 89600,
    avgEarnings: 11200,
    requirements: '$50K+ quarterly sales',
    performanceBonus: 15.0,
    roi: 4.2
  },
  {
    tier: 'Premium Partners', 
    count: 12,
    commissionRate: 25.0,
    totalEarnings: 67800,
    avgEarnings: 5650,
    requirements: '$25K+ quarterly sales',
    performanceBonus: 10.0,
    roi: 3.8
  },
  {
    tier: 'Standard Partners',
    count: 19,
    commissionRate: 20.0,
    totalEarnings: 45600,
    avgEarnings: 2400,
    requirements: '$10K+ quarterly sales',
    performanceBonus: 5.0,
    roi: 3.2
  },
  {
    tier: 'Growth Partners',
    count: 8,
    commissionRate: 15.0,
    totalEarnings: 15450,
    avgEarnings: 1931,
    requirements: 'New partner onboarding',
    performanceBonus: 0,
    roi: 2.1
  }
]

const incentivePrograms = [
  {
    program: 'Quarterly Sales Accelerator',
    participants: 34,
    budget: 45000,
    payout: 38750,
    effectiveness: 86.1,
    avgBonus: 1140,
    performanceLift: 28.4
  },
  {
    program: 'New Customer Acquisition Bonus',
    participants: 28,
    budget: 35000,
    payout: 31200,
    effectiveness: 89.1,
    avgBonus: 1114,
    performanceLift: 42.3
  },
  {
    program: 'Product Mix Incentive',
    participants: 41,
    budget: 28000,
    payout: 24680,
    effectiveness: 88.1,
    avgBonus: 602,
    performanceLift: 19.7
  },
  {
    program: 'Territory Expansion Rewards',
    participants: 15,
    budget: 22000,
    payout: 18900,
    effectiveness: 85.9,
    avgBonus: 1260,
    performanceLift: 35.6
  }
]

const commissionCalculationMetrics = [
  { metric: 'Processing Time', value: '2.3 hours', improvement: '-73%', status: 'excellent' },
  { metric: 'Calculation Accuracy', value: '99.8%', improvement: '+12%', status: 'excellent' },
  { metric: 'Dispute Rate', value: '1.2%', improvement: '-68%', status: 'excellent' },
  { metric: 'Partner Satisfaction', value: '94.7%', improvement: '+19%', status: 'excellent' },
]

export default function CommissionOptimization() {
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
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
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
              {['overview', 'tiers', 'incentives', 'automation'].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 capitalize ${
                    activeTab === tab 
                      ? 'bg-emerald-500 text-white shadow-lg' 
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
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-green-600 bg-clip-text text-transparent mb-3">
            Commission & Incentive Optimization System
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl mb-4">
            Advanced commission management and partner incentive optimization platform managing $254K+ commission structures. Automated tier adjustments with 23% average commission rate optimization and ROI-driven compensation strategy delivering 34% performance improvement and 87.5% automation efficiency.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full">Commission Pool: {formatCurrency(commissionMetrics.totalCommissionPool)}</span>
            <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full">Avg Rate: {formatPercent(commissionMetrics.averageCommissionRate)}</span>
            <span className="bg-teal-500/20 text-teal-400 px-3 py-1 rounded-full">Performance: +{formatPercent(commissionMetrics.performanceImprovement)}</span>
            <span className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full">Automation: {formatPercent(commissionMetrics.automationEfficiency)}</span>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-emerald-500/20 rounded-full" />
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-emerald-500 rounded-full animate-spin border-t-transparent" />
            </div>
          </div>
        ) : (
          <>
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Total Commission Pool */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-emerald-500/20 rounded-2xl">
                      <DollarSign className="h-6 w-6 text-emerald-400" />
                    </div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Commission Pool</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">
                    {formatCurrency(commissionMetrics.totalCommissionPool)}
                  </p>
                  <p className="text-sm text-gray-400">Annual Management</p>
                </div>
              </motion.div>

              {/* Average Commission Rate */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-teal-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-500/20 rounded-2xl">
                      <Percent className="h-6 w-6 text-green-400" />
                    </div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Avg Rate</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">
                    {formatPercent(commissionMetrics.averageCommissionRate)}
                  </p>
                  <p className="text-sm text-gray-400">Commission Rate</p>
                </div>
              </motion.div>

              {/* Performance Improvement */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-teal-500/20 rounded-2xl">
                      <TrendingUp className="h-6 w-6 text-teal-400" />
                    </div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Performance</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">
                    +{formatPercent(commissionMetrics.performanceImprovement)}
                  </p>
                  <p className="text-sm text-gray-400">Improvement</p>
                </div>
              </motion.div>

              {/* Automation Efficiency */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-cyan-500/20 rounded-2xl">
                      <Calculator className="h-6 w-6 text-cyan-400" />
                    </div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Automation</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">
                    {formatPercent(commissionMetrics.automationEfficiency)}
                  </p>
                  <p className="text-sm text-gray-400">Efficiency</p>
                </div>
              </motion.div>
            </div>

            {/* Commission Processing Metrics */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 mb-12"
            >
              <h3 className="text-lg font-semibold mb-6">Commission Processing & Automation Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {commissionCalculationMetrics.map((metric, index) => (
                  <div key={index} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <p className="text-sm text-gray-400 mb-2">{metric.metric}</p>
                    <p className="text-2xl font-bold mb-1">{metric.value}</p>
                    <p className="text-sm flex items-center gap-1 text-green-400">
                      <TrendingUp className="w-4 h-4" />
                      {metric.improvement}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Commission Structure */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300"
                >
                  <div className="mb-4">
                    <h2 className="text-xl font-bold mb-1">Commission Structure & Payout Analysis</h2>
                    <p className="text-sm text-gray-400">Tier-based commission optimization with automated calculations and performance tracking</p>
                  </div>
                  <div className="h-[280px]">
                    <CommissionStructureChart />
                  </div>
                </motion.div>

                {/* ROI Optimization */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300"
                >
                  <div className="mb-4">
                    <h2 className="text-xl font-bold mb-1">ROI Optimization & Performance Impact</h2>
                    <p className="text-sm text-gray-400">Commission ROI analysis showing investment efficiency across partner tiers</p>
                  </div>
                  <div className="h-[280px]">
                    <ROIOptimizationChart />
                  </div>
                </motion.div>
              </div>
            )}

            {activeTab === 'tiers' && (
              <div className="space-y-8 mb-12">
                {/* Commission Tier Visualization */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/[0.07] transition-all duration-300"
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2">Commission Tier Performance & ROI Analysis</h2>
                    <p className="text-gray-400">Multi-tier commission structure optimization with performance-based adjustments</p>
                  </div>
                  <CommissionTierChart />
                </motion.div>

                {/* Tier Details Table */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/[0.07] transition-all duration-300"
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2">Partner Commission Tier Structure & Requirements</h2>
                    <p className="text-gray-400">Detailed commission tier analysis with earnings, requirements, and ROI metrics</p>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-3 px-4 font-semibold">Tier</th>
                          <th className="text-left py-3 px-4 font-semibold">Partners</th>
                          <th className="text-left py-3 px-4 font-semibold">Commission Rate</th>
                          <th className="text-left py-3 px-4 font-semibold">Total Earnings</th>
                          <th className="text-left py-3 px-4 font-semibold">Avg Earnings</th>
                          <th className="text-left py-3 px-4 font-semibold">ROI</th>
                          <th className="text-left py-3 px-4 font-semibold">Requirements</th>
                        </tr>
                      </thead>
                      <tbody>
                        {commissionTiers.map((tier, index) => (
                          <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="py-4 px-4 font-medium">{tier.tier}</td>
                            <td className="py-4 px-4">{tier.count}</td>
                            <td className="py-4 px-4">{formatPercent(tier.commissionRate)}</td>
                            <td className="py-4 px-4">{formatCurrency(tier.totalEarnings)}</td>
                            <td className="py-4 px-4">{formatCurrency(tier.avgEarnings)}</td>
                            <td className="py-4 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                tier.roi >= 4 ? 'bg-green-500/20 text-green-400' :
                                tier.roi >= 3 ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {tier.roi.toFixed(1)}x
                              </span>
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-400">{tier.requirements}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </div>
            )}

            {activeTab === 'incentives' && (
              <div className="space-y-8 mb-12">
                {/* Performance Incentive Chart */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/[0.07] transition-all duration-300"
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2">Performance Incentive Program Effectiveness</h2>
                    <p className="text-gray-400">Targeted incentive programs driving partner performance with ROI-optimized bonus structures</p>
                  </div>
                  <PerformanceIncentiveChart />
                </motion.div>

                {/* Incentive Programs Table */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/[0.07] transition-all duration-300"
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2">Incentive Program Performance & ROI Analysis</h2>
                    <p className="text-gray-400">Comprehensive incentive program analysis with effectiveness metrics and performance impact</p>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-3 px-4 font-semibold">Program</th>
                          <th className="text-left py-3 px-4 font-semibold">Participants</th>
                          <th className="text-left py-3 px-4 font-semibold">Budget</th>
                          <th className="text-left py-3 px-4 font-semibold">Payout</th>
                          <th className="text-left py-3 px-4 font-semibold">Effectiveness</th>
                          <th className="text-left py-3 px-4 font-semibold">Avg Bonus</th>
                          <th className="text-left py-3 px-4 font-semibold">Performance Lift</th>
                        </tr>
                      </thead>
                      <tbody>
                        {incentivePrograms.map((program, index) => (
                          <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="py-4 px-4 font-medium">{program.program}</td>
                            <td className="py-4 px-4">{program.participants}</td>
                            <td className="py-4 px-4">{formatCurrency(program.budget)}</td>
                            <td className="py-4 px-4">{formatCurrency(program.payout)}</td>
                            <td className="py-4 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                program.effectiveness >= 85 ? 'bg-green-500/20 text-green-400' :
                                program.effectiveness >= 75 ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {formatPercent(program.effectiveness)}
                              </span>
                            </td>
                            <td className="py-4 px-4">{formatCurrency(program.avgBonus)}</td>
                            <td className="py-4 px-4 text-green-400">+{formatPercent(program.performanceLift)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </div>
            )}

            {activeTab === 'automation' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/[0.07] transition-all duration-300 mb-12"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">Automated Commission Processing System</h2>
                  <p className="text-gray-400">Real-time commission calculation and payout automation with 87.5% efficiency improvement</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-emerald-400" />
                      Processing Automation
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Processing Time:</span>
                        <span className="font-medium">2.3 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Previous Time:</span>
                        <span className="font-medium text-gray-500">8.5 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Time Savings:</span>
                        <span className="font-medium text-green-400">73% faster</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-green-400" />
                      Accuracy Metrics
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Calculation Accuracy:</span>
                        <span className="font-medium">99.8%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Error Reduction:</span>
                        <span className="font-medium text-green-400">95% fewer errors</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Dispute Rate:</span>
                        <span className="font-medium">1.2%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-teal-400" />
                      Partner Satisfaction
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Satisfaction Score:</span>
                        <span className="font-medium">94.7%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Improvement:</span>
                        <span className="font-medium text-green-400">+19%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Response Time:</span>
                        <span className="font-medium">&lt; 24 hours</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Strategic Impact */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 backdrop-blur-sm border border-emerald-500/20 rounded-3xl p-8"
            >
              <h2 className="text-2xl font-bold mb-6 text-emerald-400">Commission Optimization Excellence & Strategic Impact</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-emerald-400 mb-2">{formatCurrency(commissionMetrics.totalCommissionPool)}</div>
                  <div className="text-sm text-gray-300">Annual Commission Pool Management</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">+{formatPercent(commissionMetrics.performanceImprovement)}</div>
                  <div className="text-sm text-gray-300">Partner Performance Improvement</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-teal-400 mb-2">{formatPercent(commissionMetrics.automationEfficiency)}</div>
                  <div className="text-sm text-gray-300">Automation & Processing Efficiency</div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}
