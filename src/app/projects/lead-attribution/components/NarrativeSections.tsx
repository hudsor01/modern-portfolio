'use client'

import { SectionCard } from '@/components/ui/section-card'
import { ResultCard, TechGrid, FeatureCard } from '@/components/projects/shared'
import { technologies } from '../data/constants'

export function NarrativeSections() {
  return (
    <div className="space-y-12 mt-12">
      {/* Project Overview */}
      <SectionCard title="Project Overview" >
        <div className="space-y-4 text-muted-foreground">
          <p className="text-lg leading-relaxed">
            Developed a comprehensive multi-touch lead attribution model to accurately track and
            measure the effectiveness of marketing channels throughout the customer journey,
            enabling data-driven budget allocation and campaign optimization.
          </p>
          <p className="leading-relaxed">
            This attribution system became the foundation for marketing ROI analysis, helping the
            organization optimize a $2.4M annual marketing budget and improve lead-to-customer
            conversion rates across all channels.
          </p>
        </div>
      </SectionCard>

      {/* Challenge */}
      <SectionCard title="Challenge" >
        <div className="space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            The marketing organization was operating with limited visibility into which channels and
            touchpoints were driving qualified leads and conversions, resulting in suboptimal budget
            allocation:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              Last-click attribution was giving all credit to the final touchpoint, undervaluing
              early-stage awareness channels
            </li>
            <li>
              Marketing budget decisions were based on intuition rather than data-driven attribution
              analysis
            </li>
            <li>
              Cross-channel customer journeys were invisible, preventing holistic campaign
              optimization
            </li>
            <li>Lead quality scoring didn&apos;t account for multi-touch interaction patterns</li>
            <li>
              No systematic way to measure the assisted conversion value of different marketing
              initiatives
            </li>
          </ul>
          <p className="leading-relaxed">
            With 8,743 monthly leads across 6 primary channels and complex B2B buying journeys
            averaging 7.3 touchpoints, the team needed a sophisticated attribution model to optimize
            performance.
          </p>
        </div>
      </SectionCard>

      {/* Solution */}
      <SectionCard title="Solution" >
        <div className="space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            Built a comprehensive multi-touch attribution system that tracks the complete customer
            journey and assigns weighted credit to each marketing touchpoint based on its influence
            on conversion:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <FeatureCard title="Attribution Methodology" >
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Time-decay attribution model weighing recent touchpoints higher</li>
                <li>Cross-device and cross-channel journey tracking</li>
                <li>First-touch, last-touch, and linear attribution comparisons</li>
                <li>Assisted conversion analysis and influence scoring</li>
                <li>Channel interaction and synergy effect measurement</li>
              </ul>
            </FeatureCard>
            <FeatureCard title="Analytics & Reporting" >
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Real-time conversion path visualization and analysis</li>
                <li>Channel performance benchmarking and ROI calculation</li>
                <li>Lead quality scoring based on journey patterns</li>
                <li>Budget allocation recommendations and impact modeling</li>
                <li>Cohort analysis and seasonal trend identification</li>
              </ul>
            </FeatureCard>
          </div>
        </div>
      </SectionCard>

      {/* Results & Impact */}
      <SectionCard title="Results & Impact" >
        <div className="space-y-6 text-muted-foreground">
          <p className="leading-relaxed">
            The multi-touch attribution model revolutionized marketing decision-making and enabled
            data-driven optimization that significantly improved both lead quality and conversion
            rates:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard value="34%" label="Improvement in Marketing ROI" variant="primary" />
            <ResultCard
              value="$480K"
              label="Annual Budget Optimization Savings"
              variant="secondary"
            />
            <ResultCard value="29%" label="Increase in Lead-to-Customer Rate" variant="primary" />
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-primary">Quantified Business Outcomes:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                Identified that organic search assists 67% of paid search conversions, preventing
                budget cuts
              </li>
              <li>
                Discovered email marketing&apos;s true contribution was 3.2x higher than last-click
                attribution showed
              </li>
              <li>Reduced cost-per-acquisition by 28% through optimized channel mix allocation</li>
              <li>
                Improved lead scoring accuracy by 41% incorporating multi-touch interaction data
              </li>
              <li>
                Enabled attribution-based budget reallocation that increased qualified leads by 23%
              </li>
              <li>
                Reduced attribution reporting time from 8 hours to 15 minutes with automated
                dashboards
              </li>
            </ul>
          </div>
        </div>
      </SectionCard>

      {/* Key Learnings */}
      <SectionCard title="Key Learnings" >
        <div className="space-y-4 text-muted-foreground">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-accent-foreground">
                Marketing Attribution Insights
              </h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  B2B customer journeys are significantly more complex than traditional models
                  account for
                </li>
                <li>
                  Assisted conversions often have more total value than direct conversions in
                  enterprise sales
                </li>
                <li>
                  Channel synergy effects can increase conversion rates by 40%+ when measured
                  properly
                </li>
                <li>
                  Time-decay attribution balances recency bias while crediting early-stage awareness
                  efforts
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-primary">Implementation Insights</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  Cross-device tracking requires careful privacy compliance and data governance
                </li>
                <li>Attribution model choice significantly impacts budget allocation decisions</li>
                <li>Real-time attribution dashboards enable agile campaign optimization</li>
                <li>
                  Data visualization is crucial for marketing teams to understand complex
                  attribution concepts
                </li>
              </ul>
            </div>
          </div>
          <p className="leading-relaxed mt-4">
            This project demonstrated that attribution modeling is as much about organizational
            change management as it is about technical implementation. The key is building
            confidence in the data through transparent methodology and clear business impact.
          </p>
        </div>
      </SectionCard>

      {/* Technologies Used */}
      <TechGrid technologies={technologies} />
    </div>
  )
}
