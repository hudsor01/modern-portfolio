'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import {
  ArrowLeft,
  RefreshCcw,
  TrendingUp,
  DollarSign,
  Target,
  Calculator,
} from 'lucide-react'
import Link from 'next/link'
import { m as motion } from 'framer-motion'

// Lazy-load chart components with Suspense fallback
const CACBreakdownChart = dynamic(() => import('./CACBreakdownChart'), {
  loading: () => <div className="h-[350px] w-full animate-pulse bg-muted rounded-lg" />,
  ssr: true
})
const UnitEconomicsChart = dynamic(() => import('./UnitEconomicsChart'), {
  loading: () => <div className="h-[350px] w-full animate-pulse bg-muted rounded-lg" />,
  ssr: true
})

// Real data based on partner analytics
const cacMetrics = {
  partnerDrivenCAC: 127,
  directCAC: 289,
  blendedCAC: 168,
  averageLTV: 612,
  paybackPeriod: 8.4,
  ltv_cac_ratio: 3.6,
  grossMargin: 78.5,
  monthlyChurn: 4.2
}

const channelPerformance = [
  { channel: 'Certified Partners', cac: 98, ltv: 687, customers: 1089, efficiency: 7.0 },
  { channel: 'Legacy Partners', cac: 156, ltv: 578, customers: 743, efficiency: 3.7 },
  { channel: 'Direct Sales', cac: 289, ltv: 534, customers: 201, efficiency: 1.8 },
  { channel: 'Inactive Partners', cac: 234, ltv: 445, customers: 67, efficiency: 1.9 },
]

const productTierEconomics = [
  { tier: 'Enterprise Pro ($349)', cac: 156, ltv: 892, margin: 83.2, payback: 6.2 },
  { tier: 'Business Plus ($199)', cac: 134, ltv: 567, margin: 78.9, payback: 7.8 },
  { tier: 'Starter Web ($99)', cac: 89, ltv: 287, margin: 71.4, payback: 9.1 },
  { tier: 'Support ($9)', cac: 12, ltv: 43, margin: 65.8, payback: 2.1 },
]

