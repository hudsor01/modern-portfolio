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
      <div className="container mx-auto px-4 py-12 lg:py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Location Badge */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <MapPin className="h-5 w-5 text-blue-600" />
            <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
              Serving {region}
            </Badge>
          </div>

          {/* Hero Heading */}
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Revenue Operations Consultant in {city}, {state}
          </h1>
          
          {/* Description */}
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            {description}
          </p>

          {/* Service Areas */}
          <div className="mb-8">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
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
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Phone className="h-4 w-4" />
              Call (555) REVOPS
            </a>
            <a
              href="mailto:contact@richardwhudsonjr.com"
              className="flex items-center gap-2 px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Mail className="h-4 w-4" />
              Get Free Consultation
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2 text-blue-600">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Key Highlights */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Why Choose Richard Hudson for Revenue Operations in {city}?
            </h3>
            <div className="grid md:grid-cols-2 gap-3 text-left">
              {highlights.map((highlight, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">
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