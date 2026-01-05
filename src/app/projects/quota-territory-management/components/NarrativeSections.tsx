'use client'

import { SectionCard } from '@/components/ui/section-card'
import { ResultCard, TechGrid, FeatureCard } from '@/components/projects/shared'
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/utils/data-formatters'

const technologies = [
  'Python',
  'Machine Learning',
  'Predictive Analytics',
  'D3.js',
  'Recharts',
  'PostgreSQL',
  'Next.js',
  'TypeScript',
  'Geospatial Analysis',
  'Regression Modeling',
  'Clustering Algorithms',
  'Time Series Forecasting',
]

export function NarrativeSections() {
  return (
    <div className="space-y-12 mt-12">
      {/* Situation */}
      <SectionCard title="Situation">
        <div className="space-y-4 text-muted-foreground">
          <p className="text-lg leading-relaxed">
            When I took over territory and quota planning, I inherited a system that was failing
            sales reps and the business alike. Territory assignments were based on arbitrary
            geographic boundaries created years ago, with no consideration of actual market
            potential. Quota setting was a political process rather than a scientific one—top
            performers received ever-increasing quotas that eventually drove them out, while
            underperformers were protected with achievable targets.
          </p>
          <p className="leading-relaxed">
            The results were predictable: quota attainment variance exceeded 32%, meaning some
            reps were crushing their numbers while others missed by wide margins. Sales turnover
            was 28% annually—largely driven by perceived quota unfairness. Territory coverage
            was inefficient, with some markets over-resourced while high-potential areas were
            neglected. With 47 territories and {formatCurrency(8700000)} in revenue at stake,
            we needed a complete redesign.
          </p>
        </div>
      </SectionCard>

      {/* Task */}
      <SectionCard title="Task">
        <div className="space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            I was tasked with building an intelligent territory and quota management system that
            would replace politics with data, creating fair quotas and optimized territories.
            My specific objectives included:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Reduce quota attainment variance from 32% to under 15%</li>
            <li>Improve territory revenue forecast accuracy by at least 25%</li>
            <li>Create fairness-first quota methodology with objective, defensible criteria</li>
            <li>Design optimal territory boundaries based on market potential and coverage</li>
            <li>Reduce sales rep turnover by addressing perceived quota inequity</li>
            <li>Enable what-if scenario planning for annual territory realignment</li>
          </ul>
        </div>
      </SectionCard>

      {/* Action */}
      <SectionCard title="Action">
        <div className="space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            I designed and built a comprehensive territory intelligence platform combining
            machine learning, geospatial analysis, and fairness algorithms. The system analyzed
            {formatNumber(2500000)} data points to create scientifically-optimized territories
            and quotas:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <FeatureCard title="Territory Optimization I Built">
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Market potential scoring using 50+ demographic and firmographic signals</li>
                <li>Geospatial clustering for optimal boundary design</li>
                <li>Travel time optimization for field rep coverage</li>
                <li>Account concentration analysis to balance workloads</li>
                <li>Historical performance attribution by territory</li>
              </ul>
            </FeatureCard>
            <FeatureCard title="Quota Setting Methodology">
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Fairness-first algorithm weighing potential, history, and experience</li>
                <li>Regression models predicting territory revenue potential</li>
                <li>Rep ramp factor adjustments for tenure and role changes</li>
                <li>Seasonal adjustment based on historical patterns</li>
                <li>What-if scenario planning for leadership review</li>
              </ul>
            </FeatureCard>
          </div>

          <p className="leading-relaxed mt-4">
            I personally led the data science work, built the optimization algorithms, and
            designed the executive scenario planning interface. I also led change management
            with the sales leadership team, walking them through the methodology transparency
            that would help them defend quotas to their teams. The system was validated with
            the top 10 territories before full rollout.
          </p>
        </div>
      </SectionCard>

      {/* Result */}
      <SectionCard title="Result">
        <div className="space-y-6 text-muted-foreground">
          <p className="leading-relaxed">
            The territory intelligence system I built transformed how the organization sets
            quotas and designs territories, creating measurable improvements in fairness,
            forecast accuracy, and sales team retention:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <ResultCard
              value={formatPercentage(0.28)}
              label="Forecast Accuracy Improvement"
              variant="primary"
            />
            <ResultCard
              value={formatPercentage(0.32)}
              label="Quota Variance Reduction"
              variant="secondary"
            />
            <ResultCard
              value={formatCurrency(8700000, { compact: true })}
              label="Incremental Revenue"
              variant="primary"
            />
            <ResultCard
              value={formatPercentage(0.18)}
              label="Rep Churn Reduction"
              variant="secondary"
            />
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-secondary">Quantified Business Outcomes I Delivered:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Improved territory revenue forecast accuracy from 64% to 92%—a 28 point improvement</li>
              <li>Reduced quota attainment variance from 32% to 11%—creating perceived fairness</li>
              <li>Generated {formatCurrency(8700000)} in incremental revenue through optimized territories</li>
              <li>Reduced sales rep turnover from 28% to 10%—saving {formatCurrency(2100000)} in recruiting costs</li>
              <li>Increased average territory efficiency by 23% through better boundary design</li>
              <li>Reduced planning cycle from 8 weeks to 3 weeks through scenario automation</li>
            </ul>
          </div>
        </div>
      </SectionCard>

      {/* Key Learnings */}
      <SectionCard title="Key Learnings">
        <div className="space-y-4 text-muted-foreground">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-accent-foreground">Territory Strategy Insights</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  Perceived fairness matters as much as actual fairness—transparency in
                  methodology is essential for sales buy-in
                </li>
                <li>
                  Territory boundaries should follow market logic, not administrative
                  convenience—geospatial optimization reveals hidden potential
                </li>
                <li>
                  Quota setting should consider rep experience level—aggressive ramp
                  expectations cause early attrition
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-primary">Technical Insights</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  Clustering algorithms outperform manual boundary drawing for territory
                  design—the data reveals patterns humans miss
                </li>
                <li>
                  What-if scenario planning drives executive adoption—leaders want to
                  explore options, not receive edicts
                </li>
                <li>
                  Historical performance must be adjusted for market changes—past success
                  doesn't predict future potential
                </li>
              </ul>
            </div>
          </div>
          <p className="leading-relaxed mt-4">
            This project taught me that territory and quota planning is fundamentally about
            trust—sales teams need to believe the system is fair, even if they don't understand
            every algorithm. I now prioritize methodology transparency and change management
            as heavily as the data science itself.
          </p>
        </div>
      </SectionCard>

      {/* Technologies Used */}
      <TechGrid technologies={technologies} />
    </div>
  )
}
