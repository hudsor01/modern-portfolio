'use client'

import { SectionCard } from '@/components/ui/section-card'
import { ResultCard, FeatureCard } from '@/components/projects/shared'
import { commissionMetrics } from '../data/constants'
import { formatCurrency, formatPercentage } from '@/lib/utils/data-formatters'

export function NarrativeSections() {
  return (
    <div className="space-y-12 mt-12">
      {/* Situation */}
      <SectionCard title="Situation">
        <div className="space-y-4 text-muted-foreground">
          <p className="text-lg leading-relaxed">
            When I took ownership of commission operations, the organization was managing{' '}
            {formatCurrency(commissionMetrics.totalCommissionPool)} in annual partner commissions
            through manual processes that were creating significant friction. Finance spent
            8.5 hours weekly on calculations, error rates were unacceptable, and partners were
            increasingly frustrated with payment delays and calculation disputes.
          </p>
          <p className="leading-relaxed">
            The commission structure itself had become a strategic liability—static tiers weren't
            motivating top performers, dispute rates hit 3.8%, and we had zero visibility into
            which commission investments were actually driving revenue. Something had to change.
          </p>
        </div>
      </SectionCard>

      {/* Task */}
      <SectionCard title="Task">
        <div className="space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            I was tasked with completely transforming our commission operations—not just fixing
            the immediate problems, but building a system that would scale. My mandate was clear:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Eliminate manual calculation errors and reduce processing time by at least 60%</li>
            <li>Design commission structures that actively drive partner performance improvement</li>
            <li>Build real-time transparency to slash dispute rates below 2%</li>
            <li>Create analytics capabilities to measure and optimize commission ROI</li>
            <li>Automate tier adjustments based on actual performance data</li>
            <li>Deliver measurable partner satisfaction improvements within 6 months</li>
          </ul>
        </div>
      </SectionCard>

      {/* Action */}
      <SectionCard title="Action">
        <div className="space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            I designed and built a comprehensive commission optimization platform from scratch,
            architecting every component to address the specific pain points I'd identified:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <FeatureCard title="Automation Engine I Built">
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Real-time commission calculation engine achieving 99.8% accuracy</li>
                <li>Automated tier adjustment algorithms based on rolling performance metrics</li>
                <li>Dynamic incentive program management with A/B testing capabilities</li>
                <li>Integrated dispute resolution workflows with full audit trails</li>
                <li>Compliance monitoring and automated reporting</li>
              </ul>
            </FeatureCard>
            <FeatureCard title="Analytics & Optimization Layer">
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>ROI analysis dashboards for each commission tier and program</li>
                <li>Predictive models for partner performance and tier advancement</li>
                <li>Partner satisfaction tracking integrated with commission events</li>
                <li>Scenario modeling for commission structure optimization</li>
                <li>Executive reporting with actionable insights</li>
              </ul>
            </FeatureCard>
          </div>

          <p className="leading-relaxed mt-4">
            I personally led the integration with our CRM and finance systems, designed the
            stakeholder-specific dashboards, and trained the team on leveraging the new
            capabilities. The rollout was phased to minimize disruption while maximizing adoption.
          </p>
        </div>
      </SectionCard>

      {/* Result */}
      <SectionCard title="Result">
        <div className="space-y-6 text-muted-foreground">
          <p className="leading-relaxed">
            The commission optimization system I built delivered transformational results across
            every metric we tracked:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard
              value={formatCurrency(commissionMetrics.totalCommissionPool)}
              label="Annual Commission Pool Managed"
              variant="primary"
            />
            <ResultCard
              value={`+${formatPercentage(commissionMetrics.performanceImprovement / 100)}`}
              label="Partner Performance Improvement"
              variant="secondary"
            />
            <ResultCard
              value={formatPercentage(commissionMetrics.automationEfficiency / 100)}
              label="Automation Efficiency Achieved"
              variant="accent"
            />
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-primary">Quantified Business Outcomes I Delivered:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Reduced commission processing time from 8.5 to 2.3 hours weekly (73% improvement)</li>
              <li>Decreased dispute rate from 3.8% to 1.2% through transparent real-time tracking</li>
              <li>Increased partner satisfaction scores by 19 points to 94.7%</li>
              <li>Improved calculation accuracy from 87.8% to 99.8%</li>
              <li>Generated $127K additional revenue through optimized incentive structures</li>
              <li>Achieved 4.2x average ROI across all commission tiers</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <ResultCard value="73%" label="Processing Time Reduction" variant="primary" />
            <ResultCard value="68%" label="Dispute Rate Reduction" variant="secondary" />
            <ResultCard value="99.8%" label="Calculation Accuracy" variant="accent" />
            <ResultCard value="94.7%" label="Partner Satisfaction" variant="primary" />
          </div>
        </div>
      </SectionCard>

      {/* Key Learnings */}
      <SectionCard title="Key Learnings">
        <div className="space-y-4 text-muted-foreground">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-accent-foreground">Business Strategy Insights</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  Commission structures are behavioral levers—small, targeted adjustments
                  yield disproportionate performance changes
                </li>
                <li>
                  Transparency in calculations builds more partner trust than higher rates;
                  visibility reduces disputes faster than generosity
                </li>
                <li>Dynamic tier structures outperform static ones by 23% in partner engagement</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-secondary">Technical Implementation Insights</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  Real-time calculation engines require robust error handling and atomic
                  rollback mechanisms—I learned this the hard way
                </li>
                <li>Automated audit trails aren't just for compliance—they're dispute resolution accelerators</li>
                <li>
                  Performance optimization is critical at scale; I implemented caching strategies
                  that reduced query times by 80%
                </li>
              </ul>
            </div>
          </div>
          <p className="leading-relaxed mt-4">
            This project reinforced my belief that commission optimization is both art and science.
            The most successful strategies I've implemented combine rigorous data analysis with
            deep understanding of what actually motivates partner behavior.
          </p>
        </div>
      </SectionCard>
    </div>
  )
}
