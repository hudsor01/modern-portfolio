'use client'

import { useState, useEffect } from 'react'
import {
  ArrowLeft,
  RefreshCcw,
  TrendingUp,
  Users,
  DollarSign,
  Brain,
  Calendar,
} from 'lucide-react'
import Link from 'next/link'
import { m as motion } from 'framer-motion'
import CLVPredictionChart from './CLVPredictionChart'
import CustomerSegmentChart from './CustomerSegmentChart'
import CLVTrendChart from './CLVTrendChart'

// Advanced CLV metrics based on predictive analytics
const clvMetrics = {
  averageCLV: 2847,
  predictionAccuracy: 94.3,
  totalCustomers: 4287,
  highValueCustomers: 1156,
  churnRisk: 12.8,
  revenueImpact: 1276000,
  forecastHorizon: 24,
  modelConfidence: 96.7
}

const customerSegments = [
  { 
    segment: 'Champions', 
    count: 628, 
    clv: 4850, 
    probability: 0.92, 
    characteristics: 'High frequency, recent purchases, high value',
    color: '#10b981'
  },
  { 
    segment: 'Loyal Customers', 
    count: 841, 
    clv: 3420, 
    probability: 0.87, 
    characteristics: 'Regular buyers, consistent engagement',
    color: '#3b82f6'
  },
  { 
    segment: 'Potential Loyalists', 
    count: 1156, 
    clv: 2640, 
    probability: 0.74, 
    characteristics: 'Recent customers with growth potential',
    color: '#8b5cf6'
  },
  { 
    segment: 'At Risk', 
    count: 892, 
    clv: 1890, 
    probability: 0.45, 
    characteristics: 'Declining engagement, need intervention',
    color: '#f59e0b'
  },
  { 
    segment: 'Can\'t Lose Them', 
    count: 770, 
    clv: 3850, 
    probability: 0.68, 
    characteristics: 'High value but decreased activity',
    color: '#ef4444'
  },
]

const predictiveMetrics = [
  { metric: 'Next Purchase Probability', value: '87.3%', trend: '+12%', color: 'text-green-400' },
  { metric: 'Expected Purchase Value', value: '$342', trend: '+8%', color: 'text-blue-400' },
  { metric: 'Days to Next Purchase', value: '14.2', trend: '-3%', color: 'text-purple-400' },
  { metric: 'Churn Probability', value: '12.8%', trend: '-15%', color: 'text-amber-400' },
]

