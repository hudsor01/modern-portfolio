'use client'

import { SectionCard } from '@/components/ui/section-card'
import { ResultCard, FeatureCard } from '@/components/projects/shared'
import { formatCurrency, formatPercentage } from '@/lib/utils/data-formatters'

const _technologies = [
  'Python',
  'Machine Learning',
  'Time Series Analysis',
  'Plotly',
  'Recharts',
  'PostgreSQL',
  'Next.js',
  'TypeScript',
  'Predictive Analytics',
  'Real-time Processing',
  'Salesforce Integration',
  'Data Modeling',
]

export function NarrativeSections() {
  return (
    <div className="space-y-12 mt-12">
      {/* Situation */}
      <SectionCard title="Situation">
        <div className="space-y-4 text-muted-foreground">
          <p className="text-lg leading-relaxed">
            When I was brought in to assess the revenue forecasting function, I discovered a
            critical problem: the organization was flying blind. Forecast accuracy was hovering
            around 63%—essentially a coin flip—and deal slippage was rampant. The sales team
            would commit to quarterly numbers, but by quarter-end, 26% of committed deals had
            either pushed or fallen out entirely.
          </p>
          <p className="leading-relaxed">
            The root cause was clear: forecasting was based on gut feel and rep optimism rather
            than data-driven signals. There was no early warning system for at-risk deals, no
            objective deal health scoring, and no way to predict which deals would actually close.
            With over 4,200 deals in the pipeline representing {formatCurrency(12500000)} in
            potential revenue, the forecasting gap was costing millions in missed targets and
            misallocated resources.
          </p>
        </div>
      </SectionCard>

      {/* Task */}
      <SectionCard title="Task">
        <div className="space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            I was tasked with building an intelligent forecasting and pipeline intelligence
            system that would transform revenue prediction from art to science. My specific
            objectives included:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Improve forecast accuracy from 63% to at least 90%</li>
            <li>Reduce deal slippage by at least 20% through early warning systems</li>
            <li>Build AI-powered deal health scoring using 50+ behavioral signals</li>
            <li>Create predictive close date modeling with high confidence intervals</li>
            <li>Develop real-time pipeline intelligence dashboards for executives</li>
            <li>Enable proactive intervention for at-risk deals before they slip</li>
          </ul>
        </div>
      </SectionCard>

      {/* Action */}
      <SectionCard title="Action">
        <div className="space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            I designed and built a comprehensive forecast intelligence platform from scratch,
            combining machine learning, behavioral analytics, and real-time data processing
            to create an early warning system for pipeline risk:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <FeatureCard title="AI/ML Systems I Built">
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Deal health scoring engine analyzing 50+ engagement signals</li>
                <li>Predictive close date modeling using historical patterns</li>
                <li>Anomaly detection for sudden engagement drops</li>
                <li>Competitive threat assessment based on buyer behavior</li>
                <li>Champion strength scoring for deal progression prediction</li>
              </ul>
            </FeatureCard>
            <FeatureCard title="Pipeline Intelligence Features">
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Real-time deal health dashboards with drill-down capability</li>
                <li>Automated early warning alerts for at-risk deals</li>
                <li>Executive forecasting dashboard with scenario planning</li>
                <li>Intervention recommendation engine for sales managers</li>
                <li>Historical accuracy tracking and model improvement loops</li>
              </ul>
            </FeatureCard>
          </div>

          <p className="leading-relaxed mt-4">
            I personally led the data science work to identify the most predictive signals,
            built the integration layer with Salesforce CRM, and designed the user experience
            for both individual reps and executives. The system was deployed in phases, starting
            with the largest deals to validate accuracy before scaling across the full pipeline.
          </p>
        </div>
      </SectionCard>

      {/* Result */}
      <SectionCard title="Result">
        <div className="space-y-6 text-muted-foreground">
          <p className="leading-relaxed">
            The forecast intelligence system I built transformed pipeline management from
            reactive firefighting to proactive revenue optimization, delivering measurable
            improvements that exceeded every target:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <ResultCard
              value={formatPercentage(0.94)}
              label="Forecast Accuracy Achieved"
              variant="primary"
            />
            <ResultCard
              value={formatPercentage(0.31)}
              label="Accuracy Improvement"
              variant="secondary"
            />
            <ResultCard
              value={formatPercentage(0.26)}
              label="Slippage Reduction"
              variant="primary"
            />
            <ResultCard
              value={formatCurrency(12500000, { compact: true })}
              label="Revenue Protected"
              variant="secondary"
            />
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-secondary">Quantified Business Outcomes I Delivered:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Improved forecast accuracy from 63% to 94%—a 31 percentage point improvement</li>
              <li>Reduced deal slippage from 26% to 19%—protecting {formatCurrency(12500000)} in committed revenue</li>
              <li>Detected 89% of at-risk deals 2-4 weeks before slippage would have occurred</li>
              <li>Enabled intervention success rate of 67% for deals flagged by the early warning system</li>
              <li>Reduced forecast review meetings from weekly 2-hour sessions to 30-minute exception-based reviews</li>
              <li>Gave executives real-time confidence in commit, best-case, and worst-case scenarios</li>
            </ul>
          </div>
        </div>
      </SectionCard>

      {/* Key Learnings */}
      <SectionCard title="Key Learnings">
        <div className="space-y-4 text-muted-foreground">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-accent-foreground">Forecasting Insights</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  Buyer engagement patterns are more predictive than rep confidence—I now
                  always prioritize behavioral data over subjective assessments
                </li>
                <li>
                  Early warning effectiveness depends on actionability; alerts without
                  intervention playbooks get ignored
                </li>
                <li>
                  Model accuracy improves dramatically with feedback loops—I built in
                  mechanisms for reps to confirm or dispute predictions
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-primary">Technical Insights</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  Real-time data processing is essential—batch updates make predictions
                  stale by the time they're actionable
                </li>
                <li>
                  Explainable AI matters for adoption; I learned to show why a deal is
                  flagged, not just that it is flagged
                </li>
                <li>
                  Historical pattern matching outperforms pure ML for deal close prediction
                  when you have rich CRM history
                </li>
              </ul>
            </div>
          </div>
          <p className="leading-relaxed mt-4">
            This project taught me that the best forecasting systems don't just predict—they
            enable intervention. The value isn't in knowing a deal will slip; it's in preventing
            the slip. I now design every analytics system with action enablement as the primary
            success metric.
          </p>
        </div>
      </SectionCard>
    </div>
  )
}
