'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
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

// Lazy-load chart components with Suspense fallback
const AttributionModelChart = dynamic(() => import('./AttributionModelChart'), {
  loading: () => <div className="h-[350px] w-full animate-pulse bg-muted rounded-lg" />,
  ssr: true
})
const CustomerJourneyChart = dynamic(() => import('./CustomerJourneyChart'), {
  loading: () => <div className="h-[350px] w-full animate-pulse bg-muted rounded-lg" />,
  ssr: true
})
const ChannelROIChart = dynamic(() => import('./ChannelROIChart'), {
  loading: () => <div className="h-[350px] w-full animate-pulse bg-muted rounded-lg" />,
  ssr: true
})
const TouchpointAnalysisChart = dynamic(() => import('./TouchpointAnalysisChart'), {
  loading: () => <div className="h-[350px] w-full animate-pulse bg-muted rounded-lg" />,
  ssr: true
})

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
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-destructive rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
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
              {['overview', 'models', 'journeys', 'channels'].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 capitalize ${
                    activeTab === tab 
                      ? 'bg-orange-500 text-foreground shadow-lg' 
                      : 'text-muted-foreground hover:text-white hover:bg-white/10'
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
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent mb-3">
            Multi-Channel Attribution Analytics Dashboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mb-4">
            Advanced marketing attribution analytics platform using machine learning models to track customer journeys across 12+ touchpoints. Delivering 92.4% attribution accuracy and $2.3M ROI optimization through data-driven attribution modeling and cross-channel insights.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full">Attribution Accuracy: 92.4%</span>
            <span className="bg-destructive/20 text-destructive px-3 py-1 rounded-full">ROI Optimization: {formatCurrency(attributionMetrics.totalROI)}</span>
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
                <div className="relative glass-interactive rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-orange-500/20 rounded-2xl">
                      <Target className="h-6 w-6 text-orange-400" />
                    </div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Conversions</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">
                    {attributionMetrics.totalConversions.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-success" />
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
                <div className="relative glass-interactive rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-destructive/20 rounded-2xl">
                      <Eye className="h-6 w-6 text-destructive" />
                    </div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Accuracy</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">
                    {formatPercent(attributionMetrics.attributionAccuracy)}
                  </p>
                  <p className="text-sm text-muted-foreground">ML Model Performance</p>
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
                <div className="relative glass-interactive rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-pink-500/20 rounded-2xl">
                      <Share2 className="h-6 w-6 text-pink-400" />
                    </div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Channels</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">
                    {attributionMetrics.totalChannels}
                  </p>
                  <p className="text-sm text-muted-foreground">{attributionMetrics.avgTouchpoints.toFixed(1)} avg touchpoints</p>
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
                <div className="relative glass-interactive rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-amber-500/20 rounded-2xl">
                      <DollarSign className="h-6 w-6 text-amber-400" />
                    </div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">ROI Impact</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">
                    {formatCurrency(attributionMetrics.totalROI)}
                  </p>
                  <p className="text-sm text-muted-foreground">Optimization Value</p>
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
                  className="glass rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300"
                >
                  <div className="mb-4">
                    <h2 className="text-xl font-bold mb-1">Attribution Model Performance Comparison</h2>
                    <p className="text-sm text-muted-foreground">ML-driven data attribution vs traditional models showing 92.4% accuracy improvement</p>
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
                  className="glass rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300"
                >
                  <div className="mb-4">
                    <h2 className="text-xl font-bold mb-1">Cross-Channel ROI & Attribution Analysis</h2>
                    <p className="text-sm text-muted-foreground">Multi-touch attribution revealing true channel performance and investment optimization</p>
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
                className="glass rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300 mb-8"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-bold mb-1">Attribution Model Performance & ROI Comparison</h2>
                  <p className="text-sm text-muted-foreground">Comprehensive analysis of attribution methodologies from traditional to machine learning approaches</p>
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
                              model.accuracy >= 90 ? 'bg-success/20 text-success' :
                              model.accuracy >= 80 ? 'bg-warning/20 text-warning' :
                              'bg-destructive/20 text-destructive'
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
                  className="glass rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300"
                >
                  <div className="mb-4">
                    <h2 className="text-xl font-bold mb-1">Customer Journey Stage Analysis</h2>
                    <p className="text-sm text-muted-foreground">Multi-touchpoint customer journey mapping with conversion optimization insights</p>
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
                  className="glass rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300"
                >
                  <div className="mb-4">
                    <h2 className="text-xl font-bold mb-1">Journey Stage Performance Metrics</h2>
                    <p className="text-sm text-muted-foreground">Detailed conversion funnel analysis with touchpoint optimization opportunities</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {customerJourneyStages.map((stage, index) => (
                      <div key={index} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                        <h3 className="text-base font-semibold mb-3">{stage.stage}</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Touchpoints:</span>
                            <span className="font-medium">{stage.touchpoints.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Channels:</span>
                            <span className="font-medium">{stage.channels}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Avg Time:</span>
                            <span className="font-medium">{stage.avgTime} days</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Conversion:</span>
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
                  className="glass rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300"
                >
                  <div className="mb-4">
                    <h2 className="text-xl font-bold mb-1">Multi-Touch Attribution & Channel Performance</h2>
                    <p className="text-sm text-muted-foreground">Advanced touchpoint analysis revealing true cross-channel contribution and ROI optimization</p>
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
                  className="glass rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300"
                >
                  <div className="mb-4">
                    <h2 className="text-xl font-bold mb-1">Channel Attribution & ROI Performance</h2>
                    <p className="text-sm text-muted-foreground">Comprehensive channel analysis with multi-touch attribution insights and investment optimization</p>
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
                                channel.roi >= 20 ? 'bg-success/20 text-success' :
                                channel.roi >= 10 ? 'bg-warning/20 text-warning' :
                                'bg-destructive/20 text-destructive'
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
                <div className="glass rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-orange-400 mb-1">92.4%</div>
                  <div className="text-xs text-muted-foreground">ML Attribution Accuracy (Traditional: 65-75%)</div>
                </div>
                <div className="glass rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-destructive mb-1">{formatCurrency(attributionMetrics.totalROI)}</div>
                  <div className="text-xs text-muted-foreground">Marketing ROI Optimization Value</div>
                </div>
                <div className="glass rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-pink-400 mb-1">+47.8%</div>
                  <div className="text-xs text-muted-foreground">Conversion Lift Through Attribution Insights</div>
                </div>
              </div>
            </motion.div>

            {/* Professional Narrative Sections */}
            <div className="space-y-12 mt-12">
              {/* Project Overview */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
                className="glass rounded-3xl p-8"
              >
                <h2 className="text-2xl font-bold mb-6 text-primary">Project Overview</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="text-lg leading-relaxed">
                    Engineered an advanced multi-channel attribution system using machine learning to accurately measure the cross-channel impact of marketing efforts, enabling sophisticated budget optimization and campaign strategy refinement.
                  </p>
                  <p className="leading-relaxed">
                    This system evolved beyond traditional attribution models to provide AI-powered insights into channel interactions, customer journey patterns, and optimal budget allocation strategies that drove significant improvements in marketing efficiency and ROI.
                  </p>
                </div>
              </motion.div>

              {/* Challenge */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
                className="glass rounded-3xl p-8"
              >
                <h2 className="text-2xl font-bold mb-6 text-amber-400">Challenge</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="leading-relaxed">
                    Traditional attribution models were failing to capture the complex interactions between channels in an increasingly sophisticated multi-channel marketing environment:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Linear and time-decay models underestimated the synergy effects between channels</li>
                    <li>Cross-device customer journeys created attribution gaps and double-counting issues</li>
                    <li>Campaign optimization decisions were based on incomplete channel interaction data</li>
                    <li>Budget allocation models couldn't account for diminishing returns and channel saturation</li>
                    <li>No way to predict the impact of budget shifts across different channel combinations</li>
                    <li>Marketing mix modeling was reactive, not predictive for strategic planning</li>
                  </ul>
                  <p className="leading-relaxed">
                    With 12 active marketing channels, complex B2B customer journeys, and a $3.2M annual marketing budget, the organization needed a sophisticated attribution solution that could handle multi-channel complexity.
                  </p>
                </div>
              </motion.div>

              {/* Solution */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="glass rounded-3xl p-8"
              >
                <h2 className="text-2xl font-bold mb-6 text-success">Solution</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="leading-relaxed">
                    Developed a machine learning-powered multi-channel attribution platform that uses advanced algorithms to understand channel interactions and predict optimal marketing strategies:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <h3 className="font-semibold text-primary mb-3">ML Attribution Engine</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Algorithmic attribution using ensemble machine learning models</li>
                        <li>Cross-channel interaction analysis and synergy quantification</li>
                        <li>Probabilistic customer journey reconstruction across devices</li>
                        <li>Dynamic attribution weights based on conversion likelihood</li>
                        <li>Incremental lift testing and media mix optimization</li>
                      </ul>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <h3 className="font-semibold text-success mb-3">Predictive Analytics</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Budget optimization recommendations with scenario modeling</li>
                        <li>Channel saturation curves and diminishing returns analysis</li>
                        <li>Predictive conversion probability scoring</li>
                        <li>Real-time campaign performance monitoring and alerts</li>
                        <li>Automated insights generation and actionable recommendations</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Results & Impact */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.3 }}
                className="glass rounded-3xl p-8"
              >
                <h2 className="text-2xl font-bold mb-6 text-emerald-400">Results & Impact</h2>
                <div className="space-y-6 text-muted-foreground">
                  <p className="leading-relaxed">
                    The ML-powered attribution system delivered unprecedented insights into channel performance and enabled data-driven optimizations that significantly improved marketing efficiency:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-sm border border-primary/20 rounded-2xl p-6 text-center">
                      <div className="text-3xl font-bold text-primary mb-2">92.4%</div>
                      <div className="text-sm text-muted-foreground">ML Attribution Accuracy</div>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-secondary/20 rounded-2xl p-6 text-center">
                      <div className="text-3xl font-bold text-secondary mb-2">47.8%</div>
                      <div className="text-sm text-muted-foreground">Conversion Rate Improvement</div>
                    </div>
                    <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm border border-primary/20 rounded-2xl p-6 text-center">
                      <div className="text-3xl font-bold text-primary mb-2">{formatCurrency(attributionMetrics.totalROI)}</div>
                      <div className="text-sm text-muted-foreground">Marketing ROI Optimization</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-emerald-400">Quantified Business Outcomes:</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Discovered channel synergy effects worth $890K annually in previously hidden value</li>
                      <li>Reduced customer acquisition cost by 31% through optimized channel mix allocation</li>
                      <li>Increased marketing qualified leads by 38% with same budget through reallocation</li>
                      <li>Improved campaign ROI prediction accuracy from 67% to 92.4% using ML models</li>
                      <li>Identified optimal budget allocation across 12 channels saving $640K annually</li>
                      <li>Reduced attribution analysis time from 3 days to 2 hours with automated insights</li>
                      <li>Enabled predictive budget planning with 85% accuracy for quarterly forecasts</li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Key Learnings */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.4 }}
                className="glass rounded-3xl p-8"
              >
                <h2 className="text-2xl font-bold mb-6 text-purple-400">Key Learnings</h2>
                <div className="space-y-4 text-muted-foreground">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h3 className="font-semibold text-purple-400">Advanced Attribution Insights</h3>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>Machine learning attribution significantly outperforms rule-based models in complex environments</li>
                        <li>Channel synergy effects can account for 20-30% of total conversion value</li>
                        <li>Cross-device attribution requires probabilistic modeling, not deterministic matching</li>
                        <li>Budget saturation curves vary dramatically by channel and require individual optimization</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-semibold text-primary">Implementation Excellence</h3>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>Model interpretability is crucial for marketing team adoption and trust</li>
                        <li>Real-time attribution enables agile campaign optimization and budget shifts</li>
                        <li>Automated insights generation scales attribution analysis across large channel portfolios</li>
                        <li>Predictive capabilities transform attribution from reporting to strategic planning tool</li>
                      </ul>
                    </div>
                  </div>
                  <p className="leading-relaxed mt-4">
                    This project established that advanced attribution modeling is not just about measurement—it's about enabling predictive marketing intelligence that can guide strategic decisions and optimize performance before campaigns even launch.
                  </p>
                </div>
              </motion.div>

              {/* Technologies Used */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.5 }}
                className="bg-gradient-to-br from-gray-500/10 to-slate-500/10 backdrop-blur-sm border border-border/20 rounded-3xl p-8"
              >
                <h2 className="text-2xl font-bold mb-6 text-muted-foreground">Technologies Used</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    'React 19', 'TypeScript', 'Machine Learning', 'Attribution Modeling',
                    'Cross-Channel Analytics', 'Predictive Modeling', 'Budget Optimization', 'Marketing Mix Modeling',
                    'Customer Journey Analytics', 'Conversion Optimization', 'AI-Powered Insights', 'Performance Analytics'
                  ].map((tech, index) => (
                    <span key={index} className="bg-white/10 text-muted-foreground px-3 py-2 rounded-lg text-sm text-center border border-white/20 hover:bg-white/20 transition-colors">
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
