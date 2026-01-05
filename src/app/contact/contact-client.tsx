'use client'

import { Zap, Shield, CheckCircle } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ContactForm } from '@/components/contact/contact-form'
import { ContactInfo } from '@/components/contact/contact-info'
import { FeaturedProjects } from '@/components/contact/featured-projects'
import { useContactForm } from '@/hooks/use-contact-form'

// ============================================================================
// Component
// ============================================================================

export default function ContactPageClient() {
  const form = useContactForm()

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-20 overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-1/4 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -left-32 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Let's <span className="text-primary">Connect</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
                Open to new opportunities in Revenue Operations. Whether you're a recruiter, hiring
                manager, or industry peer, I'd love to hear from you.
              </p>

              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
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
                  <span>$4.8M+ Revenue Impact</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="relative py-16 lg:py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-stretch">
              {/* Contact Form */}
              <ContactForm form={form} />

              {/* Contact Information & Featured Work */}
              <div className="flex flex-col gap-8">
                <ContactInfo />
                <FeaturedProjects className="flex-1" />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
