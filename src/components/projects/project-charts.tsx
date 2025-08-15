'use client'

import { useState, useEffect, Suspense } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import chart components to avoid SSR issues
const ChurnLineChart = dynamic(() => import('@/app/projects/churn-retention/ChurnLineChart'), {
  ssr: false,
  loading: () => (
    <div className="h-64 flex items-center justify-center text-gray-400">
      Loading churn trends...
    </div>
  )
})

const RetentionHeatmap = dynamic(() => import('@/app/projects/churn-retention/RetentionHeatmap'), {
  ssr: false,
  loading: () => (
    <div className="h-64 flex items-center justify-center text-gray-400">
      Loading retention analytics...
    </div>
  )
})

// Revenue KPI Charts
const RevenueBarChart = dynamic(() => import('@/app/projects/revenue-kpi/RevenueBarChart'), {
  ssr: false,
  loading: () => (
    <div className="h-64 flex items-center justify-center text-gray-400">
      Loading revenue analytics...
    </div>
  )
})

const RevenueLineChart = dynamic(() => import('@/app/projects/revenue-kpi/RevenueLineChart'), {
  ssr: false,
  loading: () => (
    <div className="h-64 flex items-center justify-center text-gray-400">
      Loading revenue trends...
    </div>
  )
})

const TopPartnersChart = dynamic(() => import('@/app/projects/revenue-kpi/TopPartnersChart'), {
  ssr: false,
  loading: () => (
    <div className="h-64 flex items-center justify-center text-gray-400">
      Loading partner analytics...
    </div>
  )
})

const PartnerGroupPieChart = dynamic(() => import('@/app/projects/revenue-kpi/PartnerGroupPieChart'), {
  ssr: false,
  loading: () => (
    <div className="h-64 flex items-center justify-center text-gray-400">
      Loading partner distribution...
    </div>
  )
})

// Deal Funnel Charts
const DealStageFunnelChart = dynamic(() => import('@/app/projects/deal-funnel/DealStageFunnelChart'), {
  ssr: false,
  loading: () => (
    <div className="h-64 flex items-center justify-center text-gray-400">
      Loading funnel analysis...
    </div>
  )
})

// Lead Attribution Charts
const LeadSourcePieChart = dynamic(() => import('@/app/projects/lead-attribution/LeadSourcePieChart'), {
  ssr: false,
  loading: () => (
    <div className="h-64 flex items-center justify-center text-gray-400">
      Loading lead attribution...
    </div>
  )
})

interface ProjectChartsProps {
  projectId: string
}