export default function CACUnitEconomics() {
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
              {['overview', 'channels', 'products'].map((tab) => (
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
              {/* Blended CAC */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative glass-interactive rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-success/20 rounded-2xl">
                      <DollarSign className="h-6 w-6 text-success" />
                    </div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Blended CAC</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">
                    {formatCurrency(cacMetrics.blendedCAC)}
                  </p>
                  <p className="text-sm text-muted-foreground">Cost to Acquire</p>
                </div>
              </motion.div>

              {/* Average LTV */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative glass-interactive rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-primary/20 rounded-2xl">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Lifetime Value</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">
                    {formatCurrency(cacMetrics.averageLTV)}
                  </p>
                  <p className="text-sm text-muted-foreground">Average LTV</p>
                </div>
              </motion.div>

              {/* LTV:CAC Ratio */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative glass-interactive rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-500/20 rounded-2xl">
                      <Calculator className="h-6 w-6 text-purple-400" />
                    </div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">LTV:CAC</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">
                    {cacMetrics.ltv_cac_ratio.toFixed(1)}:1
                  </p>
                  <p className="text-sm text-muted-foreground">Efficiency Ratio</p>
                </div>
              </motion.div>

              {/* Payback Period */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative glass-interactive rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-amber-500/20 rounded-2xl">
                      <Target className="h-6 w-6 text-amber-400" />
                    </div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Payback</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">
                    {cacMetrics.paybackPeriod} mo
                  </p>
                  <p className="text-sm text-muted-foreground">Payback Period</p>
                </div>
              </motion.div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* CAC Breakdown */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="glass rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300"
                >
                  <div className="mb-4">
                    <h2 className="text-xl font-bold mb-1">Customer Acquisition Cost Breakdown by Channel</h2>
                    <p className="text-sm text-muted-foreground">Strategic CAC analysis revealing certified partners deliver 70% lower acquisition costs ($98 vs $289) compared to direct sales channels</p>
                  </div>
                  <div className="h-[250px]">
                    <CACBreakdownChart />
                  </div>
                </motion.div>

                {/* Unit Economics */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="glass rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300"
                >
                  <div className="mb-4">
                    <h2 className="text-xl font-bold mb-1">Unit Economics Performance Dashboard</h2>
                    <p className="text-sm text-muted-foreground">LTV:CAC ratio trending from 2.8:1 to 4.0:1 through systematic partner optimization and payback period reduction strategies</p>
                  </div>
                  <div className="h-[250px]">
                    <UnitEconomicsChart />
                  </div>
                </motion.div>
              </div>
            )}

            {activeTab === 'channels' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="glass rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300 mb-8"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-bold mb-1">Partner Channel ROI & Acquisition Efficiency Analysis</h2>
                  <p className="text-sm text-muted-foreground">Data-driven partner channel optimization revealing certified partners achieve 7:1 LTV:CAC efficiency vs 1.8:1 for direct sales</p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 font-semibold">Channel</th>
                        <th className="text-left py-3 px-4 font-semibold">CAC</th>
                        <th className="text-left py-3 px-4 font-semibold">LTV</th>
                        <th className="text-left py-3 px-4 font-semibold">Customers</th>
                        <th className="text-left py-3 px-4 font-semibold">Efficiency</th>
                      </tr>
                    </thead>
                    <tbody>
                      {channelPerformance.map((channel, index) => (
                        <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4 font-medium">{channel.channel}</td>
                          <td className="py-4 px-4">{formatCurrency(channel.cac)}</td>
                          <td className="py-4 px-4">{formatCurrency(channel.ltv)}</td>
                          <td className="py-4 px-4">{channel.customers.toLocaleString()}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              channel.efficiency >= 5 ? 'bg-success/20 text-success' :
                              channel.efficiency >= 3 ? 'bg-warning/20 text-warning' :
                              'bg-destructive/20 text-destructive'
                            }`}>
                              {channel.efficiency.toFixed(1)}:1
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'products' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="glass rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300 mb-8"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-bold mb-1">SaaS Product Tier Unit Economics & Profitability</h2>
                  <p className="text-sm text-muted-foreground">Multi-tier pricing strategy analysis showing $349 Enterprise Pro achieving 83.2% gross margin with 6.2-month payback optimization</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {productTierEconomics.map((product, index) => (
                    <div key={index} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                      <h3 className="text-base font-semibold mb-3">{product.tier}</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">CAC:</span>
                          <span className="font-medium">{formatCurrency(product.cac)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">LTV:</span>
                          <span className="font-medium">{formatCurrency(product.ltv)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Margin:</span>
                          <span className="font-medium">{product.margin}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Payback:</span>
                          <span className="font-medium">{product.payback} mo</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Business Insights */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-success/20 rounded-3xl p-6"
            >
              <h2 className="text-xl font-bold mb-4 text-success">Proven Revenue Operations Impact & ROI Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-success mb-1">32%</div>
                  <div className="text-xs text-muted-foreground">CAC Reduction Through Strategic Partner Channel Optimization</div>
                </div>
                <div className="glass rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-400 mb-1">3.6:1</div>
                  <div className="text-xs text-muted-foreground">Industry-Leading LTV:CAC Efficiency Ratio (Benchmark: 3:1+)</div>
                </div>
                <div className="glass rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">8.4 mo</div>
                  <div className="text-xs text-muted-foreground">Optimized Customer Payback Period (Target: &lt;12mo)</div>
                </div>
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
                    Developed a comprehensive Customer Acquisition Cost (CAC) and unit economics analysis system to optimize customer acquisition efficiency and establish sustainable growth metrics for long-term business planning.
                  </p>
                  <p className="leading-relaxed">
                    This analytical framework became the foundation for strategic decision-making around customer acquisition investments, channel optimization, and pricing strategies, enabling the organization to achieve industry-leading LTV:CAC ratios and sustainable growth.
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
                    The organization was struggling with unsustainable customer acquisition costs and lacked visibility into the true unit economics of their business model:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>CAC calculations were inconsistent across teams, leading to conflicting optimization strategies</li>
                    <li>No systematic tracking of customer payback periods or lifetime value relationships</li>
                    <li>Marketing spend decisions were made without understanding channel-specific unit economics</li>
                    <li>Pricing strategies weren't aligned with acquisition cost realities and profitability targets</li>
                    <li>No early warning system for unsustainable growth patterns or CAC inflation</li>
                    <li>Investor reporting lacked standardized unit economics metrics and benchmarking</li>
                  </ul>
                  <p className="leading-relaxed">
                    With rising competition driving up acquisition costs across all channels and pressure to achieve profitability, the company needed a sophisticated approach to understanding and optimizing customer unit economics.
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
                    Built a comprehensive unit economics analytics platform that provides real-time visibility into CAC, LTV, and payback metrics with sophisticated segmentation and optimization capabilities:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <h3 className="font-semibold text-primary mb-3">Unit Economics Framework</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Standardized CAC calculation methodology across all acquisition channels</li>
                        <li>Cohort-based LTV analysis with predictive modeling and confidence intervals</li>
                        <li>Payback period tracking with channel and segment-specific benchmarks</li>
                        <li>Contribution margin analysis and profitability modeling</li>
                        <li>LTV:CAC ratio optimization with industry benchmarking</li>
                      </ul>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <h3 className="font-semibold text-success mb-3">Optimization Tools</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Real-time channel performance monitoring and alerting</li>
                        <li>Budget allocation optimization based on unit economics efficiency</li>
                        <li>Scenario modeling for pricing and acquisition strategy decisions</li>
                        <li>Automated insights and recommendations for CAC improvement</li>
                        <li>Executive dashboards with investor-ready metrics and trend analysis</li>
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
                    The unit economics optimization system enabled data-driven growth strategies that significantly improved acquisition efficiency and long-term profitability:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-sm border border-primary/20 rounded-2xl p-6 text-center">
                      <div className="text-3xl font-bold text-primary mb-2">32%</div>
                      <div className="text-sm text-muted-foreground">CAC Reduction Achievement</div>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-secondary/20 rounded-2xl p-6 text-center">
                      <div className="text-3xl font-bold text-secondary mb-2">3.6:1</div>
                      <div className="text-sm text-muted-foreground">LTV:CAC Ratio Achieved</div>
                    </div>
                    <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm border border-primary/20 rounded-2xl p-6 text-center">
                      <div className="text-3xl font-bold text-primary mb-2">8.4 mo</div>
                      <div className="text-sm text-muted-foreground">Customer Payback Period</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-emerald-400">Quantified Business Outcomes:</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Reduced blended CAC from $247 to $168 through channel optimization and efficiency improvements</li>
                      <li>Achieved industry-leading LTV:CAC ratio of 3.6:1, exceeding the 3:1 benchmark for sustainable growth</li>
                      <li>Improved customer payback period from 14.2 months to 8.4 months through pricing optimization</li>
                      <li>Identified $890K in annual savings through elimination of unprofitable acquisition channels</li>
                      <li>Increased overall contribution margin by 28% through better customer segment targeting</li>
                      <li>Enabled data-driven pricing strategy that improved unit economics while maintaining growth</li>
                      <li>Reduced time-to-insight for unit economics analysis from 2 weeks to 1 day</li>
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
                      <h3 className="font-semibold text-purple-400">Unit Economics Strategy</h3>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>Sustainable growth requires maintaining LTV:CAC ratios above 3:1 with payback periods under 12 months</li>
                        <li>Channel-specific unit economics can vary by 200%+, making blended metrics misleading for optimization</li>
                        <li>Customer segmentation significantly impacts unit economics and should drive targeted acquisition strategies</li>
                        <li>Pricing decisions have exponential impact on unit economics and should be optimized alongside acquisition costs</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-semibold text-primary">Implementation Success Factors</h3>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>Standardized calculation methodologies are essential for consistent decision-making across teams</li>
                        <li>Real-time monitoring enables quick intervention before unit economics deteriorate significantly</li>
                        <li>Cohort-based analysis provides more accurate LTV predictions than aggregate historical data</li>
                        <li>Executive visibility into unit economics drives more disciplined growth and investment decisions</li>
                      </ul>
                    </div>
                  </div>
                  <p className="leading-relaxed mt-4">
                    This project reinforced that sustainable growth is not about maximizing acquisition volume, but optimizing the efficiency and profitability of each customer acquired. Unit economics must be the north star for all growth initiatives.
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
                    'React 19', 'TypeScript', 'Unit Economics', 'CAC Analysis',
                    'LTV Modeling', 'Cohort Analysis', 'Financial Modeling', 'Contribution Margin Analysis',
                    'Payback Period Tracking', 'Channel Optimization', 'Profitability Analysis', 'Business Intelligence'
                  ].map((tech, index) => (
                    <span key={index} className="bg-white/10 text-muted-foreground px-3 py-2 rounded-lg text-sm text-center border border-white/20 hover:bg-white/20 transition-colors">
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}