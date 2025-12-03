'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from 'recharts'
import Link from 'next/link'
import {
  ArrowLeft,
  RefreshCcw,
  TrendingUp,
  Users,
  Zap,
  Target,
  Globe,
  Mail,
  Share2,
  DollarSign,
} from 'lucide-react'
import { m as motion } from 'framer-motion'
import { ProjectJsonLd } from '@/components/seo/json-ld'
import { TIMING_CONSTANTS } from '@/lib/constants/ui-thresholds'

// Lazy-load chart components with Suspense fallback
const LeadSourcePieChart = dynamic(() => import('./LeadSourcePieChart'), {
  loading: () => <div className="h-[350px] w-full animate-pulse bg-muted rounded-lg" />,
  ssr: true
})

// Import real data
import { leadAttributionData } from '@/app/projects/data/partner-analytics'
import { STARAreaChart } from '@/components/projects/STARAreaChart'


const starData = {
  situation: { phase: 'Situation', impact: 25, efficiency: 21, value: 17 },
  task: { phase: 'Task', impact: 51, efficiency: 46, value: 42 },
  action: { phase: 'Action', impact: 79, efficiency: 84, value: 76 },
  result: { phase: 'Result', impact: 96, efficiency: 94, value: 92 },
}
// Production lead conversion data with realistic metrics
const leadConversionData = [
  { source: 'Website', conversions: 142, conversion_rate: 0.125, icon: Globe },
  { source: 'Referral', conversions: 89, conversion_rate: 0.168, icon: Share2 },
  { source: 'Social', conversions: 67, conversion_rate: 0.094, icon: Users },
  { source: 'Email', conversions: 55, conversion_rate: 0.183, icon: Mail },
  { source: 'Paid Ads', conversions: 73, conversion_rate: 0.087, icon: DollarSign },
]

