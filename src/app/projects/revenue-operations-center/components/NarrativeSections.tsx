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
            When I was brought in to lead revenue operations transformation, I inherited a
            chaotic environment where revenue data was scattered across 12 different systems
            with no single source of truth. Sales, marketing, and customer success operated
            in complete silos with misaligned metrics. Manual reporting consumed 25+ hours
            weekly across departments, and revenue forecasting accuracy was hovering below 75%.
          </p>
          <p className="leading-relaxed">
            The organization couldn't see the complete customer journey from lead to retention,
            strategic decisions were delayed by weeks due to data accessibility issues, and
            process automation was essentially non-existent—creating massive scalability
            constraints as the company grew. Something fundamental had to change.
          </p>
        </div>
      </SectionCard>

      {/* Task */}
      <SectionCard title="Task">
        <div className="space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            I was charged with architecting and implementing a comprehensive Revenue Operations
            Center that would serve as the central hub for all revenue-related data, processes,
            and strategic decision-making. My mandate was clear:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Consolidate 12 disparate systems into a unified data platform with real-time integration</li>
            <li>Create 360-degree customer journey visibility from first touch to renewal</li>
            <li>Implement predictive revenue forecasting with accuracy above 90%</li>
            <li>Automate workflow orchestration for lead routing, follow-up, and reporting</li>
            <li>Build executive dashboards that enable real-time strategic decision-making</li>
            <li>Establish cross-functional alignment through standardized metrics and shared visibility</li>
            <li>Reduce manual reporting time by at least 60%</li>
          </ul>
        </div>
      </SectionCard>

      {/* Action */}
      <SectionCard title="Action">
        <div className="space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            I designed and built a comprehensive Revenue Operations Center from scratch,
            unifying all revenue-related functions into a single intelligent platform with
            advanced analytics and automation capabilities:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <FeatureCard title="Unified Data Platform I Built">
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Real-time data integration from 12 source systems with automated ETL pipelines</li>
                <li>360-degree customer journey tracking from first touch to renewal</li>
                <li>Unified revenue metrics and KPI standardization across all departments</li>
                <li>Advanced data validation and quality monitoring systems</li>
                <li>Role-based access controls and comprehensive data governance framework</li>
              </ul>
            </FeatureCard>
            <FeatureCard title="Intelligence & Automation Layer">
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Predictive revenue forecasting using ML models I trained and deployed</li>
                <li>Automated workflow orchestration for lead routing and follow-up sequences</li>
                <li>Real-time performance monitoring with proactive alerting systems</li>
                <li>Executive dashboards with drill-down capabilities and insight generation</li>
                <li>Automated reporting that runs without human intervention</li>
              </ul>
            </FeatureCard>
          </div>

          <p className="leading-relaxed mt-4">
            I personally led the integration architecture, designed the cross-functional
            workflows, and managed the change management process to shift from siloed
            operations to unified revenue intelligence. The rollout was phased by department
            to build confidence before expanding capabilities.
          </p>
        </div>
      </SectionCard>

      {/* Result */}
      <SectionCard title="Result">
        <div className="space-y-6 text-muted-foreground">
          <p className="leading-relaxed">
            The Revenue Operations Center I built transformed how the organization manages
            and optimizes revenue, delivering unprecedented visibility and efficiency across
            all revenue functions:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard value="96.8%" label="Revenue Forecast Accuracy" variant="primary" />
            <ResultCard value="34.2%" label="YoY Revenue Growth" variant="secondary" />
            <ResultCard value="89.7%" label="Operational Efficiency Score" variant="primary" />
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-primary">Quantified Business Outcomes I Delivered:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                Improved revenue forecasting accuracy from 74% to 96.8% using my predictive analytics models
              </li>
              <li>Reduced manual reporting time by 78% through automated dashboard generation</li>
              <li>
                Increased lead-to-opportunity conversion rate by 31% through optimized routing algorithms
              </li>
              <li>Shortened sales cycle by 22 days average through process automation I implemented</li>
              <li>
                Achieved 34.2% YoY revenue growth, exceeding 25% target through data-driven optimization
              </li>
              <li>Improved customer retention rate by 18% through proactive churn prediction</li>
              <li>
                Enabled real-time decision making, reducing strategic planning cycles from weeks to days
              </li>
              <li>
                Created unified team alignment, improving cross-department collaboration scores by 45%
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
              <h3 className="font-semibold text-accent-foreground">Revenue Operations Strategy</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  Unified data architecture is the absolute foundation of effective revenue
                  operations—I learned to never compromise on this
                </li>
                <li>
                  Cross-functional team alignment requires standardized metrics and shared
                  visibility; politics disappear when everyone sees the same numbers
                </li>
                <li>
                  Predictive analytics dramatically outperform traditional forecasting—I now
                  default to ML models for any forecasting need
                </li>
                <li>
                  Process automation scales human expertise and reduces operational overhead;
                  I automate everything I can
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-primary">Implementation Excellence</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  Data governance must be established before building analytics layers—I learned
                  this the hard way
                </li>
                <li>
                  User adoption requires intuitive interfaces and immediate value demonstration;
                  I now show wins within the first week
                </li>
                <li>
                  Phased rollout prevents disruption while building confidence in new systems
                </li>
                <li>
                  Executive sponsorship and change management are critical for transformation
                  success—technology alone won't drive adoption
                </li>
              </ul>
            </div>
          </div>
          <p className="leading-relaxed mt-4">
            This project taught me that revenue operations is not just about technology—it's
            about creating a culture of data-driven decision making that permeates every aspect
            of the revenue organization. I now focus on people and processes as much as platforms
            in every RevOps engagement.
          </p>
        </div>
      </SectionCard>

      {/* Technologies Used */}
      <TechGrid technologies={technologies} />
    </div>
  )
}
