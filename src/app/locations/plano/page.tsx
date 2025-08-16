import React from 'react'
import { Metadata } from 'next'
import { generateMetadata } from '@/app/shared-metadata'
import { LocationHero } from '@/components/locations/location-hero'
import { LocationServices } from '@/components/locations/location-services'
import { BreadcrumbJsonLd, FAQJsonLd } from '@/components/seo/json-ld'
import { TrendingUp, Users, Target, DollarSign, Building, Zap } from 'lucide-react'

export const metadata: Metadata = generateMetadata(
  'Revenue Operations Consultant Plano, TX | CRM Consultant Richard Hudson',
  'Expert Revenue Operations Consultant based in Plano, Texas. Serving tech companies and growing businesses with sales automation, CRM optimization, and partnership program development. SalesLoft & HubSpot certified. Local Plano presence.',
  '/locations/plano',
  {
    keywords: [
      'Revenue Operations Consultant Plano',
      'CRM Consultant Plano Texas',
      'Sales Automation Plano',
      'Partnership Program Developer Plano',
      'Business Intelligence Plano',
      'Marketing Automation Plano',
      'Sales Process Optimization Plano',
      'RevOps Expert Plano',
      'HubSpot Consultant Plano',
      'SalesLoft Consultant Plano',
      'Tech Consultant Plano Texas',
    ],
  }
)

const PLANO_STATS = [
  { label: 'Revenue Generated', value: '$4.8M+', icon: <DollarSign className="h-6 w-6" /> },
  { label: 'Growth Achieved', value: '432%', icon: <TrendingUp className="h-6 w-6" /> },
  { label: 'Plano Clients', value: '35+', icon: <Building className="h-6 w-6" /> },
  { label: 'Local Projects', value: '50+', icon: <Target className="h-6 w-6" /> },
]

const PLANO_HIGHLIGHTS = [
  'Based in Plano with deep knowledge of local tech and business community',
  'SalesLoft Admin Certified (Level 1 & 2) and HubSpot Revenue Operations Certified',
  'Extensive experience with Plano tech companies and Fortune 500 headquarters',
  'Local presence in Plano Business District with immediate availability',
  'Expert in scaling high-growth Plano startups and established enterprises',
  'Partnership program implementation with proven $4.8M+ revenue results',
  'Active in Plano Chamber of Commerce and local business networking groups',
  'Specializes in Plano\'s diverse business ecosystem from tech to healthcare',
]

const PLANO_SERVICES = [
  {
    title: 'Tech Company Revenue Operations for Plano Startups',
    description: 'Scale your Plano tech startup with sophisticated RevOps strategies designed for rapid growth. From seed stage to Series C, I help Plano tech companies build scalable revenue engines that attract investors and drive sustainable growth.',
    features: [
      'Startup-focused CRM implementation (HubSpot, Salesforce)',
      'Rapid scaling sales process development',
      'Investor-ready metrics and reporting dashboards',
      'Product-led growth strategy implementation',
      'Customer success automation and onboarding',
      'Churn reduction and retention optimization',
      'Integration with popular tech stack tools',
      'Funding-stage revenue forecasting and modeling',
    ],
    benefits: [
      'Investor-Ready Metrics',
      'Scalable Growth Systems',
      'Reduced Customer Churn',
      'Improved Unit Economics',
      'Faster Time to Market',
    ],
    cta: {
      text: 'See Plano Tech Startup Success Story',
      href: '/projects/revenue-operations-center',
    },
  },
  {
    title: 'Enterprise Partnership Programs for Plano Headquarters',
    description: 'Develop strategic partnership programs that drive significant revenue growth for Plano-based enterprises. Our proven methodology has generated $4.8M+ in partnership revenue for companies with headquarters in Plano.',
    features: [
      'Enterprise-scale partnership strategy development',
      'Multi-tier partner program design and implementation',
      'Global partner onboarding and management systems',
      'Channel conflict resolution and territory management',
      'Partner portal development with advanced features',
      'Co-selling and joint GTM strategy implementation',
      'Partnership performance analytics and optimization',
      'Integration with enterprise sales and marketing systems',
    ],
    benefits: [
      '$4.8M+ Revenue Generated',
      '432% Growth Achieved',
      'Global Partner Scalability',
      'Enterprise-Grade Security',
      'Advanced Analytics',
    ],
    cta: {
      text: 'View Enterprise Partnership Case Study',
      href: '/projects/partnership-program-implementation',
    },
  },
  {
    title: 'Advanced Analytics for Plano Fortune 500 Companies',
    description: 'Transform enterprise data into strategic insights with sophisticated business intelligence solutions. Perfect for Plano\'s Fortune 500 headquarters requiring enterprise-grade analytics and reporting.',
    features: [
      'Enterprise data warehouse design and implementation',
      'Advanced predictive analytics and machine learning models',
      'Executive dashboard development for C-suite reporting',
      'Multi-department data integration and governance',
      'Real-time performance monitoring and alerting',
      'Compliance and audit trail reporting',
      'Custom API development for data integration',
      'Advanced visualization and self-service analytics',
    ],
    benefits: [
      'Enterprise-Scale Insights',
      'Predictive Capabilities',
      'C-Suite Ready Reporting',
      'Improved Data Governance',
      'Competitive Advantage',
    ],
    cta: {
      text: 'Explore Enterprise Analytics Solutions',
      href: '/projects/revenue-kpi',
    },
  },
  {
    title: 'Healthcare RevOps for Plano Medical Companies',
    description: 'Specialized Revenue Operations solutions for Plano\'s thriving healthcare and medical device sector. Ensure compliance while optimizing revenue processes and patient lifecycle management.',
    features: [
      'HIPAA-compliant CRM and automation systems',
      'Patient lifecycle management and optimization',
      'Medical device sales process automation',
      'Healthcare partnership and referral management',
      'Compliance tracking and reporting systems',
      'Integration with EMR and healthcare IT systems',
      'Provider and payer relationship management',
      'Regulatory compliance automation and monitoring',
    ],
    benefits: [
      'HIPAA Compliance Assured',
      'Improved Patient Outcomes',
      'Streamlined Provider Relations',
      'Regulatory Risk Reduction',
      'Enhanced Care Coordination',
    ],
    cta: {
      text: 'See Healthcare RevOps Implementation',
      href: '/projects/customer-lifetime-value',
    },
  },
]

