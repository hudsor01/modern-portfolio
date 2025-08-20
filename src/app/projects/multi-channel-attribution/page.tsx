'use client'

import { useState, useEffect } from 'react'
import {
  ArrowLeft,
  RefreshCcw,
  TrendingUp,
  Target,
  DollarSign,
  Eye,
  Share2,
} from 'lucide-react'
import Link from 'next/link'
import { m as motion } from 'framer-motion'
import AttributionModelChart from './AttributionModelChart'
import CustomerJourneyChart from './CustomerJourneyChart'
import ChannelROIChart from './ChannelROIChart'
import TouchpointAnalysisChart from './TouchpointAnalysisChart'

// Multi-channel attribution metrics
const attributionMetrics = {
  totalConversions: 8247,
  attributionAccuracy: 92.4,
  totalROI: 2300000,
  conversionLift: 47.8,
  avgTouchpoints: 7.3,
  totalChannels: 12,
  customersAnalyzed: 45670,
  journeyLength: 28.4
}

const attributionModels = [
  { model: 'First-Touch', accuracy: 68.2, conversions: 1456, roi: 340000 },
  { model: 'Last-Touch', accuracy: 72.4, conversions: 1823, roi: 420000 },
  { model: 'Linear', accuracy: 78.9, conversions: 2104, roi: 580000 },
  { model: 'Time-Decay', accuracy: 84.6, conversions: 2456, roi: 720000 },
  { model: 'Position-Based', accuracy: 87.3, conversions: 2698, roi: 840000 },
  { model: 'Data-Driven (ML)', accuracy: 92.4, conversions: 2847, roi: 1200000 },
]

const channelPerformance = [
  { 
    channel: 'Paid Search', 
    touchpoints: 12450, 
    conversions: 1847, 
    cost: 285000, 
    revenue: 2340000, 
    roi: 8.2,
    attribution: 22.4 
  },
  { 
    channel: 'Social Media', 
    touchpoints: 8920, 
    conversions: 1234, 
    cost: 180000, 
    revenue: 1560000, 
    roi: 8.7,
    attribution: 15.0 
  },
  { 
    channel: 'Email Marketing', 
    touchpoints: 15670, 
    conversions: 2104, 
    cost: 95000, 
    revenue: 2850000, 
    roi: 30.0,
    attribution: 25.5 
  },
  { 
    channel: 'Direct Traffic', 
    touchpoints: 6890, 
    conversions: 987, 
    cost: 0, 
    revenue: 1890000, 
    roi: 999,
    attribution: 12.0 
  },
  { 
    channel: 'Display Ads', 
    touchpoints: 9540, 
    conversions: 756, 
    cost: 220000, 
    revenue: 980000, 
    roi: 4.5,
    attribution: 9.2 
  },
  { 
    channel: 'Organic Search', 
    touchpoints: 11230, 
    conversions: 1456, 
    cost: 65000, 
    revenue: 2200000, 
    roi: 33.8,
    attribution: 17.7 
  },
]

const customerJourneyStages = [
  { stage: 'Awareness', touchpoints: 45670, channels: 8, avgTime: 0, conversionRate: 18.5 },
  { stage: 'Interest', touchpoints: 8447, channels: 6, avgTime: 3.2, conversionRate: 34.2 },
  { stage: 'Consideration', touchpoints: 2889, channels: 5, avgTime: 12.8, conversionRate: 52.7 },
  { stage: 'Intent', touchpoints: 1523, channels: 4, avgTime: 21.4, conversionRate: 68.9 },
  { stage: 'Purchase', touchpoints: 1049, channels: 3, avgTime: 28.4, conversionRate: 78.6 },
  { stage: 'Retention', touchpoints: 825, channels: 4, avgTime: 45.2, conversionRate: 89.3 },
]

