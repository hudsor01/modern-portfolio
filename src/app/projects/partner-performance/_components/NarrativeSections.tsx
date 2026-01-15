'use client'

import { SectionCard } from '@/components/ui/section-card'
import { FeatureCard } from '@/components/projects/shared/feature-card'
import { ResultCard } from '@/components/projects/shared/result-card'
import { formatCurrency, formatPercentage } from '@/lib/data-formatters'


export function NarrativeSections() {
  return (
    <div className="space-y-12 mt-12">
      {/* Situation */}
      <SectionCard title="Situation">
        <div className="space-y-4 text-muted-foreground">
          <p className="text-lg leading-relaxed">
            When I inherited the partner operations function, I discovered a dangerous blind spot:
            we had 47 partners driving {formatPercentage(0.832)} of total revenue, but we had no
            systematic way to measure, compare, or optimize their performance. Partner investments
            were made based on relationship history rather than data. Some partners consumed
            significant resources while delivering minimal returns, while high-performers were
            under-supported.
          </p>
          <p className="leading-relaxed">
            The lack of visibility was causing real business problems. We couldn't identify which
            partners deserved tier upgrades, which needed intervention, or where to focus enablement
            resources. Partner satisfaction was declining because top performers felt undervalued,
            and revenue concentration risk was invisible—we didn't even know that 5 partners were
            driving 80% of channel revenue until I started digging into the data.
          </p>
        </div>
      </SectionCard>

      {/* Task */}
      <SectionCard title="Task">
        <div className="space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            I was tasked with building a comprehensive partner intelligence platform that would
            provide complete visibility into partner performance, enable data-driven investment
            decisions, and optimize the partner program for maximum ROI. My specific objectives
            included:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Create real-time visibility into partner performance across all tiers</li>
            <li>Build ROI-based partner tiering with objective advancement criteria</li>
            <li>Identify the top-performing partners driving 80% of revenue (Pareto analysis)</li>
            <li>Develop early warning systems for underperforming or at-risk partners</li>
            <li>Enable resource allocation optimization based on partner potential</li>
            <li>Achieve partner win rate improvements of at least 10% through better enablement targeting</li>
          </ul>
        </div>
      </SectionCard>

      {/* Action */}
      <SectionCard title="Action">
        <div className="space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            I designed and built a partner performance intelligence platform that transformed
            how we manage, measure, and optimize partner relationships. The system combined
            real-time analytics with strategic planning capabilities:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <FeatureCard title="Analytics I Built">
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Partner ROI calculator with full cost attribution</li>
                <li>Win rate analysis by tier, segment, and deal type</li>
                <li>Revenue contribution tracking with Pareto visualization</li>
                <li>Sales cycle analysis comparing partner vs. direct channels</li>
                <li>Partner health scoring based on engagement and performance</li>
              </ul>
            </FeatureCard>
            <FeatureCard title="Strategic Features">
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Tier advancement recommendations based on objective criteria</li>
                <li>Resource allocation optimization by partner potential</li>
                <li>Early warning alerts for declining engagement or performance</li>
                <li>Competitive benchmarking against industry standards</li>
                <li>Executive dashboards with drill-down to individual partners</li>
              </ul>
            </FeatureCard>
          </div>

          <p className="leading-relaxed mt-4">
            I personally led the data integration effort, connecting CRM, billing, and partner
            portal data into a unified analytics layer. I designed the tier scoring methodology,
            built the ROI calculation engine, and created the executive reporting framework.
            The platform launched with the top 20 partners and expanded to all 47 within 60 days.
          </p>
        </div>
      </SectionCard>

      {/* Result */}
      <SectionCard title="Result">
        <div className="space-y-6 text-muted-foreground">
          <p className="leading-relaxed">
            The partner intelligence platform I built transformed channel management from
            relationship-driven to data-driven, delivering measurable improvements across
            every dimension of partner performance:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <ResultCard
              value={formatPercentage(0.832)}
              label="Partner Win Rate"
              variant="primary"
            />
            <ResultCard
              value={formatCurrency(904387, { compact: true })}
              label="Partner Revenue"
              variant="secondary"
            />
            <ResultCard
              value="4.7x"
              label="Quick Ratio Achieved"
              variant="primary"
            />
            <ResultCard
              value="80/20"
              label="Pareto Optimized"
              variant="secondary"
            />
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-secondary">Quantified Business Outcomes I Delivered:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Achieved {formatPercentage(0.832)} win rate for partner channel—18 points above industry average (65-75%)</li>
              <li>Identified top 5 partners driving 80% of partner revenue, enabling focused investment</li>
              <li>Improved certified partner revenue contribution by 63% through targeted enablement</li>
              <li>Reduced partner churn by 22% through early warning interventions</li>
              <li>Optimized resource allocation, saving 15 hours weekly on partner reporting</li>
              <li>Achieved 4.7x quick ratio—exceeding SaaS benchmark of 4.0x</li>
            </ul>
          </div>
        </div>
      </SectionCard>

      {/* Key Learnings */}
      <SectionCard title="Key Learnings">
        <div className="space-y-4 text-muted-foreground">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-accent-foreground">Partner Strategy Insights</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  The Pareto principle (80/20) applies universally to partner programs—focusing
                  on top performers yields disproportionate returns
                </li>
                <li>
                  Partner tier should reflect ROI potential, not just revenue—I now weight
                  margin and deal velocity in tier scoring
                </li>
                <li>
                  Early warning systems prevent partner churn far more effectively than
                  reactive retention efforts
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-primary">Technical Insights</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  Unified data architecture is essential—partner data scattered across systems
                  makes performance analysis impossible
                </li>
                <li>
                  Real-time dashboards drive adoption; static reports get ignored by busy
                  channel managers
                </li>
                <li>
                  Visualization matters—Pareto charts and tier comparisons communicate insights
                  that tables cannot
                </li>
              </ul>
            </div>
          </div>
          <p className="leading-relaxed mt-4">
            This project taught me that partner programs succeed or fail based on measurement
            rigor. You can't optimize what you don't measure, and most organizations under-invest
            in partner analytics. I now treat partner intelligence as a core competency, not
            a reporting function.
          </p>
        </div>
      </SectionCard>
    </div>
  )
}
