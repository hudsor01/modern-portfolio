'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, RefreshCcw, DollarSign, Target, BarChart3, Users, Activity, TrendingUp } from 'lucide-react'
import Link from 'next/link'


import { revenueMetrics } from './data/constants'
import { formatCurrency, formatPercent } from './utils'
import { MetricCard } from './components/MetricCard'
import { KPIAlerts } from './components/KPIAlerts'
import { OverviewTab } from './components/OverviewTab'
import { PipelineTab } from './components/PipelineTab'
import { ForecastingTab } from './components/ForecastingTab'
import { OperationsTab } from './components/OperationsTab'
import { StrategicImpact } from './components/StrategicImpact'
import { NarrativeSections } from './components/NarrativeSections'

const tabs = ['overview', 'pipeline', 'forecasting', 'operations'] as const
type Tab = typeof tabs[number]

export default function RevenueOperationsCenter() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-8">
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
                      ? 'bg-violet-500 text-foreground shadow-lg'
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
          className="mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-violet-400 to-purple-600 bg-clip-text text-transparent mb-4">
            Revenue Operations Command Center
          </h1>
          <p className="typography-lead max-w-3xl mb-6">
            Comprehensive revenue operations dashboard consolidating pipeline health, forecasting accuracy, partner performance, and operational KPIs. Real-time insights with 96.8% forecast accuracy and 89.7% operational efficiency across sales, marketing, and partner channels.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="bg-violet-500/20 text-violet-400 px-3 py-1 rounded-full">Forecast Accuracy: 96.8%</span>
            <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full">Pipeline Health: 92.4%</span>
            <span className="bg-secondary/20 text-secondary px-3 py-1 rounded-full">Revenue Growth: +34.2%</span>
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full">Operations Dashboard</span>
          </div>
        </div>

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
              <MetricCard
                icon={DollarSign}
                label="Total Revenue"
                value={formatCurrency(revenueMetrics.totalRevenue)}
                subtitle={
                  <p className="typography-small text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-success" />
                    +{formatPercent(revenueMetrics.revenueGrowth)} YoY
                  </p>
                }
                gradientFrom="from-violet-600"
                gradientTo="to-purple-600"
                iconBgClass="bg-violet-500/20"
                iconColorClass="text-violet-400"
                
              />
              <MetricCard
                icon={Target}
                label="Forecast"
                value={formatPercent(revenueMetrics.forecastAccuracy)}
                subtitle="Accuracy Rate"
                gradientFrom="from-purple-600"
                gradientTo="to-indigo-600"
                iconBgClass="bg-purple-500/20"
                iconColorClass="text-purple-400"
                
              />
              <MetricCard
                icon={BarChart3}
                label="Pipeline"
                value={formatPercent(revenueMetrics.pipelineHealth)}
                subtitle="Health Score"
                gradientFrom="from-indigo-600"
                gradientTo="to-blue-600"
                iconBgClass="bg-secondary/20"
                iconColorClass="text-secondary"
                
              />
              <MetricCard
                icon={Users}
                label="Active Deals"
                value={revenueMetrics.activeDeals.toString()}
                subtitle={`${formatCurrency(revenueMetrics.avgDealSize)} avg`}
                gradientFrom="from-blue-600"
                gradientTo="to-cyan-600"
                iconBgClass="bg-primary/20"
                iconColorClass="text-primary"
                
              />
              <MetricCard
                icon={Activity}
                label="Target"
                value={formatPercent(revenueMetrics.targetAttainment)}
                subtitle="Attainment"
                gradientFrom="from-cyan-600"
                gradientTo="to-teal-600"
                iconBgClass="bg-primary/20"
                iconColorClass="text-primary"
                
              />
            </div>

            {/* KPI Alerts */}
            <KPIAlerts />

            {/* Tab Content */}
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'pipeline' && <PipelineTab />}
            {activeTab === 'forecasting' && <ForecastingTab />}
            {activeTab === 'operations' && <OperationsTab />}

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
