'use client'

import { Code, Check } from 'lucide-react'
import { SectionCard } from '@/components/ui/section-card'
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
      {/* Algorithmic Approaches */}
      <SectionCard
        title="Algorithmic Approaches"
        description="Advanced algorithms and methodologies for quota and territory optimization"
        className="mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {approaches.map((approach, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all"
            >
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                {approach.name}
              </h3>
              <p className="text-muted-foreground mb-4">{approach.description}</p>
              <ul className="space-y-2">
                {approach.outcomes.map((outcome, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Revenue Impact */}
      <SectionCard
        title="Revenue Impact"
        description="Measurable business impact and performance improvements"
        variant="gradient"
        className="mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center p-4">
            <div className="text-3xl font-bold text-secondary mb-2">
              {formatCurrency(8700000, { compact: true })}
            </div>
            <p className="text-muted-foreground">
              Incremental revenue from optimized territories
            </p>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl font-bold text-primary mb-2">{formatPercentage(0.28)}</div>
            <p className="text-muted-foreground">Improvement in forecast accuracy</p>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl font-bold text-secondary mb-2">{formatPercentage(0.32)}</div>
            <p className="text-muted-foreground">Reduction in quota attainment variance</p>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl font-bold text-primary mb-2">{formatPercentage(0.23)}</div>
            <p className="text-muted-foreground">Average territory efficiency increase</p>
          </div>
        </div>
      </SectionCard>

      {/* Technical Implementation */}
      <SectionCard
        title="Technical Stack & Methodologies"
        description="Machine learning models and data analytics approaches"
        className="mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Machine Learning Models</h3>
            <ul className="space-y-2 text-muted-foreground">
              {mlModels.map((model, idx) => (
                <li key={idx}>• {model}</li>
              ))}
            </ul>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Data & Analytics</h3>
            <ul className="space-y-2 text-muted-foreground">
              {dataAnalytics.map((analytic, idx) => (
                <li key={idx}>• {analytic}</li>
              ))}
            </ul>
          </div>
        </div>
      </SectionCard>
    </>
  )
}
