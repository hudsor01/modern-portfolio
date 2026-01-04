'use client'

import { SectionCard } from '@/components/ui/section-card'
import { ResultCard, TechGrid, FeatureCard } from '@/components/projects/shared'
import { commissionMetrics, technologies } from '../data/constants'
import { formatCurrency, formatPercentage } from '@/lib/utils/data-formatters'

export function NarrativeSections() {
  return (
    <div className="space-y-12 mt-12">
      {/* Project Overview */}
      <SectionCard title="Project Overview">
        <div className="space-y-4 text-muted-foreground">
          <p className="text-lg leading-relaxed">
            Designed and implemented a comprehensive commission optimization system to manage{' '}
            {formatCurrency(commissionMetrics.totalCommissionPool)} annual commission pool across
            multi-tier partner structures. This strategic initiative transformed commission
            management from manual processes to automated optimization.
          </p>
          <p className="leading-relaxed">
            The system enabled data-driven commission strategy decisions that improved partner
            performance by {formatPercentage(commissionMetrics.performanceImprovement / 100)} while
            achieving {formatPercentage(commissionMetrics.automationEfficiency / 100)} automation
            efficiency across all commission operations.
          </p>
        </div>
      </SectionCard>

      {/* Challenge */}
      <SectionCard title="Challenge">
        <div className="space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            The existing commission structure was hindering partner performance and creating
            operational inefficiencies. Key problems included:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Manual commission calculations consuming 8.5 hours weekly with frequent errors</li>
            <li>Static tier structures not aligned with actual partner performance patterns</li>
            <li>
              High dispute rates (3.8%) due to calculation inconsistencies and transparency issues
            </li>
            <li>Inability to rapidly adjust incentive programs based on market conditions</li>
            <li>Partner dissatisfaction with delayed payments and unclear commission structures</li>
            <li>No visibility into commission ROI or optimization opportunities</li>
          </ul>
          <p className="leading-relaxed">
            These inefficiencies were not only costly operationally but also negatively impacting
            partner motivation and retention rates.
          </p>
        </div>
      </SectionCard>

      {/* Solution */}
      <SectionCard title="Solution">
        <div className="space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            Developed a comprehensive commission optimization platform with automated tier
            management, real-time calculations, and performance-based incentive programs:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <FeatureCard title="Automation Engine" >
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Real-time commission calculation with 99.8% accuracy</li>
                <li>Automated tier adjustments based on performance metrics</li>
                <li>Dynamic incentive program management</li>
                <li>Integrated dispute resolution workflows</li>
                <li>Compliance monitoring and audit trails</li>
              </ul>
            </FeatureCard>
            <FeatureCard title="Analytics & Optimization" >
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>ROI analysis for each commission tier and program</li>
                <li>Performance impact measurement and forecasting</li>
                <li>Partner satisfaction tracking and optimization</li>
                <li>Commission structure scenario modeling</li>
                <li>Predictive analytics for tier advancement</li>
              </ul>
            </FeatureCard>
          </div>

          <p className="leading-relaxed mt-4">
            The solution included comprehensive dashboards for different stakeholders: executives
            focused on ROI metrics, operations teams managing day-to-day processing, and partners
            tracking their earnings and performance.
          </p>
        </div>
      </SectionCard>

      {/* Results & Impact */}
      <SectionCard title="Results & Impact">
        <div className="space-y-6 text-muted-foreground">
          <p className="leading-relaxed">
            The commission optimization system delivered significant operational improvements and
            partner performance gains:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard
              value={formatCurrency(commissionMetrics.totalCommissionPool)}
              label="Annual Commission Pool Management"
              variant="primary"
            />
            <ResultCard
              value={`+${formatPercentage(commissionMetrics.performanceImprovement / 100)}`}
              label="Partner Performance Improvement"
              variant="secondary"
            />
            <ResultCard
              value={formatPercentage(commissionMetrics.automationEfficiency / 100)}
              label="Automation & Processing Efficiency"
              variant="accent"
            />
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-primary">Quantified Business Outcomes:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Reduced commission processing time from 8.5 to 2.3 hours (73% improvement)</li>
              <li>Decreased dispute rate from 3.8% to 1.2% through improved transparency</li>
              <li>Increased partner satisfaction scores by 19% to 94.7%</li>
              <li>Improved calculation accuracy from 87.8% to 99.8%</li>
              <li>Generated $127K additional revenue through optimized incentive programs</li>
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
                  Commission structures significantly impact partner behavior - small adjustments
                  yield large performance changes
                </li>
                <li>
                  Transparency in commission calculations builds trust and reduces disputes more
                  than higher rates
                </li>
                <li>Dynamic tier structures outperform static ones by 23% in partner engagement</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-secondary">Technical Implementation Insights</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  Real-time calculation engines require robust error handling and rollback
                  mechanisms
                </li>
                <li>Automated audit trails are essential for compliance and dispute resolution</li>
                <li>
                  Performance optimization is critical when processing large commission datasets
                </li>
              </ul>
            </div>
          </div>
          <p className="leading-relaxed mt-4">
            This project demonstrated that commission optimization is both an art and a science. The
            most successful strategies combined data-driven insights with deep understanding of
            partner psychology and motivation patterns.
          </p>
        </div>
      </SectionCard>

      {/* Technologies Used */}
      <TechGrid technologies={technologies} />
    </div>
  )
}
