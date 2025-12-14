'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, RefreshCcw, DollarSign, Percent, TrendingUp, Calculator } from 'lucide-react'
import Link from 'next/link'

import { AnimatedBackground } from '@/components/projects/animated-background'
import { commissionMetrics } from './data/constants'
import { formatCurrency, formatPercent } from './utils'
import { MetricCard } from './components/MetricCard'
import { ProcessingMetrics } from './components/ProcessingMetrics'
import { OverviewTab } from './components/OverviewTab'
import { TiersTab } from './components/TiersTab'
import { IncentivesTab } from './components/IncentivesTab'
import { AutomationTab } from './components/AutomationTab'
import { NarrativeSections } from './components/NarrativeSections'

const tabs = ['overview', 'tiers', 'incentives', 'automation'] as const
type Tab = typeof tabs[number]

export default function CommissionOptimization() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <AnimatedBackground
        primaryColor="bg-emerald-500"
        secondaryColor="bg-success"
        tertiaryColor="bg-teal-500"
      />

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
            <div className="flex items-center gap-1 glass rounded-2xl p-1">
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
        <div
          className="mb-8"
        >
          <h1 className="text-xl md:typography-h1 text-xl bg-gradient-to-r from-emerald-400 to-green-600 bg-clip-text text-transparent mb-3">
            Commission & Incentive Optimization System
          </h1>
          <p className="typography-lead max-w-3xl mb-4">
            Advanced commission management and partner incentive optimization platform managing $254K+ commission structures. Automated tier adjustments with 23% average commission rate optimization and ROI-driven compensation strategy delivering 34% performance improvement and 87.5% automation efficiency.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full">Commission Pool: {formatCurrency(commissionMetrics.totalCommissionPool)}</span>
            <span className="bg-success/20 text-success px-3 py-1 rounded-full">Avg Rate: {formatPercent(commissionMetrics.averageCommissionRate)}</span>
            <span className="bg-teal-500/20 text-teal-400 px-3 py-1 rounded-full">Performance: +{formatPercent(commissionMetrics.performanceImprovement)}</span>
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full">Automation: {formatPercent(commissionMetrics.automationEfficiency)}</span>
          </div>
        </div>

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
                label="Commission Pool"
                value={formatCurrency(commissionMetrics.totalCommissionPool)}
                subtitle="Annual Management"
                gradientFrom="from-emerald-600"
                gradientTo="to-green-600"
                iconBgClass="bg-emerald-500/20"
                iconColorClass="text-emerald-400"
                
              />
              <MetricCard
                icon={Percent}
                label="Avg Rate"
                value={formatPercent(commissionMetrics.averageCommissionRate)}
                subtitle="Commission Rate"
                gradientFrom="from-green-600"
                gradientTo="to-teal-600"
                iconBgClass="bg-success/20"
                iconColorClass="text-success"
                
              />
              <MetricCard
                icon={TrendingUp}
                label="Performance"
                value={`+${formatPercent(commissionMetrics.performanceImprovement)}`}
                subtitle="Improvement"
                gradientFrom="from-teal-600"
                gradientTo="to-cyan-600"
                iconBgClass="bg-teal-500/20"
                iconColorClass="text-teal-400"
                
              />
              <MetricCard
                icon={Calculator}
                label="Automation"
                value={formatPercent(commissionMetrics.automationEfficiency)}
                subtitle="Efficiency"
                gradientFrom="from-cyan-600"
                gradientTo="to-blue-600"
                iconBgClass="bg-primary/20"
                iconColorClass="text-primary"
                
              />
            </div>

            {/* Processing Metrics */}
            <ProcessingMetrics />

            {/* Tab Content */}
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'tiers' && <TiersTab />}
            {activeTab === 'incentives' && <IncentivesTab />}
            {activeTab === 'automation' && <AutomationTab />}

            {/* Professional Narrative Sections */}
            <NarrativeSections />
          </>
        )}
      </div>
    </div>
  )
}
