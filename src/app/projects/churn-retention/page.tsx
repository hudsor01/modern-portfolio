'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { TrendingDown, Users, Activity, AlertCircle } from 'lucide-react'

import { ProjectPageLayout } from '@/components/projects/project-page-layout'
import { MetricsGrid } from '@/components/projects/metrics-grid'
import { SectionCard } from '@/components/ui/section-card'
import { ChartContainer } from '@/components/ui/chart-container'
import { ProjectJsonLd } from '@/components/seo/json-ld'
import { TIMING } from '@/lib/constants/spacing'
import { formatPercentage, formatNumber, formatCurrency } from '@/lib/utils/data-formatters'

// Lazy-load chart components with Suspense fallback
const ChurnLineChart = dynamic(() => import('./ChurnLineChart'), {
  loading: () => <div className="h-[350px] w-full animate-pulse bg-muted rounded-lg" />,
  ssr: true,
})
const RetentionHeatmap = dynamic(() => import('./RetentionHeatmap'), {
  loading: () => <div className="h-[350px] w-full animate-pulse bg-muted rounded-lg" />,
  ssr: true,
})

// Import static churn data
import { staticChurnData } from '@/app/projects/data/partner-analytics'
import { STARAreaChart } from '@/components/projects/star-area-chart'

const starData = {
  situation: { phase: 'Situation', impact: 27, efficiency: 23, value: 18 },
  task: { phase: 'Task', impact: 53, efficiency: 47, value: 43 },
  action: { phase: 'Action', impact: 81, efficiency: 85, value: 77 },
  result: { phase: 'Result', impact: 97, efficiency: 95, value: 93 },
}