export default function MultiChannelAttribution() {
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
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
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
              {['overview', 'models', 'journeys', 'channels'].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 capitalize ${
                    activeTab === tab 
                      ? 'bg-orange-500 text-white shadow-lg' 
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
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent mb-3">
            Multi-Channel Attribution Analytics Dashboard
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl mb-4">
            Advanced marketing attribution analytics platform using machine learning models to track customer journeys across 12+ touchpoints. Delivering 92.4% attribution accuracy and $2.3M ROI optimization through data-driven attribution modeling and cross-channel insights.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full">Attribution Accuracy: 92.4%</span>
            <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full">ROI Optimization: {formatCurrency(attributionMetrics.totalROI)}</span>
            <span className="bg-pink-500/20 text-pink-400 px-3 py-1 rounded-full">ML Attribution Models</span>
            <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full">Customer Journey Analytics</span>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-orange-500/20 rounded-full" />
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-orange-500 rounded-full animate-spin border-t-transparent" />
            </div>
          </div>
        ) : (
          <>
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Total Conversions */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-orange-500/20 rounded-2xl">
                      <Target className="h-6 w-6 text-orange-400" />
                    </div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Conversions</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">
                    {attributionMetrics.totalConversions.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-400 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    +{formatPercent(attributionMetrics.conversionLift)} lift
                  </p>
                </div>
              </motion.div>

              {/* Attribution Accuracy */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-red-500/20 rounded-2xl">
                      <Eye className="h-6 w-6 text-red-400" />
                    </div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Accuracy</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">
                    {formatPercent(attributionMetrics.attributionAccuracy)}
                  </p>
                  <p className="text-sm text-gray-400">ML Model Performance</p>
                </div>
              </motion.div>

              {/* Total Channels */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-pink-500/20 rounded-2xl">
                      <Share2 className="h-6 w-6 text-pink-400" />
                    </div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Channels</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">
                    {attributionMetrics.totalChannels}
                  </p>
                  <p className="text-sm text-gray-400">{attributionMetrics.avgTouchpoints.toFixed(1)} avg touchpoints</p>
                </div>
              </motion.div>

              {/* ROI Optimization */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-amber-500/20 rounded-2xl">
                      <DollarSign className="h-6 w-6 text-amber-400" />
                    </div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">ROI Impact</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">
                    {formatCurrency(attributionMetrics.totalROI)}
                  </p>
                  <p className="text-sm text-gray-400">Optimization Value</p>
                </div>
              </motion.div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Attribution Model Comparison */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300"
                >
                  <div className="mb-4">
                    <h2 className="text-xl font-bold mb-1">Attribution Model Performance Comparison</h2>
                    <p className="text-sm text-gray-400">ML-driven data attribution vs traditional models showing 92.4% accuracy improvement</p>
                  </div>
                  <div className="h-[250px]">
                    <AttributionModelChart />
                  </div>
                </motion.div>

                {/* Channel ROI Analysis */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300"
                >
                  <div className="mb-4">
                    <h2 className="text-xl font-bold mb-1">Cross-Channel ROI & Attribution Analysis</h2>
                    <p className="text-sm text-gray-400">Multi-touch attribution revealing true channel performance and investment optimization</p>
                  </div>
                  <div className="h-[250px]">
                    <ChannelROIChart />
                  </div>
                </motion.div>
              </div>
            )}

            {activeTab === 'models' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300 mb-8"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-bold mb-1">Attribution Model Performance & ROI Comparison</h2>
                  <p className="text-sm text-gray-400">Comprehensive analysis of attribution methodologies from traditional to machine learning approaches</p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 font-semibold">Attribution Model</th>
                        <th className="text-left py-3 px-4 font-semibold">Accuracy</th>
                        <th className="text-left py-3 px-4 font-semibold">Conversions</th>
                        <th className="text-left py-3 px-4 font-semibold">Attributed ROI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attributionModels.map((model, index) => (
                        <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4 font-medium">{model.model}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              model.accuracy >= 90 ? 'bg-green-500/20 text-green-400' :
                              model.accuracy >= 80 ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {formatPercent(model.accuracy)}
                            </span>
                          </td>
                          <td className="py-4 px-4">{model.conversions.toLocaleString()}</td>
                          <td className="py-4 px-4">{formatCurrency(model.roi)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'journeys' && (
              <div className="space-y-6 mb-8">
                {/* Customer Journey Visualization */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300"
                >
                  <div className="mb-4">
                    <h2 className="text-xl font-bold mb-1">Customer Journey Stage Analysis</h2>
                    <p className="text-sm text-gray-400">Multi-touchpoint customer journey mapping with conversion optimization insights</p>
                  </div>
                  <div className="h-[250px]">
                    <CustomerJourneyChart />
                  </div>
                </motion.div>

                {/* Journey Stages Details */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300"
                >
                  <div className="mb-4">
                    <h2 className="text-xl font-bold mb-1">Journey Stage Performance Metrics</h2>
                    <p className="text-sm text-gray-400">Detailed conversion funnel analysis with touchpoint optimization opportunities</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {customerJourneyStages.map((stage, index) => (
                      <div key={index} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                        <h3 className="text-base font-semibold mb-3">{stage.stage}</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Touchpoints:</span>
                            <span className="font-medium">{stage.touchpoints.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Channels:</span>
                            <span className="font-medium">{stage.channels}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Avg Time:</span>
                            <span className="font-medium">{stage.avgTime} days</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Conversion:</span>
                            <span className="font-medium">{formatPercent(stage.conversionRate)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}

            {activeTab === 'channels' && (
              <div className="space-y-6 mb-8">
                {/* Touchpoint Analysis */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300"
                >
                  <div className="mb-4">
                    <h2 className="text-xl font-bold mb-1">Multi-Touch Attribution & Channel Performance</h2>
                    <p className="text-sm text-gray-400">Advanced touchpoint analysis revealing true cross-channel contribution and ROI optimization</p>
                  </div>
                  <div className="h-[250px]">
                    <TouchpointAnalysisChart />
                  </div>
                </motion.div>

                {/* Channel Performance Table */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300"
                >
                  <div className="mb-4">
                    <h2 className="text-xl font-bold mb-1">Channel Attribution & ROI Performance</h2>
                    <p className="text-sm text-gray-400">Comprehensive channel analysis with multi-touch attribution insights and investment optimization</p>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-3 px-4 font-semibold">Channel</th>
                          <th className="text-left py-3 px-4 font-semibold">Touchpoints</th>
                          <th className="text-left py-3 px-4 font-semibold">Conversions</th>
                          <th className="text-left py-3 px-4 font-semibold">Cost</th>
                          <th className="text-left py-3 px-4 font-semibold">Revenue</th>
                          <th className="text-left py-3 px-4 font-semibold">ROI</th>
                          <th className="text-left py-3 px-4 font-semibold">Attribution %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {channelPerformance.map((channel, index) => (
                          <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="py-4 px-4 font-medium">{channel.channel}</td>
                            <td className="py-4 px-4">{channel.touchpoints.toLocaleString()}</td>
                            <td className="py-4 px-4">{channel.conversions.toLocaleString()}</td>
                            <td className="py-4 px-4">{formatCurrency(channel.cost)}</td>
                            <td className="py-4 px-4">{formatCurrency(channel.revenue)}</td>
                            <td className="py-4 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                channel.roi >= 20 ? 'bg-green-500/20 text-green-400' :
                                channel.roi >= 10 ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {channel.roi === 999 ? '∞' : `${channel.roi.toFixed(1)}x`}
                              </span>
                            </td>
                            <td className="py-4 px-4">{formatPercent(channel.attribution)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Strategic Impact */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-sm border border-orange-500/20 rounded-3xl p-6"
            >
              <h2 className="text-xl font-bold mb-4 text-orange-400">Multi-Channel Attribution Intelligence & Marketing ROI Impact</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-orange-400 mb-1">92.4%</div>
                  <div className="text-xs text-gray-300">ML Attribution Accuracy (Traditional: 65-75%)</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-red-400 mb-1">{formatCurrency(attributionMetrics.totalROI)}</div>
                  <div className="text-xs text-gray-300">Marketing ROI Optimization Value</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-pink-400 mb-1">+47.8%</div>
                  <div className="text-xs text-gray-300">Conversion Lift Through Attribution Insights</div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}
