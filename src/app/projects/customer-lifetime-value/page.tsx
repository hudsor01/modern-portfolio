'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, RefreshCcw, DollarSign, Brain, Users, Calendar } from 'lucide-react'
import Link from 'next/link'
import { m as motion } from 'framer-motion'

import { clvMetrics } from './data/constants'
import { formatCurrency, formatPercent } from './utils'
import { MetricCard } from './components/MetricCard'
import { OverviewTab } from './components/OverviewTab'
import { SegmentsTab } from './components/SegmentsTab'
import { PredictionsTab } from './components/PredictionsTab'
import { StrategicImpact } from './components/StrategicImpact'
import { NarrativeSections } from './components/NarrativeSections'

const tabs = ['overview', 'segments', 'predictions'] as const
type Tab = typeof tabs[number]

export default function CustomerLifetimeValueAnalytics() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
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
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 capitalize ${
                    activeTab === tab
                      ? 'bg-emerald-500 text-foreground shadow-lg'
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
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-600 bg-clip-text text-transparent mb-3">
            Customer Lifetime Value Predictive Analytics Dashboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mb-4">
            Advanced CLV analytics platform leveraging BTYD (Buy Till You Die) predictive modeling framework. Achieving 94.3% prediction accuracy through machine learning algorithms and real-time customer behavior tracking across 5 distinct customer segments.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full">Prediction Accuracy: 94.3%</span>
            <span className="bg-teal-500/20 text-teal-400 px-3 py-1 rounded-full">Avg CLV: {formatCurrency(clvMetrics.averageCLV)}</span>
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full">Machine Learning</span>
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full">BTYD Framework</span>
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
              <MetricCard
                icon={DollarSign}
                label="Average CLV"
                value={formatCurrency(clvMetrics.averageCLV)}
                subtitle="Predicted Value"
                gradientFrom="from-emerald-600"
                gradientTo="to-teal-600"
                iconBgClass="bg-emerald-500/20"
                iconColorClass="text-emerald-400"
                delay={0.1}
              />
              <MetricCard
                icon={Brain}
                label="ML Accuracy"
                value={formatPercent(clvMetrics.predictionAccuracy)}
                subtitle="Model Performance"
                gradientFrom="from-teal-600"
                gradientTo="to-cyan-600"
                iconBgClass="bg-teal-500/20"
                iconColorClass="text-teal-400"
                delay={0.2}
              />
              <MetricCard
                icon={Users}
                label="High Value"
                value={clvMetrics.highValueCustomers.toLocaleString()}
                subtitle="Premium Customers"
                gradientFrom="from-cyan-600"
                gradientTo="to-blue-600"
                iconBgClass="bg-primary/20"
                iconColorClass="text-primary"
                delay={0.3}
              />
              <MetricCard
                icon={Calendar}
                label="Forecast"
                value={`${clvMetrics.forecastHorizon} mo`}
                subtitle="Prediction Window"
                gradientFrom="from-blue-600"
                gradientTo="to-purple-600"
                iconBgClass="bg-primary/20"
                iconColorClass="text-primary"
                delay={0.4}
              />
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'segments' && <SegmentsTab />}
            {activeTab === 'predictions' && <PredictionsTab />}

            {/* Strategic Impact */}
            <StrategicImpact />

            {/* Professional Narrative Sections */}
            <NarrativeSections />
          </>
        )}
      </div>
    </div>
  )
}
