'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface Service {
  title: string
  description: string
  features: string[]
  benefits: string[]
  cta: {
    text: string
    href: string
  }
}

interface LocationServicesProps {
  city: string
  services: Service[]
}

export function LocationServices({ city, services }: LocationServicesProps) {
  return (
    <section className="py-16 bg-background dark:bg-background">
      <div className="w-full mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="typography-h2 border-none pb-0 text-3xl lg:text-4xl text-foreground dark:text-white">
            Revenue Operations Services in {city}
          </h2>
          <p className="typography-lead max-w-3xl mx-auto">
            Comprehensive RevOps solutions tailored for {city} businesses. From startup scaling to enterprise optimization, 
            we deliver measurable results that drive sustainable growth.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="p-8 bg-white dark:bg-card border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="space-y-6">
                {/* Service Header */}
                <div>
                  <h3 className="typography-h3 text-foreground dark:text-white mb-3">
                    {service.title}
                  </h3>
                  <p className="typography-muted leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Features */}
                <div>
                  <h4 className="typography-large text-foreground dark:text-white mb-3">
                    What's Included:
                  </h4>
                  <div className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                        <span className="typography-small text-muted-foreground">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <h4 className="typography-large text-foreground dark:text-white mb-3">
                    Expected Outcomes:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {service.benefits.map((benefit, benefitIndex) => (
                      <Badge key={benefitIndex} variant="secondary" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-4 border-t border-border dark:border-border">
                  <Link 
                    href={service.cta.href}
                    className="inline-flex items-center gap-2 text-primary hover:text-primary font-medium transition-colors"
                  >
                    {service.cta.text}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Card className="max-w-2xl mx-auto p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-primary/20 dark:border-primary/80">
            <h3 className="typography-h3 text-foreground dark:text-white mb-4">
              Ready to Transform Your Revenue Operations?
            </h3>
            <p className="typography-muted mb-6">
              Get a free consultation and discover how our proven RevOps strategies can accelerate your {city} business growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact"
                className="px-8 py-3 bg-primary-hover text-foreground rounded-lg hover:bg-primary transition-colors font-medium"
              >
                Schedule Free Consultation
              </Link>
              <Link 
                href="/projects"
                className="px-8 py-3 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors font-medium"
              >
                View Case Studies
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}