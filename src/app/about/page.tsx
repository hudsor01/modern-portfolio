import { generateMetadata } from '@/app/shared-metadata'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import { ProfilePageJsonLd } from '@/components/seo/json-ld/profile-page-json-ld'
import { Navbar } from '@/components/layout/navbar'
import { PersonalInfo } from '@/components/about/personal-info'
import { ExpertiseNarrative } from '@/components/about/expertise-narrative'
import { ExperienceStats } from '@/components/about/experience-stats'
import { CertificationsSection } from '@/components/about/certifications-section'
import { WhatIBring } from '@/components/about/what-i-bring'
import { Button } from '@/components/ui/button'
import { ArrowRight, Mail } from 'lucide-react'
import Link from 'next/link'
import { CONTACT } from '@/lib/contact-info'
import type { Metadata } from 'next'
import { canonicalUrl, SITE_ORIGIN } from '@/lib/absolute-url'
import { PROJECT_COUNT } from '@/data/projects'
import { STAT_LABELS, STAT_VALUES, type StatKey } from '@/lib/stats'

const EXPERIENCE_STATS: { statKey: StatKey; label: string; value: string; icon: string }[] = [
  { statKey: 'revenue', icon: 'dollar-sign' },
  { statKey: 'transaction-growth', icon: 'bar-chart' },
  { statKey: 'network-growth', icon: 'rocket' },
  { statKey: 'years', icon: 'clock' },
].map(({ statKey, icon }) => ({
  statKey: statKey as StatKey,
  label: STAT_LABELS[statKey as StatKey],
  value: STAT_VALUES[statKey as StatKey],
  icon,
}))

const CERTIFICATIONS = [
  {
    name: 'Salesloft Admin Certification Level 1',
    issuer: 'Salesloft',
    badge: '/images/certifications/salesloft-admin-badge-1.png',
    description:
      'Foundational administration and configuration of Salesloft sales engagement platform',
    skills: ['Platform Setup', 'User Management', 'Basic Cadences', 'Email Templates'],
  },
  {
    name: 'Salesloft Admin Certification Level 2',
    issuer: 'Salesloft',
    badge: '/images/certifications/salesloft-admin-badge-2.png',
    description:
      'Advanced administration including complex automation, integrations, and advanced analytics',
    skills: ['Advanced Automation', 'CRM Integrations', 'Advanced Analytics', 'Complex Workflows'],
  },
  {
    name: 'HubSpot Revenue Operations Certification',
    issuer: 'HubSpot Academy',
    badge: '/images/certifications/hubspot-revops-badge.png',
    description:
      'Comprehensive revenue operations strategy, process optimization, and performance analysis',
    skills: [
      'Revenue Operations',
      'Sales Process Optimization',
      'Marketing Alignment',
      'Analytics & Forecasting',
    ],
  },
]

const PERSONAL_INFO = {
  name: 'Richard Hudson',
  title: 'Revenue Operations Professional',
  location: `${CONTACT.location.display} • Dallas-Fort Worth Metroplex • Remote & On-Site`,
  email: CONTACT.email,
  bio: `Started my career untangling spreadsheet chaos at a 50-person startup. Built my first automated pipeline with zero engineering support—just Excel, determination, and 3 YouTube tutorials.

Today, I architect revenue operations systems that transform data overwhelm into competitive advantage. Ten years working the messy middle—where sales meets marketing meets customer success—turning manual reporting nightmares into automated workflows that scale.

Salesloft Admin certified (Level 1 & 2), HubSpot Revenue Operations certified, and obsessed with making complex systems feel simple.`,
}

export const dynamic = 'force-static'
export const metadata: Metadata = generateMetadata(
  'About: Revenue Operations Professional',
  // ~155 characters: Google truncates snippets beyond that, so the old 424-character
  // description lost everything after the first sentence.
  `Revenue operations professional in Dallas-Fort Worth with ${STAT_VALUES.years} years of experience. Salesloft and HubSpot certified; ${STAT_VALUES.revenue} revenue impact across ${PROJECT_COUNT} projects.`,
  '/about'
)

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* No FAQPage markup here. Google's structured-data policy requires every
          marked-up Q&A to be visible on the page; the four that used to be
          emitted never were, and one restated headline metrics. */}
      <ProfilePageJsonLd />
      <BreadcrumbListJsonLd
        items={[
          { name: 'Home', url: SITE_ORIGIN },
          { name: 'About', url: canonicalUrl('/about') },
        ]}
      />
      <Navbar />

      <main id="main-content" tabIndex={-1}>
        {/* 1. Hero - Personal Information */}
        <section aria-label="Introduction" className="pt-24 pb-16 lg:pt-32 lg:pb-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <PersonalInfo personalInfo={PERSONAL_INFO} />
          </div>
        </section>

        {/* 2. What I Bring */}
        <section aria-label="Working principles" className="py-16 lg:py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <WhatIBring />
          </div>
        </section>

        {/* 3. Impact & Experience Stats */}
        <section aria-label="Impact metrics" className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <ExperienceStats stats={EXPERIENCE_STATS} />
          </div>
        </section>

        {/* 4. Expertise + Certifications — paired: how the work happens, then what proves it */}
        <section aria-label="Expertise and certifications" className="py-16 lg:py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-20 lg:space-y-24">
            <ExpertiseNarrative />
            <div className="border-t border-border pt-16 lg:pt-20">
              <CertificationsSection certifications={CERTIFICATIONS} />
            </div>
          </div>
        </section>

        {/* 5. Final CTA */}
        <section aria-label="Contact" className="py-20 lg:py-28">
          <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="mb-6">Let's talk about your goals</h2>
            <p className="mb-10">
              Ready to turn revenue operations into a competitive advantage? See the work, or get in
              touch directly.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="h-12 px-8 text-base font-semibold">
                <Link data-track="CTA Click" data-track-location="about-cta" href="/projects">
                  View Case Studies
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 px-8 text-base font-semibold"
              >
                <Link data-track="CTA Click" data-track-location="about-cta" href="/contact">
                  <Mail className="mr-2 h-5 w-5" />
                  Get in Touch
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
