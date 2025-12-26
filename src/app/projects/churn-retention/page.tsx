'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { TrendingDown, Users, Activity, AlertCircle } from 'lucide-react'

import { ProjectPageLayout } from '@/components/projects/project-page-layout'
import { LoadingState } from '@/components/projects/loading-state'
import { ProjectJsonLd } from '@/components/seo/json-ld'
import { TIMING } from '@/lib/constants/spacing'
import { staticChurnData } from '@/app/projects/data/partner-analytics'
import { STARAreaChart } from '@/components/projects/star-area-chart'

import { MetricCard } from './components/MetricCard'
import { NarrativeSection } from './components/NarrativeSection'
import { InsightCard } from './components/InsightCard'
import { ResultMetric } from './components/ResultMetric'
import { STARPhaseCard } from './components/STARPhaseCard'

const ChurnLineChart = dynamic(() => import('./ChurnLineChart'), {
  loading: () => <div className="h-[350px] w-full animate-pulse bg-muted rounded-lg" />,
  ssr: true,
})
const RetentionHeatmap = dynamic(() => import('./RetentionHeatmap'), {
  loading: () => <div className="h-[350px] w-full animate-pulse bg-muted rounded-lg" />,
  ssr: true,
})

const starData = {
  situation: { phase: 'Situation', impact: 27, efficiency: 23, value: 18 },
  task: { phase: 'Task', impact: 53, efficiency: 47, value: 43 },
  action: { phase: 'Action', impact: 81, efficiency: 85, value: 77 },
  result: { phase: 'Result', impact: 97, efficiency: 95, value: 93 },
}

const TECHNOLOGIES = [
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
]

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

  const currentMonth = staticChurnData?.[staticChurnData.length - 1] ?? null
  const previousMonth = staticChurnData?.[staticChurnData.length - 2] ?? null

  const churnDifference =
    currentMonth && previousMonth
      ? (currentMonth.churnRate - previousMonth.churnRate).toFixed(1)
      : '0.0'

  const totalPartners = currentMonth ? currentMonth.retained + currentMonth.churned : 0
  const retentionRate = currentMonth
    ? ((currentMonth.retained / totalPartners) * 100).toFixed(1)
    : '0.0'

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
            label: `Churn Rate: ${currentMonth ? currentMonth.churnRate : 'N/A'}%`,
            color: 'bg-primary/20 text-primary',
          },
          { label: `Retention: ${retentionRate}%`, color: 'bg-secondary/20 text-secondary' },
          { label: 'Prediction: 89%', color: 'bg-primary/20 text-primary' },
          { label: 'Revenue Saved: $830K', color: 'bg-secondary/20 text-secondary' },
        ]}
        onRefresh={handleRefresh}
        refreshButtonDisabled={isLoading}
      >
        {isLoading ? (
          <LoadingState />
        ) : (
          <>
            <KPISection
              currentMonth={currentMonth}
              retentionRate={retentionRate}
              churnDifference={churnDifference}
            />
            <ChartsSection />
            <NarrativeSections />
            <TechnologiesSection technologies={TECHNOLOGIES} />
            <InsightsSection />
            <STARSection starData={starData} />
          </>
        )}
      </ProjectPageLayout>
    </>
  )
}

interface KPISectionProps {
  currentMonth: { churnRate: number; retained: number; churned: number } | null
  retentionRate: string
  churnDifference: string
}

function KPISection({ currentMonth, retentionRate, churnDifference }: KPISectionProps) {
  const isChurnIncreasing = parseFloat(churnDifference) > 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <MetricCard
        icon={TrendingDown}
        iconColorClass="text-destructive"
        iconBgClass="bg-destructive/20"
        gradientColor="red"
        label="Current"
        value={currentMonth ? `${currentMonth.churnRate}%` : 'N/A'}
        sublabel="Churn Rate"
      />
      <MetricCard
        icon={Users}
        iconColorClass="text-success"
        iconBgClass="bg-success/20"
        gradientColor="green"
        label="Current"
        value={`${retentionRate}%`}
        sublabel="Retention Rate"
      />
      <MetricCard
        icon={Activity}
        iconColorClass="text-primary"
        iconBgClass="bg-primary/20"
        gradientColor="blue"
        label="vs Last Month"
        value={`${isChurnIncreasing ? '+' : ''}${churnDifference}%`}
        sublabel="Churn Change"
        valueColorClass={isChurnIncreasing ? 'text-destructive' : 'text-success'}
      />
      <MetricCard
        icon={AlertCircle}
        iconColorClass="text-amber-400"
        iconBgClass="bg-amber-500/20"
        gradientColor="amber"
        label="This Month"
        value={currentMonth ? currentMonth.churned : 'N/A'}
        sublabel="Partners Churned"
      />
    </div>
  )
}

function ChartsSection() {
  return (
    <div className="space-y-8">
      <div className="glass rounded-2xl p-8 hover:bg-white/[0.07] transition-all duration-300">
        <div className="mb-6">
          <h2 className="typography-h3 mb-2">Partner Retention Patterns</h2>
          <p className="typography-muted">Monthly retention rates by partner cohort</p>
        </div>
        <RetentionHeatmap />
      </div>

      <div className="glass rounded-2xl p-8 hover:bg-white/[0.07] transition-all duration-300">
        <div className="mb-6">
          <h2 className="typography-h3 mb-2">Churn Rate Trends</h2>
          <p className="typography-muted">Historical churn rate analysis and projections</p>
        </div>
        <ChurnLineChart />
      </div>
    </div>
  )
}