export function ProjectCharts({ projectId }: ProjectChartsProps) {
  const [isMounted, setIsMounted] = useState(false)

  // Deterministic chart bar heights to prevent hydration mismatch
  const chartBarHeights = [85, 92, 78, 95, 88, 82, 90, 76, 93, 87, 91, 89]

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-4">Loading Charts...</h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            Initializing data visualization...
          </div>
        </div>
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-4">Loading Analytics...</h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            Preparing analytics dashboard...
          </div>
        </div>
      </div>
    )
  }

  if (projectId === 'churn-retention') {
    return (
      <div className="space-y-8">
        {/* Enhanced Chart Container */}
        <div className="grid grid-cols-1 gap-8">
          {/* Churn Line Chart */}
          <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 backdrop-blur-lg border border-red-500/20 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
              <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-pink-400">
                Monthly Churn Rate Trends
              </h3>
            </div>
            <div className="bg-black/20 rounded-xl p-6 border border-red-500/20">
              <Suspense fallback={
                <div className="h-64 flex items-center justify-center text-gray-400">
                  Loading churn data visualization...
                </div>
              }>
                <ChurnLineChart />
              </Suspense>
            </div>
          </div>

          {/* Retention Heatmap */}
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-lg border border-green-500/20 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-400">
                Customer Retention Analytics
              </h3>
            </div>
            <div className="bg-black/20 rounded-xl p-6 border border-green-500/20">
              <Suspense fallback={
                <div className="h-64 flex items-center justify-center text-gray-400">
                  Loading retention analytics...
                </div>
              }>
                <RetentionHeatmap />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-lg border border-blue-500/20 rounded-2xl p-8 shadow-xl">
          <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 mb-6">
            Key Insights from Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 rounded-xl p-6 border border-blue-500/20 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">92%</div>
              <div className="text-sm text-gray-300">Prediction Accuracy</div>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-blue-500/20 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">25%</div>
              <div className="text-sm text-gray-300">Churn Reduction</div>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-blue-500/20 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">$800K</div>
              <div className="text-sm text-gray-300">Revenue Saved</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (projectId === 'revenue-kpi') {
    return (
      <div className="space-y-8">
        {/* Enhanced Chart Container for Revenue KPI */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Line Chart */}
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-lg border border-green-500/20 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-400">
                Revenue Growth Trends
              </h3>
            </div>
            <div className="bg-black/20 rounded-xl p-6 border border-green-500/20">
              <Suspense fallback={
                <div className="h-64 flex items-center justify-center text-gray-400">
                  Loading revenue trends...
                </div>
              }>
                <RevenueLineChart />
              </Suspense>
            </div>
          </div>

          {/* Revenue Bar Chart */}
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-lg border border-blue-500/20 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
              <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                Monthly Revenue Analysis
              </h3>
            </div>
            <div className="bg-black/20 rounded-xl p-6 border border-blue-500/20">
              <Suspense fallback={
                <div className="h-64 flex items-center justify-center text-gray-400">
                  Loading revenue analytics...
                </div>
              }>
                <RevenueBarChart />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Second Row - Partner Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Partners Chart */}
          <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 backdrop-blur-lg border border-purple-500/20 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
              <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
                Top Revenue Partners
              </h3>
            </div>
            <div className="bg-black/20 rounded-xl p-6 border border-purple-500/20">
              <Suspense fallback={
                <div className="h-64 flex items-center justify-center text-gray-400">
                  Loading partner analytics...
                </div>
              }>
                <TopPartnersChart />
              </Suspense>
            </div>
          </div>

          {/* Partner Group Distribution */}
          <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-lg border border-orange-500/20 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
              <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-400">
                Partner Distribution
              </h3>
            </div>
            <div className="bg-black/20 rounded-xl p-6 border border-orange-500/20">
              <Suspense fallback={
                <div className="h-64 flex items-center justify-center text-gray-400">
                  Loading partner distribution...
                </div>
              }>
                <PartnerGroupPieChart />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Revenue KPI Insights */}
        <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-lg border border-yellow-500/20 rounded-2xl p-8 shadow-xl">
          <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 mb-6">
            Key Revenue Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/5 rounded-xl p-6 border border-yellow-500/20 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">$1.2M</div>
              <div className="text-sm text-gray-300">Additional Revenue</div>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-yellow-500/20 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">95%</div>
              <div className="text-sm text-gray-300">Forecast Accuracy</div>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-yellow-500/20 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">40%</div>
              <div className="text-sm text-gray-300">Time Saved</div>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-yellow-500/20 text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">100%</div>
              <div className="text-sm text-gray-300">Real-time Data</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (projectId === 'deal-funnel') {
    return (
      <div className="space-y-8">
        {/* Deal Funnel Analysis */}
        <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 backdrop-blur-lg border border-purple-500/20 rounded-2xl p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
            <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
              Sales Pipeline Analysis
            </h3>
          </div>
          <div className="bg-black/20 rounded-xl p-6 border border-purple-500/20">
            <Suspense fallback={
              <div className="h-64 flex items-center justify-center text-gray-400">
                Loading funnel analysis...
              </div>
            }>
              <DealStageFunnelChart stages={[
                { name: 'Leads', count: 1000, avg_deal_size: 0 },
                { name: 'Qualified', count: 750, avg_deal_size: 15000 },
                { name: 'Proposal', count: 500, avg_deal_size: 18000 },
                { name: 'Negotiation', count: 300, avg_deal_size: 22000 },
                { name: 'Closed Won', count: 200, avg_deal_size: 25000 }
              ]} />
            </Suspense>
          </div>
        </div>

        {/* Deal Funnel Insights */}
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-lg border border-blue-500/20 rounded-2xl p-8 shadow-xl">
          <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 mb-6">
            Sales Funnel Performance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 rounded-xl p-6 border border-blue-500/20 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">+35%</div>
              <div className="text-sm text-gray-300">Conversion Rate</div>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-blue-500/20 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">+60%</div>
              <div className="text-sm text-gray-300">Sales Velocity</div>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-blue-500/20 text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">+20%</div>
              <div className="text-sm text-gray-300">Average Deal Size</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (projectId === 'lead-attribution') {
    return (
      <div className="space-y-8">
        {/* Lead Attribution Analysis */}
        <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-lg border border-orange-500/20 rounded-2xl p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
            <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-400">
              Marketing Attribution Analysis
            </h3>
          </div>
          <div className="bg-black/20 rounded-xl p-6 border border-orange-500/20">
            <Suspense fallback={
              <div className="h-64 flex items-center justify-center text-gray-400">
                Loading lead attribution...
              </div>
            }>
              <LeadSourcePieChart />
            </Suspense>
          </div>
        </div>

        {/* Attribution Insights */}
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-lg border border-green-500/20 rounded-2xl p-8 shadow-xl">
          <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-400 mb-6">
            Attribution Performance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 rounded-xl p-6 border border-green-500/20 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">88%</div>
              <div className="text-sm text-gray-300">Attribution Accuracy</div>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-green-500/20 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">+45%</div>
              <div className="text-sm text-gray-300">ROAS Improvement</div>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-green-500/20 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">+30%</div>
              <div className="text-sm text-gray-300">Campaign Efficiency</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default fallback for other projects
  return (
    <div className="bg-black/20 rounded-2xl p-8 border border-blue-500/30">
      <div className="text-center text-gray-300 mb-6">
        <div className="text-lg font-semibold mb-2">Interactive Data Visualization</div>
        <div className="text-sm text-gray-400">Real-time metrics and analytics from this project</div>
      </div>

      {/* Mock chart placeholder with animated elements */}
      <div className="relative h-80 bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl border border-blue-500/20 overflow-hidden">
        {/* Animated grid background */}
        <div className="absolute inset-0 bg-[image:linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(to_right,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[length:20px_20px]" />

        {/* Animated data points */}
        <div className="absolute top-8 left-8 w-4 h-4 bg-blue-400 rounded-full animate-ping"></div>
        <div className="absolute top-16 right-12 w-3 h-3 bg-green-400 rounded-full animate-pulse [animation-delay:1s]"></div>
        <div className="absolute bottom-20 left-20 w-5 h-5 bg-purple-400 rounded-full animate-bounce [animation-delay:2s]"></div>

        {/* Chart representation */}
        <div className="absolute bottom-8 left-8 right-8 h-32">
          <div className="flex items-end justify-between h-full">
            {chartBarHeights.map((height, i) => (
              <div
                key={i}
                className={`bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t transition-all duration-1000 hover:from-blue-400 hover:to-cyan-300`}
                style={{
                  height: `${height}%`,
                  width: '6%',
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        </div>

        {/* Overlay text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center bg-black/60 backdrop-blur rounded-xl p-6 border border-white/10">
            <div className="text-2xl font-bold text-white mb-2">Live Data Preview</div>
            <div className="text-sm text-gray-300">Charts coming soon for this project</div>
          </div>
        </div>
      </div>
    </div>
  )
}
