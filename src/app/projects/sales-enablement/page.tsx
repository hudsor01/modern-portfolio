'use client'

import { TrendingUp, Users, Zap, BookOpen, Check } from 'lucide-react'

import { ProjectPageLayout } from '@/components/projects/project-page-layout'
import { MetricsGrid } from '@/components/projects/metrics-grid'
import { SectionCard } from '@/components/ui/section-card'
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatTrend,
} from '@/lib/utils/data-formatters'
import { ProjectJsonLd } from '@/components/seo/json-ld'
import { NarrativeSections } from './components/NarrativeSections'

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

            {/* Implementation Pillars wrapped in SectionCard */}
            <SectionCard
              title="Implementation Pillars"
              description="Core components of the sales enablement platform"
              className="mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {keyPillars.map((pillar, index) => (
                  <div
                    key={index}
                    className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all"
                  >
                    <h3 className="text-lg font-semibold mb-3">{pillar.title}</h3>
                    <p className="text-muted-foreground mb-4">{pillar.description}</p>
                    <ul className="space-y-2">
                      {pillar.achievements.map((achievement, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Business Impact wrapped in SectionCard */}
            <SectionCard
              title="Business Impact"
              description="Measurable improvements in sales performance and team effectiveness"
              variant="gradient"
              className="mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-secondary mb-2">
                    {formatPercentage(0.34)}
                  </div>
                  <p className="text-muted-foreground">
                    Increase in deal win rates across all sales teams
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {formatPercentage(0.45)}
                  </div>
                  <p className="text-muted-foreground">
                    Reduction in new hire ramp time to full productivity
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-secondary mb-2">
                    {formatPercentage(0.82)}
                  </div>
                  <p className="text-muted-foreground">
                    Adoption rate for coaching materials within 3 months
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {formatCurrency(3200000, { compact: true })}
                  </div>
                  <p className="text-muted-foreground">
                    Additional revenue attributed to improved sales skills
                  </p>
                </div>
              </div>
            </SectionCard>

            {/* Professional Narrative Sections - STAR Method */}
            <NarrativeSections />
      </ProjectPageLayout>
    </>
  )
}
