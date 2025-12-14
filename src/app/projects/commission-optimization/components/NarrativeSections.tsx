'use client'


import { STARAreaChart } from '@/components/projects/STARAreaChart'
import { starData, commissionMetrics, technologies } from '../data/constants'
import { formatCurrency, formatPercent } from '../utils'

export function NarrativeSections() {
  return (
    <div className="space-y-12 mt-12">
      {/* Project Overview */}
      <div
        className="glass rounded-2xl p-8"
      >
        <h2 className="typography-h3 mb-6 text-emerald-400">Project Overview</h2>
        <div className="space-y-4 text-muted-foreground">
          <p className="text-lg leading-relaxed">
            Designed and implemented a comprehensive commission optimization system to manage {formatCurrency(commissionMetrics.totalCommissionPool)} annual commission pool across multi-tier partner structures. This strategic initiative transformed commission management from manual processes to automated optimization.
          </p>
          <p className="leading-relaxed">
            The system enabled data-driven commission strategy decisions that improved partner performance by {formatPercent(commissionMetrics.performanceImprovement)} while achieving {formatPercent(commissionMetrics.automationEfficiency)} automation efficiency across all commission operations.
          </p>
        </div>
      </div>

      {/* Challenge */}
      <div
        className="glass rounded-2xl p-8"
      >
        <h2 className="typography-h3 mb-6 text-amber-400">Challenge</h2>
        <div className="space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            The existing commission structure was hindering partner performance and creating operational inefficiencies. Key problems included:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Manual commission calculations consuming 8.5 hours weekly with frequent errors</li>
            <li>Static tier structures not aligned with actual partner performance patterns</li>
            <li>High dispute rates (3.8%) due to calculation inconsistencies and transparency issues</li>
            <li>Inability to rapidly adjust incentive programs based on market conditions</li>
            <li>Partner dissatisfaction with delayed payments and unclear commission structures</li>
            <li>No visibility into commission ROI or optimization opportunities</li>
          </ul>
          <p className="leading-relaxed">
            These inefficiencies were not only costly operationally but also negatively impacting partner motivation and retention rates.
          </p>
        </div>
      </div>

      {/* Solution */}
      <div
        className="glass rounded-2xl p-8"
      >
        <h2 className="typography-h3 mb-6 text-success">Solution</h2>
        <div className="space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            Developed a comprehensive commission optimization platform with automated tier management, real-time calculations, and performance-based incentive programs:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="font-semibold text-emerald-400 mb-3">Automation Engine</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Real-time commission calculation with 99.8% accuracy</li>
                <li>Automated tier adjustments based on performance metrics</li>
                <li>Dynamic incentive program management</li>
                <li>Integrated dispute resolution workflows</li>
                <li>Compliance monitoring and audit trails</li>
              </ul>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="font-semibold text-success mb-3">Analytics & Optimization</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>ROI analysis for each commission tier and program</li>
                <li>Performance impact measurement and forecasting</li>
                <li>Partner satisfaction tracking and optimization</li>
                <li>Commission structure scenario modeling</li>
                <li>Predictive analytics for tier advancement</li>
              </ul>
            </div>
          </div>

          <p className="leading-relaxed mt-4">
            The solution included comprehensive dashboards for different stakeholders: executives focused on ROI metrics, operations teams managing day-to-day processing, and partners tracking their earnings and performance.
          </p>
        </div>
      </div>

      {/* Results & Impact */}
      <div
        className="glass rounded-2xl p-8"
      >
        <h2 className="typography-h3 mb-6 text-primary">Results & Impact</h2>
        <div className="space-y-6 text-muted-foreground">
          <p className="leading-relaxed">
            The commission optimization system delivered significant operational improvements and partner performance gains:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 backdrop-blur-xs border border-emerald-500/20 rounded-xl p-6 text-center">
              <div className="typography-h2 border-none pb-0 text-2xl text-emerald-400 mb-2">{formatCurrency(commissionMetrics.totalCommissionPool)}</div>
              <div className="typography-small text-muted-foreground">Annual Commission Pool Management</div>
            </div>
            <div className="bg-gradient-to-br from-green-500/10 to-teal-500/10 backdrop-blur-xs border border-success/20 rounded-xl p-6 text-center">
              <div className="typography-h2 border-none pb-0 text-2xl text-success mb-2">+{formatPercent(commissionMetrics.performanceImprovement)}</div>
              <div className="typography-small text-muted-foreground">Partner Performance Improvement</div>
            </div>
            <div className="bg-gradient-to-br from-teal-500/10 to-cyan-500/10 backdrop-blur-xs border border-teal-500/20 rounded-xl p-6 text-center">
              <div className="typography-h2 border-none pb-0 text-2xl text-teal-400 mb-2">{formatPercent(commissionMetrics.automationEfficiency)}</div>
              <div className="typography-small text-muted-foreground">Automation & Processing Efficiency</div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-primary">Quantified Business Outcomes:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Reduced commission processing time from 8.5 to 2.3 hours (73% improvement)</li>
              <li>Decreased dispute rate from 3.8% to 1.2% through improved transparency</li>
              <li>Increased partner satisfaction scores by 19% to 94.7%</li>
              <li>Improved calculation accuracy from 87.8% to 99.8%</li>
              <li>Generated $127K additional revenue through optimized incentive programs</li>
              <li>Achieved 4.2x average ROI across all commission tiers</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
              <div className="typography-h3 text-emerald-400 mb-1">73%</div>
              <div className="typography-small text-muted-foreground">Processing Time Reduction</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
              <div className="typography-h3 text-success mb-1">68%</div>
              <div className="typography-small text-muted-foreground">Dispute Rate Reduction</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
              <div className="typography-h3 text-teal-400 mb-1">99.8%</div>
              <div className="typography-small text-muted-foreground">Calculation Accuracy</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
              <div className="typography-h3 text-primary mb-1">94.7%</div>
              <div className="typography-small text-muted-foreground">Partner Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Learnings */}
      <div
        className="glass rounded-2xl p-8"
      >
        <h2 className="typography-h3 mb-6 text-purple-400">Key Learnings</h2>
        <div className="space-y-4 text-muted-foreground">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-purple-400">Business Strategy Insights</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Commission structures significantly impact partner behavior - small adjustments yield large performance changes</li>
                <li>Transparency in commission calculations builds trust and reduces disputes more than higher rates</li>
                <li>Dynamic tier structures outperform static ones by 23% in partner engagement</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-success">Technical Implementation Insights</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Real-time calculation engines require robust error handling and rollback mechanisms</li>
                <li>Automated audit trails are essential for compliance and dispute resolution</li>
                <li>Performance optimization is critical when processing large commission datasets</li>
              </ul>
            </div>
          </div>
          <p className="leading-relaxed mt-4">
            This project demonstrated that commission optimization is both an art and a science. The most successful strategies combined data-driven insights with deep understanding of partner psychology and motivation patterns.
          </p>
        </div>
      </div>

      {/* Technologies Used */}
      <div
        className="bg-gradient-to-br from-gray-500/10 to-slate-500/10 backdrop-blur-xs border border-border/20 rounded-xl p-8"
      >
        <h2 className="typography-h3 mb-6 text-muted-foreground">Technologies Used</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {technologies.map((tech, index) => (
            <span key={index} className="bg-white/10 text-muted-foreground px-3 py-2 rounded-lg text-sm text-center border border-white/20 hover:bg-white/20 transition-colors">
              {tech}
            </span>
          ))}
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
    </div>
  )
}
