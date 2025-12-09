'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, RefreshCcw, DollarSign, Clock, Target, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { m as motion } from 'framer-motion'
import { getProject } from '@/lib/content/projects'
import { ProjectJsonLd } from '@/components/seo/json-ld'
import { createContextLogger } from '@/lib/monitoring/logger'

import {
  type FunnelStage,
  type PartnerConversion,
  type ConversionRate,
  initialFunnelStages,
  initialPartnerConversion,
  initialConversionRates
} from './data/constants'
import { MetricCard } from './components/MetricCard'
import { FunnelChart } from './components/FunnelChart'
import { ConversionChart } from './components/ConversionChart'
import { VelocityChart } from './components/VelocityChart'
import { PipelineValue } from './components/PipelineValue'
import { NarrativeSections } from './components/NarrativeSections'

const logger = createContextLogger('DealFunnelPage')

export default function DealFunnel() {
  const [isLoading, setIsLoading] = useState(true)
  const [localFunnelStages, setLocalFunnelStages] = useState<FunnelStage[]>([])
  const [localPartnerConversion, setLocalPartnerConversion] = useState<PartnerConversion[]>([])
  const [localConversionRates, setLocalConversionRates] = useState<ConversionRate[]>([])

  useEffect(() => {
    async function loadProjectData() {
      try {
        await getProject('deal-funnel')
        setLocalFunnelStages(initialFunnelStages)
        setLocalPartnerConversion(initialPartnerConversion)
        setLocalConversionRates(initialConversionRates)
        setTimeout(() => setIsLoading(false), 800)
      } catch (error) {
        logger.error('Error loading project data', error instanceof Error ? error : new Error(String(error)))
        setIsLoading(false)
      }
    }
    loadProjectData()
  }, [])

  // Derived calculations
  const totalOpportunities = localFunnelStages?.[0]?.count ?? 0
  const closedDeals = localFunnelStages.length > 0 ? localFunnelStages[localFunnelStages.length - 1]?.count ?? 0 : 0
  const avgDealSize = localFunnelStages.length > 0 ? Math.round(localFunnelStages[localFunnelStages.length - 1]?.avg_deal_size ?? 0) : 0
  const totalRevenue = closedDeals * avgDealSize

  const avgSalesCycle = localPartnerConversion.length > 0
    ? Math.round(localPartnerConversion.reduce((sum, group) => sum + group.avg_sales_cycle_days, 0) / localPartnerConversion.length)
    : 0

  const overallConversionRate = totalOpportunities > 0 ? ((closedDeals / totalOpportunities) * 100).toFixed(1) : '0.0'

  const stageConversions = localConversionRates.length > 0
    ? [
        { stage: 'Leads → Qualified', conversion: localConversionRates[localConversionRates.length - 1]?.lead_to_qualified ?? 0, color: 'var(--color-primary)' },
        { stage: 'Qualified → Proposal', conversion: localConversionRates[localConversionRates.length - 1]?.qualified_to_proposal ?? 0, color: 'var(--color-secondary)' },
        { stage: 'Proposal → Negotiation', conversion: localConversionRates[localConversionRates.length - 1]?.proposal_to_negotiation ?? 0, color: 'var(--color-secondary)' },
        { stage: 'Negotiation → Closed', conversion: localConversionRates[localConversionRates.length - 1]?.negotiation_to_closed ?? 0, color: 'var(--color-chart-5)' },
      ]
    : []

  return (
    <>
      <ProjectJsonLd
        title="Sales Pipeline Funnel Analysis - Deal Stage Optimization"
        description="Interactive sales funnel dashboard showing deal progression, conversion rates, and sales cycle optimization."
        slug="deal-funnel"
        category="Sales Operations"
        tags={['Sales Funnel', 'Deal Pipeline', 'Conversion Analysis', 'Sales Operations']}
      />
      <div className="min-h-screen bg-[#0f172a] text-white">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
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
                setTimeout(() => setIsLoading(false), 800)
              }}
              className="p-2 rounded-xl glass-interactive"
            >
              <RefreshCcw className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-4">
              Deal Pipeline Analytics
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Track deal progression through your sales funnel, identify bottlenecks, and optimize conversion rates at each stage.
            </p>
          </motion.div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-purple-500/20 rounded-full" />
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-purple-500 rounded-full animate-spin border-t-transparent" />
              </div>
            </div>
          ) : (
            <>
              {/* KPI Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
              >
                <MetricCard icon={BarChart3} label="Pipeline" value={totalOpportunities.toLocaleString()} subtitle="Total Opportunities" gradientFrom="from-blue-600" gradientTo="to-indigo-600" iconBgClass="bg-primary/20" iconColorClass="text-primary" />
                <MetricCard icon={Target} label="Won" value={closedDeals.toLocaleString()} subtitle="Closed Deals" gradientFrom="from-green-600" gradientTo="to-emerald-600" iconBgClass="bg-success/20" iconColorClass="text-success" />
                <MetricCard icon={DollarSign} label="Average" value={`$${(avgDealSize / 1000).toFixed(0)}K`} subtitle="Deal Size" gradientFrom="from-purple-600" gradientTo="to-pink-600" iconBgClass="bg-purple-500/20" iconColorClass="text-purple-400" />
                <MetricCard icon={Clock} label="Average" value={avgSalesCycle.toString()} subtitle="Days to Close" gradientFrom="from-amber-600" gradientTo="to-orange-600" iconBgClass="bg-amber-500/20" iconColorClass="text-amber-400" />
              </motion.div>

              {/* Main Funnel Chart */}
              <FunnelChart stages={localFunnelStages} overallConversionRate={overallConversionRate} />

              {/* Conversion Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ConversionChart stageConversions={stageConversions} />
                <VelocityChart partnerConversion={localPartnerConversion} />
              </div>

              {/* Professional Narrative Sections */}
              <NarrativeSections />

              {/* Revenue Impact */}
              <PipelineValue totalRevenue={totalRevenue} />
            </>
          )}
        </div>
      </div>
    </>
  )
}