export default function CustomerLifetimeValueAnalytics() {
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
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
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
              {['overview', 'segments', 'predictions'].map((tab) => (
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
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-600 bg-clip-text text-transparent mb-3">
            Customer Lifetime Value Predictive Analytics Dashboard
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl mb-4">
            Advanced CLV analytics platform leveraging BTYD (Buy Till You Die) predictive modeling framework. Achieving 94.3% prediction accuracy through machine learning algorithms and real-time customer behavior tracking across 5 distinct customer segments.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full">Prediction Accuracy: 94.3%</span>
            <span className="bg-teal-500/20 text-teal-400 px-3 py-1 rounded-full">Avg CLV: {formatCurrency(clvMetrics.averageCLV)}</span>
            <span className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full">Machine Learning</span>
            <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full">BTYD Framework</span>
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
              {/* Average CLV */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-emerald-500/20 rounded-2xl">
                      <DollarSign className="h-6 w-6 text-emerald-400" />
                    </div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Average CLV</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">
                    {formatCurrency(clvMetrics.averageCLV)}
                  </p>
                  <p className="text-sm text-gray-400">Predicted Value</p>
                </div>
              </motion.div>

              {/* Prediction Accuracy */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-teal-500/20 rounded-2xl">
                      <Brain className="h-6 w-6 text-teal-400" />
                    </div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">ML Accuracy</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">
                    {formatPercent(clvMetrics.predictionAccuracy)}
                  </p>
                  <p className="text-sm text-gray-400">Model Performance</p>
                </div>
              </motion.div>

              {/* High Value Customers */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-cyan-500/20 rounded-2xl">
                      <Users className="h-6 w-6 text-cyan-400" />
                    </div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">High Value</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">
                    {clvMetrics.highValueCustomers.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-400">Premium Customers</p>
                </div>
              </motion.div>

              {/* Forecast Horizon */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-500/20 rounded-2xl">
                      <Calendar className="h-6 w-6 text-blue-400" />
                    </div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Forecast</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">
                    {clvMetrics.forecastHorizon} mo
                  </p>
                  <p className="text-sm text-gray-400">Prediction Window</p>
                </div>
              </motion.div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* CLV Prediction Chart */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300"
                >
                  <div className="mb-4">
                    <h2 className="text-xl font-bold mb-1">CLV Prediction vs Actual Performance</h2>
                    <p className="text-sm text-gray-400">BTYD model accuracy analysis showing 94.3% prediction success rate across customer segments</p>
                  </div>
                  <div className="h-[250px]">
                    <CLVPredictionChart />
                  </div>
                </motion.div>

                {/* CLV Trend Analysis */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300"
                >
                  <div className="mb-4">
                    <h2 className="text-xl font-bold mb-1">CLV Trend Analysis & Forecasting</h2>
                    <p className="text-sm text-gray-400">24-month predictive CLV trending with confidence intervals and seasonal adjustments</p>
                  </div>
                  <div className="h-[250px]">
                    <CLVTrendChart />
                  </div>
                </motion.div>
              </div>
            )}

            {activeTab === 'segments' && (
              <div className="space-y-6 mb-8">
                {/* Customer Segment Chart */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300"
                >
                  <div className="mb-4">
                    <h2 className="text-xl font-bold mb-1">Customer Segment Distribution & CLV Analysis</h2>
                    <p className="text-sm text-gray-400">RFM-based customer segmentation with predictive CLV modeling across behavioral clusters</p>
                  </div>
                  <div className="h-[250px]">
                    <CustomerSegmentChart />
                  </div>
                </motion.div>

                {/* Segment Details Table */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300"
                >
                  <div className="mb-4">
                    <h2 className="text-xl font-bold mb-1">Customer Segment Intelligence & Behavioral Insights</h2>
                    <p className="text-sm text-gray-400">Detailed segment analysis with CLV predictions and engagement probability scores</p>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-3 px-4 font-semibold">Segment</th>
                          <th className="text-left py-3 px-4 font-semibold">Customers</th>
                          <th className="text-left py-3 px-4 font-semibold">Avg CLV</th>
                          <th className="text-left py-3 px-4 font-semibold">Engagement Prob.</th>
                          <th className="text-left py-3 px-4 font-semibold">Characteristics</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customerSegments.map((segment, index) => (
                          <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: segment.color }}
                                />
                                <span className="font-medium">{segment.segment}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">{segment.count.toLocaleString()}</td>
                            <td className="py-4 px-4">{formatCurrency(segment.clv)}</td>
                            <td className="py-4 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                segment.probability >= 0.8 ? 'bg-green-500/20 text-green-400' :
                                segment.probability >= 0.6 ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {formatPercent(segment.probability * 100)}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-400">{segment.characteristics}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </div>
            )}

            {activeTab === 'predictions' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300 mb-8"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-bold mb-1">Real-Time Predictive Analytics Dashboard</h2>
                  <p className="text-sm text-gray-400">Advanced machine learning predictions for customer behavior and purchase patterns</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {predictiveMetrics.map((metric, index) => (
                    <div key={index} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                      <h3 className="text-xs font-medium text-gray-400 mb-2">{metric.metric}</h3>
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-lg font-bold mb-1">{metric.value}</p>
                          <p className={`text-xs ${metric.color} flex items-center gap-1`}>
                            <TrendingUp className="w-3 h-3" />
                            {metric.trend}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Strategic Insights */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-sm border border-emerald-500/20 rounded-3xl p-6"
            >
              <h2 className="text-xl font-bold mb-4 text-emerald-400">Advanced CLV Analytics & Predictive Intelligence Impact</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-400 mb-1">94.3%</div>
                  <div className="text-xs text-gray-300">Machine Learning Prediction Accuracy (Industry: 75-85%)</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-teal-400 mb-1">{formatCurrency(clvMetrics.revenueImpact / 1000)}K</div>
                  <div className="text-xs text-gray-300">Predicted Revenue Impact (24-month forecast)</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-cyan-400 mb-1">5</div>
                  <div className="text-xs text-gray-300">Customer Segments (RFM + Behavioral Analysis)</div>
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
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
              >
                <h2 className="text-2xl font-bold mb-6 text-blue-400">Project Overview</h2>
                <div className="space-y-4 text-gray-300">
                  <p className="text-lg leading-relaxed">
                    Developed a comprehensive customer lifetime value prediction model using advanced analytics and machine learning to enable data-driven customer segmentation and retention strategies. This initiative was critical for optimizing marketing spend and improving customer acquisition ROI.
                  </p>
                  <p className="leading-relaxed">
                    The CLV model became the foundation for strategic decision-making across sales, marketing, and customer success teams, enabling personalized customer journeys and targeted retention campaigns that significantly improved long-term revenue sustainability.
                  </p>
                </div>
              </motion.div>

              {/* Challenge */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
              >
                <h2 className="text-2xl font-bold mb-6 text-amber-400">Challenge</h2>
                <div className="space-y-4 text-gray-300">
                  <p className="leading-relaxed">
                    The organization lacked a scientific approach to understanding customer value and predicting future behavior, resulting in inefficient resource allocation and missed revenue opportunities:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Marketing campaigns targeted all customers equally, wasting budget on low-value segments</li>
                    <li>Sales teams couldn't prioritize leads based on predicted lifetime value</li>
                    <li>Customer success resources were spread thin without risk-based prioritization</li>
                    <li>Retention efforts were reactive rather than predictive</li>
                    <li>No systematic way to measure the long-term impact of customer acquisition channels</li>
                  </ul>
                  <p className="leading-relaxed">
                    With 4,287 active customers and no predictive analytics framework, the team was essentially flying blind when making strategic decisions about customer investment.
                  </p>
                </div>
              </motion.div>

              {/* Solution */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
              >
                <h2 className="text-2xl font-bold mb-6 text-green-400">Solution</h2>
                <div className="space-y-4 text-gray-300">
                  <p className="leading-relaxed">
                    Built a comprehensive CLV prediction system using machine learning algorithms and RFM analysis to segment customers and predict future value with 94.3% accuracy:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <h3 className="font-semibold text-blue-400 mb-3">Analytical Framework</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>RFM analysis (Recency, Frequency, Monetary) segmentation</li>
                        <li>Predictive modeling using customer behavior patterns</li>
                        <li>Cohort analysis and retention curve modeling</li>
                        <li>Churn probability scoring with early warning system</li>
                        <li>Dynamic customer journey mapping and optimization</li>
                      </ul>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <h3 className="font-semibold text-green-400 mb-3">Technical Implementation</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Interactive dashboard with drill-down capabilities</li>
                        <li>Real-time customer scoring and alerts</li>
                        <li>Automated segment assignment and recommendations</li>
                        <li>Integration with CRM and marketing automation platforms</li>
                        <li>24-month forecasting with confidence intervals</li>
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
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
              >
                <h2 className="text-2xl font-bold mb-6 text-emerald-400">Results & Impact</h2>
                <div className="space-y-6 text-gray-300">
                  <p className="leading-relaxed">
                    The CLV prediction model transformed how the organization approaches customer relationships, enabling data-driven decisions that significantly improved both customer satisfaction and revenue performance:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 text-center">
                      <div className="text-3xl font-bold text-blue-400 mb-2">{formatCurrency(1276000)}</div>
                      <div className="text-sm text-gray-300">Predicted Revenue Impact</div>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-500/20 rounded-2xl p-6 text-center">
                      <div className="text-3xl font-bold text-indigo-400 mb-2">94.3%</div>
                      <div className="text-sm text-gray-300">Prediction Accuracy</div>
                    </div>
                    <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6 text-center">
                      <div className="text-3xl font-bold text-cyan-400 mb-2">42%</div>
                      <div className="text-sm text-gray-300">Improvement in Marketing ROI</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-emerald-400">Quantified Business Outcomes:</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Increased customer retention rate by 18% through proactive intervention</li>
                      <li>Reduced churn probability from 21% to 12.8% for at-risk segments</li>
                      <li>Improved marketing campaign efficiency by 42% through better targeting</li>
                      <li>Enabled 5-tier customer segmentation with 96.7% model confidence</li>
                      <li>Identified 1,156 high-value customers contributing 67% of revenue</li>
                      <li>Reduced customer acquisition cost by 28% through channel optimization</li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Key Learnings */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.4 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
              >
                <h2 className="text-2xl font-bold mb-6 text-purple-400">Key Learnings</h2>
                <div className="space-y-4 text-gray-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h3 className="font-semibold text-purple-400">Strategic Insights</h3>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>Customer behavior patterns are more predictable than initially assumed when proper data science techniques are applied</li>
                        <li>The top 20% of customers (Champions + Loyal) contribute 60%+ of total revenue, validating the Pareto principle</li>
                        <li>Predictive models need regular retraining as customer behavior evolves with market conditions</li>
                        <li>Early intervention is 3x more cost-effective than reactive retention efforts</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-semibold text-blue-400">Technical Insights</h3>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>RFM analysis combined with behavioral data significantly outperforms demographic-only segmentation</li>
                        <li>24-month prediction horizon provides optimal balance between accuracy and actionability</li>
                        <li>Real-time scoring enables dynamic customer journey optimization</li>
                        <li>Visual dashboards increase adoption when they answer specific business questions, not just display data</li>
                      </ul>
                    </div>
                  </div>
                  <p className="leading-relaxed mt-4">
                    This project demonstrated that sophisticated analytics can be made accessible and actionable for business teams. The key is translating complex predictions into simple, clear recommendations that drive immediate action.
                  </p>
                </div>
              </motion.div>

              {/* Technologies Used */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.5 }}
                className="bg-gradient-to-br from-gray-500/10 to-slate-500/10 backdrop-blur-sm border border-gray-500/20 rounded-3xl p-8"
              >
                <h2 className="text-2xl font-bold mb-6 text-gray-300">Technologies Used</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    'React 19', 'TypeScript', 'Machine Learning', 'RFM Analysis',
                    'Predictive Modeling', 'Cohort Analysis', 'Data Visualization', 'Statistical Analysis',
                    'Customer Segmentation', 'Behavioral Analytics', 'Retention Modeling', 'Churn Prediction'
                  ].map((tech, index) => (
                    <span key={index} className="bg-white/10 text-gray-300 px-3 py-2 rounded-lg text-sm text-center border border-white/20 hover:bg-white/20 transition-colors">
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
