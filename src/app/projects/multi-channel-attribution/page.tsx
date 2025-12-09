'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, RefreshCcw, Target, Eye, Share2, DollarSign, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { m as motion } from 'framer-motion'

import { attributionMetrics } from './data/constants'
import { formatCurrency, formatPercent } from './utils'
import { MetricCard } from './components/MetricCard'
import { OverviewTab } from './components/OverviewTab'
import { ModelsTab } from './components/ModelsTab'
import { JourneysTab } from './components/JourneysTab'
import { ChannelsTab } from './components/ChannelsTab'
import { StrategicImpact } from './components/StrategicImpact'
import { NarrativeSections } from './components/NarrativeSections'

const tabs = ['overview', 'models', 'journeys', 'channels'] as const
type Tab = typeof tabs[number]

export default function MultiChannelAttribution() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

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
              {tabs.map((tab) => (
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
              <MetricCard
                icon={Target}
                label="Conversions"
                value={attributionMetrics.totalConversions.toLocaleString()}
                subtitle={
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-success" />
                    +{formatPercent(attributionMetrics.conversionLift)} lift
                  </p>
                }
                gradientFrom="from-orange-600"
                gradientTo="to-red-600"
                iconBgClass="bg-orange-500/20"
                iconColorClass="text-orange-400"
                delay={0.1}
              />
              <MetricCard
                icon={Eye}
                label="Accuracy"
                value={formatPercent(attributionMetrics.attributionAccuracy)}
                subtitle="ML Model Performance"
                gradientFrom="from-red-600"
                gradientTo="to-pink-600"
                iconBgClass="bg-destructive/20"
                iconColorClass="text-destructive"
                delay={0.2}
              />
              <MetricCard
                icon={Share2}
                label="Channels"
                value={attributionMetrics.totalChannels.toString()}
                subtitle={`${attributionMetrics.avgTouchpoints.toFixed(1)} avg touchpoints`}
                gradientFrom="from-pink-600"
                gradientTo="to-purple-600"
                iconBgClass="bg-pink-500/20"
                iconColorClass="text-pink-400"
                delay={0.3}
              />
              <MetricCard
                icon={DollarSign}
                label="ROI Impact"
                value={formatCurrency(attributionMetrics.totalROI)}
                subtitle="Optimization Value"
                gradientFrom="from-amber-600"
                gradientTo="to-orange-600"
                iconBgClass="bg-amber-500/20"
                iconColorClass="text-amber-400"
                delay={0.4}
              />
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'models' && <ModelsTab />}
            {activeTab === 'journeys' && <JourneysTab />}
            {activeTab === 'channels' && <ChannelsTab />}

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
