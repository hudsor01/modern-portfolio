import React from 'react'
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
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Revenue Operations Services in {city}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Comprehensive RevOps solutions tailored for {city} businesses. From startup scaling to enterprise optimization, 
            we deliver measurable results that drive sustainable growth.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="p-8 bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="space-y-6">
                {/* Service Header */}
                <div>
                  <h3 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Features */}
                <div>
                  <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">
                    What's Included:
                  </h4>
                  <div className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">
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
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Link 
                    href={service.cta.href}
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
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
          <Card className="max-w-2xl mx-auto p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Ready to Transform Your Revenue Operations?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Get a free consultation and discover how our proven RevOps strategies can accelerate your {city} business growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Schedule Free Consultation
              </Link>
              <Link 
                href="/projects"
                className="px-8 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
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