'use client'

import { m as motion } from 'framer-motion'
import { STARAreaChart } from '@/components/projects/STARAreaChart'
import { starData, technologies } from '../data/constants'

export function NarrativeSections() {
  return (
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
            <li>Lead quality scoring didn&apos;t account for multi-touch interaction patterns</li>
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
              <li>Discovered email marketing&apos;s true contribution was 3.2x higher than last-click attribution showed</li>
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
          {technologies.map((tech, index) => (
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
  )
}
