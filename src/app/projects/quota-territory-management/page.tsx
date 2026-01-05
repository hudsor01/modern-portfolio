'use client'

import { TrendingUp, Map, Database, Zap, Code } from 'lucide-react'

import { ProjectPageLayout } from '@/components/projects/project-page-layout'
import { LoadingState } from '@/components/projects/loading-state'
import { MetricsGrid } from '@/components/projects/metrics-grid'
import { SectionCard } from '@/components/ui/section-card'
import { useLoadingState } from '@/hooks/use-loading-state'
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatTrend,
} from '@/lib/utils/data-formatters'
import { ProjectJsonLd } from '@/components/seo/json-ld'

export default function QuotaTerritoryManagementProject() {
  const { isLoading, handleRefresh } = useLoadingState()

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
        onRefresh={handleRefresh}
        refreshButtonDisabled={isLoading}
      >
        {isLoading ? (
          <LoadingState />
        ) : (
          <>
            {/* Key Metrics using standardized MetricsGrid */}
            <MetricsGrid metrics={metrics} columns={4} loading={isLoading} className="mb-8" />

            {/* Algorithmic Approaches wrapped in SectionCard */}
            <SectionCard
              title="Algorithmic Approaches"
              description="Advanced algorithms and methodologies for quota and territory optimization"
              className="mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {algorithmicApproaches.map((approach, index) => (
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
                          <span className="text-secondary mt-1">✓</span>
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Revenue Impact wrapped in SectionCard */}
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
                  <div className="text-3xl font-bold text-primary mb-2">
                    {formatPercentage(0.28)}
                  </div>
                  <p className="text-muted-foreground">Improvement in forecast accuracy</p>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-secondary mb-2">
                    {formatPercentage(0.32)}
                  </div>
                  <p className="text-muted-foreground">Reduction in quota attainment variance</p>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {formatPercentage(0.23)}
                  </div>
                  <p className="text-muted-foreground">Average territory efficiency increase</p>
                </div>
              </div>
            </SectionCard>

            {/* Technical Implementation wrapped in SectionCard */}
            <SectionCard
              title="Technical Stack & Methodologies"
              description="Machine learning models and data analytics approaches"
              className="mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Machine Learning Models</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Regression models for revenue prediction</li>
                    <li>• Classification for territory potential</li>
                    <li>• Clustering for geographic optimization</li>
                    <li>• Time series forecasting</li>
                  </ul>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Data & Analytics</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• {formatNumber(2500000, { compact: true })} data points analyzed</li>
                    <li>• Multi-dimensional territory analysis</li>
                    <li>• Real-time performance tracking</li>
                    <li>• Historical trend analysis</li>
                  </ul>
                </div>
              </div>
            </SectionCard>

            {/* Technologies wrapped in SectionCard */}
            <SectionCard
              title="Technologies & Tools"
              description="Technology stack and tools used for implementation"
            >
              <div className="flex flex-wrap gap-3">
                {[
                  'Python',
                  'Machine Learning',
                  'Predictive Analytics',
                  'D3.js',
                  'Recharts',
                  'PostgreSQL',
                  'Next.js',
                  'Geospatial Analysis',
                ].map((tech) => (
                  <span
                    key={tech}
                    className="bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm text-primary hover:bg-primary/20 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </SectionCard>
          </>
        )}
      </ProjectPageLayout>
    </>
  )
}
