'use client'

import {
  Zap,
  Shield,
  CheckCircle,
} from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ContactForm } from '@/components/contact/ContactForm'
import { ContactInfo } from '@/components/contact/ContactInfo'
import { SuccessStories } from '@/components/contact/SuccessStories'
import { useContactForm } from '@/hooks/use-contact-form'

// ============================================================================
// Component
// ============================================================================

export default function ContactPageClient() {
  const form = useContactForm()

  return (
    <>
      <Navbar />
      <main id="main-content">
        <section className="min-h-screen bg-background text-foreground pt-20">
          <div className="w-full mx-auto px-6">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-xl sm:text-xl md:text-2xl font-display font-bold mb-6 text-primary">
                Let's Connect
              </h1>
              <p className="typography-lead max-w-3xl mx-auto mb-8">
                Open to new opportunities in Revenue Operations. Whether you're a recruiter, hiring manager, or industry peer, I'd love to hear from you.
              </p>

              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center gap-8 typography-small text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-warning" />
                  <span>24hr Response Time</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-success" />
                  <span>Confidential Discussions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>$4.8M+ Revenue Impact</span>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Contact Form */}
              <ContactForm form={form} />

              {/* Contact Information & Social Proof */}
              <div className="space-y-8">
                <ContactInfo />
                <SuccessStories />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
