'use client'

import { Code } from 'lucide-react'
import { SectionCard } from '@/components/ui/section-card'
import { FeatureListGrid } from '@/components/projects/shared/feature-list-grid'
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/data-formatters'

interface AlgorithmicApproach {
  name: string
  description: string
  outcomes: string[]
}

interface AlgorithmicApproachesGridProps {
  approaches: AlgorithmicApproach[]
}

export function AlgorithmicApproachesGrid({ approaches }: AlgorithmicApproachesGridProps) {
  const mlModels = [
    'Regression models for revenue prediction',
    'Classification for territory potential',
    'Clustering for geographic optimization',
    'Time series forecasting',
  ]

  const dataAnalytics = [
    `${formatNumber(2500000, { compact: true })} data points analyzed`,
    'Multi-dimensional territory analysis',
    'Real-time performance tracking',
    'Historical trend analysis',
  ]

  return (
    <>
      <FeatureListGrid
        featureTitle="Algorithmic Approaches"
        featureDescription="Advanced algorithms and methodologies for quota and territory optimization"
        items={approaches.map((a) => ({
          title: a.name,
          description: a.description,
          bullets: a.outcomes,
        }))}
        itemIcon={Code}
        impactTitle="Revenue Impact"
        impactDescription="Measurable business impact and performance improvements"
        impactStats={[
          {
            value: formatCurrency(8700000, { compact: true }),
            label: 'Incremental revenue from optimized territories',
            variant: 'secondary',
          },
          {
            value: formatPercentage(0.28),
            label: 'Improvement in forecast accuracy',
            variant: 'primary',
          },
          {
            value: formatPercentage(0.32),
            label: 'Reduction in quota attainment variance',
            variant: 'secondary',
          },
          {
            value: formatPercentage(0.23),
            label: 'Average territory efficiency increase',
            variant: 'primary',
          },
        ]}
      />

      {/* Technical Implementation — project-unique, kept inline */}
      <SectionCard
        title="Technical Stack & Methodologies"
        description="Machine learning models and data analytics approaches"
        className="mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Machine Learning Models</h3>
            <ul className="space-y-2 text-muted-foreground">
              {mlModels.map((model) => (
                <li key={model}>• {model}</li>
              ))}
            </ul>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Data & Analytics</h3>
            <ul className="space-y-2 text-muted-foreground">
              {dataAnalytics.map((analytic) => (
                <li key={analytic}>• {analytic}</li>
              ))}
            </ul>
          </div>
        </div>
      </SectionCard>
    </>
  )
}
