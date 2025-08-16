import React from 'react'
import { Metadata } from 'next'
import { generateMetadata } from '@/app/shared-metadata'
import { LocationHero } from '@/components/locations/location-hero'
import { LocationServices } from '@/components/locations/location-services'
import { BreadcrumbJsonLd, FAQJsonLd } from '@/components/seo/json-ld'
import { TrendingUp, Users, Target, DollarSign, Building } from 'lucide-react'

export const metadata: Metadata = generateMetadata(
  'Sales Automation Specialist Frisco, TX | Revenue Operations Consultant',
  'Expert Sales Automation Specialist serving Frisco, Texas businesses. Specializing in revenue operations, CRM optimization, and partnership program development for growing Frisco companies. SalesLoft & HubSpot certified. Fast-growing business expert.',
  '/locations/frisco',
  {
    keywords: [
      'Sales Automation Specialist Frisco',
      'Revenue Operations Consultant Frisco Texas',
      'CRM Consultant Frisco',
      'Partnership Program Developer Frisco',
      'Business Intelligence Frisco',
      'Marketing Automation Frisco',
      'Sales Process Optimization Frisco',
      'RevOps Expert Frisco',
      'HubSpot Consultant Frisco',
      'SalesLoft Consultant Frisco',
      'Frisco Business Consultant',
    ],
  }
)

const FRISCO_STATS = [
  { label: 'Revenue Generated', value: '$4.8M+', icon: <DollarSign className="h-6 w-6" /> },
  { label: 'Growth Achieved', value: '432%', icon: <TrendingUp className="h-6 w-6" /> },
  { label: 'Frisco Clients', value: '22+', icon: <Building className="h-6 w-6" /> },
  { label: 'Projects Delivered', value: '35+', icon: <Target className="h-6 w-6" /> },
]

const FRISCO_HIGHLIGHTS = [
  'Deep expertise with fast-growing Frisco companies and startup ecosystem',
  'SalesLoft Admin Certified (Level 1 & 2) and HubSpot Revenue Operations Certified',
  'Proven success with Frisco\'s sports, entertainment, and technology sectors',
  'Strategic location providing easy access to all Frisco business districts',
  'Expert in scaling rapid-growth companies through Frisco\'s boom periods',
  'Partnership program implementation with proven $4.8M+ revenue results',
  'Active in Frisco Chamber of Commerce and North Texas business community',
  'Specializes in companies relocating to or expanding in Frisco',
]

const FRISCO_SERVICES = [
  {
    title: 'Rapid Growth Revenue Operations for Frisco Companies',
    description: 'Scale your fast-growing Frisco business with agile RevOps strategies designed for rapid expansion. Perfect for companies experiencing Frisco\'s economic boom and need scalable systems that grow with their success.',
    features: [
      'Rapid-deployment CRM systems for fast-growing companies',
      'Scalable sales process design and automation',
      'Growth-stage financial reporting and forecasting',
      'Territory expansion planning for multi-location growth',
      'Performance tracking systems for distributed teams',
      'Integration with modern tech stack and cloud platforms',
      'Investor and stakeholder reporting automation',
      'Crisis management and business continuity planning',
    ],
    benefits: [
      'Rapid Scalability',
      'Growth-Ready Systems',
      'Improved Efficiency',
      'Better Resource Planning',
      'Enhanced Visibility',
    ],
    cta: {
      text: 'See Frisco Growth Company Success',
      href: '/projects/revenue-operations-center',
    },
  },
  {
    title: 'Sports & Entertainment Partnership Programs',
    description: 'Develop strategic partnerships for Frisco\'s thriving sports and entertainment industry. Our proven methodology leverages Frisco\'s unique position as a sports destination to create revenue-generating partnerships.',
    features: [
      'Sports industry partnership strategy development',
      'Entertainment venue collaboration programs',
      'Sponsorship management and optimization systems',
      'Event-driven partnership activation',
      'Multi-stakeholder partnership coordination',
      'Brand partnership and co-marketing automation',
      'Performance analytics for partnership ROI',
      'Integration with entertainment industry platforms',
    ],
    benefits: [
      '$4.8M+ Revenue Generated',
      'Brand Visibility Increase',
      'Market Reach Expansion',
      'Event-Driven Growth',
      'Industry Leadership',
    ],
    cta: {
      text: 'View Sports Partnership Case Study',
      href: '/projects/partnership-program-implementation',
    },
  },
  {
    title: 'Corporate Relocation Revenue Optimization',
    description: 'Help companies relocating to Frisco optimize their revenue operations during transition. Ensure business continuity while implementing improved systems that take advantage of Frisco\'s business-friendly environment.',
    features: [
      'Business continuity planning during relocation',
      'System migration and data transfer management',
      'Local market analysis and territory optimization',
      'New employee onboarding and training systems',
      'Vendor and partnership relationship management',
      'Compliance and regulatory transition support',
      'Performance monitoring during transition periods',
      'Integration with Frisco business networks and resources',
    ],
    benefits: [
      'Smooth Transition Process',
      'Minimal Business Disruption',
      'Improved Local Market Position',
      'Enhanced Operational Efficiency',
      'Faster ROI Achievement',
    ],
    cta: {
      text: 'Explore Relocation Optimization',
      href: '/projects/revenue-kpi',
    },
  },
  {
    title: 'Technology Company Sales Automation',
    description: 'Implement sophisticated sales automation for Frisco\'s growing technology sector. Create systems that support complex sales cycles, technical product demonstrations, and enterprise customer acquisition.',
    features: [
      'Technical sales process automation and optimization',
      'Demo scheduling and technical resource management',
      'Enterprise sales cycle management and tracking',
      'Product-led growth strategy implementation',
      'Customer onboarding and success automation',
      'Integration with development and product teams',
      'Technical documentation and sales enablement',
      'Performance analytics for technical sales teams',
    ],
    benefits: [
      'Shorter Sales Cycles',
      'Higher Win Rates',
      'Better Resource Utilization',
      'Improved Customer Experience',
      'Scalable Growth Systems',
    ],
    cta: {
      text: 'See Tech Sales Automation Results',
      href: '/projects/deal-funnel',
    },
  },
]