const PLANO_FAQS = [
  {
    question: 'Why choose a Plano-based Revenue Operations consultant?',
    answer: 'Being based in Plano gives me unique insight into the local business ecosystem, from tech startups in Legacy West to Fortune 500 headquarters throughout the city. I understand Plano\'s rapid growth dynamics, the competitive landscape, and the specific challenges facing businesses in our diverse economy. My local presence means immediate availability and face-to-face collaboration.',
  },
  {
    question: 'Do you work with both Plano startups and Fortune 500 companies?',
    answer: 'Absolutely! Plano\'s unique business environment includes everything from early-stage tech startups to Fortune 500 headquarters. I scale my RevOps solutions accordingly - from rapid-growth systems for startups to enterprise-grade implementations for large corporations. My $4.8M+ revenue generation track record spans companies of all sizes.',
  },
  {
    question: 'How do you help Plano tech companies prepare for funding rounds?',
    answer: 'I help Plano tech companies create investor-ready revenue operations with clean metrics, predictable forecasting, and scalable processes. This includes implementing proper CRM systems, creating accurate revenue reporting, optimizing unit economics, and building the operational foundation that investors expect to see.',
  },
  {
    question: 'What experience do you have with Plano\'s healthcare sector?',
    answer: 'Plano\'s healthcare and medical device sector requires specialized knowledge of compliance, patient privacy, and complex sales cycles. I have extensive experience implementing HIPAA-compliant RevOps solutions, managing provider relationships, and optimizing patient lifecycle processes while maintaining strict regulatory compliance.',
  },
  {
    question: 'How quickly can you start working with Plano companies?',
    answer: 'As a Plano resident, I can typically begin consultation within 24-48 hours and start implementation within a week. My local presence eliminates travel time and scheduling conflicts, allowing for more frequent check-ins and faster problem resolution. Emergency support is available for critical issues.',
  },
]

export default function PlanoLocationPage() {
  return (
    <>
      <BreadcrumbJsonLd 
        items={[
          { name: 'Home', url: 'https://richardwhudsonjr.com' },
          { name: 'Locations', url: 'https://richardwhudsonjr.com/locations' },
          { name: 'Plano', url: 'https://richardwhudsonjr.com/locations/plano' },
        ]}
      />
      <FAQJsonLd faqs={PLANO_FAQS} />
      
      <LocationHero
        city="Plano"
        state="TX"
        region="Collin County & North Texas"
        description="Based in Plano, I provide expert Revenue Operations consulting to local tech companies, Fortune 500 headquarters, and growing businesses. My proximity ensures immediate availability and deep understanding of Plano's unique business ecosystem."
        serviceAreas={[
          'Legacy West',
          'West Plano',
          'East Plano',
          'Central Plano',
          'Willow Bend',
          'Plano Business District',
          'Legacy Town Center',
          'Shops at Legacy',
          'Plano Corporate Corridor',
          'Spring Creek',
        ]}
        stats={PLANO_STATS}
        highlights={PLANO_HIGHLIGHTS}
      />
      
      <LocationServices
        city="Plano"
        services={PLANO_SERVICES}
      />

      {/* Local Expertise Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              Your Local Plano Revenue Operations Expert
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              As a Plano resident and business owner, I understand the unique opportunities and challenges of our 
              rapidly growing city. From Legacy West's tech corridor to the established business districts, I help 
              Plano companies navigate growth with proven RevOps strategies.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Local Presence</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Based in Plano Business District with immediate availability for consultations and support.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Community Connected</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Active in Plano Chamber of Commerce and local business networking groups.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Rapid Response</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Same-day consultation available for urgent Plano business needs.
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
              Frequently Asked Questions - Plano RevOps Consulting
            </h2>
            <div className="space-y-8">
              {PLANO_FAQS.map((faq, index) => (
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