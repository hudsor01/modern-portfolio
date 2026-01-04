'use client'

import { SectionCard } from '@/components/ui/section-card'
import { ResultCard, TechGrid, FeatureCard } from '@/components/projects/shared'
import { formatCurrency } from '@/lib/utils/data-formatters'
import { technologies } from '../data/constants'

interface NarrativeSectionsProps {
  totalRevenue: number
}

export function NarrativeSections({ totalRevenue }: NarrativeSectionsProps) {
  return (
    <div className="space-y-12 mt-12">
      {/* Project Overview */}
      <SectionCard title="Project Overview" >
        <div className="space-y-4 text-muted-foreground">
          <p className="text-lg leading-relaxed">
            Developed and implemented a comprehensive real-time revenue analytics dashboard to
            consolidate partner performance data across multiple business channels. This strategic
            initiative was critical for executive decision-making and revenue optimization during a
            period of rapid business growth.
          </p>
          <p className="leading-relaxed">
            The dashboard became the single source of truth for revenue operations, enabling
            data-driven strategic decisions that directly contributed to a 432% growth trajectory
            and {formatCurrency(totalRevenue)} in annual revenue management.
          </p>
        </div>
      </SectionCard>

      {/* Challenge */}
      <SectionCard title="Challenge" >
        <div className="space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            The organization was experiencing rapid growth but lacked visibility into partner
            performance across different revenue channels. Revenue data was scattered across
            multiple systems, making it impossible to:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Track real-time partner performance and commission calculations</li>
            <li>Identify high-performing partners and growth opportunities</li>
            <li>Make data-driven decisions about partner tier adjustments</li>
            <li>Forecast revenue accurately for strategic planning</li>
            <li>Optimize partner compensation structures</li>
          </ul>
          <p className="leading-relaxed">
            Manual reporting processes were consuming 15+ hours weekly and often contained
            discrepancies, limiting the leadership team&apos;s ability to respond quickly to market
            opportunities.
          </p>
        </div>
      </SectionCard>

      {/* Solution */}
      <SectionCard title="Solution" >
        <div className="space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            Designed and built a comprehensive revenue KPI dashboard using React, TypeScript, and
            Recharts, integrating data from CRM, billing systems, and partner management platforms:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <FeatureCard title="Technical Implementation" >
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Real-time data integration from multiple sources</li>
                <li>Automated revenue calculations and forecasting</li>
                <li>Interactive visualizations with drill-down capabilities</li>
                <li>Responsive design for mobile and desktop access</li>
                <li>Role-based access controls and data security</li>
              </ul>
            </FeatureCard>
            <FeatureCard title="Business Features" >
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Partner performance tracking and rankings</li>
                <li>Commission tier analysis and optimization</li>
                <li>Revenue trend analysis and projections</li>
                <li>Automated alert system for KPI thresholds</li>
                <li>Executive summary reports and insights</li>
              </ul>
            </FeatureCard>
          </div>
        </div>
      </SectionCard>

      {/* Results & Impact */}
      <SectionCard title="Results & Impact" >
        <div className="space-y-6 text-muted-foreground">
          <p className="leading-relaxed">
            The revenue KPI dashboard transformed how the organization manages and optimizes partner
            relationships, delivering measurable improvements across all key metrics:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard
              value={formatCurrency(4200000)}
              label="Additional Revenue Generated"
              variant="primary"
            />
            <ResultCard value="94%" label="Forecast Accuracy Achievement" variant="secondary" />
            <ResultCard value="65%" label="Reduction in Manual Reporting Time" variant="primary" />
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-secondary">Quantified Business Outcomes:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Increased partner productivity by 28% through improved performance visibility</li>
              <li>Reduced revenue forecasting errors from 18% to 6% variance</li>
              <li>Accelerated decision-making process from weeks to hours</li>
              <li>Improved partner satisfaction scores by 22% through transparent reporting</li>
              <li>Enabled identification of top 20% partners contributing 67% of revenue</li>
            </ul>
          </div>
        </div>
      </SectionCard>

      {/* Key Learnings */}
      <SectionCard title="Key Learnings" >
        <div className="space-y-4 text-muted-foreground">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-accent-foreground">Strategic Insights</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  Real-time visibility into revenue metrics is crucial for agile business operations
                </li>
                <li>
                  Partner performance data patterns reveal optimization opportunities not visible in
                  traditional reports
                </li>
                <li>
                  Executive adoption increases dramatically when dashboards provide actionable
                  insights, not just data
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-primary">Technical Insights</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  Modular chart components enable rapid iteration and customization for different
                  stakeholder needs
                </li>
                <li>
                  Data consistency validation is essential when integrating multiple business
                  systems
                </li>
                <li>
                  Performance optimization becomes critical when handling large datasets with
                  frequent updates
                </li>
              </ul>
            </div>
          </div>
          <p className="leading-relaxed mt-4">
            This project reinforced the importance of bridging technical excellence with business
            strategy. The most impactful features weren&apos;t the most technically complex, but
            those that directly addressed specific business pain points and enabled immediate
            action.
          </p>
        </div>
      </SectionCard>

      {/* Technologies Used */}
      <TechGrid technologies={technologies} />
    </div>
  )
}
