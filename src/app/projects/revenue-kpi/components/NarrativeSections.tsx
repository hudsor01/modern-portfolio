'use client'

import { m as motion } from 'framer-motion'
import { STARAreaChart } from '@/components/projects/STARAreaChart'
import { starData, technologies } from '../data/constants'
import { formatCurrency } from '../utils'

interface NarrativeSectionsProps {
  totalRevenue: number
}

export function NarrativeSections({ totalRevenue }: NarrativeSectionsProps) {
  return (
    <div className="space-y-12 mt-12">
      {/* Project Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="glass rounded-3xl p-8"
      >
        <h2 className="text-2xl font-bold mb-6 text-primary">Project Overview</h2>
        <div className="space-y-4 text-muted-foreground">
          <p className="text-lg leading-relaxed">
            Developed and implemented a comprehensive real-time revenue analytics dashboard to
            consolidate partner performance data across multiple business channels. This strategic
            initiative was critical for executive decision-making and revenue optimization during a
            period of rapid business growth.
          </p>
          <p className="leading-relaxed">
            The dashboard became the single source of truth for revenue operations, enabling
            data-driven strategic decisions that directly contributed to a 432% growth trajectory
            and {formatCurrency(totalRevenue)} in annual revenue management.
          </p>
        </div>
      </motion.div>

      {/* Challenge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.3 }}
        className="glass rounded-3xl p-8"
      >
        <h2 className="text-2xl font-bold mb-6 text-amber-400">Challenge</h2>
        <div className="space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            The organization was experiencing rapid growth but lacked visibility into partner
            performance across different revenue channels. Revenue data was scattered across
            multiple systems, making it impossible to:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Track real-time partner performance and commission calculations</li>
            <li>Identify high-performing partners and growth opportunities</li>
            <li>Make data-driven decisions about partner tier adjustments</li>
            <li>Forecast revenue accurately for strategic planning</li>
            <li>Optimize partner compensation structures</li>
          </ul>
          <p className="leading-relaxed">
            Manual reporting processes were consuming 15+ hours weekly and often contained
            discrepancies, limiting the leadership team&apos;s ability to respond quickly to market
            opportunities.
          </p>
        </div>
      </motion.div>

      {/* Solution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.4 }}
        className="glass rounded-3xl p-8"
      >
        <h2 className="text-2xl font-bold mb-6 text-success">Solution</h2>
        <div className="space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            Designed and built a comprehensive revenue KPI dashboard using React, TypeScript, and
            Recharts, integrating data from CRM, billing systems, and partner management platforms:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="font-semibold text-primary mb-3">Technical Implementation</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Real-time data integration from multiple sources</li>
                <li>Automated revenue calculations and forecasting</li>
                <li>Interactive visualizations with drill-down capabilities</li>
                <li>Responsive design for mobile and desktop access</li>
                <li>Role-based access controls and data security</li>
              </ul>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="font-semibold text-success mb-3">Business Features</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Partner performance tracking and rankings</li>
                <li>Commission tier analysis and optimization</li>
                <li>Revenue trend analysis and projections</li>
                <li>Automated alert system for KPI thresholds</li>
                <li>Executive summary reports and insights</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Results & Impact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.5 }}
        className="glass rounded-3xl p-8"
      >
        <h2 className="text-2xl font-bold mb-6 text-emerald-400">Results & Impact</h2>
        <div className="space-y-6 text-muted-foreground">
          <p className="leading-relaxed">
            The revenue KPI dashboard transformed how the organization manages and optimizes partner
            relationships, delivering measurable improvements across all key metrics:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-sm border border-primary/20 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {formatCurrency(4200000)}
              </div>
              <div className="text-sm text-muted-foreground">Additional Revenue Generated</div>
            </div>
            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-secondary/20 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-secondary mb-2">94%</div>
              <div className="text-sm text-muted-foreground">Forecast Accuracy Achievement</div>
            </div>
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm border border-primary/20 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">65%</div>
              <div className="text-sm text-muted-foreground">Reduction in Manual Reporting Time</div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-emerald-400">Quantified Business Outcomes:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Increased partner productivity by 28% through improved performance visibility</li>
              <li>Reduced revenue forecasting errors from 18% to 6% variance</li>
              <li>Accelerated decision-making process from weeks to hours</li>
              <li>Improved partner satisfaction scores by 22% through transparent reporting</li>
              <li>Enabled identification of top 20% partners contributing 67% of revenue</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Key Learnings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.6 }}
        className="glass rounded-3xl p-8"
      >
        <h2 className="text-2xl font-bold mb-6 text-purple-400">Key Learnings</h2>
        <div className="space-y-4 text-muted-foreground">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-purple-400">Strategic Insights</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  Real-time visibility into revenue metrics is crucial for agile business operations
                </li>
                <li>
                  Partner performance data patterns reveal optimization opportunities not visible in
                  traditional reports
                </li>
                <li>
                  Executive adoption increases dramatically when dashboards provide actionable
                  insights, not just data
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-primary">Technical Insights</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  Modular chart components enable rapid iteration and customization for different
                  stakeholder needs
                </li>
                <li>
                  Data consistency validation is essential when integrating multiple business
                  systems
                </li>
                <li>
                  Performance optimization becomes critical when handling large datasets with
                  frequent updates
                </li>
              </ul>
            </div>
          </div>
          <p className="leading-relaxed mt-4">
            This project reinforced the importance of bridging technical excellence with business
            strategy. The most impactful features weren&apos;t the most technically complex, but
            those that directly addressed specific business pain points and enabled immediate
            action.
          </p>
        </div>
      </motion.div>

      {/* Technologies Used */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.7 }}
        className="bg-gradient-to-br from-gray-500/10 to-slate-500/10 backdrop-blur-sm border border-border/20 rounded-3xl p-8"
      >
        <h2 className="text-2xl font-bold mb-6 text-muted-foreground">Technologies Used</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {technologies.map((tech, index) => (
            <span
              key={index}
              className="bg-white/10 text-muted-foreground px-3 py-2 rounded-lg text-sm text-center border border-white/20 hover:bg-white/20 transition-colors"
            >
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
          <STARAreaChart data={starData} title="Project Progression Metrics" />
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
