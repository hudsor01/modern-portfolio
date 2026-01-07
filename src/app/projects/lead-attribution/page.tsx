'use client'

import { useMemo } from 'react'
import {
  TrendingUp,
  Users,
  Zap,
  Target,
  Globe,
  Mail,
  Share2,
  DollarSign,
  Activity,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { ProjectPageLayout } from '@/components/projects/project-page-layout'
import { LoadingState } from '@/components/projects/loading-state'
import { MetricsGrid } from '@/components/projects/metrics-grid'
import { SectionCard } from '@/components/ui/section-card'
import { ChartContainer } from '@/components/ui/chart-container'
import { ProjectJsonLd } from '@/components/seo/json-ld'
import { useLoadingState } from '@/hooks/use-loading-state'
import { useAnalyticsData } from '@/hooks/use-analytics-data'
import { formatNumber, formatPercentage, formatTrend } from '@/lib/utils/data-formatters'
import { leadAttributionData } from '@/app/projects/data/partner-analytics'

import { leadConversionData, monthlyTrendData } from './data/constants'
import { ChartsSection } from './components/ChartsSection'
import { TrendsChart } from './components/TrendsChart'
import { InsightsSection } from './components/InsightsSection'
import { NarrativeSections } from './components/NarrativeSections'

export default function LeadAttribution() {
  const { isLoading: isUiLoading, handleRefresh: handleUiRefresh } = useLoadingState()
  const {
    data: analyticsData,
    isLoading: isAnalyticsLoading,
    refresh: refreshAnalyticsData,
  } = useAnalyticsData()

  const leadSources = useMemo(() => {
    if (analyticsData?.leadAttribution?.length) {
      return analyticsData.leadAttribution.map((item) => ({
        name: item.channel,
        value: item.leads,
        growth: item.conversion_rate ? `+${item.conversion_rate.toFixed(1)}%` : undefined,
      }))
    }

    return leadAttributionData.map((item) => ({
      name: item.source,
      value: item.leads,
      growth: item.conversion ? `+${(item.conversion * 100).toFixed(1)}%` : undefined,
    }))
  }, [analyticsData?.leadAttribution])

  const conversionSources = useMemo(() => {
    const iconByChannel: Record<string, LucideIcon> = {
      Website: Globe,
      'Organic Search': Globe,
      'Paid Search': DollarSign,
      'Paid Social': Users,
      'Social Media': Users,
      Referrals: Share2,
      Referral: Share2,
      LinkedIn: Users,
      Conferences: Users,
      Email: Mail,
      'Email Marketing': Mail,
      'Google Ads': DollarSign,
      'Content Marketing': Globe,
      'Direct Traffic': Activity,
    }

    if (analyticsData?.leadAttribution?.length) {
      return analyticsData.leadAttribution.map((item) => ({
        source: item.channel,
        conversions: item.closed,
        conversion_rate: item.conversion_rate / 100,
        icon: iconByChannel[item.channel] || Activity,
      }))
    }

    return leadConversionData
  }, [analyticsData?.leadAttribution])

  const trendData = useMemo(() => {
    if (analyticsData?.leadTrends?.length) {
      return analyticsData.leadTrends.map((item) => ({
        month: item.month,
        leads: item.leads,
        conversions: item.conversions,
      }))
    }

    return monthlyTrendData
  }, [analyticsData?.leadTrends])

  const totalLeads = leadSources.reduce((sum, source) => sum + (source.value || 0), 0)
  const totalConversions = conversionSources.reduce(
    (sum, source) => sum + (source.conversions || 0),
    0
  )

  // Calculate conversion rate safely
  const overallConversionRate = totalLeads > 0 ? (totalConversions / totalLeads) * 100 : 0

  // Find best performing source
  const bestSource =
    conversionSources.length > 0
      ? conversionSources.reduce((best, current) =>
          current.conversion_rate > best.conversion_rate ? current : best
        )
      : { source: 'N/A', conversions: 0, conversion_rate: 0, icon: Activity }

  // Calculate month-over-month growth safely (prevent division by zero)
  const lastMonth = trendData[trendData.length - 1]
  const prevMonth = trendData[trendData.length - 2]
  const monthlyGrowth =
    prevMonth && lastMonth && prevMonth.leads > 0
      ? ((lastMonth.leads - prevMonth.leads) / prevMonth.leads) * 100
      : 0

  const isLoading = isUiLoading || isAnalyticsLoading

  // Standardized metrics configuration using consistent data formatting
  const metrics = [
    {
      id: 'total-leads',
      icon: Users,
      label: 'Total',
      value: formatNumber(totalLeads),
      subtitle: 'Leads Generated',
      variant: 'primary' as const,
    },
    {
      id: 'total-conversions',
      icon: Target,
      label: 'Success',
      value: formatNumber(totalConversions),
      subtitle: 'Total Conversions',
      variant: 'secondary' as const,
    },
    {
      id: 'conversion-rate',
      icon: Zap,
      label: 'Overall',
      value: formatPercentage(overallConversionRate / 100),
      subtitle: 'Conversion Rate',
      variant: 'primary' as const,
    },
    {
      id: 'monthly-growth',
      icon: TrendingUp,
      label: 'MoM',
      value: formatTrend(monthlyGrowth / 100, { format: 'percentage', showArrow: false }),
      subtitle: 'Monthly Growth',
      variant: 'secondary' as const,
    },
  ]

  return (
    <>
      <ProjectJsonLd
        title="Lead Attribution & Marketing Analytics - Multi-Touch Attribution"
        description="Comprehensive lead attribution analysis with multi-touch attribution modeling."
        slug="lead-attribution"
        category="Marketing Analytics"
        tags={[
          'Lead Attribution',
          'Marketing Analytics',
          'Campaign Tracking',
          'Multi-Touch Attribution',
        ]}
      />
      <ProjectPageLayout
        title="Lead Attribution Analytics"
        description="Understand your lead sources, optimize marketing spend, and improve conversion rates across all channels."
        tags={[
          { label: `Total Leads: ${formatNumber(totalLeads)}`, variant: 'primary' },
          { label: `Conversions: ${formatNumber(totalConversions)}`, variant: 'secondary' },
          {
            label: `Conversion Rate: ${formatPercentage(overallConversionRate / 100)}`,
            variant: 'primary',
          },
          {
            label: `Growth: ${formatTrend(monthlyGrowth / 100, { format: 'percentage', showArrow: false })}`,
            variant: 'secondary',
          },
        ]}
        onRefresh={() => {
          handleUiRefresh()
          void refreshAnalyticsData()
        }}
        refreshButtonDisabled={isLoading}
      >
        {isLoading ? (
          <LoadingState />
        ) : (
          <>
            {/* Key Metrics using standardized MetricsGrid */}
            <MetricsGrid metrics={metrics} columns={4} loading={isLoading} className="mb-8" />

            {/* Charts Section wrapped in SectionCard */}
            <SectionCard
              title="Lead Source Analysis"
              description="Breakdown of lead generation and conversion performance by source"
              className="mb-8"
            >
              <ChartsSection
                bestSource={bestSource}
                leadSources={leadSources}
                conversionSources={conversionSources}
              />
            </SectionCard>

            {/* Monthly Trends wrapped in SectionCard */}
            <SectionCard
              title="Monthly Trends"
              description="Lead generation trends and performance over time"
              className="mb-8"
            >
              <ChartContainer
                title="Lead Generation Trends"
                description="Monthly lead volume and growth patterns"
                height={400}
              >
                <TrendsChart data={trendData} />
              </ChartContainer>
            </SectionCard>

            {/* Insights Section wrapped in SectionCard */}
            <SectionCard
              title="Performance Insights"
              description="Key insights and optimization recommendations"
              className="mb-8"
            >
              <InsightsSection bestConversionRate={bestSource.conversion_rate * 100} />
            </SectionCard>

            {/* Professional Narrative Sections wrapped in SectionCard */}
            <SectionCard
              title="Project Narrative"
              description="Comprehensive case study following the STAR methodology"
            >
              <NarrativeSections />
            </SectionCard>
          </>
        )}
      </ProjectPageLayout>
    </>
  )
}