function NarrativeSections() {
  return (
    <div className="space-y-12 mt-12">
      <NarrativeSection title="Project Overview" titleColorClass="text-primary">
        <p className="text-lg leading-relaxed">
          Developed a predictive churn analysis system to identify at-risk partners and implement
          proactive retention strategies. This analytics solution became critical for maintaining
          partner relationships and optimizing lifetime value across the entire partner ecosystem.
        </p>
        <p className="leading-relaxed">
          The system processes partner engagement patterns, transaction histories, and performance
          metrics to predict churn probability with 89% accuracy, enabling data-driven retention
          interventions.
        </p>
      </NarrativeSection>

      <NarrativeSection title="Challenge" titleColorClass="text-amber-400">
        <p className="leading-relaxed">
          Partner churn was reactive rather than proactive, resulting in significant revenue loss
          and missed retention opportunities:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>No early warning system for partners at risk of churning</li>
          <li>Partners often churned without any engagement attempt from the retention team</li>
          <li>High-value partners were leaving due to unaddressed concerns</li>
          <li>Retention efforts were costly and unfocused, targeting the wrong segments</li>
          <li>No understanding of churn patterns or leading indicators</li>
          <li>Manual tracking was impossible at scale with growing partner base</li>
        </ul>
        <p className="leading-relaxed">
          The reactive approach meant losing partners who could have been retained with timely
          intervention, significantly impacting long-term revenue.
        </p>
      </NarrativeSection>

      <NarrativeSection title="Solution" titleColorClass="text-success">
        <p className="leading-relaxed">
          Built a comprehensive churn prediction and retention analytics platform using machine
          learning algorithms and real-time data analysis:
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
          The solution integrated with CRM systems, partner portals, and communication platforms to
          provide a 360-degree view of partner health and automated intervention triggers.
        </p>
      </NarrativeSection>

      <NarrativeSection title="Results & Impact" titleColorClass="text-emerald-400">
        <p className="leading-relaxed">
          The churn prediction system transformed partner retention from reactive firefighting to
          proactive relationship management:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <ResultMetric color="blue" value="23%" label="Churn Rate Reduction" />
          <ResultMetric color="green" value="89%" label="Prediction Accuracy" />
          <ResultMetric color="purple" value="$830K" label="Revenue Saved from Retention" />
          <ResultMetric color="amber" value="67%" label="Success Rate of Interventions" />
        </div>

        <div className="space-y-3 mt-6">
          <h3 className="font-semibold text-emerald-400">Quantified Business Outcomes:</h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Reduced partner churn rate from 14.2% to 10.9% quarterly</li>
            <li>Increased retention rate for high-value partners to 92%</li>
            <li>Achieved 67% success rate for at-risk partner interventions</li>
            <li>Saved $830K in annual revenue through proactive retention</li>
            <li>Improved partner satisfaction scores by 18% through proactive outreach</li>
            <li>Reduced retention team workload by 34% through targeted interventions</li>
          </ul>
        </div>
      </NarrativeSection>

      <NarrativeSection title="Key Learnings" titleColorClass="text-purple-400">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-purple-400">Customer Success Insights</h3>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Early engagement is 3x more effective than late-stage retention efforts</li>
              <li>
                Partners with declining engagement patterns show churn intent 60-90 days before
                actual churn
              </li>
              <li>Personalized retention approaches significantly outperform generic campaigns</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-primary">Technical Implementation Insights</h3>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Real-time data processing is crucial for actionable churn predictions</li>
              <li>Model accuracy improves significantly with multi-dimensional engagement data</li>
              <li>Automated workflows reduce response time from days to hours</li>
            </ul>
          </div>
        </div>
        <p className="leading-relaxed mt-4">
          This project highlighted that retention is fundamentally about relationship health, not
          just transactional metrics. The most successful interventions addressed underlying
          business challenges rather than just engagement gaps.
        </p>
      </NarrativeSection>
    </div>
  )
}

function TechnologiesSection({ technologies }: { technologies: string[] }) {
  return (
    <div className="bg-gradient-to-br from-gray-500/10 to-slate-500/10 backdrop-blur-xs border border-border/20 rounded-xl p-8 mt-12">
      <h2 className="typography-h3 mb-6 text-muted-foreground">Technologies Used</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {technologies.map((tech, index) => (
          <span
            key={index}
            className="bg-white/10 text-muted-foreground px-3 py-2 rounded-lg text-sm text-center border border-white/20 hover:bg-white/20 transition-colors"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}

function InsightsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
      <InsightCard
        type="insight"
        title="Key Insight"
        description="Partners with less than 3 months tenure show 2x higher churn risk. Focus onboarding efforts here."
      />
      <InsightCard
        type="opportunity"
        title="Opportunity"
        description="Implementing proactive engagement for at-risk segments could reduce churn by up to 15%."
      />
      <InsightCard
        type="action"
        title="Action Required"
        description="Schedule quarterly business reviews with top 20% of partners to maintain retention rates."
      />
    </div>
  )
}

interface STARSectionProps {
  starData: {
    situation: { phase: string; impact: number; efficiency: number; value: number }
    task: { phase: string; impact: number; efficiency: number; value: number }
    action: { phase: string; impact: number; efficiency: number; value: number }
    result: { phase: string; impact: number; efficiency: number; value: number }
  }
}

function STARSection({ starData }: STARSectionProps) {
  return (
    <div className="mt-16 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="typography-h2 border-none pb-0 text-2xl md:text-2xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          STAR Impact Analysis
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Tracking project progression from Situation through Action to measurable Results
        </p>
      </div>

      <div className="glass rounded-2xl p-8">
        <STARAreaChart data={starData} title="Project Progression Metrics" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <STARPhaseCard phase="situation" label="Initial Assessment" />
        <STARPhaseCard phase="task" label="Goal Definition" />
        <STARPhaseCard phase="action" label="Implementation" />
        <STARPhaseCard phase="result" label="Measurable Impact" />
      </div>
    </div>
  )
}
