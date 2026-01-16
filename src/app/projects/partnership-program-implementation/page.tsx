'use client'
export const dynamic = 'force-static'

import { Zap, Clock, Settings, Users } from 'lucide-react'

import { ProjectPageLayout } from '@/components/projects/project-page-layout'
import { MetricsGrid } from '@/components/projects/metrics-grid'
import { SectionCard } from '@/components/ui/section-card'
import { ProjectJsonLd } from '@/components/seo/json-ld/project-json-ld'
import { AchievementsGrid } from './_components/AchievementsGrid'
import { TechnicalDetails } from './_components/TechnicalDetails'
import { NarrativeSections } from './_components/NarrativeSections'

export default function PartnershipProgramPage() {
  // Standardized metrics configuration
  const metrics = [
    {
      id: 'automation-rate',
      icon: Zap,
      label: 'Automation',
      value: '90%+',
      subtitle: 'Process Coverage',
      variant: 'success' as const,
    },
    {
      id: 'launch-time',
      icon: Clock,
      label: 'Launch Time',
      value: '6 mo',
      subtitle: 'Concept to Production',
      variant: 'primary' as const,
    },
    {
      id: 'integrations',
      icon: Settings,
      label: 'Integrations',
      value: 'Full Stack',
      subtitle: 'CRM, Billing, Portals',
      variant: 'secondary' as const,
    },
    {
      id: 'onboarding',
      icon: Users,
      label: 'Onboarding',
      value: 'Automated',
      subtitle: 'Partner Journey',
      variant: 'primary' as const,
    },
  ]

  return (
    <>
      <ProjectJsonLd
        title="Enterprise Partnership Program Implementation"
        description="Led comprehensive design and implementation of a company's first partnership program, creating automated partner onboarding, commission tracking, and performance analytics."
        slug="partnership-program-implementation"
        category="Revenue Operations"
        tags={[
          'Partnership Program',
          'Channel Operations',
          'Partner Onboarding',
          'Commission Automation',
        ]}
      />

      <ProjectPageLayout
        title="Enterprise Partnership Program Implementation"
        description="Led comprehensive design and implementation of a company's first partnership program, creating automated partner onboarding, commission tracking, and performance analytics. Built production-ready integrations with CRM, billing systems, and partner portals."
        tags={[
          { label: 'First Partner Program', variant: 'primary' },
          { label: '90%+ Automation', variant: 'secondary' },
          { label: 'Full Production', variant: 'primary' },
          { label: 'Strategic Success', variant: 'secondary' },
        ]}
      >
        {/* Key Metrics using standardized MetricsGrid */}
        <MetricsGrid metrics={metrics} columns={4} className="mb-8" />

        {/* Key Achievements */}
        <SectionCard
          title="Key Achievements"
          description="Strategic implementation results and business impact"
          className="mb-8"
        >
          <AchievementsGrid />
        </SectionCard>

        {/* Technical Implementation */}
        <SectionCard
          title="Technical Implementation"
          description="Architecture and integration details"
          className="mb-8"
        >
          <TechnicalDetails />
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