export default function ChurnAnalysis() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), TIMING.LOADING_STATE_RESET)
    return () => clearTimeout(timer)
  }, [])

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), TIMING.LOADING_STATE_RESET)
  }

  // Ensure data exists before accessing indices
  const currentMonth = staticChurnData?.[staticChurnData.length - 1] ?? null
  const previousMonth = staticChurnData?.[staticChurnData.length - 2] ?? null

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
        onRefresh={handleRefresh}
        refreshButtonDisabled={isLoading}
      >
        {isLoading ? (
          <MetricsGrid metrics={metricsData} columns={4} loading={true} className="mb-12" />
        ) : (
          <>
            {/* Standardized Metrics Grid */}
            <MetricsGrid metrics={metricsData} columns={4} className="mb-12" />

            {/* Charts Section */}
            <div className="space-y-8">
              {/* Retention Heatmap */}
              <ChartContainer
                title="Partner Retention Patterns"
                description="Monthly retention rates by partner cohort"
                height={350}
                loading={isLoading}
              >
                <RetentionHeatmap />
              </ChartContainer>

              {/* Churn Trends */}
              <ChartContainer
                title="Churn Rate Trends"
                description="Historical churn rate analysis and projections"
                height={350}
                loading={isLoading}
              >
                <ChurnLineChart />
              </ChartContainer>
            </div>

            {/* Professional Narrative Sections */}
            <div className="space-y-8 mt-12">
              {/* Project Overview */}
              <SectionCard title="Project Overview" variant="glass" padding="lg">
                <div className="space-y-4 text-muted-foreground">
                  <p className="text-lg leading-relaxed">
                    Developed a predictive churn analysis system to identify at-risk partners and
                    implement proactive retention strategies. This analytics solution became
                    critical for maintaining partner relationships and optimizing lifetime value
                    across the entire partner ecosystem.
                  </p>
                  <p className="leading-relaxed">
                    The system processes partner engagement patterns, transaction histories, and
                    performance metrics to predict churn probability with 89% accuracy, enabling
                    data-driven retention interventions.
                  </p>
                </div>
              </SectionCard>

              {/* Challenge */}
              <SectionCard title="Challenge" variant="glass" padding="lg">
                <div className="space-y-4 text-muted-foreground">
                  <p className="leading-relaxed">
                    Partner churn was reactive rather than proactive, resulting in significant
                    revenue loss and missed retention opportunities:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>No early warning system for partners at risk of churning</li>
                    <li>
                      Partners often churned without any engagement attempt from the retention team
                    </li>
                    <li>High-value partners were leaving due to unaddressed concerns</li>
                    <li>
                      Retention efforts were costly and unfocused, targeting the wrong segments
                    </li>
                    <li>No understanding of churn patterns or leading indicators</li>
                    <li>Manual tracking was impossible at scale with growing partner base</li>
                  </ul>
                  <p className="leading-relaxed">
                    The reactive approach meant losing partners who could have been retained with
                    timely intervention, significantly impacting long-term revenue.
                  </p>
                </div>
              </SectionCard>

              {/* Solution */}
              <SectionCard title="Solution" variant="glass" padding="lg">
                <div className="space-y-4 text-muted-foreground">
                  <p className="leading-relaxed">
                    Built a comprehensive churn prediction and retention analytics platform using
                    machine learning algorithms and real-time data analysis:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h3 className="font-semibold text-primary mb-3">Predictive Analytics</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Machine learning models for churn probability scoring</li>
                        <li>Real-time partner engagement tracking</li>
                        <li>Behavioral pattern analysis and anomaly detection</li>
                        <li>Cohort analysis for retention rate optimization</li>
                        <li>Predictive lifecycle modeling</li>
                      </ul>
                    </div>
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h3 className="font-semibold text-success mb-3">Retention Operations</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Automated alert system for at-risk partners</li>
                        <li>Segmented retention campaign workflows</li>
                        <li>Partner health score monitoring</li>
                        <li>Success team task prioritization</li>
                        <li>ROI tracking for retention initiatives</li>
                      </ul>
                    </div>
                  </div>

                  <p className="leading-relaxed mt-4">
                    The solution integrated with CRM systems, partner portals, and communication
                    platforms to provide a 360-degree view of partner health and automated
                    intervention triggers.
                  </p>
                </div>
              </SectionCard>

              {/* Results & Impact */}
              <SectionCard title="Results & Impact" variant="glass" padding="lg">
                <div className="space-y-6 text-muted-foreground">
                  <p className="leading-relaxed">
                    The churn prediction system transformed partner retention from reactive
                    firefighting to proactive relationship management:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-xs border border-primary/20 rounded-xl p-6 text-center">
                      <div className="text-2xl font-semibold text-primary mb-2">23%</div>
                      <div className="text-sm text-muted-foreground">Churn Rate Reduction</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xs border border-success/20 rounded-xl p-6 text-center">
                      <div className="text-2xl font-semibold text-success mb-2">89%</div>
                      <div className="text-sm text-muted-foreground">Prediction Accuracy</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xs border border-purple-500/20 rounded-xl p-6 text-center">
                      <div className="text-2xl font-semibold text-purple-400 mb-2">
                        {formatCurrency(830000, { compact: true })}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Revenue Saved from Retention
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-xs border border-amber-500/20 rounded-xl p-6 text-center">
                      <div className="text-2xl font-semibold text-amber-400 mb-2">67%</div>
                      <div className="text-sm text-muted-foreground">
                        Success Rate of Interventions
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-emerald-400">
                      Quantified Business Outcomes:
                    </h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Reduced partner churn rate from 14.2% to 10.9% quarterly</li>
                      <li>Increased retention rate for high-value partners to 92%</li>
                      <li>Achieved 67% success rate for at-risk partner interventions</li>
                      <li>
                        Saved {formatCurrency(830000, { compact: true })} in annual revenue through
                        proactive retention
                      </li>
                      <li>
                        Improved partner satisfaction scores by 18% through proactive outreach
                      </li>
                      <li>Reduced retention team workload by 34% through targeted interventions</li>
                    </ul>
                  </div>
                </div>
              </SectionCard>

              {/* Key Learnings */}
              <SectionCard title="Key Learnings" variant="glass" padding="lg">
                <div className="space-y-4 text-muted-foreground">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h3 className="font-semibold text-purple-400">Customer Success Insights</h3>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>
                          Early engagement is 3x more effective than late-stage retention efforts
                        </li>
                        <li>
                          Partners with declining engagement patterns show churn intent 60-90 days
                          before actual churn
                        </li>
                        <li>
                          Personalized retention approaches significantly outperform generic
                          campaigns
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-semibold text-primary">
                        Technical Implementation Insights
                      </h3>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>
                          Real-time data processing is crucial for actionable churn predictions
                        </li>
                        <li>
                          Model accuracy improves significantly with multi-dimensional engagement
                          data
                        </li>
                        <li>Automated workflows reduce response time from days to hours</li>
                      </ul>
                    </div>
                  </div>
                  <p className="leading-relaxed mt-4">
                    This project highlighted that retention is fundamentally about relationship
                    health, not just transactional metrics. The most successful interventions
                    addressed underlying business challenges rather than just engagement gaps.
                  </p>
                </div>
              </SectionCard>

              {/* Technologies Used */}
              <SectionCard title="Technologies Used" variant="default" padding="lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    'React 19',
                    'TypeScript',
                    'Recharts',
                    'Machine Learning',
                    'Predictive Analytics',
                    'Data Modeling',
                    'Real-time Processing',
                    'CRM Integration',
                    'Behavioral Analytics',
                    'Cohort Analysis',
                    'Automation Workflows',
                    'Customer Success',
                  ].map((tech, index) => (
                    <span
                      key={index}
                      className="bg-white/10 text-muted-foreground px-3 py-2 rounded-lg text-sm text-center border border-white/20 hover:bg-white/20 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </SectionCard>

              {/* Insights Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SectionCard
                  title="Key Insight"
                  variant="glass"
                  padding="md"
                  className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-primary/20"
                >
                  <p className="text-muted-foreground text-sm">
                    Partners with less than 3 months tenure show 2x higher churn risk. Focus
                    onboarding efforts here.
                  </p>
                </SectionCard>
                <SectionCard
                  title="Opportunity"
                  variant="glass"
                  padding="md"
                  className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-success/20"
                >
                  <p className="text-muted-foreground text-sm">
                    Implementing proactive engagement for at-risk segments could reduce churn by up
                    to 15%.
                  </p>
                </SectionCard>
                <SectionCard
                  title="Action Required"
                  variant="glass"
                  padding="md"
                  className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20"
                >
                  <p className="text-muted-foreground text-sm">
                    Schedule quarterly business reviews with top 20% of partners to maintain
                    retention rates.
                  </p>
                </SectionCard>
              </div>

              {/* STAR Impact Analysis */}
              <SectionCard
                title="STAR Impact Analysis"
                description="Tracking project progression from Situation through Action to measurable Results"
                variant="glass"
                padding="lg"
                className="mt-16"
              >
                <div className="space-y-8">
                  <ChartContainer
                    title="Project Progression Metrics"
                    height={300}
                    loading={isLoading}
                  >
                    <STARAreaChart data={starData} title="Project Progression Metrics" />
                  </ChartContainer>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-6 glass rounded-2xl">
                      <div className="text-sm text-primary/70 mb-2">Situation</div>
                      <div className="text-lg font-medium text-white">Initial Assessment</div>
                    </div>
                    <div className="text-center p-6 glass rounded-2xl">
                      <div className="text-sm text-green-400/70 mb-2">Task</div>
                      <div className="text-lg font-medium text-white">Goal Definition</div>
                    </div>
                    <div className="text-center p-6 glass rounded-2xl">
                      <div className="text-sm text-amber-400/70 mb-2">Action</div>
                      <div className="text-lg font-medium text-white">Implementation</div>
                    </div>
                    <div className="text-center p-6 glass rounded-2xl">
                      <div className="text-sm text-cyan-400/70 mb-2">Result</div>
                      <div className="text-lg font-medium text-white">Measurable Impact</div>
                    </div>
                  </div>
                </div>
              </SectionCard>
            </div>
          </>
        )}
      </ProjectPageLayout>
    </>
  )
}
