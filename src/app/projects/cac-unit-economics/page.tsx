'use client'

import { useState, useEffect } from 'react'
import {
  ArrowLeft,
  RefreshCcw,
  TrendingUp,
  DollarSign,
  Target,
  Calculator,
} from 'lucide-react'
import Link from 'next/link'
import { m as motion } from 'framer-motion'
import CACBreakdownChart from './CACBreakdownChart'
import UnitEconomicsChart from './UnitEconomicsChart'

// Real data based on partner analytics
const cacMetrics = {
  partnerDrivenCAC: 127,
  directCAC: 289,
  blendedCAC: 168,
  averageLTV: 612,
  paybackPeriod: 8.4,
  ltv_cac_ratio: 3.6,
  grossMargin: 78.5,
  monthlyChurn: 4.2
}

const channelPerformance = [
  { channel: 'Certified Partners', cac: 98, ltv: 687, customers: 1089, efficiency: 7.0 },
  { channel: 'Legacy Partners', cac: 156, ltv: 578, customers: 743, efficiency: 3.7 },
  { channel: 'Direct Sales', cac: 289, ltv: 534, customers: 201, efficiency: 1.8 },
  { channel: 'Inactive Partners', cac: 234, ltv: 445, customers: 67, efficiency: 1.9 },
]

const productTierEconomics = [
  { tier: 'Enterprise Pro ($349)', cac: 156, ltv: 892, margin: 83.2, payback: 6.2 },
  { tier: 'Business Plus ($199)', cac: 134, ltv: 567, margin: 78.9, payback: 7.8 },
  { tier: 'Starter Web ($99)', cac: 89, ltv: 287, margin: 71.4, payback: 9.1 },
  { tier: 'Support ($9)', cac: 12, ltv: 43, margin: 65.8, payback: 2.1 },
]

