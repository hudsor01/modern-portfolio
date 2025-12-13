'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { MapPin, Phone, Mail } from 'lucide-react'

interface LocationHeroProps {
  city: string
  state: string
  region: string
  description: string
  serviceAreas: string[]
  stats: Array<{
    label: string
    value: string
    icon: React.ReactNode
  }>
  highlights: string[]
}

export function LocationHero({
  city,
  state,
  region,
  description,
  serviceAreas,
  stats,
  highlights
}: LocationHeroProps) {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full mx-auto px-4 py-12 lg:py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Location Badge */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <MapPin className="h-5 w-5 text-primary" />
            <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">
              Serving {region}
            </Badge>
          </div>

          {/* Hero Heading */}
          <h1 className="typography-h1 text-xl lg:text-xl mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Revenue Operations Consultant in {city}, {state}
          </h1>
          
          {/* Description */}
          <p className="typography-lead dark:text-muted-foreground mb-8 leading-relaxed">
            {description}
          </p>

          {/* Service Areas */}
          <div className="mb-8">
            <p className="typography-small text-muted-foreground dark:text-muted-foreground mb-3">
              Service Areas Include:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {serviceAreas.map((area) => (
                <Badge key={area} variant="secondary" className="text-xs">
                  {area}
                </Badge>
              ))}
            </div>
          </div>

          {/* Contact Options */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <a
              href="tel:+1-555-REVOPS"
              className="flex items-center gap-2 px-6 py-3 bg-primary-hover text-foreground rounded-lg hover:bg-primary transition-colors"
            >
              <Phone className="h-4 w-4" />
              Call (555) REVOPS
            </a>
            <a
              href="mailto:contact@richardwhudsonjr.com"
              className="flex items-center gap-2 px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors"
            >
              <Mail className="h-4 w-4" />
              Get Free Consultation
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2 text-primary">
                  {stat.icon}
                </div>
                <div className="typography-h3 text-foreground dark:text-white">
                  {stat.value}
                </div>
                <div className="typography-small text-muted-foreground dark:text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Key Highlights */}
          <div className="bg-white/70 dark:bg-card/70 backdrop-blur rounded-xl p-6 border border-white/20">
            <h3 className="typography-large mb-4 text-foreground dark:text-white">
              Why Choose Richard Hudson for Revenue Operations in {city}?
            </h3>
            <div className="grid md:grid-cols-2 gap-3 text-left">
              {highlights.map((highlight, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary-hover rounded-full mt-2 flex-shrink-0" />
                  <p className="typography-small text-muted-foreground dark:text-muted-foreground">
                    {highlight}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}