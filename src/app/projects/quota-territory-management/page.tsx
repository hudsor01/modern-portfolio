'use client'
export const dynamic = 'force-static'

import { TrendingUp, Map, Database, Zap } from 'lucide-react'

import { ProjectPageLayout } from '@/components/projects/project-page-layout'
import { MetricsGrid } from '@/components/projects/metrics-grid'
import { formatNumber, formatTrend } from '@/lib/utils/data-formatters'
import { ProjectJsonLd } from '@/components/seo/json-ld'
import { NarrativeSections } from './components/NarrativeSections'
import { AlgorithmicApproachesGrid } from './components/AlgorithmicApproachesGrid'

export default function QuotaTerritoryManagementProject() {

  // Standardized metrics configuration using consistent data formatting
  const metrics = [
    {
      id: 'forecast-accuracy',
      icon: TrendingUp,
      label: 'Forecast Accuracy',
      value: formatTrend(0.28, { format: 'percentage', showArrow: false }),
      subtitle: 'Improvement',
      variant: 'success' as const,
    },
    {
      id: 'quota-variance',
      icon: Zap,
      label: 'Quota Variance',
      value: formatTrend(-0.32, { format: 'percentage', showArrow: false }),
      subtitle: 'Reduction',
      variant: 'primary' as const,
    },
    {
      id: 'territories-optimized',
      icon: Map,
      label: 'Territories',
      value: formatNumber(47),
      subtitle: 'Optimized',
      variant: 'secondary' as const,
    },
    {
      id: 'data-points',
      icon: Database,
      label: 'Data Points',
      value: formatNumber(2500000, { compact: true }),
      subtitle: 'Analyzed',
      variant: 'primary' as const,
    },
  ]

  const algorithmicApproaches = [
    {
      name: 'Fairness-First Quota Setting',
      description:
        'Multi-factor model incorporating territory potential, historical performance, experience level, and market conditions',
      outcomes: [
        '18% reduction in sales rep churn',
        'Improved rep satisfaction scores by 24%',
        'Reduced turnover-related revenue impact',
      ],
    },
    {
      name: 'Predictive Territory Design',
      description:
        'Machine learning models predicting territory revenue potential and optimal rep placement',
      outcomes: [
        '28% improvement in forecast accuracy',
        'Better territory-to-rep matching',
        'Optimized sales coverage',
      ],
    },
    {
      name: 'Dynamic Rebalancing',
      description:
        'Quarterly territory optimization based on market changes, rep performance, and revenue trends',
      outcomes: [
        '23% average territory efficiency increase',
        'Continuous improvement over time',
        'Data-driven decision making',
      ],
    },
    {
      name: 'What-If Scenario Planning',
      description:
        'Advanced simulation tools for evaluating different territory assignments and quota structures',
      outcomes: [
        'Reduced planning cycle by 60%',
        'Better executive visibility into trade-offs',
        'Faster implementation of changes',
      ],
    },
  ]

  return (
    <>
      <ProjectJsonLd
        title="Intelligent Quota Management & Territory Planning"
        description="Territory management system that improved forecast accuracy by 28% and reduced quota variance by 32%"
        slug="quota-territory-management"
        category="Revenue Operations"
        tags={[
          'Quota Management',
          'Territory Planning',
          'Predictive Analytics',
          'Revenue Operations',
        ]}
      />

      <ProjectPageLayout
        title="Intelligent Quota Management & Territory Planning"
        description="Advanced quota setting and territory assignment system using predictive analytics and fairness algorithms. Optimized territory design increased forecast accuracy by 28% and reduced quota attainment variance by 32%."
        tags={[
          {
            label: `Forecast Accuracy: ${formatTrend(0.28, { format: 'percentage', showArrow: false })}`,
            variant: 'primary',
          },
          {
            label: `Quota Variance: ${formatTrend(-0.32, { format: 'percentage', showArrow: false })}`,
            variant: 'secondary',
          },
          { label: `${formatNumber(47)} Territories Optimized`, variant: 'primary' },
          {
            label: `${formatNumber(2500000, { compact: true })} Data Points`,
            variant: 'secondary',
          },
        ]}
      >
            {/* Key Metrics using standardized MetricsGrid */}
            <MetricsGrid metrics={metrics} columns={4} className="mb-8" />

            {/* Algorithmic Approaches, Revenue Impact, and Technical Stack */}
            <AlgorithmicApproachesGrid approaches={algorithmicApproaches} />

            {/* Professional Narrative Sections - STAR Method */}
            <NarrativeSections />
      </ProjectPageLayout>
    </>
  )
}
