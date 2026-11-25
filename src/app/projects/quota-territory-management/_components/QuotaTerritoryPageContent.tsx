'use client'

import { TrendingUp, Map as MapIcon, Database, Zap } from 'lucide-react'

import { ProjectPageLayout } from '@/components/projects/project-page-layout'
import { MetricsGrid } from '@/components/projects/metrics-grid'
import { SectionCard } from '@/components/ui/section-card'
import { formatNumber } from '@/lib/data-formatters'
import { ogImageUrl } from '@/lib/absolute-url'
import { ProjectJsonLd } from '@/components/seo/json-ld/project-json-ld'
import { NarrativeSections } from './NarrativeSections'
import { AlgorithmicApproachesGrid } from './AlgorithmicApproachesGrid'

export default function QuotaTerritoryManagementProject() {
  // Standardized metrics configuration using consistent data formatting
  const metrics = [
    {
      id: 'forecast-accuracy',
      icon: TrendingUp,
      label: 'Forecast Accuracy',
      value: '92%',
      subtitle: 'From 64%',
      variant: 'success' as const,
    },
    {
      id: 'quota-variance',
      icon: Zap,
      label: 'Quota Variance',
      value: '11%',
      subtitle: 'From 32%',
      variant: 'primary' as const,
    },
    {
      id: 'territories-optimized',
      icon: MapIcon,
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
        'Sales rep turnover reduced from 28% to 10%',
        'Reduced turnover-related revenue impact',
      ],
    },
    {
      name: 'Predictive Territory Design',
      description:
        'Machine learning models predicting territory revenue potential and optimal rep placement',
      outcomes: [
        'Forecast accuracy improved from 64% to 92%',
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
        'Planning cycle reduced from 8 weeks to 3 weeks',
        'Better executive visibility into trade-offs',
        'Faster implementation of changes',
      ],
    },
  ]

  return (
    <>
      <ProjectJsonLd
        image={ogImageUrl({
          title: 'Intelligent Quota Management & Territory Planning',
          subtitle: 'Revenue Operations Project',
          project: 'quota-territory-management',
        })}
        title="Intelligent Quota Management & Territory Planning"
        description="Territory management system that raised forecast accuracy from 64% to 92% and reduced quota variance from 32% to 11%"
        slug="quota-territory-management"
        category="Revenue Operations"
        datePublished="2025-11-19T00:00:00-06:00"
        dateModified="2026-04-10T00:00:00-06:00"
        tags={[
          'Quota Management',
          'Territory Planning',
          'Predictive Analytics',
          'Revenue Operations',
        ]}
      />

      <ProjectPageLayout
        title="Intelligent Quota Management & Territory Planning"
        description="Advanced quota setting and territory assignment system using predictive analytics and fairness algorithms. Optimized territory design raised forecast accuracy from 64% to 92% and reduced quota attainment variance from 32% to 11%."
        tags={[
          {
            label: 'Forecast Accuracy: 92% (from 64%)',
            variant: 'primary',
          },
          {
            label: 'Quota Variance: 11% (from 32%)',
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

        {/* Algorithmic Approaches */}
        <SectionCard
          title="Algorithmic Approaches"
          description="Predictive models and optimization algorithms powering territory planning"
          className="mb-8"
        >
          <AlgorithmicApproachesGrid approaches={algorithmicApproaches} />
        </SectionCard>

        {/* Professional Narrative Sections - STAR Method */}
        <SectionCard
          title="Project Narrative"
          description="Comprehensive case study following the STAR methodology"
        >
          <NarrativeSections />
        </SectionCard>
      </ProjectPageLayout>
    </>
  )
}