const FRISCO_FAQS = [
  {
    question: 'Why is Frisco an ideal location for Revenue Operations consulting?',
    answer: 'Frisco represents one of the fastest-growing business environments in North Texas, with companies experiencing rapid expansion and unique scaling challenges. As a RevOps expert serving Frisco, I understand the specific needs of high-growth companies, corporate relocations, and businesses capitalizing on Frisco\'s economic boom.',
  },
  {
    question: 'Do you work with companies relocating their headquarters to Frisco?',
    answer: 'Absolutely! Frisco has become a magnet for corporate relocations, and I specialize in helping companies optimize their revenue operations during this transition. This includes system migrations, process improvements, local market integration, and ensuring business continuity throughout the relocation process.',
  },
  {
    question: 'What experience do you have with Frisco\'s sports and entertainment industry?',
    answer: 'Frisco\'s unique position as a sports destination (with the Dallas Cowboys, FC Dallas, and numerous sporting events) creates special opportunities for partnership programs and revenue optimization. I\'ve helped sports-related businesses and entertainment venues create strategic partnerships that leverage Frisco\'s sports ecosystem.',
  },
  {
    question: 'How do you help fast-growing Frisco companies scale their operations?',
    answer: 'Fast growth requires scalable systems that can adapt quickly. I implement agile RevOps strategies that include rapid-deployment CRM systems, automated reporting, scalable sales processes, and growth-stage analytics. My approach ensures companies can maintain efficiency while scaling rapidly in Frisco\'s competitive environment.',
  },
  {
    question: 'What makes your approach different for Frisco businesses?',
    answer: 'Frisco businesses often face unique challenges related to rapid growth, corporate relocations, and competitive markets. I tailor my RevOps strategies to address these specific needs, with a focus on scalability, agility, and leveraging Frisco\'s business-friendly environment. My $4.8M+ revenue generation track record demonstrates success with these types of dynamic businesses.',
  },
]

export default function FriscoLocationPage() {
  return (
    <>
      <BreadcrumbJsonLd 
        items={[
          { name: 'Home', url: 'https://richardwhudsonjr.com' },
          { name: 'Locations', url: 'https://richardwhudsonjr.com/locations' },
          { name: 'Frisco', url: 'https://richardwhudsonjr.com/locations/frisco' },
        ]}
      />
      <FAQJsonLd faqs={FRISCO_FAQS} />
      
      <LocationHero
        city="Frisco"
        state="TX"
        region="Collin County & North Texas"
        description="Power your fast-growing Frisco business with expert Revenue Operations consulting. I help companies navigate rapid expansion, corporate relocations, and market opportunities in one of Texas's most dynamic business environments."
        serviceAreas={[
          'Downtown Frisco',
          'The Star District',
          'Frisco Square',
          'Preston Center',
          'Lebanon Road Corridor',
          'North Frisco',
          'West Frisco',
          'Legacy West Adjacent',
          'Toyota Stadium Area',
          'Frisco Business District',
        ]}
        stats={FRISCO_STATS}
        highlights={FRISCO_HIGHLIGHTS}
      />
      
      <LocationServices
        city="Frisco"
        services={FRISCO_SERVICES}
      />

      {/* Frisco Growth Story Section */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              Growing with Frisco's Success Story
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Frisco represents one of the most remarkable growth stories in Texas business. As companies flock to this 
              dynamic city, they need RevOps strategies that can match Frisco's pace of growth and innovation.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Rapid Growth Expertise</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Specialized in scaling systems for companies experiencing explosive growth.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Relocation Support</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Expert guidance for companies relocating to Frisco's business-friendly environment.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Sports & Entertainment</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Unique partnerships leveraging Frisco's sports and entertainment ecosystem.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              Frequently Asked Questions - Frisco RevOps Consulting
            </h2>
            <div className="space-y-8">
              {FRISCO_FAQS.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}