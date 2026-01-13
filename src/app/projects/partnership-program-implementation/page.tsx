'use client'
export const dynamic = 'force-static'

import { ProjectPageLayout } from '@/components/projects/project-page-layout'
import { ProjectJsonLd } from '@/components/seo/json-ld'
import { AchievementsGrid } from './_components/AchievementsGrid'
import { TechnicalDetails } from './_components/TechnicalDetails'
import { NarrativeSections } from './_components/NarrativeSections'

export default function PartnershipProgramPage() {

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
        {/* Key Achievements */}
        <AchievementsGrid />

        {/* Technical Implementation */}
        <TechnicalDetails />

        {/* Professional Narrative Sections - STAR Method */}
        <NarrativeSections />
      </ProjectPageLayout>
    </>
  )
}
