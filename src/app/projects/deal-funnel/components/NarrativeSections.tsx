'use client'

import {
  SectionCard,
  ResultCard,
  TechGrid,
  FeatureCard,
} from '@/components/projects/shared'
import { technologies } from '../data/constants'

export function NarrativeSections() {
  return (
    <div className="space-y-12 mt-12">
      {/* Project Overview */}
      <SectionCard title="Project Overview" titleVariant="primary">
        <div className="space-y-4 text-muted-foreground">
          <p className="text-lg leading-relaxed">
            Designed and implemented a comprehensive deal funnel analytics system to provide real-time visibility into sales pipeline performance, conversion rates, and revenue velocity across different market segments and deal sizes.
          </p>
          <p className="leading-relaxed">
            This strategic initiative enabled data-driven sales optimization, improved forecasting accuracy, and identified critical bottlenecks that were constraining revenue growth across the organization&apos;s diverse customer segments.
          </p>
        </div>
      </SectionCard>

      {/* Challenge */}
      <SectionCard title="Challenge" titleVariant="warning">
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
      </SectionCard>

      {/* Solution */}
      <SectionCard title="Solution" titleVariant="success">
        <div className="space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            Built a comprehensive deal funnel analytics dashboard that provides real-time visibility into sales performance with advanced segmentation and velocity tracking:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <FeatureCard title="Analytics Framework" titleVariant="primary">
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Multi-stage funnel tracking with conversion rate analysis</li>
                <li>Segment-based performance comparisons (Enterprise, SMB, etc.)</li>
                <li>Real-time deal velocity calculations and trending</li>
                <li>Automated bottleneck identification and alerting</li>
                <li>Historical performance benchmarking and forecasting</li>
              </ul>
            </FeatureCard>
            <FeatureCard title="Interactive Features" titleVariant="secondary">
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Dynamic filtering by segment, stage, and deal size</li>
                <li>Drill-down capabilities from overview to individual deals</li>
                <li>Performance comparison tools and trend analysis</li>
                <li>Automated reporting and insights generation</li>
                <li>Mobile-optimized dashboards for field sales teams</li>
              </ul>
            </FeatureCard>
          </div>
        </div>
      </SectionCard>

      {/* Results & Impact */}
      <SectionCard title="Results & Impact" titleVariant="success">
        <div className="space-y-6 text-muted-foreground">
          <p className="leading-relaxed">
            The deal funnel analytics system transformed sales performance visibility and enabled data-driven optimization that significantly improved conversion rates and revenue velocity:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard
              value="27%"
              label="Overall Conversion Rate Improvement"
              variant="primary"
            />
            <ResultCard
              value="31 Days"
              label="Reduction in Average Sales Cycle"
              variant="secondary"
            />
            <ResultCard
              value="$2.8M"
              label="Additional Pipeline Value Captured"
              variant="primary"
            />
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-secondary">Quantified Business Outcomes:</h3>
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
      </SectionCard>

      {/* Key Learnings */}
      <SectionCard title="Key Learnings" titleVariant="accent">
        <div className="space-y-4 text-muted-foreground">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-accent-foreground">Sales Process Insights</h3>
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
      </SectionCard>

      {/* Technologies Used */}
      <TechGrid technologies={technologies} />
    </div>
  )
}