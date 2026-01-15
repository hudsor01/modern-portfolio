'use client'
export const dynamic = 'force-static'

import { TrendingUp, Users, Zap, BookOpen } from 'lucide-react'

import { ProjectPageLayout } from '@/components/projects/project-page-layout'
import { MetricsGrid } from '@/components/projects/metrics-grid'
import { formatNumber, formatTrend } from '@/lib/data-formatters'
import { ProjectJsonLd } from '@/components/seo/json-ld/project-json-ld'
import { NarrativeSections } from './_components/NarrativeSections'
import { PillarsGrid } from './_components/PillarsGrid'

export default function SalesEnablementProject() {

  // Standardized metrics configuration using consistent data formatting
  const metrics = [
    {
      id: 'win-rate-increase',
      icon: TrendingUp,
      label: 'Win Rate',
      value: formatTrend(0.34, { format: 'percentage', showArrow: false }),
      subtitle: 'Increase',
      variant: 'success' as const,
    },
    {
      id: 'ramp-time-reduction',
      icon: Zap,
      label: 'Ramp Time',
      value: formatTrend(-0.45, { format: 'percentage', showArrow: false }),
      subtitle: 'Reduction',
      variant: 'primary' as const,
    },
    {
      id: 'sales-team-size',
      icon: Users,
      label: 'Sales Team',
      value: formatNumber(125),
      subtitle: 'Team Members',
      variant: 'secondary' as const,
    },
    {
      id: 'content-pieces',
      icon: BookOpen,
      label: 'Content',
      value: formatNumber(450, { suffix: '+' }),
      subtitle: 'Pieces Created',
      variant: 'primary' as const,
    },
  ]

  const keyPillars = [
    {
      title: 'Skills Assessment & Development',
      description:
        'Comprehensive assessment of sales skills across all stages and industries, with personalized development plans',
      achievements: [
        '45% faster ramp time for new hires',
        'Identified 8 core competencies requiring focus',
        'Created role-specific development tracks',
      ],
    },
    {
      title: 'Content & Playbook Development',
      description:
        '450+ pieces of multi-format content including videos, case studies, battle cards, and industry-specific playbooks',
      achievements: [
        '82% adoption rate within 3 months',
        'Real-time coaching library integrated with CRM',
        'Updated quarterly based on market feedback',
      ],
    },
    {
      title: 'Manager Coaching & Enablement',
      description:
        'Equipped sales managers with coaching frameworks and tools to drive team performance and development',
      achievements: [
        '28% reduction in sales turnover',
        '3.2M additional revenue from improved coaching',
        'Manager satisfaction score: 4.7/5',
      ],
    },
    {
      title: 'Peer Learning Community',
      description:
        'Created communities where sales professionals share wins, learn from peers, and celebrate successes',
      achievements: [
        '5,000+ peer interactions monthly',
        'Top performers recognized and featured',
        'Knowledge retention improved by 40%',
      ],
    },
  ]

  return (
    <>
      <ProjectJsonLd
        title="Sales Enablement & Coaching Platform"
        description="Sales enablement platform that improved win rates by 34% and reduced ramp time by 45%"
        slug="sales-enablement"
        category="Sales Operations"
        tags={['Sales Enablement', 'Training', 'Coaching', 'Sales Operations']}
      />

      <ProjectPageLayout
        title="Sales Enablement & Coaching Platform"
        description="Transformed sales team performance through structured training, real-time coaching, and continuous skill development. Increased win rates by 34% and reduced ramp time by 45%."
        tags={[
          {
            label: `Win Rate: ${formatTrend(0.34, { format: 'percentage', showArrow: false })}`,
            variant: 'primary',
          },
          {
            label: `Ramp Time: ${formatTrend(-0.45, { format: 'percentage', showArrow: false })}`,
            variant: 'secondary',
          },
          { label: `${formatNumber(125)} Sales Team Members`, variant: 'primary' },
          { label: `${formatNumber(450)}+ Content Pieces`, variant: 'secondary' },
        ]}
      >
            {/* Key Metrics using standardized MetricsGrid */}
            <MetricsGrid metrics={metrics} columns={4} className="mb-8" />

            {/* Implementation Pillars and Business Impact */}
            <PillarsGrid pillars={keyPillars} />

            {/* Professional Narrative Sections - STAR Method */}
            <NarrativeSections />
      </ProjectPageLayout>
    </>
  )
}
