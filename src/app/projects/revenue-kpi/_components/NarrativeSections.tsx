'use client'

import { SectionCard } from '@/components/ui/section-card'
import { FeatureCard } from '@/components/projects/shared/feature-card'
import { ResultCard } from '@/components/projects/shared/result-card'
import { formatCurrency } from '@/lib/data-formatters'

interface NarrativeSectionsProps {
  totalRevenue: number
}

export function NarrativeSections({ totalRevenue }: NarrativeSectionsProps) {
  return (
    <div className="space-y-12 mt-12">
      {/* Situation */}
      <SectionCard title="Situation">
        <div className="space-y-4 text-muted-foreground">
          <p className="text-lg leading-relaxed">
            When I joined the revenue operations team, I inherited a data chaos problem.
            The organization was experiencing explosive growth—we were on track for 432%
            year-over-year—but our revenue data was scattered across 5 different systems
            with no single source of truth. Leadership was making million-dollar decisions
            based on spreadsheets that were already outdated by the time they hit their inbox.
          </p>
          <p className="leading-relaxed">
            Manual reporting was consuming 15+ hours weekly from my team, and the reports
            often contained discrepancies that eroded trust. We couldn't track real-time
            partner performance, couldn't identify growth opportunities until it was too late,
            and revenue forecasting was an exercise in frustration. With {formatCurrency(totalRevenue)} in
            annual revenue at stake, we needed a complete transformation.
          </p>
        </div>
      </SectionCard>

      {/* Task */}
      <SectionCard title="Task">
        <div className="space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            I was given the mandate to build a unified revenue intelligence platform that
            would become the single source of truth for the entire organization. My
            specific objectives included:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Consolidate data from CRM, billing, and partner management platforms into real-time dashboards</li>
            <li>Reduce manual reporting time by at least 50%</li>
            <li>Improve revenue forecasting accuracy from 82% to 90%+</li>
            <li>Enable self-service analytics for executives and managers</li>
            <li>Create automated alerting for KPI threshold breaches</li>
            <li>Build role-based access controls to protect sensitive revenue data</li>
          </ul>
        </div>
      </SectionCard>

      {/* Action */}
      <SectionCard title="Action">
        <div className="space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            I designed and built a comprehensive revenue KPI dashboard using React, TypeScript,
            and Recharts, architecting the entire data pipeline from source systems to
            executive-facing visualizations:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <FeatureCard title="Technical Implementation">
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Built real-time data integration layer connecting 5 source systems</li>
                <li>Developed automated revenue calculation engine with validation rules</li>
                <li>Created interactive visualizations with drill-down to transaction level</li>
                <li>Implemented responsive design for desktop, tablet, and mobile access</li>
                <li>Deployed role-based access controls with audit logging</li>
              </ul>
            </FeatureCard>
            <FeatureCard title="Business Features">
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Partner performance tracking with automated rankings</li>
                <li>Commission tier analysis with optimization recommendations</li>
                <li>Revenue trend analysis with 12-month projections</li>
                <li>Automated alert system for KPI threshold breaches</li>
                <li>One-click executive summary reports</li>
              </ul>
            </FeatureCard>
          </div>

          <p className="leading-relaxed mt-4">
            I personally led the stakeholder interviews to understand each role's needs,
            designed the data architecture, built the core components, and managed the
            change management process. The platform went live in phases, starting with
            the executive team and rolling out to regional managers.
          </p>
        </div>
      </SectionCard>

      {/* Result */}
      <SectionCard title="Result">
        <div className="space-y-6 text-muted-foreground">
          <p className="leading-relaxed">
            The revenue KPI dashboard I built transformed how the organization manages and
            optimizes partner relationships, delivering measurable improvements across every
            metric we tracked:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard
              value={formatCurrency(4200000)}
              label="Additional Revenue Generated"
              variant="primary"
            />
            <ResultCard value="94%" label="Forecast Accuracy Achieved" variant="secondary" />
            <ResultCard value="65%" label="Reduction in Manual Reporting" variant="primary" />
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-secondary">Quantified Business Outcomes I Delivered:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Increased partner productivity by 28% through improved performance visibility</li>
              <li>Reduced revenue forecasting variance from 18% to 6%</li>
              <li>Accelerated decision-making from weeks to hours with real-time data access</li>
              <li>Improved partner satisfaction scores by 22% through transparent reporting</li>
              <li>Identified that top 20% of partners drive 67% of revenue—enabling focused investment</li>
              <li>Saved the team 10+ hours weekly in manual reporting time</li>
            </ul>
          </div>
        </div>
      </SectionCard>

      {/* Key Learnings */}
      <SectionCard title="Key Learnings">
        <div className="space-y-4 text-muted-foreground">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-accent-foreground">Strategic Insights</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  Real-time visibility into revenue metrics is non-negotiable for agile
                  business operations—batch reporting is a competitive disadvantage
                </li>
                <li>
                  Partner performance data reveals optimization opportunities invisible
                  in traditional reports; patterns emerge at scale
                </li>
                <li>
                  Executive adoption skyrockets when dashboards provide actionable insights,
                  not just data dumps
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-primary">Technical Insights</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  Modular chart components enable rapid iteration—I can customize views
                  for new stakeholders in hours, not weeks
                </li>
                <li>
                  Data consistency validation is essential when integrating multiple systems;
                  I learned to trust but verify
                </li>
                <li>
                  Performance optimization becomes critical at scale; I implemented caching
                  that reduced dashboard load times by 70%
                </li>
              </ul>
            </div>
          </div>
          <p className="leading-relaxed mt-4">
            This project reinforced my belief that the most impactful features aren't the
            most technically complex—they're the ones that directly address specific business
            pain points and enable immediate action. I now apply this principle to every
            system I build.
          </p>
        </div>
      </SectionCard>
    </div>
  )
}
