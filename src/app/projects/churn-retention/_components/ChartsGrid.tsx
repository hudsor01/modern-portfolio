'use client'

import dynamicImport from 'next/dynamic'
import { ChartSkeleton } from '@/components/charts/chart-skeleton'
import { ChartContainer } from '@/components/ui/chart-container'

const ChurnLineChart = dynamicImport(() => import('./ChurnLineChart'), {
  loading: () => <ChartSkeleton height="md" />,
  ssr: false,
})
const RetentionHeatmap = dynamicImport(() => import('./RetentionHeatmap'), {
  loading: () => <ChartSkeleton height="md" />,
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
        headingLevel={2}
        title="Partner Retention Patterns"
        description="Monthly retention rates by partner cohort"
        size="md"
        loading={isLoading}
      >
        <RetentionHeatmap data={churnData} />
      </ChartContainer>

      {/* Churn Trends */}
      <ChartContainer
        headingLevel={2}
        title="Churn Rate Trends"
        description="Historical churn rate analysis and projections"
        size="md"
        loading={isLoading}
      >
        <ChurnLineChart data={churnData} />
      </ChartContainer>
    </div>
  )
}
