'use client'


import { STARAreaChart } from '@/components/projects/STARAreaChart'
import { starData, attributionMetrics, technologies } from '../data/constants'
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
            Engineered an advanced multi-channel attribution system using machine learning to accurately measure the cross-channel impact of marketing efforts, enabling sophisticated budget optimization and campaign strategy refinement.
          </p>
          <p className="leading-relaxed">
            This system evolved beyond traditional attribution models to provide AI-powered insights into channel interactions, customer journey patterns, and optimal budget allocation strategies that drove significant improvements in marketing efficiency and ROI.
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
            Traditional attribution models were failing to capture the complex interactions between channels in an increasingly sophisticated multi-channel marketing environment:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Linear and time-decay models underestimated the synergy effects between channels</li>
            <li>Cross-device customer journeys created attribution gaps and double-counting issues</li>
            <li>Campaign optimization decisions were based on incomplete channel interaction data</li>
            <li>Budget allocation models couldn't account for diminishing returns and channel saturation</li>
            <li>No way to predict the impact of budget shifts across different channel combinations</li>
            <li>Marketing mix modeling was reactive, not predictive for strategic planning</li>
          </ul>
          <p className="leading-relaxed">
            With 12 active marketing channels, complex B2B customer journeys, and a $3.2M annual marketing budget, the organization needed a sophisticated attribution solution that could handle multi-channel complexity.
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
            Developed a machine learning-powered multi-channel attribution platform that uses advanced algorithms to understand channel interactions and predict optimal marketing strategies:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="font-semibold text-primary mb-3">ML Attribution Engine</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Algorithmic attribution using ensemble machine learning models</li>
                <li>Cross-channel interaction analysis and synergy quantification</li>
                <li>Probabilistic customer journey reconstruction across devices</li>
                <li>Dynamic attribution weights based on conversion likelihood</li>
                <li>Incremental lift testing and media mix optimization</li>
              </ul>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="font-semibold text-success mb-3">Predictive Analytics</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Budget optimization recommendations with scenario modeling</li>
                <li>Channel saturation curves and diminishing returns analysis</li>
                <li>Predictive conversion probability scoring</li>
                <li>Real-time campaign performance monitoring and alerts</li>
                <li>Automated insights generation and actionable recommendations</li>
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
            The ML-powered attribution system delivered unprecedented insights into channel performance and enabled data-driven optimizations that significantly improved marketing efficiency:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-xs border border-primary/20 rounded-xl p-6 text-center">
              <div className="typography-h2 border-none pb-0 text-2xl text-primary mb-2">92.4%</div>
              <div className="typography-small text-muted-foreground">ML Attribution Accuracy</div>
            </div>
            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xs border border-secondary/20 rounded-xl p-6 text-center">
              <div className="typography-h2 border-none pb-0 text-2xl text-secondary mb-2">47.8%</div>
              <div className="typography-small text-muted-foreground">Conversion Rate Improvement</div>
            </div>
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xs border border-primary/20 rounded-xl p-6 text-center">
              <div className="typography-h2 border-none pb-0 text-2xl text-primary mb-2">{formatCurrency(attributionMetrics.totalROI)}</div>
              <div className="typography-small text-muted-foreground">Marketing ROI Optimization</div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-emerald-400">Quantified Business Outcomes:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Discovered channel synergy effects worth $890K annually in previously hidden value</li>
              <li>Reduced customer acquisition cost by 31% through optimized channel mix allocation</li>
              <li>Increased marketing qualified leads by 38% with same budget through reallocation</li>
              <li>Improved campaign ROI prediction accuracy from 67% to 92.4% using ML models</li>
              <li>Identified optimal budget allocation across 12 channels saving $640K annually</li>
              <li>Reduced attribution analysis time from 3 days to 2 hours with automated insights</li>
              <li>Enabled predictive budget planning with 85% accuracy for quarterly forecasts</li>
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
              <h3 className="font-semibold text-purple-400">Advanced Attribution Insights</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Machine learning attribution significantly outperforms rule-based models in complex environments</li>
                <li>Channel synergy effects can account for 20-30% of total conversion value</li>
                <li>Cross-device attribution requires probabilistic modeling, not deterministic matching</li>
                <li>Budget saturation curves vary dramatically by channel and require individual optimization</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-primary">Implementation Excellence</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Model interpretability is crucial for marketing team adoption and trust</li>
                <li>Real-time attribution enables agile campaign optimization and budget shifts</li>
                <li>Automated insights generation scales attribution analysis across large channel portfolios</li>
                <li>Predictive capabilities transform attribution from reporting to strategic planning tool</li>
              </ul>
            </div>
          </div>
          <p className="leading-relaxed mt-4">
            This project established that advanced attribution modeling is not just about measurement—it's about enabling predictive marketing intelligence that can guide strategic decisions and optimize performance before campaigns even launch.
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
