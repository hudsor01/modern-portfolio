'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import {
  ArrowLeft,
  RefreshCcw,
  TrendingUp,
  Users,
  Target,
  DollarSign,
} from 'lucide-react'
import Link from 'next/link'

import { STARAreaChart } from '@/components/projects/STARAreaChart'


const starData = {
  situation: { phase: 'Situation', impact: 24, efficiency: 20, value: 15 },
  task: { phase: 'Task', impact: 50, efficiency: 45, value: 40 },
  action: { phase: 'Action', impact: 78, efficiency: 83, value: 75 },
  result: { phase: 'Result', impact: 95, efficiency: 93, value: 91 },
}
// Lazy-load chart components with Suspense fallback
const PartnerTierChart = dynamic(() => import('./PartnerTierChart'), {
  loading: () => <div className="h-[350px] w-full animate-pulse bg-muted rounded-lg" />,
  ssr: true
})
const RevenueContributionChart = dynamic(() => import('./RevenueContributionChart'), {
  loading: () => <div className="h-[350px] w-full animate-pulse bg-muted rounded-lg" />,
  ssr: true
})

// Real data based on CSV analysis: 83.2% win rate, $1.1M partner revenue
const partnerMetrics = {
  totalPartners: 47,
  activePartners: 34,
  certifiedPartners: 12,
  totalRevenue: 1087420,
  partnerRevenue: 904387,
  partnerContribution: 83.2,
  avgDealSize: 305,
  winRate: 83.2,
  quickRatio: 4.7, // SaaS benchmark >4
  topPartnerRevenue: 287650, // 80/20 rule demonstration
}

const partnerTierPerformance = [
  { 
    tier: 'Certified Partners', 
    count: 12, 
    revenue: 687420, 
    avgDeal: 485, 
    winRate: 89.4,
    cycleLength: 73,
    roi: 8.2 
  },
  { 
    tier: 'Legacy Partners', 
    count: 15, 
    revenue: 216967, 
    avgDeal: 298, 
    winRate: 78.1,
    cycleLength: 89,
    roi: 3.1 
  },
  { 
    tier: 'Inactive Partners', 
    count: 7, 
    revenue: 0, 
    avgDeal: 0, 
    winRate: 0,
    cycleLength: 126,
    roi: 0 
  },
  { 
    tier: 'New Partners', 
    count: 13, 
    revenue: 183033, 
    avgDeal: 267, 
    winRate: 71.2,
    cycleLength: 105,
    roi: 2.4 
  },
]

const top80PercentPartners = [
  { partner: 'TechFlow Solutions', revenue: 287650, deals: 89, winRate: 94.2, tier: 'Certified' },
  { partner: 'Digital Marketing Pro', revenue: 184320, deals: 67, winRate: 87.6, tier: 'Certified' },
  { partner: 'Revenue Boost Inc', revenue: 156780, deals: 54, winRate: 91.1, tier: 'Certified' },
  { partner: 'Growth Partners LLC', revenue: 142890, deals: 48, winRate: 85.4, tier: 'Legacy' },
  { partner: 'Channel Dynamics', revenue: 133247, deals: 45, winRate: 82.2, tier: 'Legacy' },
]

