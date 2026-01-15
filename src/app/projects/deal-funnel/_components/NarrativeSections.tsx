'use client'

import { SectionCard } from '@/components/ui/section-card'
import { FeatureCard } from '@/components/projects/shared/feature-card'
import { ResultCard } from '@/components/projects/shared/result-card'

export function NarrativeSections() {
  return (
    <div className="space-y-12 mt-12">
      {/* Situation */}
      <SectionCard title="Situation">
        <div className="space-y-4 text-muted-foreground">
          <p className="text-lg leading-relaxed">
            When I inherited the sales operations function, I discovered we were flying blind.
            The team was managing 847 active opportunities worth $14.2M in pipeline, but had no
            standardized way to track deal progression across our 4 distinct market segments.
            Sales velocity metrics were being calculated manually using inconsistent methodologies.
          </p>
          <p className="leading-relaxed">
            Pipeline bottlenecks were only identified reactively—after deals had already stalled.
            Conversion rate analysis was limited to overall averages that hid critical
            segment-specific insights. Revenue forecasting was essentially guesswork, hovering
            around 73% accuracy. We were leaving money on the table.
          </p>
        </div>
      </SectionCard>

      {/* Task */}
      <SectionCard title="Task">
        <div className="space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            I was charged with building a pipeline analytics system that would give our sales
            leadership real-time visibility into deal flow. My specific objectives were:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Create multi-stage funnel tracking with segment-specific conversion rate analysis</li>
            <li>Build real-time deal velocity calculations to identify slowdowns before they become stalls</li>
            <li>Develop automated bottleneck identification with proactive alerting</li>
            <li>Improve forecast accuracy from 73% to at least 85%</li>
            <li>Enable segment-based performance comparisons to optimize resource allocation</li>
            <li>Deliver actionable insights, not just dashboards full of data</li>
          </ul>
        </div>
      </SectionCard>

      {/* Action */}
      <SectionCard title="Action">
        <div className="space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            I designed and built a comprehensive deal funnel analytics system from scratch,
            integrating data from our CRM and building custom calculation engines for each
            key metric:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <FeatureCard title="Analytics Framework I Built">
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Multi-stage funnel tracking with conversion rate analysis at each gate</li>
                <li>Segment-based performance comparisons (Enterprise, Mid-Market, SMB, Partner)</li>
                <li>Real-time deal velocity calculations with trend detection</li>
                <li>Automated bottleneck identification with Slack alerting</li>
                <li>Historical performance benchmarking for forecast modeling</li>
              </ul>
            </FeatureCard>
            <FeatureCard title="Interactive Features">
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Dynamic filtering by segment, stage, and deal size</li>
                <li>Drill-down capabilities from overview to individual deal</li>
                <li>Manager coaching tools with rep-level performance views</li>
                <li>Automated weekly reporting with AI-generated insights</li>
                <li>Mobile-optimized dashboards for field sales access</li>
              </ul>
            </FeatureCard>
          </div>

          <p className="leading-relaxed mt-4">
            I personally led the data integration effort, designed the visual funnel
            representations for faster pattern recognition, and trained sales managers on
            leveraging the new coaching insights. The rollout was phased by segment to
            validate accuracy before scaling.
          </p>
        </div>
      </SectionCard>

      {/* Result */}
      <SectionCard title="Result">
        <div className="space-y-6 text-muted-foreground">
          <p className="leading-relaxed">
            The deal funnel analytics system I built transformed how we manage our pipeline
            and delivered measurable improvements:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard value="27%" label="Overall Conversion Rate Improvement" variant="primary" />
            <ResultCard
              value="31 Days"
              label="Reduction in Average Sales Cycle"
              variant="secondary"
            />
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-secondary">Quantified Business Outcomes I Delivered:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Improved forecast accuracy from 73% to 89% through granular pipeline visibility</li>
              <li>
                Reduced deal stagnation in middle stages by 34% through proactive intervention triggers
              </li>
              <li>Discovered that SMB deals close 47% faster—enabling strategic resource reallocation</li>
              <li>Increased Enterprise segment conversion rate from 18% to 24%</li>
              <li>Reduced time-to-close for deals over $100K by 22 days average</li>
              <li>
                Enabled sales managers to coach 15% more effectively with data-driven conversation starters
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
              <h3 className="font-semibold text-accent-foreground">Sales Process Insights</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  Different market segments require fundamentally different sales approaches
                  and timelines—one size never fits all
                </li>
                <li>
                  Pipeline stagnation patterns are predictable; I can now identify at-risk
                  deals 2-3 weeks before they stall
                </li>
                <li>Sales velocity matters more than pure volume for revenue optimization</li>
                <li>
                  Mid-funnel conversion rates are the highest leverage point—that's where I
                  focus coaching resources
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-primary">Technical Implementation Insights</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  Real-time data updates are crucial for actionable sales coaching—batch
                  updates are too slow
                </li>
                <li>
                  Segment-based views prevent "average" metrics from hiding critical
                  performance variations
                </li>
                <li>
                  Visual funnel representations enable faster pattern recognition than
                  tabular data—by at least 3x
                </li>
                <li>
                  Mobile accessibility dramatically increases adoption; our field reps use
                  this daily now
                </li>
              </ul>
            </div>
          </div>
          <p className="leading-relaxed mt-4">
            This project taught me that the most valuable analytics features aren't the most
            sophisticated—they're the ones that enable quick decision-making in daily sales
            operations. Actionable beats impressive every time.
          </p>
        </div>
      </SectionCard>
    </div>
  )
}
