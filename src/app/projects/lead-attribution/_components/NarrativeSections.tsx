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
            When I inherited the marketing analytics function, I discovered the team was operating
            with a fundamentally broken attribution model. Last-click attribution was giving all
            credit to the final touchpoint, completely undervaluing the awareness channels that
            were actually driving qualified leads into the funnel. With 8,743 monthly leads across
            6 primary channels and complex B2B buying journeys averaging 7.3 touchpoints, we were
            making million-dollar budget decisions based on incomplete data.
          </p>
          <p className="leading-relaxed">
            The marketing team was essentially flying blind—budget decisions were based on intuition,
            cross-channel customer journeys were invisible, and there was no systematic way to
            measure the assisted conversion value of different initiatives. A $2.4M annual marketing
            budget deserved better.
          </p>
        </div>
      </SectionCard>

      {/* Task */}
      <SectionCard title="Task">
        <div className="space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            I was charged with building a multi-touch attribution system that would give marketing
            leadership complete visibility into which channels and touchpoints were actually driving
            qualified leads. My specific objectives were:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Replace last-click attribution with a weighted multi-touch model that credits the full journey</li>
            <li>Build cross-channel journey tracking to visualize complete customer paths</li>
            <li>Create assisted conversion analysis to measure influence beyond direct conversions</li>
            <li>Develop lead quality scoring that accounts for multi-touch interaction patterns</li>
            <li>Enable data-driven budget allocation recommendations based on true channel performance</li>
            <li>Reduce attribution reporting time from 8+ hours to under 30 minutes</li>
          </ul>
        </div>
      </SectionCard>

      {/* Action */}
      <SectionCard title="Action">
        <div className="space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            I designed and built a comprehensive multi-touch attribution system from scratch,
            tracking the complete customer journey and assigning weighted credit to each
            marketing touchpoint based on its actual influence on conversion:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <FeatureCard title="Attribution Methodology I Developed">
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Time-decay attribution model weighing recent touchpoints appropriately</li>
                <li>Cross-device and cross-channel journey tracking with identity resolution</li>
                <li>First-touch, last-touch, and linear attribution comparison framework</li>
                <li>Assisted conversion analysis with influence scoring algorithms</li>
                <li>Channel interaction and synergy effect measurement capabilities</li>
              </ul>
            </FeatureCard>
            <FeatureCard title="Analytics Platform Features">
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Real-time conversion path visualization and journey analysis</li>
                <li>Channel performance benchmarking with ROI calculation engine</li>
                <li>Lead quality scoring based on journey patterns and engagement</li>
                <li>Budget allocation recommendations with impact modeling</li>
                <li>Cohort analysis and seasonal trend identification dashboards</li>
              </ul>
            </FeatureCard>
          </div>

          <p className="leading-relaxed mt-4">
            I personally led the integration with our marketing tech stack, designed the
            attribution weighting methodology, and trained the marketing team on leveraging
            the new insights for budget optimization. The rollout was phased to validate
            accuracy before scaling recommendations.
          </p>
        </div>
      </SectionCard>

      {/* Result */}
      <SectionCard title="Result">
        <div className="space-y-6 text-muted-foreground">
          <p className="leading-relaxed">
            The multi-touch attribution model I built revolutionized marketing decision-making
            and enabled data-driven optimization that significantly improved both lead quality
            and conversion rates:
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
            <h3 className="font-semibold text-primary">Quantified Business Outcomes I Delivered:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                Discovered that organic search assists 67% of paid search conversions—preventing
                a planned budget cut that would have cost us leads
              </li>
              <li>
                Proved email marketing's true contribution was 3.2x higher than last-click
                attribution showed—saving the channel from elimination
              </li>
              <li>Reduced cost-per-acquisition by 28% through optimized channel mix allocation</li>
              <li>
                Improved lead scoring accuracy by 41% by incorporating multi-touch interaction data
              </li>
              <li>
                Enabled attribution-based budget reallocation that increased qualified leads by 23%
              </li>
              <li>
                Reduced attribution reporting time from 8 hours to 15 minutes with automated dashboards
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
              <h3 className="font-semibold text-accent-foreground">
                Marketing Attribution Insights
              </h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  B2B customer journeys are significantly more complex than traditional models
                  account for—I now assume at least 7 touchpoints
                </li>
                <li>
                  Assisted conversions often have more total value than direct conversions in
                  enterprise sales; I learned to prioritize influence over attribution
                </li>
                <li>
                  Channel synergy effects can increase conversion rates by 40%+ when measured
                  properly—this was the biggest hidden value I uncovered
                </li>
                <li>
                  Time-decay attribution balances recency bias while crediting early-stage
                  awareness efforts appropriately
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-primary">Implementation Insights</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  Cross-device tracking requires careful privacy compliance—I built consent
                  management into the foundation
                </li>
                <li>
                  Attribution model choice significantly impacts budget allocation; I now test
                  multiple models before recommending changes
                </li>
                <li>
                  Real-time attribution dashboards enable agile campaign optimization that
                  weekly reports can't achieve
                </li>
                <li>
                  Data visualization is crucial for marketing teams to understand complex
                  attribution concepts—I invest heavily in UX
                </li>
              </ul>
            </div>
          </div>
          <p className="leading-relaxed mt-4">
            This project taught me that attribution modeling is as much about organizational
            change management as it is about technical implementation. The key is building
            confidence in the data through transparent methodology and clear business impact—
            I now lead with outcomes, not algorithms.
          </p>
        </div>
      </SectionCard>
    </div>
  )
}
