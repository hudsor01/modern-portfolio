'use client'


import { STARAreaChart } from '@/components/projects/STARAreaChart'
import { starData, technologies } from '../data/constants'

export function NarrativeSections() {
  return (
    <div className="space-y-12 mt-12">
      {/* Project Overview */}
      <div
        className="glass rounded-2xl p-8"
      >
        <h2 className="typography-h3 mb-6 text-primary">Project Overview</h2>
        <div className="space-y-4 text-muted-foreground">
          <p className="text-lg leading-relaxed">
            Designed and implemented a comprehensive deal funnel analytics system to provide real-time visibility into sales pipeline performance, conversion rates, and revenue velocity across different market segments and deal sizes.
          </p>
          <p className="leading-relaxed">
            This strategic initiative enabled data-driven sales optimization, improved forecasting accuracy, and identified critical bottlenecks that were constraining revenue growth across the organization&apos;s diverse customer segments.
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
            The sales organization lacked comprehensive visibility into pipeline performance across different segments, making it difficult to optimize conversion rates and identify process improvements:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>No standardized way to track deal progression across 4 distinct market segments</li>
            <li>Sales velocity metrics were calculated manually, often with inconsistent methodologies</li>
            <li>Pipeline bottlenecks were identified reactively, after deals had already stalled</li>
            <li>Conversion rate analysis was limited to overall averages, missing segment-specific insights</li>
            <li>Revenue forecasting accuracy suffered due to lack of granular pipeline data</li>
          </ul>
          <p className="leading-relaxed">
            With 847 active opportunities worth $14.2M in pipeline, the team needed a systematic approach to optimize deal flow and maximize revenue conversion.
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
            Built a comprehensive deal funnel analytics dashboard that provides real-time visibility into sales performance with advanced segmentation and velocity tracking:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="font-semibold text-primary mb-3">Analytics Framework</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Multi-stage funnel tracking with conversion rate analysis</li>
                <li>Segment-based performance comparisons (Enterprise, SMB, etc.)</li>
                <li>Real-time deal velocity calculations and trending</li>
                <li>Automated bottleneck identification and alerting</li>
                <li>Historical performance benchmarking and forecasting</li>
              </ul>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="font-semibold text-success mb-3">Interactive Features</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Dynamic filtering by segment, stage, and deal size</li>
                <li>Drill-down capabilities from overview to individual deals</li>
                <li>Performance comparison tools and trend analysis</li>
                <li>Automated reporting and insights generation</li>
                <li>Mobile-optimized dashboards for field sales teams</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Results & Impact */}
      <div
        className="glass rounded-2xl p-8"
      >
        <h2 className="typography-h3 mb-6 text-emerald-400">Results & Impact</h2>
        <div className="space-y-6 text-muted-foreground">
          <p className="leading-relaxed">
            The deal funnel analytics system transformed sales performance visibility and enabled data-driven optimization that significantly improved conversion rates and revenue velocity:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-xs border border-primary/20 rounded-xl p-6 text-center">
              <div className="typography-h2 border-none pb-0 text-2xl text-primary mb-2">27%</div>
              <div className="typography-small text-muted-foreground">Overall Conversion Rate Improvement</div>
            </div>
            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xs border border-secondary/20 rounded-xl p-6 text-center">
              <div className="typography-h2 border-none pb-0 text-2xl text-secondary mb-2">31 Days</div>
              <div className="typography-small text-muted-foreground">Reduction in Average Sales Cycle</div>
            </div>
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xs border border-primary/20 rounded-xl p-6 text-center">
              <div className="typography-h2 border-none pb-0 text-2xl text-primary mb-2">$2.8M</div>
              <div className="typography-small text-muted-foreground">Additional Pipeline Value Captured</div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-emerald-400">Quantified Business Outcomes:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Improved forecast accuracy from 73% to 89% through better pipeline visibility</li>
              <li>Reduced deal stagnation in middle stages by 34% through proactive intervention</li>
              <li>Identified that SMB deals close 47% faster, enabling resource reallocation</li>
              <li>Increased Enterprise segment conversion rate from 18% to 24%</li>
              <li>Reduced time-to-close for deals over $100K by 22 days average</li>
              <li>Enabled sales managers to coach 15% more effectively with data-driven insights</li>
            </ul>
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
              <h3 className="font-semibold text-purple-400">Sales Process Insights</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Different market segments require fundamentally different sales approaches and timelines</li>
                <li>Pipeline stagnation patterns are predictable and can be prevented with early intervention</li>
                <li>Sales velocity is more impactful than pure volume for revenue optimization</li>
                <li>Mid-funnel conversion rates are the highest leverage point for overall improvement</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-primary">Technical Implementation Insights</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Real-time data updates are crucial for actionable sales coaching and intervention</li>
                <li>Segment-based views prevent &quot;average&quot; metrics from hiding important performance variations</li>
                <li>Visual funnel representations enable faster pattern recognition than tabular data</li>
                <li>Mobile accessibility dramatically increases sales team adoption and daily usage</li>
              </ul>
            </div>
          </div>
          <p className="leading-relaxed mt-4">
            This project highlighted the importance of making complex sales data immediately actionable. The most valuable features weren&apos;t the most sophisticated analyses, but the ones that enabled quick decision-making in daily sales operations.
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
