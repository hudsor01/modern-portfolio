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
            Architected and implemented a comprehensive Revenue Operations Center that serves as the
            central hub for all revenue-related data, processes, and strategic decision-making
            across sales, marketing, and customer success teams.
          </p>
          <p className="leading-relaxed">
            This enterprise-level RevOps platform became the operational backbone of the
            organization, consolidating 12 different systems into a unified command center that
            enables real-time visibility, predictive analytics, and automated workflows for revenue
            optimization.
          </p>
        </div>
      </SectionCard>

      {/* Challenge */}
      <SectionCard title="Challenge" >
        <div className="space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            The organization was struggling with fragmented revenue operations across departments,
            creating inefficiencies and limiting growth potential:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              Revenue data was scattered across 12 different systems with no single source of truth
            </li>
            <li>
              Sales, marketing, and customer success teams operated in silos with misaligned metrics
            </li>
            <li>
              Manual reporting processes consumed 25+ hours weekly across multiple departments
            </li>
            <li>Revenue forecasting was inconsistent with accuracy rates below 75%</li>
            <li>No unified customer journey visibility from lead to retention</li>
            <li>Strategic decisions were delayed due to lack of real-time operational insights</li>
            <li>Process automation was limited, causing scalability constraints</li>
          </ul>
          <p className="leading-relaxed">
            With rapid growth and increasing complexity, the company needed a unified RevOps
            platform to align teams, automate processes, and enable data-driven revenue optimization
            at scale.
          </p>
        </div>
      </SectionCard>

      {/* Solution */}
      <SectionCard title="Solution" >
        <div className="space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            Built a comprehensive Revenue Operations Center that unifies all revenue-related
            functions into a single, intelligent platform with advanced analytics and automation
            capabilities:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <FeatureCard title="Unified Data Platform" >
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>
                  Real-time data integration from 12 source systems with automated ETL pipelines
                </li>
                <li>360-degree customer journey tracking from first touch to renewal</li>
                <li>Unified revenue metrics and KPI standardization across departments</li>
                <li>Advanced data validation and quality monitoring systems</li>
                <li>Role-based access controls and data governance framework</li>
              </ul>
            </FeatureCard>
            <FeatureCard title="Intelligence & Automation" >
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Predictive revenue forecasting with 96.8% accuracy using ML models</li>
                <li>Automated workflow orchestration for lead routing and follow-up</li>
                <li>Real-time performance monitoring and alerting systems</li>
                <li>Executive dashboards with drill-down capabilities and insights</li>
                <li>Automated reporting and insight generation for all stakeholders</li>
              </ul>
            </FeatureCard>
          </div>
        </div>
      </SectionCard>

      {/* Results & Impact */}
      <SectionCard title="Results & Impact" >
        <div className="space-y-6 text-muted-foreground">
          <p className="leading-relaxed">
            The Revenue Operations Center transformed how the organization manages and optimizes
            revenue, delivering unprecedented visibility and efficiency across all revenue
            functions:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard value="96.8%" label="Revenue Forecast Accuracy" variant="primary" />
            <ResultCard value="34.2%" label="YoY Revenue Growth" variant="secondary" />
            <ResultCard value="89.7%" label="Operational Efficiency Score" variant="primary" />
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-primary">Quantified Business Outcomes:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                Improved revenue forecasting accuracy from 74% to 96.8% using predictive analytics
              </li>
              <li>Reduced manual reporting time by 78% through automated dashboard generation</li>
              <li>
                Increased lead-to-opportunity conversion rate by 31% through optimized routing
              </li>
              <li>Shortened sales cycle by 22 days average through process automation</li>
              <li>
                Achieved 34.2% YoY revenue growth, exceeding 25% target through data-driven
                optimization
              </li>
              <li>Improved customer retention rate by 18% through proactive churn prediction</li>
              <li>
                Enabled real-time decision making, reducing strategic planning cycles from weeks to
                days
              </li>
              <li>
                Created unified team alignment, improving cross-department collaboration scores by
                45%
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
              <h3 className="font-semibold text-accent-foreground">Revenue Operations Strategy</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Unified data architecture is the foundation of effective revenue operations</li>
                <li>
                  Cross-functional team alignment requires standardized metrics and shared
                  visibility
                </li>
                <li>
                  Predictive analytics dramatically outperform traditional forecasting methods
                </li>
                <li>Process automation scales human expertise and reduces operational overhead</li>
                <li>Real-time insights enable proactive rather than reactive revenue management</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-primary">Implementation Excellence</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Data governance must be established before building analytics layers</li>
                <li>
                  User adoption requires intuitive interfaces and immediate value demonstration
                </li>
                <li>Phased rollout prevents disruption while building confidence in new systems</li>
                <li>
                  Continuous monitoring and optimization are essential for sustained performance
                </li>
                <li>
                  Executive sponsorship and change management are critical for transformation
                  success
                </li>
              </ul>
            </div>
          </div>
          <p className="leading-relaxed mt-4">
            This project demonstrated that revenue operations is not just about technology—it's
            about creating a culture of data-driven decision making that permeates every aspect of
            the revenue organization. The most successful RevOps implementations focus on people and
            processes as much as platforms.
          </p>
        </div>
      </SectionCard>

      {/* Technologies Used */}
      <TechGrid technologies={technologies} />
    </div>
  )
}
