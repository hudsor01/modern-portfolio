import React from 'react'
import { Metadata } from 'next'
import { generateMetadata } from '@/app/shared-metadata'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, ArrowRight, Phone, Mail } from 'lucide-react'
import Link from 'next/link'
import { BreadcrumbJsonLd } from '@/components/seo/json-ld'

export const metadata: Metadata = generateMetadata(
  'Revenue Operations Consulting Locations | Dallas-Fort Worth Metroplex',
  'Expert Revenue Operations consulting services across Dallas-Fort Worth metroplex. Serving Dallas, Fort Worth, Plano, Frisco, and surrounding areas with on-site and remote RevOps solutions. Local presence, proven results.',
  '/locations',
  {
    keywords: [
      'Revenue Operations Consultant DFW',
      'RevOps Expert Dallas Fort Worth',
      'Sales Automation DFW Metroplex',
      'CRM Consultant North Texas',
      'Partnership Program Developer Texas',
      'Business Intelligence DFW',
      'Marketing Automation Dallas-Fort Worth',
      'Revenue Operations Plano Frisco',
    ],
  }
)

const LOCATIONS = [
  {
    city: 'Dallas',
    state: 'TX',
    slug: 'dallas',
    description: 'Serving Downtown Dallas, Deep Ellum, Uptown, and the greater Dallas metropolitan area with expert Revenue Operations consulting.',
    highlights: [
      'Downtown Dallas business district expertise',
      'Deep Ellum tech corridor specialization',
      'Uptown professional services focus',
      'Strong network in Dallas startup ecosystem',
    ],
    serviceAreas: ['Downtown', 'Deep Ellum', 'Uptown', 'Bishop Arts', 'Design District'],
    clientCount: '25+',
    projectCount: '40+',
  },
  {
    city: 'Fort Worth',
    state: 'TX',
    slug: 'fort-worth',
    description: 'Expert RevOps consulting for Fort Worth\'s diverse business landscape, from traditional industries to modern service companies.',
    highlights: [
      'Manufacturing and industrial expertise',
      'Traditional business modernization',
      'Cultural District professional services',
      'Alliance area logistics specialization',
    ],
    serviceAreas: ['Downtown', 'Cultural District', 'Alliance', 'Sundance Square', 'Near Southside'],
    clientCount: '18+',
    projectCount: '30+',
  },
  {
    city: 'Plano',
    state: 'TX',
    slug: 'plano',
    description: 'Based in Plano with immediate availability for local tech companies, Fortune 500 headquarters, and growing businesses.',
    highlights: [
      'Local Plano Business District presence',
      'Fortune 500 headquarters expertise',
      'Legacy West tech corridor specialization',
      'Healthcare and medical device focus',
    ],
    serviceAreas: ['Legacy West', 'Business District', 'West Plano', 'East Plano', 'Legacy Town Center'],
    clientCount: '35+',
    projectCount: '50+',
    featured: true,
  },
  {
    city: 'Frisco',
    state: 'TX',
    slug: 'frisco',
    description: 'Specialized RevOps for fast-growing Frisco companies, corporate relocations, and sports & entertainment businesses.',
    highlights: [
      'Rapid growth company specialization',
      'Corporate relocation expertise',
      'Sports and entertainment industry focus',
      'The Star District business connections',
    ],
    serviceAreas: ['Downtown Frisco', 'The Star District', 'Frisco Square', 'Preston Center', 'Legacy West Adjacent'],
    clientCount: '22+',
    projectCount: '35+',
  },
]

export default function LocationsPage() {
  return (
    <>
      <BreadcrumbJsonLd 
        items={[
          { name: 'Home', url: 'https://richardwhudsonjr.com' },
          { name: 'Locations', url: 'https://richardwhudsonjr.com/locations' },
        ]}
      />
      
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-12 lg:py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
              <MapPin className="h-5 w-5 text-blue-600" />
              <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
                Dallas-Fort Worth Metroplex
              </Badge>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Revenue Operations Consulting Across DFW
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Expert Revenue Operations consulting services throughout the Dallas-Fort Worth metroplex. 
              Local presence, proven results, and deep understanding of North Texas business dynamics.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <a
                href="tel:+1-555-REVOPS"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Phone className="h-4 w-4" />
                Call (555) REVOPS
              </a>
              <Link
                href="/contact"
                className="flex items-center gap-2 px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Mail className="h-4 w-4" />
                Schedule Consultation
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">$4.8M+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Revenue Generated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">432%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Growth Achieved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">100+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">DFW Clients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">155+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Projects Delivered</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Locations Grid */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Serving the Dallas-Fort Worth Metroplex
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Strategic locations throughout North Texas ensure immediate availability and 
              deep understanding of local business ecosystems.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {LOCATIONS.map((location) => (
              <Card 
                key={location.slug} 
                className={`p-8 bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
                  location.featured ? 'ring-2 ring-blue-200 dark:ring-blue-800 bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-900/20 dark:to-gray-800' : ''
                }`}
              >
                <div className="space-y-6">
                  {/* Location Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {location.city}, {location.state}
                        </h3>
                        {location.featured && (
                          <Badge className="bg-blue-600 text-white">Home Base</Badge>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {location.description}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-6">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{location.clientCount}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Clients</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{location.projectCount}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Projects</div>
                    </div>
                  </div>

                  {/* Service Areas */}
                  <div>
                    <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">
                      Primary Service Areas:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {location.serviceAreas.map((area) => (
                        <Badge key={area} variant="secondary" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Highlights */}
                  <div>
                    <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">
                      Local Expertise:
                    </h4>
                    <div className="space-y-2">
                      {location.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {highlight}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Link 
                      href={`/locations/${location.slug}`}
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      Learn More About {location.city} Services
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Additional Coverage */}
          <div className="text-center mt-12">
            <Card className="max-w-3xl mx-auto p-8 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Extended Coverage Area
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Also serving Richardson, McKinney, Allen, Carrollton, Addison, Irving, Arlington, 
                Grand Prairie, and other DFW metroplex communities.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Richardson', 'McKinney', 'Allen', 'Carrollton', 'Addison', 'Irving', 'Arlington', 'Grand Prairie', 'Flower Mound', 'Lewisville'].map((city) => (
                  <Badge key={city} variant="outline" className="text-xs">
                    {city}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Ready to Transform Your Revenue Operations?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Get a free consultation and discover how our proven RevOps strategies can 
              accelerate your DFW business growth.
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
          </div>
        </div>
      </section>
    </>
  )
}