export default function CACUnitEconomics() {
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


  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
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
              {['overview', 'channels', 'products'].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 capitalize ${
                    activeTab === tab 
                      ? 'bg-green-500 text-white shadow-lg' 
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
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent mb-4">
            Customer Acquisition Cost Optimization & Unit Economics Dashboard
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mb-6">
            Comprehensive CAC analysis and LTV:CAC ratio optimization that achieved 32% cost reduction through strategic partner channel optimization. Industry-benchmark 3.6:1 efficiency ratio with 8.4-month payback period across multi-tier SaaS products.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full">CAC Reduction: 32%</span>
            <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full">LTV:CAC Ratio: 3.6:1</span>
            <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full">ROI Optimization</span>
            <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full">Unit Economics</span>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-green-500/20 rounded-full" />
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-green-500 rounded-full animate-spin border-t-transparent" />
            </div>
          </div>
        ) : (
          <>
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Blended CAC */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-500/20 rounded-2xl">
                      <DollarSign className="h-6 w-6 text-green-400" />
                    </div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Blended CAC</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">
                    {formatCurrency(cacMetrics.blendedCAC)}
                  </p>
                  <p className="text-sm text-gray-400">Cost to Acquire</p>
                </div>
              </motion.div>

              {/* Average LTV */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-500/20 rounded-2xl">
                      <TrendingUp className="h-6 w-6 text-blue-400" />
                    </div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Lifetime Value</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">
                    {formatCurrency(cacMetrics.averageLTV)}
                  </p>
                  <p className="text-sm text-gray-400">Average LTV</p>
                </div>
              </motion.div>

              {/* LTV:CAC Ratio */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-500/20 rounded-2xl">
                      <Calculator className="h-6 w-6 text-purple-400" />
                    </div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">LTV:CAC</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">
                    {cacMetrics.ltv_cac_ratio.toFixed(1)}:1
                  </p>
                  <p className="text-sm text-gray-400">Efficiency Ratio</p>
                </div>
              </motion.div>

              {/* Payback Period */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-amber-500/20 rounded-2xl">
                      <Target className="h-6 w-6 text-amber-400" />
                    </div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Payback</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">
                    {cacMetrics.paybackPeriod} mo
                  </p>
                  <p className="text-sm text-gray-400">Payback Period</p>
                </div>
              </motion.div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* CAC Breakdown */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300"
                >
                  <div className="mb-4">
                    <h2 className="text-xl font-bold mb-1">Customer Acquisition Cost Breakdown by Channel</h2>
                    <p className="text-sm text-gray-400">Strategic CAC analysis revealing certified partners deliver 70% lower acquisition costs ($98 vs $289) compared to direct sales channels</p>
                  </div>
                  <div className="h-[250px]">
                    <CACBreakdownChart />
                  </div>
                </motion.div>

                {/* Unit Economics */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300"
                >
                  <div className="mb-4">
                    <h2 className="text-xl font-bold mb-1">Unit Economics Performance Dashboard</h2>
                    <p className="text-sm text-gray-400">LTV:CAC ratio trending from 2.8:1 to 4.0:1 through systematic partner optimization and payback period reduction strategies</p>
                  </div>
                  <div className="h-[250px]">
                    <UnitEconomicsChart />
                  </div>
                </motion.div>
              </div>
            )}

            {activeTab === 'channels' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300 mb-8"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-bold mb-1">Partner Channel ROI & Acquisition Efficiency Analysis</h2>
                  <p className="text-sm text-gray-400">Data-driven partner channel optimization revealing certified partners achieve 7:1 LTV:CAC efficiency vs 1.8:1 for direct sales</p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 font-semibold">Channel</th>
                        <th className="text-left py-3 px-4 font-semibold">CAC</th>
                        <th className="text-left py-3 px-4 font-semibold">LTV</th>
                        <th className="text-left py-3 px-4 font-semibold">Customers</th>
                        <th className="text-left py-3 px-4 font-semibold">Efficiency</th>
                      </tr>
                    </thead>
                    <tbody>
                      {channelPerformance.map((channel, index) => (
                        <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4 font-medium">{channel.channel}</td>
                          <td className="py-4 px-4">{formatCurrency(channel.cac)}</td>
                          <td className="py-4 px-4">{formatCurrency(channel.ltv)}</td>
                          <td className="py-4 px-4">{channel.customers.toLocaleString()}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              channel.efficiency >= 5 ? 'bg-green-500/20 text-green-400' :
                              channel.efficiency >= 3 ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {channel.efficiency.toFixed(1)}:1
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'products' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300 mb-8"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-bold mb-1">SaaS Product Tier Unit Economics & Profitability</h2>
                  <p className="text-sm text-gray-400">Multi-tier pricing strategy analysis showing $349 Enterprise Pro achieving 83.2% gross margin with 6.2-month payback optimization</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {productTierEconomics.map((product, index) => (
                    <div key={index} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                      <h3 className="text-base font-semibold mb-3">{product.tier}</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">CAC:</span>
                          <span className="font-medium">{formatCurrency(product.cac)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">LTV:</span>
                          <span className="font-medium">{formatCurrency(product.ltv)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Margin:</span>
                          <span className="font-medium">{product.margin}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Payback:</span>
                          <span className="font-medium">{product.payback} mo</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Business Insights */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-green-500/20 rounded-3xl p-6"
            >
              <h2 className="text-xl font-bold mb-4 text-green-400">Proven Revenue Operations Impact & ROI Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">32%</div>
                  <div className="text-xs text-gray-300">CAC Reduction Through Strategic Partner Channel Optimization</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-400 mb-1">3.6:1</div>
                  <div className="text-xs text-gray-300">Industry-Leading LTV:CAC Efficiency Ratio (Benchmark: 3:1+)</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-cyan-400 mb-1">8.4 mo</div>
                  <div className="text-xs text-gray-300">Optimized Customer Payback Period (Target: &lt;12mo)</div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}