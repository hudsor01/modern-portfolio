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
            <li>Pricing strategies weren&apos;t aligned with acquisition cost realities and profitability targets</li>
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
