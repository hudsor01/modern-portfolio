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
            Architected and implemented a comprehensive Revenue Operations Center that serves as the central hub for all revenue-related data, processes, and strategic decision-making across sales, marketing, and customer success teams.
          </p>
          <p className="leading-relaxed">
            This enterprise-level RevOps platform became the operational backbone of the organization, consolidating 12 different systems into a unified command center that enables real-time visibility, predictive analytics, and automated workflows for revenue optimization.
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
            The organization was struggling with fragmented revenue operations across departments, creating inefficiencies and limiting growth potential:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Revenue data was scattered across 12 different systems with no single source of truth</li>
            <li>Sales, marketing, and customer success teams operated in silos with misaligned metrics</li>
            <li>Manual reporting processes consumed 25+ hours weekly across multiple departments</li>
            <li>Revenue forecasting was inconsistent with accuracy rates below 75%</li>
            <li>No unified customer journey visibility from lead to retention</li>
            <li>Strategic decisions were delayed due to lack of real-time operational insights</li>
            <li>Process automation was limited, causing scalability constraints</li>
          </ul>
          <p className="leading-relaxed">
            With rapid growth and increasing complexity, the company needed a unified RevOps platform to align teams, automate processes, and enable data-driven revenue optimization at scale.
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
            Built a comprehensive Revenue Operations Center that unifies all revenue-related functions into a single, intelligent platform with advanced analytics and automation capabilities:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="font-semibold text-primary mb-3">Unified Data Platform</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Real-time data integration from 12 source systems with automated ETL pipelines</li>
                <li>360-degree customer journey tracking from first touch to renewal</li>
                <li>Unified revenue metrics and KPI standardization across departments</li>
                <li>Advanced data validation and quality monitoring systems</li>
                <li>Role-based access controls and data governance framework</li>
              </ul>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="font-semibold text-success mb-3">Intelligence & Automation</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Predictive revenue forecasting with 96.8% accuracy using ML models</li>
                <li>Automated workflow orchestration for lead routing and follow-up</li>
                <li>Real-time performance monitoring and alerting systems</li>
                <li>Executive dashboards with drill-down capabilities and insights</li>
                <li>Automated reporting and insight generation for all stakeholders</li>
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
            The Revenue Operations Center transformed how the organization manages and optimizes revenue, delivering unprecedented visibility and efficiency across all revenue functions:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-xs border border-primary/20 rounded-xl p-6 text-center">
              <div className="typography-h2 border-none pb-0 text-2xl text-primary mb-2">96.8%</div>
              <div className="typography-small text-muted-foreground">Revenue Forecast Accuracy</div>
            </div>
            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xs border border-secondary/20 rounded-xl p-6 text-center">
              <div className="typography-h2 border-none pb-0 text-2xl text-secondary mb-2">34.2%</div>
              <div className="typography-small text-muted-foreground">YoY Revenue Growth</div>
            </div>
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xs border border-primary/20 rounded-xl p-6 text-center">
              <div className="typography-h2 border-none pb-0 text-2xl text-primary mb-2">89.7%</div>
              <div className="typography-small text-muted-foreground">Operational Efficiency Score</div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-emerald-400">Quantified Business Outcomes:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Improved revenue forecasting accuracy from 74% to 96.8% using predictive analytics</li>
              <li>Reduced manual reporting time by 78% through automated dashboard generation</li>
              <li>Increased lead-to-opportunity conversion rate by 31% through optimized routing</li>
              <li>Shortened sales cycle by 22 days average through process automation</li>
              <li>Achieved 34.2% YoY revenue growth, exceeding 25% target through data-driven optimization</li>
              <li>Improved customer retention rate by 18% through proactive churn prediction</li>
              <li>Enabled real-time decision making, reducing strategic planning cycles from weeks to days</li>
              <li>Created unified team alignment, improving cross-department collaboration scores by 45%</li>
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
              <h3 className="font-semibold text-purple-400">Revenue Operations Strategy</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Unified data architecture is the foundation of effective revenue operations</li>
                <li>Cross-functional team alignment requires standardized metrics and shared visibility</li>
                <li>Predictive analytics dramatically outperform traditional forecasting methods</li>
                <li>Process automation scales human expertise and reduces operational overhead</li>
                <li>Real-time insights enable proactive rather than reactive revenue management</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-primary">Implementation Excellence</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Data governance must be established before building analytics layers</li>
                <li>User adoption requires intuitive interfaces and immediate value demonstration</li>
                <li>Phased rollout prevents disruption while building confidence in new systems</li>
                <li>Continuous monitoring and optimization are essential for sustained performance</li>
                <li>Executive sponsorship and change management are critical for transformation success</li>
              </ul>
            </div>
          </div>
          <p className="leading-relaxed mt-4">
            This project demonstrated that revenue operations is not just about technology—it's about creating a culture of data-driven decision making that permeates every aspect of the revenue organization. The most successful RevOps implementations focus on people and processes as much as platforms.
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