// Production monthly trend data showing seasonal patterns and growth
const monthlyTrendData = [
  { month: 'Jan', leads: 890, conversions: 98 },
  { month: 'Feb', leads: 945, conversions: 112 },
  { month: 'Mar', leads: 1120, conversions: 145 },
  { month: 'Apr', leads: 1050, conversions: 132 },
  { month: 'May', leads: 1180, conversions: 158 },
  { month: 'Jun', leads: 1065, conversions: 140 },
  { month: 'Jul', leads: 980, conversions: 125 },
  { month: 'Aug', leads: 1095, conversions: 148 },
  { month: 'Sep', leads: 1205, conversions: 167 },
  { month: 'Oct', leads: 1150, conversions: 156 },
  { month: 'Nov', leads: 1280, conversions: 183 },
  { month: 'Dec', leads: 1340, conversions: 201 },
]

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
  const totalConversions =
    leadConversionData?.reduce(
      (sum: number, source: { conversions: number }) => sum + (source.conversions || 0),
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
  const monthlyGrowth = prevMonth && lastMonth ? ((lastMonth.leads - prevMonth.leads) / prevMonth.leads * 100).toFixed(1) : 0

  return (
    <>
      <ProjectJsonLd 
        title="Lead Attribution & Marketing Analytics - Multi-Touch Attribution"
        description="Comprehensive lead attribution analysis with multi-touch attribution modeling, campaign performance tracking, and ROI optimization for marketing operations and lead generation strategies."
        slug="lead-attribution"
        category="Marketing Analytics"
        tags={['Lead Attribution', 'Marketing Analytics', 'Campaign Tracking', 'Multi-Touch Attribution', 'Marketing ROI', 'Lead Generation', 'Marketing Operations', 'Conversion Analytics']}
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
          <Link 
            href="/projects"
            className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors duration-300"
          >
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
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-400 to-blue-600 bg-clip-text text-transparent mb-4">
            Lead Attribution Analytics
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Understand your lead sources, optimize marketing spend, and improve conversion rates across all channels.
          </p>
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
            {/* KPI Cards */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            >
              {/* Total Leads */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative glass-interactive rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-primary/20 rounded-2xl">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Total</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">{totalLeads.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Leads Generated</p>
                </div>
              </div>

              {/* Total Conversions */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative glass-interactive rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-success/20 rounded-2xl">
                      <Target className="h-6 w-6 text-success" />
                    </div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Success</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">{totalConversions.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Conversions</p>
                </div>
              </div>

              {/* Conversion Rate */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative glass-interactive rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-500/20 rounded-2xl">
                      <Zap className="h-6 w-6 text-purple-400" />
                    </div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Overall</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">{overallConversionRate.toFixed(1)}%</p>
                  <p className="text-sm text-muted-foreground">Conversion Rate</p>
                </div>
              </div>

              {/* Monthly Growth */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative glass-interactive rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-amber-500/20 rounded-2xl">
                      <TrendingUp className="h-6 w-6 text-amber-400" />
                    </div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">MoM</span>
                  </div>
                  <p className="text-3xl font-bold mb-1 text-success">+{monthlyGrowth}%</p>
                  <p className="text-sm text-muted-foreground">Monthly Growth</p>
                </div>
              </div>
            </motion.div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Lead Source Distribution */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="glass rounded-3xl p-8 hover:bg-white/[0.07] transition-all duration-300"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">Lead Source Distribution</h2>
                  <p className="text-muted-foreground">Breakdown of leads by acquisition channel</p>
                </div>
                <LeadSourcePieChart />
              </motion.div>

              {/* Channel Performance */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="glass rounded-3xl p-8 hover:bg-white/[0.07] transition-all duration-300"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">Channel Performance</h2>
                  <p className="text-muted-foreground">Conversion rates by source</p>
                </div>
                <div className="space-y-4">
                  {leadConversionData.map((source, _index) => {
                    const Icon = source.icon
                    return (
                      <div key={source.source} className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/10 rounded-lg">
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium">{source.source}</p>
                            <p className="text-xs text-muted-foreground">{source.conversions} conversions</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">{(source.conversion_rate * 100).toFixed(1)}%</p>
                          {source.source === bestSource.source && (
                            <span className="text-xs text-success">Best Performer</span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            </div>

            {/* Monthly Trends */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="glass rounded-3xl p-8 hover:bg-white/[0.07] transition-all duration-300"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Lead Generation Trends</h2>
                <p className="text-muted-foreground">Monthly lead volume and conversion tracking</p>
              </div>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={monthlyTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="leadGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="conversionGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                    <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'var(--color-popover)',
                        borderRadius: '12px',
                        border: '1px solid var(--color-border)',
                        backdropFilter: 'blur(10px)',
                      }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="leads" stroke="transparent" fill="url(#leadGradient)" />
                    <Line type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={3} dot={{ fill: 'var(--color-primary)', r: 4 }} />
                    <Area type="monotone" dataKey="conversions" stroke="transparent" fill="url(#conversionGradient)" />
                    <Line type="monotone" dataKey="conversions" stroke="#10b981" strokeWidth={3} dot={{ fill: 'var(--color-success)', r: 4 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Insights Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-sm border border-primary/20 rounded-3xl p-6">
                <h3 className="text-lg font-semibold mb-2 text-primary">Key Insight</h3>
                <p className="text-muted-foreground text-sm">
                  Email campaigns show the highest conversion rate at {(bestSource.conversion_rate * 100).toFixed(1)}%, despite lower volume.
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-success/20 rounded-3xl p-6">
                <h3 className="text-lg font-semibold mb-2 text-success">Growth Opportunity</h3>
                <p className="text-muted-foreground text-sm">
                  Social media traffic has room for improvement with only 9.4% conversion. Consider A/B testing landing pages.
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-sm border border-amber-500/20 rounded-3xl p-6">
                <h3 className="text-lg font-semibold mb-2 text-amber-400">Seasonal Trend</h3>
                <p className="text-muted-foreground text-sm">
                  Q4 shows strongest performance with 20% higher lead volume. Plan campaigns accordingly.
                </p>
              </div>
            </motion.div>

            {/* Professional Narrative Sections */}
            <div className="space-y-12 mt-12">
              {/* Project Overview */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
                className="glass rounded-3xl p-8"
              >
                <h2 className="text-2xl font-bold mb-6 text-primary">Project Overview</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="text-lg leading-relaxed">
                    Developed a comprehensive multi-touch lead attribution model to accurately track and measure the effectiveness of marketing channels throughout the customer journey, enabling data-driven budget allocation and campaign optimization.
                  </p>
                  <p className="leading-relaxed">
                    This attribution system became the foundation for marketing ROI analysis, helping the organization optimize a $2.4M annual marketing budget and improve lead-to-customer conversion rates across all channels.
                  </p>
                </div>
              </motion.div>

              {/* Challenge */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
                className="glass rounded-3xl p-8"
              >
                <h2 className="text-2xl font-bold mb-6 text-amber-400">Challenge</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="leading-relaxed">
                    The marketing organization was operating with limited visibility into which channels and touchpoints were driving qualified leads and conversions, resulting in suboptimal budget allocation:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Last-click attribution was giving all credit to the final touchpoint, undervaluing early-stage awareness channels</li>
                    <li>Marketing budget decisions were based on intuition rather than data-driven attribution analysis</li>
                    <li>Cross-channel customer journeys were invisible, preventing holistic campaign optimization</li>
                    <li>Lead quality scoring didn't account for multi-touch interaction patterns</li>
                    <li>No systematic way to measure the assisted conversion value of different marketing initiatives</li>
                  </ul>
                  <p className="leading-relaxed">
                    With 8,743 monthly leads across 6 primary channels and complex B2B buying journeys averaging 7.3 touchpoints, the team needed a sophisticated attribution model to optimize performance.
                  </p>
                </div>
              </motion.div>

              {/* Solution */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="glass rounded-3xl p-8"
              >
                <h2 className="text-2xl font-bold mb-6 text-success">Solution</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="leading-relaxed">
                    Built a comprehensive multi-touch attribution system that tracks the complete customer journey and assigns weighted credit to each marketing touchpoint based on its influence on conversion:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <h3 className="font-semibold text-primary mb-3">Attribution Methodology</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Time-decay attribution model weighing recent touchpoints higher</li>
                        <li>Cross-device and cross-channel journey tracking</li>
                        <li>First-touch, last-touch, and linear attribution comparisons</li>
                        <li>Assisted conversion analysis and influence scoring</li>
                        <li>Channel interaction and synergy effect measurement</li>
                      </ul>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <h3 className="font-semibold text-success mb-3">Analytics & Reporting</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Real-time conversion path visualization and analysis</li>
                        <li>Channel performance benchmarking and ROI calculation</li>
                        <li>Lead quality scoring based on journey patterns</li>
                        <li>Budget allocation recommendations and impact modeling</li>
                        <li>Cohort analysis and seasonal trend identification</li>
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
                className="glass rounded-3xl p-8"
              >
                <h2 className="text-2xl font-bold mb-6 text-emerald-400">Results & Impact</h2>
                <div className="space-y-6 text-muted-foreground">
                  <p className="leading-relaxed">
                    The multi-touch attribution model revolutionized marketing decision-making and enabled data-driven optimization that significantly improved both lead quality and conversion rates:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-sm border border-primary/20 rounded-2xl p-6 text-center">
                      <div className="text-3xl font-bold text-primary mb-2">34%</div>
                      <div className="text-sm text-muted-foreground">Improvement in Marketing ROI</div>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-secondary/20 rounded-2xl p-6 text-center">
                      <div className="text-3xl font-bold text-secondary mb-2">$480K</div>
                      <div className="text-sm text-muted-foreground">Annual Budget Optimization Savings</div>
                    </div>
                    <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm border border-primary/20 rounded-2xl p-6 text-center">
                      <div className="text-3xl font-bold text-primary mb-2">29%</div>
                      <div className="text-sm text-muted-foreground">Increase in Lead-to-Customer Rate</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-emerald-400">Quantified Business Outcomes:</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Identified that organic search assists 67% of paid search conversions, preventing budget cuts</li>
                      <li>Discovered email marketing's true contribution was 3.2x higher than last-click attribution showed</li>
                      <li>Reduced cost-per-acquisition by 28% through optimized channel mix allocation</li>
                      <li>Improved lead scoring accuracy by 41% incorporating multi-touch interaction data</li>
                      <li>Enabled attribution-based budget reallocation that increased qualified leads by 23%</li>
                      <li>Reduced attribution reporting time from 8 hours to 15 minutes with automated dashboards</li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Key Learnings */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.4 }}
                className="glass rounded-3xl p-8"
              >
                <h2 className="text-2xl font-bold mb-6 text-purple-400">Key Learnings</h2>
                <div className="space-y-4 text-muted-foreground">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h3 className="font-semibold text-purple-400">Marketing Attribution Insights</h3>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>B2B customer journeys are significantly more complex than traditional models account for</li>
                        <li>Assisted conversions often have more total value than direct conversions in enterprise sales</li>
                        <li>Channel synergy effects can increase conversion rates by 40%+ when measured properly</li>
                        <li>Time-decay attribution balances recency bias while crediting early-stage awareness efforts</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-semibold text-primary">Implementation Insights</h3>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>Cross-device tracking requires careful privacy compliance and data governance</li>
                        <li>Attribution model choice significantly impacts budget allocation decisions</li>
                        <li>Real-time attribution dashboards enable agile campaign optimization</li>
                        <li>Data visualization is crucial for marketing teams to understand complex attribution concepts</li>
                      </ul>
                    </div>
                  </div>
                  <p className="leading-relaxed mt-4">
                    This project demonstrated that attribution modeling is as much about organizational change management as it is about technical implementation. The key is building confidence in the data through transparent methodology and clear business impact.
                  </p>
                </div>
              </motion.div>

              {/* Technologies Used */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.5 }}
                className="bg-gradient-to-br from-gray-500/10 to-slate-500/10 backdrop-blur-sm border border-border/20 rounded-3xl p-8"
              >
                <h2 className="text-2xl font-bold mb-6 text-muted-foreground">Technologies Used</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    'React 19', 'TypeScript', 'Attribution Modeling', 'Customer Journey Mapping',
                    'Cross-Device Tracking', 'Conversion Analysis', 'Marketing Analytics', 'ROI Optimization',
                    'Multi-Touch Attribution', 'Data Visualization', 'Campaign Performance', 'Lead Scoring'
                  ].map((tech, index) => (
                    <span key={index} className="bg-white/10 text-muted-foreground px-3 py-2 rounded-lg text-sm text-center border border-white/20 hover:bg-white/20 transition-colors">
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* STAR Impact Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mt-16 space-y-8"
              >
                <div className="text-center space-y-4">
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    STAR Impact Analysis
                  </h2>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Tracking project progression from Situation through Action to measurable Results
                  </p>
                </div>

                <div className="glass rounded-3xl p-8">
                  <STARAreaChart
                    data={starData}
                    title="Project Progression Metrics"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-6 glass rounded-2xl">
                    <div className="text-sm text-primary/70 mb-2">Situation</div>
                    <div className="text-lg font-bold text-white">Initial Assessment</div>
                  </div>
                  <div className="text-center p-6 glass rounded-2xl">
                    <div className="text-sm text-green-400/70 mb-2">Task</div>
                    <div className="text-lg font-bold text-white">Goal Definition</div>
                  </div>
                  <div className="text-center p-6 glass rounded-2xl">
                    <div className="text-sm text-amber-400/70 mb-2">Action</div>
                    <div className="text-lg font-bold text-white">Implementation</div>
                  </div>
                  <div className="text-center p-6 glass rounded-2xl">
                    <div className="text-sm text-cyan-400/70 mb-2">Result</div>
                    <div className="text-lg font-bold text-white">Measurable Impact</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </div>
      </div>
    </>
  )
}
