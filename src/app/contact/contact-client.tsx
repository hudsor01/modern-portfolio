'use client'

import { Zap, Shield, CheckCircle } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { ContactForm } from '@/components/contact/contact-form'
import { ContactInfo } from '@/components/contact/contact-info'
import { FeaturedProjects, type FeaturedProject } from '@/components/contact/featured-projects'
import { AvailabilityBadge } from '@/components/ui/availability-badge'
import { CONTACT, SERVICE_AREA } from '@/lib/contact-info'
import { REVENUE_IMPACT, REVENUE_IMPACT_LABEL } from '@/lib/stats'
import { useContactForm } from '@/hooks/use-contact-form'
import { DecorativeBlob } from '@/components/ui/decorative-blob'

// ============================================================================
// Component
// ============================================================================

export default function ContactPageClient({
  featuredProjects,
}: {
  featuredProjects: FeaturedProject[]
}) {
  const form = useContactForm()

  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative pt-24 pb-8 lg:pt-32 lg:pb-20 overflow-clip">
          {/* Decorative background elements */}
          <DecorativeBlob position="top-right" />
          <DecorativeBlob position="bottom-left" className="bottom-1/4" />

          <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-12">
              <AvailabilityBadge className="mx-auto mb-6" />
              <h1 className="mb-6">
                Let's <span className="text-primary">Connect</span>
              </h1>
              <p className="max-w-3xl mx-auto mb-4">
                Open to new opportunities in Revenue Operations. Whether you're a recruiter, hiring
                manager, or industry peer, I'd love to hear from you.
              </p>
              <p className="max-w-3xl mx-auto mb-8">
                Based in {CONTACT.location.city}, serving {SERVICE_AREA} — remote engagements
                welcome anywhere in the US.
              </p>

              {/* Quick Stats */}
              <div className="mx-auto flex max-w-xs flex-col items-center gap-3 text-sm text-muted-foreground sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center sm:gap-8">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-secondary" />
                  <span>24hr Response Time</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-secondary" />
                  <span>Confidential Discussions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>
                    <span data-stat="revenue">{REVENUE_IMPACT}</span>{' '}
                    <span data-stat-label="revenue">{REVENUE_IMPACT_LABEL}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="relative py-10 lg:py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
              {/* Contact Form */}
              <div className="min-w-0 h-full">
                <ContactForm form={form} />
              </div>

              {/* Contact Information & Featured Work */}
              <div className="flex min-w-0 flex-col gap-8">
                <ContactInfo />
                <FeaturedProjects className="flex-1" projects={featuredProjects} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
