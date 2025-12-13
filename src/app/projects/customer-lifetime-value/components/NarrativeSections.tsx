'use client'


import { STARAreaChart } from '@/components/projects/STARAreaChart'
import { starData, technologies } from '../data/constants'
import { formatCurrency } from '../utils'

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
            Developed a comprehensive customer lifetime value prediction model using advanced analytics and machine learning to enable data-driven customer segmentation and retention strategies. This initiative was critical for optimizing marketing spend and improving customer acquisition ROI.
          </p>
          <p className="leading-relaxed">
            The CLV model became the foundation for strategic decision-making across sales, marketing, and customer success teams, enabling personalized customer journeys and targeted retention campaigns that significantly improved long-term revenue sustainability.
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
            The organization lacked a scientific approach to understanding customer value and predicting future behavior, resulting in inefficient resource allocation and missed revenue opportunities:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Marketing campaigns targeted all customers equally, wasting budget on low-value segments</li>
            <li>Sales teams couldn&apos;t prioritize leads based on predicted lifetime value</li>
            <li>Customer success resources were spread thin without risk-based prioritization</li>
            <li>Retention efforts were reactive rather than predictive</li>
            <li>No systematic way to measure the long-term impact of customer acquisition channels</li>
          </ul>
          <p className="leading-relaxed">
            With 4,287 active customers and no predictive analytics framework, the team was essentially flying blind when making strategic decisions about customer investment.
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
            Built a comprehensive CLV prediction system using machine learning algorithms and RFM analysis to segment customers and predict future value with 94.3% accuracy:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="font-semibold text-primary mb-3">Analytical Framework</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>RFM analysis (Recency, Frequency, Monetary) segmentation</li>
                <li>Predictive modeling using customer behavior patterns</li>
                <li>Cohort analysis and retention curve modeling</li>
                <li>Churn probability scoring with early warning system</li>
                <li>Dynamic customer journey mapping and optimization</li>
              </ul>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="font-semibold text-success mb-3">Technical Implementation</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Interactive dashboard with drill-down capabilities</li>
                <li>Real-time customer scoring and alerts</li>
                <li>Automated segment assignment and recommendations</li>
                <li>Integration with CRM and marketing automation platforms</li>
                <li>24-month forecasting with confidence intervals</li>
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
            The CLV prediction model transformed how the organization approaches customer relationships, enabling data-driven decisions that significantly improved both customer satisfaction and revenue performance:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-xs border border-primary/20 rounded-xl p-6 text-center">
              <div className="typography-h2 border-none pb-0 text-2xl text-primary mb-2">{formatCurrency(1276000)}</div>
              <div className="typography-small text-muted-foreground">Predicted Revenue Impact</div>
            </div>
            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xs border border-secondary/20 rounded-xl p-6 text-center">
              <div className="typography-h2 border-none pb-0 text-2xl text-secondary mb-2">94.3%</div>
              <div className="typography-small text-muted-foreground">Prediction Accuracy</div>
            </div>
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xs border border-primary/20 rounded-xl p-6 text-center">
              <div className="typography-h2 border-none pb-0 text-2xl text-primary mb-2">42%</div>
              <div className="typography-small text-muted-foreground">Improvement in Marketing ROI</div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-emerald-400">Quantified Business Outcomes:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Increased customer retention rate by 18% through proactive intervention</li>
              <li>Reduced churn probability from 21% to 12.8% for at-risk segments</li>
              <li>Improved marketing campaign efficiency by 42% through better targeting</li>
              <li>Enabled 5-tier customer segmentation with 96.7% model confidence</li>
              <li>Identified 1,156 high-value customers contributing 67% of revenue</li>
              <li>Reduced customer acquisition cost by 28% through channel optimization</li>
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
              <h3 className="font-semibold text-purple-400">Strategic Insights</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Customer behavior patterns are more predictable than initially assumed when proper data science techniques are applied</li>
                <li>The top 20% of customers (Champions + Loyal) contribute 60%+ of total revenue, validating the Pareto principle</li>
                <li>Predictive models need regular retraining as customer behavior evolves with market conditions</li>
                <li>Early intervention is 3x more cost-effective than reactive retention efforts</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-primary">Technical Insights</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>RFM analysis combined with behavioral data significantly outperforms demographic-only segmentation</li>
                <li>24-month prediction horizon provides optimal balance between accuracy and actionability</li>
                <li>Real-time scoring enables dynamic customer journey optimization</li>
                <li>Visual dashboards increase adoption when they answer specific business questions, not just display data</li>
              </ul>
            </div>
          </div>
          <p className="leading-relaxed mt-4">
            This project demonstrated that sophisticated analytics can be made accessible and actionable for business teams. The key is translating complex predictions into simple, clear recommendations that drive immediate action.
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
