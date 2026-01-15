'use client'

import { CheckCircle } from 'lucide-react'
import { SectionCard } from '@/components/ui/section-card'
import { formatCurrency, formatPercentage } from '@/lib/data-formatters'

interface Module {
  title: string
  description: string
  capabilities: string[]
}

interface IntelligenceModulesGridProps {
  modules: Module[]
}

export function IntelligenceModulesGrid({ modules }: IntelligenceModulesGridProps) {
  const dealHealthSignals = [
    'Engagement level and trend',
    'Buying committee consensus',
    'Competitive threat assessment',
    'Budget confirmation status',
    'Timeline alignment',
    'Champion strength and risk',
  ]

  const forecastingSignals = [
    'Historical stage progression rates',
    'Seasonal patterns and trends',
    'Deal size and complexity',
    'Rep experience and track record',
    'Customer industry and maturity',
    'Days in current stage',
  ]

  return (
    <>
      {/* Intelligence Modules */}
      <SectionCard
        title="Intelligence Modules"
        description="Core components of the forecasting and pipeline intelligence system"
        className="mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((module, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all"
            >
              <h3 className="text-lg font-semibold mb-3">{module.title}</h3>
              <p className="text-muted-foreground mb-4">{module.description}</p>
              <ul className="space-y-2">
                {module.capabilities.map((capability, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>{capability}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Business Impact */}
      <SectionCard
        title="Business Impact"
        description="Measurable improvements in forecasting accuracy and pipeline management"
        variant="gradient"
        className="mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center p-4">
            <div className="text-3xl font-bold text-secondary mb-2">
              {formatCurrency(12500000, { compact: true })}
            </div>
            <p className="text-muted-foreground">
              Revenue protected through proactive pipeline management
            </p>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl font-bold text-primary mb-2">{formatPercentage(0.94)}</div>
            <p className="text-muted-foreground">Overall forecasting accuracy achieved</p>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl font-bold text-secondary mb-2">{formatPercentage(0.31)}</div>
            <p className="text-muted-foreground">Improvement in revenue forecast accuracy</p>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl font-bold text-primary mb-2">{formatPercentage(0.26)}</div>
            <p className="text-muted-foreground">Reduction in deal slippage</p>
          </div>
        </div>
      </SectionCard>

      {/* Analytics & Signals */}
      <SectionCard
        title="Analytics & Signals"
        description="Data signals and analytics approaches used for forecasting intelligence"
        className="mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Deal Health Signals (50+)</h3>
            <ul className="space-y-2 text-muted-foreground text-sm">
              {dealHealthSignals.map((signal, idx) => (
                <li key={idx}>• {signal}</li>
              ))}
            </ul>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Forecasting Signals</h3>
            <ul className="space-y-2 text-muted-foreground text-sm">
              {forecastingSignals.map((signal, idx) => (
                <li key={idx}>• {signal}</li>
              ))}
            </ul>
          </div>
        </div>
      </SectionCard>
    </>
  )
}
