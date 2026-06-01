'use client'

import dynamicImport from 'next/dynamic'
import { ChartSkeleton } from '@/components/charts/chart-skeleton'
import { ChartContainer } from '@/components/ui/chart-container'

const ChurnLineChart = dynamicImport(() => import('./ChurnLineChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false,
})
const RetentionHeatmap = dynamicImport(() => import('./RetentionHeatmap'), {
  loading: () => <ChartSkeleton />,
  ssr: false,
})

type ChurnDataItem = {
  month: string
  churnRate: number
  retained: number
  churned: number
}

type ChartsGridProps = {
  churnData: ChurnDataItem[]
  isLoading?: boolean
}

export function ChartsGrid({ churnData, isLoading = false }: ChartsGridProps) {
  return (
    <div className="space-y-8 mb-8">
      {/* Retention Heatmap */}
      <ChartContainer
        title="Partner Retention Patterns"
        description="Monthly retention rates by partner cohort"
        height={350}
        loading={isLoading}
      >
        <RetentionHeatmap data={churnData} />
      </ChartContainer>

      {/* Churn Trends */}
      <ChartContainer
        title="Churn Rate Trends"
        description="Historical churn rate analysis and projections"
        height={350}
        loading={isLoading}
      >
        <ChurnLineChart data={churnData} />
      </ChartContainer>
    </div>
  )
}
