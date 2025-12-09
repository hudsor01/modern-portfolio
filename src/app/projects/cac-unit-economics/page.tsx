'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, RefreshCcw, TrendingUp, DollarSign, Target, Calculator } from 'lucide-react'
import Link from 'next/link'
import { m as motion } from 'framer-motion'

import { cacMetrics } from './data/constants'
import { formatCurrency } from './utils'
import { MetricCard } from './components/MetricCard'
import { OverviewTab } from './components/OverviewTab'
import { ChannelsTab } from './components/ChannelsTab'
import { ProductsTab } from './components/ProductsTab'
import { StrategicImpact } from './components/StrategicImpact'
import { NarrativeSections } from './components/NarrativeSections'

const tabs = ['overview', 'channels', 'products'] as const
type Tab = typeof tabs[number]

export default function CACUnitEconomics() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-success rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
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
                      ? 'bg-success text-foreground shadow-lg'
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
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent mb-4">
            Customer Acquisition Cost Optimization & Unit Economics Dashboard
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mb-6">
            Comprehensive CAC analysis and LTV:CAC ratio optimization that achieved 32% cost reduction through strategic partner channel optimization. Industry-benchmark 3.6:1 efficiency ratio with 8.4-month payback period across multi-tier SaaS products.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="bg-success/20 text-success px-3 py-1 rounded-full">CAC Reduction: 32%</span>
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full">LTV:CAC Ratio: 3.6:1</span>
            <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full">ROI Optimization</span>
            <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full">Unit Economics</span>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-success/20 rounded-full" />
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-success rounded-full animate-spin border-t-transparent" />
            </div>
          </div>
        ) : (
          <>
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <MetricCard
                icon={DollarSign}
                label="Blended CAC"
                value={formatCurrency(cacMetrics.blendedCAC)}
                subtitle="Cost to Acquire"
                gradientFrom="from-green-600"
                gradientTo="to-emerald-600"
                iconBgClass="bg-success/20"
                iconColorClass="text-success"
                delay={0.1}
              />
              <MetricCard
                icon={TrendingUp}
                label="Lifetime Value"
                value={formatCurrency(cacMetrics.averageLTV)}
                subtitle="Average LTV"
                gradientFrom="from-blue-600"
                gradientTo="to-cyan-600"
                iconBgClass="bg-primary/20"
                iconColorClass="text-primary"
                delay={0.1}
              />
              <MetricCard
                icon={Calculator}
                label="LTV:CAC"
                value={`${cacMetrics.ltv_cac_ratio.toFixed(1)}:1`}
                subtitle="Efficiency Ratio"
                gradientFrom="from-purple-600"
                gradientTo="to-pink-600"
                iconBgClass="bg-purple-500/20"
                iconColorClass="text-purple-400"
                delay={0.1}
              />
              <MetricCard
                icon={Target}
                label="Payback"
                value={`${cacMetrics.paybackPeriod} mo`}
                subtitle="Payback Period"
                gradientFrom="from-amber-600"
                gradientTo="to-orange-600"
                iconBgClass="bg-amber-500/20"
                iconColorClass="text-amber-400"
                delay={0.1}
              />
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'channels' && <ChannelsTab />}
            {activeTab === 'products' && <ProductsTab />}

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
