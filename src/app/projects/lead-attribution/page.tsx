'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, RefreshCcw, TrendingUp, Users, Zap, Target } from 'lucide-react'

import { ProjectJsonLd } from '@/components/seo/json-ld'
import { TIMING_CONSTANTS } from '@/lib/constants/ui-thresholds'
import { leadAttributionData } from '@/app/projects/data/partner-analytics'

import { leadConversionData, monthlyTrendData } from './data/constants'
import { MetricCard } from './components/MetricCard'
import { ChartsSection } from './components/ChartsSection'
import { TrendsChart } from './components/TrendsChart'
import { InsightsSection } from './components/InsightsSection'
import { NarrativeSections } from './components/NarrativeSections'

export default function LeadAttribution() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), TIMING_CONSTANTS.LOADING_STATE_RESET)
  }, [])

  // Calculate totals safely
  const totalLeads = leadAttributionData?.reduce(
    (sum: number, source: { leads: number }) => sum + (source.leads || 0),
    0
  ) || 0
  const totalConversions = leadConversionData.reduce(
    (sum, source) => sum + (source.conversions || 0),
    0
  ) || 0

  // Calculate conversion rate safely
  const overallConversionRate = totalLeads > 0 ? (totalConversions / totalLeads) * 100 : 0

  // Find best performing source
  const bestSource = leadConversionData.reduce((best, current) =>
    current.conversion_rate > best.conversion_rate ? current : best
  )

  // Calculate month-over-month growth
  const lastMonth = monthlyTrendData[monthlyTrendData.length - 1]
  const prevMonth = monthlyTrendData[monthlyTrendData.length - 2]
  const monthlyGrowth = prevMonth && lastMonth ? ((lastMonth.leads - prevMonth.leads) / prevMonth.leads * 100).toFixed(1) : '0'

  return (
    <>
      <ProjectJsonLd
        title="Lead Attribution & Marketing Analytics - Multi-Touch Attribution"
        description="Comprehensive lead attribution analysis with multi-touch attribution modeling."
        slug="lead-attribution"
        category="Marketing Analytics"
        tags={['Lead Attribution', 'Marketing Analytics', 'Campaign Tracking', 'Multi-Touch Attribution']}
      />
      <div className="min-h-screen bg-[#0f172a] text-white">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-success rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <Link href="/projects" className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors duration-300">
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm font-medium">Back to Projects</span>
            </Link>
            <button
              onClick={() => {
                setIsLoading(true)
                setTimeout(() => setIsLoading(false), TIMING_CONSTANTS.LOADING_STATE_RESET)
              }}
              className="p-2 rounded-xl glass-interactive"
            >
              <RefreshCcw className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          {/* Title Section */}
          <div
            className="mb-12"
          >
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-600 bg-clip-text text-transparent mb-4">
              Lead Attribution Analytics
            </h1>
            <p className="typography-lead max-w-3xl">
              Understand your lead sources, optimize marketing spend, and improve conversion rates across all channels.
            </p>
          </div>

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
              {/* KPI Cards */}
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
              >
                <MetricCard icon={Users} label="Total" value={totalLeads.toLocaleString()} subtitle="Leads Generated" gradientFrom="from-blue-600" gradientTo="to-indigo-600" iconBgClass="bg-primary/20" iconColorClass="text-primary" />
                <MetricCard icon={Target} label="Success" value={totalConversions.toLocaleString()} subtitle="Total Conversions" gradientFrom="from-green-600" gradientTo="to-emerald-600" iconBgClass="bg-success/20" iconColorClass="text-success" />
                <MetricCard icon={Zap} label="Overall" value={`${overallConversionRate.toFixed(1)}%`} subtitle="Conversion Rate" gradientFrom="from-purple-600" gradientTo="to-pink-600" iconBgClass="bg-purple-500/20" iconColorClass="text-purple-400" />
                <MetricCard icon={TrendingUp} label="MoM" value={`+${monthlyGrowth}%`} subtitle="Monthly Growth" gradientFrom="from-amber-600" gradientTo="to-orange-600" iconBgClass="bg-amber-500/20" iconColorClass="text-amber-400" />
              </div>

              {/* Charts Section */}
              <ChartsSection bestSource={bestSource} />

              {/* Monthly Trends */}
              <TrendsChart />

              {/* Insights Section */}
              <InsightsSection bestConversionRate={bestSource.conversion_rate * 100} />

              {/* Professional Narrative Sections */}
              <NarrativeSections />
            </>
          )}
        </div>
      </div>
    </>
  )
}
