'use client'

import { SectionCard } from '@/components/ui/section-card'
import { ResultCard, TechGrid, FeatureCard } from '@/components/projects/shared'
import { technologies } from '../data/constants'

export function NarrativeSections() {
  return (
    <div className="space-y-12 mt-12">
      {/* Situation */}
      <SectionCard title="Situation">
        <div className="space-y-4 text-muted-foreground">
          <p className="text-lg leading-relaxed">
            When I took ownership of growth analytics, I discovered the organization was flying
            blind on customer acquisition economics. CAC calculations were inconsistent across
            teams—marketing, sales, and finance each had different methodologies, leading to
            conflicting optimization strategies. There was no systematic tracking of payback
            periods or lifetime value relationships, and pricing strategies weren't aligned
            with acquisition cost realities.
          </p>
          <p className="leading-relaxed">
            Rising competition was driving up acquisition costs across all channels, and there
            was increasing pressure to achieve profitability. Without visibility into true unit
            economics, we were essentially guessing which channels were sustainable and which
            were destroying value. Investor reporting lacked standardized metrics, and there
            was no early warning system for CAC inflation.
          </p>
        </div>
      </SectionCard>

      {/* Task */}
      <SectionCard title="Task">
        <div className="space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            I was tasked with building a comprehensive unit economics analytics platform that
            would become the foundation for sustainable growth strategy. My specific objectives
            included:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Establish standardized CAC calculation methodology across all acquisition channels</li>
            <li>Build cohort-based LTV analysis with predictive modeling capabilities</li>
            <li>Create payback period tracking with channel and segment-specific benchmarks</li>
            <li>Develop LTV:CAC ratio optimization to achieve industry-leading benchmarks</li>
            <li>Enable real-time channel performance monitoring with automated alerting</li>
            <li>Build scenario modeling for pricing and acquisition strategy decisions</li>
            <li>Reduce time-to-insight for unit economics analysis from weeks to days</li>
          </ul>
        </div>
      </SectionCard>

      {/* Action */}
      <SectionCard title="Action">
        <div className="space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            I designed and built a comprehensive unit economics analytics platform from scratch,
            providing real-time visibility into CAC, LTV, and payback metrics with sophisticated
            segmentation and optimization capabilities:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <FeatureCard title="Unit Economics Framework I Built">
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Standardized CAC calculation methodology I enforced across all teams</li>
                <li>Cohort-based LTV analysis with predictive modeling and confidence intervals</li>
                <li>Payback period tracking with channel and segment-specific benchmarks</li>
                <li>Contribution margin analysis and profitability modeling by segment</li>
                <li>LTV:CAC ratio optimization with automated industry benchmarking</li>
              </ul>
            </FeatureCard>
            <FeatureCard title="Optimization Tools">
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Real-time channel performance monitoring with proactive alerting</li>
                <li>Budget allocation optimization based on unit economics efficiency</li>
                <li>Scenario modeling for pricing and acquisition strategy decisions</li>
                <li>Automated insights and recommendations for CAC improvement</li>
                <li>Executive dashboards with investor-ready metrics and trend analysis</li>
              </ul>
            </FeatureCard>
          </div>

          <p className="leading-relaxed mt-4">
            I personally led the data standardization effort across marketing, sales, and
            finance teams, designed the calculation methodologies, and trained stakeholders
            on using unit economics to guide their decisions. The platform was deployed in
            phases to validate accuracy before scaling recommendations.
          </p>
        </div>
      </SectionCard>

      {/* Result */}
      <SectionCard title="Result">
        <div className="space-y-6 text-muted-foreground">
          <p className="leading-relaxed">
            The unit economics optimization system I built enabled data-driven growth
            strategies that significantly improved acquisition efficiency and long-term
            profitability:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard value="32%" label="CAC Reduction Achievement" variant="primary" />
            <ResultCard value="3.6:1" label="LTV:CAC Ratio Achieved" variant="secondary" />
            <ResultCard value="8.4 mo" label="Customer Payback Period" variant="primary" />
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-secondary">Quantified Business Outcomes I Delivered:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                Reduced blended CAC from $247 to $168 through channel optimization I directed
              </li>
              <li>
                Achieved industry-leading LTV:CAC ratio of 3.6:1, exceeding the 3:1 benchmark
                for sustainable growth
              </li>
              <li>
                Improved customer payback period from 14.2 months to 8.4 months through pricing
                optimization I recommended
              </li>
              <li>
                Identified $890K in annual savings through elimination of unprofitable acquisition
                channels I flagged
              </li>
              <li>
                Increased overall contribution margin by 28% through better customer segment targeting
              </li>
              <li>
                Enabled data-driven pricing strategy that improved unit economics while maintaining growth
              </li>
              <li>
                Reduced time-to-insight for unit economics analysis from 2 weeks to 1 day
              </li>
            </ul>
          </div>
        </div>
      </SectionCard>

      {/* Key Learnings */}
      <SectionCard title="Key Learnings">
        <div className="space-y-4 text-muted-foreground">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Unit Economics Strategy</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  Sustainable growth requires maintaining LTV:CAC ratios above 3:1 with payback
                  periods under 12 months—I now enforce this as a hard constraint
                </li>
                <li>
                  Channel-specific unit economics can vary by 200%+, making blended metrics
                  dangerous for optimization decisions
                </li>
                <li>
                  Customer segmentation significantly impacts unit economics; I learned to
                  segment before optimizing
                </li>
                <li>
                  Pricing decisions have exponential impact on unit economics—a 10% price
                  increase often improves CAC payback by 20%+
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-primary">Implementation Success Factors</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  Standardized calculation methodologies are essential—I now document and
                  enforce definitions before building dashboards
                </li>
                <li>
                  Real-time monitoring enables quick intervention before unit economics
                  deteriorate significantly
                </li>
                <li>
                  Cohort-based analysis provides more accurate LTV predictions than aggregate
                  historical data—I learned to always use cohorts
                </li>
                <li>
                  Executive visibility into unit economics drives more disciplined growth and
                  investment decisions across the organization
                </li>
              </ul>
            </div>
          </div>
          <p className="leading-relaxed mt-4">
            This project reinforced my belief that sustainable growth is not about maximizing
            acquisition volume, but optimizing the efficiency and profitability of each
            customer acquired. I now make unit economics the north star for all growth
            initiatives I lead.
          </p>
        </div>
      </SectionCard>

      {/* Technologies Used */}
      <TechGrid technologies={technologies} />
    </div>
  )
}
