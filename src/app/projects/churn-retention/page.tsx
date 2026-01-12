'use client'
export const dynamic = 'force-static'

import { useAnalyticsData } from '@/hooks/use-analytics-data'
import { TrendingDown, Users, Activity, AlertCircle } from 'lucide-react'

import { ProjectPageLayout } from '@/components/projects/project-page-layout'
import { MetricsGrid } from '@/components/projects/metrics-grid'
import { ProjectJsonLd } from '@/components/seo/json-ld'
import { formatPercentage, formatNumber, formatCurrency } from '@/lib/utils/data-formatters'

// Import static churn data
import { staticChurnData } from '@/app/projects/data/partner-analytics'

// Import wrapper components
import { ChartsGrid } from './_components/ChartsGrid'
import { NarrativeSections } from './_components/NarrativeSections'

export default function ChurnAnalysis() {
  const {
    data: analyticsData,
    isLoading,
  } = useAnalyticsData()

  const churnData = (() =>
      analyticsData?.churn?.length
        ? analyticsData.churn.map((item) => ({
            month: item.month,
            churnRate: item.churn_rate,
            retained: item.retained_partners,
            churned: item.churned_partners,
          }))
        : staticChurnData
  )()


  // Ensure data exists before accessing indices
  const currentMonth = churnData?.[churnData.length - 1] ?? null
  const previousMonth = churnData?.[churnData.length - 2] ?? null

  // Safe calculations
  const churnDifference =
    currentMonth && previousMonth ? currentMonth.churnRate - previousMonth.churnRate : 0

  const totalPartners = currentMonth ? currentMonth.retained + currentMonth.churned : 0

  const retentionRate = currentMonth ? (currentMonth.retained / totalPartners) * 100 : 0

  // Create metrics data for standardized MetricsGrid
  const metricsData = [
    {
      id: 'churn-rate',
      icon: TrendingDown,
      label: 'Current',
      value: currentMonth ? formatPercentage(currentMonth.churnRate / 100) : 'N/A',
      subtitle: 'Churn Rate',
      variant: 'warning' as const,
    },
    {
      id: 'retention-rate',
      icon: Users,
      label: 'Current',
      value: formatPercentage(retentionRate / 100),
      subtitle: 'Retention Rate',
      variant: 'success' as const,
    },
    {
      id: 'churn-trend',
      icon: Activity,
      label: 'vs Last Month',
      value:
        churnDifference > 0
          ? `+${formatPercentage(Math.abs(churnDifference) / 100)}`
          : formatPercentage(Math.abs(churnDifference) / 100),
      subtitle: 'Churn Change',
      variant: 'info' as const,
      trend: {
        direction:
          churnDifference > 0
            ? ('up' as const)
            : churnDifference < 0
              ? ('down' as const)
              : ('neutral' as const),
        value: formatPercentage(Math.abs(churnDifference) / 100),
        label: 'vs last month',
      },
    },
    {
      id: 'churned-partners',
      icon: AlertCircle,
      label: 'This Month',
      value: currentMonth ? formatNumber(currentMonth.churned) : 'N/A',
      subtitle: 'Partners Churned',
      variant: 'warning' as const,
    },
  ]

  return (
    <>
      <ProjectJsonLd
        title="Customer Churn & Retention Analysis - Predictive Analytics"
        description="Advanced churn prediction and retention analysis dashboard with customer lifecycle metrics, retention heatmaps, and predictive modeling for customer success optimization."
        slug="churn-retention"
        category="Customer Analytics"
        tags={[
          'Churn Analysis',
          'Customer Retention',
          'Predictive Analytics',
          'Customer Success',
          'Lifecycle Management',
          'Customer Analytics',
          'Data Science',
          'Machine Learning',
        ]}
      />
      <ProjectPageLayout
        title="Churn & Retention Analysis"
        description="Track partner churn rates and retention patterns to identify at-risk segments and improve partner success strategies."
        tags={[
          {
            label: `Churn Rate: ${currentMonth ? formatPercentage(currentMonth.churnRate / 100) : 'N/A'}`,
            variant: 'warning' as const,
          },
          {
            label: `Retention: ${formatPercentage(retentionRate / 100)}`,
            variant: 'success' as const,
          },
          { label: 'Prediction: 89%', variant: 'info' as const },
          {
            label: `Revenue Saved: ${formatCurrency(830000, { compact: true })}`,
            variant: 'success' as const,
          },
        ]}
      >
        {isLoading ? (
          <MetricsGrid metrics={metricsData} columns={4} loading={true} className="mb-8" />
        ) : (
          <>
            {/* Standardized Metrics Grid */}
            <div className="mb-8">
              <MetricsGrid metrics={metricsData} columns={4} />
            </div>

            {/* Charts Grid */}
            <ChartsGrid churnData={churnData} isLoading={isLoading} />

            {/* Narrative Sections */}
            <NarrativeSections revenueSaved={830000} />
          </>
        )}
      </ProjectPageLayout>
    </>
  )
}