export default function PartnerPerformanceIntelligence() {
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

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
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
            <div className="flex items-center gap-1 glass rounded-2xl p-1">
              {['overview', 'tiers', 'top-performers'].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 capitalize ${
                    activeTab === tab 
                      ? 'bg-primary text-foreground shadow-lg' 
                      : 'text-muted-foreground hover:text-white hover:bg-white/10'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.replace('-', ' ')}
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
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent mb-4">
            Partner Performance Intelligence Dashboard
          </h1>
          <p className="typography-lead max-w-3xl mb-6">
            Strategic channel analytics and partner ROI intelligence demonstrating 83.2% win rate across multi-tier partner ecosystem. Real-time performance tracking following industry-standard 80/20 partner revenue distribution.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full">Channel ROI: 4.7x</span>
            <span className="bg-secondary/20 text-secondary px-3 py-1 rounded-full">Win Rate: 83.2%</span>
            <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full">Partner Intelligence</span>
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full">Revenue Operations</span>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary/20 rounded-full" />
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary rounded-full animate-spin border-t-transparent" />
            </div>
          </div>
        ) : (
          <>
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Total Partner Revenue */}
              <div 
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative glass-interactive rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-primary/20 rounded-xl">
                      <DollarSign className="h-6 w-6 text-primary" />
                    </div>
                    <span className="typography-small text-muted-foreground uppercase tracking-wider">Partner Revenue</span>
                  </div>
                  <p className="typography-h2 border-none pb-0 text-2xl mb-1">
                    {formatCurrency(partnerMetrics.partnerRevenue)}
                  </p>
                  <p className="typography-small text-muted-foreground">83.2% of Total Revenue</p>
                </div>
              </div>

              {/* Win Rate */}
              <div 
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative glass-interactive rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-secondary/20 rounded-xl">
                      <Target className="h-6 w-6 text-secondary" />
                    </div>
                    <span className="typography-small text-muted-foreground uppercase tracking-wider">Win Rate</span>
                  </div>
                  <p className="typography-h2 border-none pb-0 text-2xl mb-1">
                    {partnerMetrics.winRate}%
                  </p>
                  <p className="typography-small text-muted-foreground">Partner Channel Efficiency</p>
                </div>
              </div>

              {/* Active Partners */}
              <div 
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative glass-interactive rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-500/20 rounded-xl">
                      <Users className="h-6 w-6 text-purple-400" />
                    </div>
                    <span className="typography-small text-muted-foreground uppercase tracking-wider">Active Partners</span>
                  </div>
                  <p className="typography-h2 border-none pb-0 text-2xl mb-1">
                    {partnerMetrics.activePartners}
                  </p>
                  <p className="typography-small text-muted-foreground">of {partnerMetrics.totalPartners} Total</p>
                </div>
              </div>

              {/* SaaS Quick Ratio */}
              <div 
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative glass-interactive rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-primary/20 rounded-xl">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <span className="typography-small text-muted-foreground uppercase tracking-wider">Quick Ratio</span>
                  </div>
                  <p className="typography-h2 border-none pb-0 text-2xl mb-1">
                    {partnerMetrics.quickRatio}x
                  </p>
                  <p className="typography-small text-muted-foreground">SaaS Benchmark: &gt;4.0x</p>
                </div>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Partner Tier Performance */}
                <div 
                  className="glass rounded-2xl p-6 hover:bg-white/[0.07] transition-all duration-300"
                >
                  <div className="mb-4">
                    <h2 className="typography-h4 mb-1">Partner Tier Performance Analysis</h2>
                    <p className="typography-small text-muted-foreground">Revenue and ROI analysis across certified, legacy, and new partner tiers</p>
                  </div>
                  <div className="h-[250px]">
                    <PartnerTierChart />
                  </div>
                </div>

                {/* Revenue Contribution */}
                <div 
                  className="glass rounded-2xl p-6 hover:bg-white/[0.07] transition-all duration-300"
                >
                  <div className="mb-4">
                    <h2 className="typography-h4 mb-1">Channel Revenue Contribution</h2>
                    <p className="typography-small text-muted-foreground">Partner revenue distribution following industry 80/20 performance rule</p>
                  </div>
                  <div className="h-[250px]">
                    <RevenueContributionChart />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tiers' && (
              <div 
                className="glass rounded-2xl p-6 hover:bg-white/[0.07] transition-all duration-300 mb-8"
              >
                <div className="mb-4">
                  <h2 className="typography-h4 mb-1">Partner Tier Intelligence & ROI Metrics</h2>
                  <p className="typography-small text-muted-foreground">Comprehensive partner performance analysis across certification levels and engagement tiers</p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 font-semibold">Partner Tier</th>
                        <th className="text-left py-3 px-4 font-semibold">Count</th>
                        <th className="text-left py-3 px-4 font-semibold">Revenue</th>
                        <th className="text-left py-3 px-4 font-semibold">Avg Deal</th>
                        <th className="text-left py-3 px-4 font-semibold">Win Rate</th>
                        <th className="text-left py-3 px-4 font-semibold">Cycle (Days)</th>
                        <th className="text-left py-3 px-4 font-semibold">ROI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {partnerTierPerformance.map((tier, index) => (
                        <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4 font-medium">{tier.tier}</td>
                          <td className="py-4 px-4">{tier.count}</td>
                          <td className="py-4 px-4">{formatCurrency(tier.revenue)}</td>
                          <td className="py-4 px-4">{formatCurrency(tier.avgDeal)}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              tier.winRate >= 85 ? 'bg-success/20 text-success' :
                              tier.winRate >= 70 ? 'bg-warning/20 text-warning' :
                              'bg-destructive/20 text-destructive'
                            }`}>
                              {tier.winRate}%
                            </span>
                          </td>
                          <td className="py-4 px-4">{tier.cycleLength}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              tier.roi >= 5 ? 'bg-success/20 text-success' :
                              tier.roi >= 3 ? 'bg-warning/20 text-warning' :
                              'bg-destructive/20 text-destructive'
                            }`}>
                              {tier.roi}x
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'top-performers' && (
              <div 
                className="glass rounded-2xl p-6 hover:bg-white/[0.07] transition-all duration-300 mb-8"
              >
                <div className="mb-4">
                  <h2 className="typography-h4 mb-1">Top 80% Revenue Partners (Pareto Principle)</h2>
                  <p className="typography-small text-muted-foreground">Elite partner performance driving majority of channel revenue following the proven 80/20 distribution rule</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {top80PercentPartners.map((partner, index) => (
                    <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-base font-semibold">{partner.partner}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          partner.tier === 'Certified' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'
                        }`}>
                          {partner.tier}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="typography-muted">Revenue:</span>
                          <span className="font-medium">{formatCurrency(partner.revenue)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="typography-muted">Deals:</span>
                          <span className="font-medium">{partner.deals}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="typography-muted">Win Rate:</span>
                          <span className="font-medium">{partner.winRate}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strategic Insights */}
            <div 
              className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-xs border border-primary/20 rounded-xl p-6"
            >
              <h2 className="typography-h4 mb-4 text-primary">Partner Intelligence & Strategic Impact</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass rounded-2xl p-4 text-center">
                  <div className="typography-h3 text-primary mb-1">83.2%</div>
                  <div className="typography-small text-muted-foreground">Partner Channel Win Rate (Industry: 65-75%)</div>
                </div>
                <div className="glass rounded-2xl p-4 text-center">
                  <div className="typography-h3 text-secondary mb-1">4.7x</div>
                  <div className="typography-small text-muted-foreground">SaaS Quick Ratio (Benchmark: &gt;4.0x)</div>
                </div>
                <div className="glass rounded-2xl p-4 text-center">
                  <div className="typography-h3 text-purple-400 mb-1">80/20</div>
                  <div className="typography-small text-muted-foreground">Partner Revenue Distribution (Pareto Optimized)</div>
                </div>
              </div>
            </div>

            {/* STAR Impact Analysis */}
            <div
              className="mt-16 space-y-8"
            >
              <div className="text-center space-y-4">
                <h2 className="typography-h2 border-none pb-0 text-2xl md:text-2xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  STAR Impact Analysis
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Tracking project progression from Situation through Action to measurable Results
                </p>
              </div>

              <div className="glass rounded-2xl p-8">
                <STARAreaChart
                  data={starData}
                  title="Project Progression Metrics"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-6 glass rounded-2xl">
                  <div className="text-sm text-primary/70 mb-2">Situation</div>
                  <div className="typography-large text-white">Initial Assessment</div>
                </div>
                <div className="text-center p-6 glass rounded-2xl">
                  <div className="text-sm text-green-400/70 mb-2">Task</div>
                  <div className="typography-large text-white">Goal Definition</div>
                </div>
                <div className="text-center p-6 glass rounded-2xl">
                  <div className="text-sm text-amber-400/70 mb-2">Action</div>
                  <div className="typography-large text-white">Implementation</div>
                </div>
                <div className="text-center p-6 glass rounded-2xl">
                  <div className="text-sm text-cyan-400/70 mb-2">Result</div>
                  <div className="typography-large text-white">Measurable Impact</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}