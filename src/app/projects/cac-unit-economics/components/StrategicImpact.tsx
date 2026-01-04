'use client'

import { MetricsGrid } from '@/components/projects/metrics-grid'
import { TrendingUp, Target, Calculator } from 'lucide-react'

export function StrategicImpact() {
  const impactMetrics = [
    {
      id: 'cac-reduction',
      icon: TrendingUp,
      label: 'CAC Reduction',
      value: '32%',
      subtitle: 'Through Strategic Partner Channel Optimization',
      variant: 'success' as const,
    },
    {
      id: 'ltv-cac-efficiency',
      icon: Calculator,
      label: 'LTV:CAC Efficiency',
      value: '3.6:1',
      subtitle: 'Industry-Leading Ratio (Benchmark: 3:1+)',
      variant: 'success' as const,
    },
    {
      id: 'payback-period',
      icon: Target,
      label: 'Payback Period',
      value: '8.4 mo',
      subtitle: 'Optimized Customer Payback (Target: <12mo)',
      variant: 'primary' as const,
    },
  ]

  return (
    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xs border border-green-200 dark:border-green-800 rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4 text-green-600 dark:text-green-400">
        Proven Revenue Operations Impact & ROI Results
      </h2>
      <MetricsGrid metrics={impactMetrics} columns={3} className="gap-4" />
    </div>
  )
}
