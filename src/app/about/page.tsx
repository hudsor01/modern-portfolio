import { generateMetadata } from '@/app/shared-metadata'
import { FAQPageJsonLd } from '@/components/seo/json-ld/faq-json-ld'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import { Navbar } from '@/components/layout/navbar'
import { PersonalInfo } from '@/components/about/personal-info'
import { ExpertiseNarrative } from '@/components/about/expertise-narrative'
import { ExperienceStats } from '@/components/about/experience-stats'
import { CertificationsSection } from '@/components/about/certifications-section'
import { WhatIBring } from '@/components/about/what-i-bring'
import { StickyCTA } from '@/components/about/sticky-cta'
import { Button } from '@/components/ui/button'
import { ArrowRight, Mail } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

const EXPERIENCE_STATS = [
  { label: 'Projects Delivered', value: '10+', icon: 'check-circle' },
  { label: 'Revenue Generated', value: '$4.8M+', icon: 'dollar-sign' },
  { label: 'Transaction Growth', value: '432%', icon: 'bar-chart' },
  { label: 'Network Expansion', value: '2,217%', icon: 'rocket' },
]

const CERTIFICATIONS = [
  {
    name: 'SalesLoft Admin Certification Level 1',
    issuer: 'SalesLoft',
    badge: '/images/certifications/salesloft-admin-badge-1.png',
    description:
      'Foundational administration and configuration of SalesLoft sales engagement platform',
    skills: ['Platform Setup', 'User Management', 'Basic Cadences', 'Email Templates'],
  },
  {
    name: 'SalesLoft Admin Certification Level 2',
    issuer: 'SalesLoft',
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
  location: 'Dallas, TX • Dallas-Fort Worth Metroplex • Remote & On-Site',
  email: 'contact@richardwhudsonjr.com',
  bio: `Started my career untangling spreadsheet chaos at a 50-person startup. Built my first automated pipeline with zero engineering support—just Excel, determination, and 3 YouTube tutorials. That pipeline now processes $4.8M+ annually.

Today, I architect revenue operations systems that transform data overwhelm into competitive advantage. Ten years working the messy middle—where sales meets marketing meets customer success—turning manual reporting nightmares into automated workflows that scale.

SalesLoft Admin certified (Level 1 & 2), HubSpot Revenue Operations certified, and obsessed with making complex systems feel simple.`,
}

export const dynamic = 'force-static'
export const metadata: Metadata = generateMetadata(
  'About Richard Hudson | Revenue Operations Professional | Dallas-Fort Worth',
  'Richard Hudson - Dallas, Texas Revenue Operations Professional serving Dallas-Fort Worth metroplex with 10+ years experience. SalesLoft Admin certified (Level 1 & 2) and HubSpot Revenue Operations certified. Partnership program implementation specialist with system integration experience. Expert in data analytics, process automation, and CRM optimization. $4.8M+ revenue generated across 10+ projects, 432% transaction growth achieved.',
  '/about'
)

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <FAQPageJsonLd
        faqs={[
          {
            question: 'What does a Revenue Operations Specialist do?',
            answer:
              'A Revenue Operations Specialist aligns sales, marketing, and customer success teams through data-driven process optimization, CRM administration, and analytics to maximize revenue growth and operational efficiency.',
          },
          {
            question: 'What certifications does Richard Hudson hold?',
            answer:
              'Richard holds SalesLoft Admin Certification (Level 1 and Level 2) and HubSpot Revenue Operations Certification, demonstrating expertise in sales engagement platforms and revenue operations methodology.',
          },
          {
            question: 'What results has Richard Hudson achieved in Revenue Operations?',
            answer:
              'Richard has generated over $4.8M in revenue, achieved 432% transaction growth, and delivered 2,217% network expansion across partnership programs and revenue operations initiatives.',
          },
          {
            question: 'Where is Richard Hudson located?',
            answer:
              'Richard is based in Dallas, Texas, serving the Dallas-Fort Worth metroplex area.',
          },
        ]}
      />
      <BreadcrumbListJsonLd
        items={[
          { name: 'Home', url: 'https://richardwhudsonjr.com' },
          { name: 'About', url: 'https://richardwhudsonjr.com/about' },
        ]}
      />
      <Navbar />

      <main className="relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-1/4 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -left-32 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />

        {/* 1. Hero - Personal Information Section */}
        <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <PersonalInfo personalInfo={PERSONAL_INFO} />
          </div>
        </section>

        {/* 2. What I Bring */}
        <section className="relative py-16 lg:py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <WhatIBring />
          </div>
        </section>

        {/* 3. Impact & Experience Stats */}
        <section className="relative py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <ExperienceStats stats={EXPERIENCE_STATS} />
          </div>
        </section>

        {/* 4. Expertise Narrative + Certifications */}
        <section className="relative py-16 lg:py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <ExpertiseNarrative />
          </div>
        </section>
        <section className="relative py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <CertificationsSection certifications={CERTIFICATIONS} />
          </div>
        </section>

        {/* 5. Final CTA */}
        <section className="relative py-20 lg:py-28 bg-muted/30">
          <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="font-display text-3xl lg:text-5xl font-bold text-foreground mb-6">
              Let's talk about your goals
            </h2>
            <p className="text-xl text-muted-foreground mb-10">
              Ready to turn revenue operations into a competitive advantage? See the work, or get in
              touch directly.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="h-12 px-8 text-base font-semibold">
                <Link href="/projects">
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
                <Link href="/contact">
                  <Mail className="mr-2 h-5 w-5" />
                  Get in Touch
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Sticky Mobile CTA */}
      <StickyCTA />
    </div>
  )
}
