import React from 'react'
import { Metadata } from 'next'
import { generateMetadata } from '@/app/shared-metadata'
import { LocationHero } from '@/components/locations/location-hero'
import { LocationServices } from '@/components/locations/location-services'
import { BreadcrumbJsonLd, FAQJsonLd } from '@/components/seo/json-ld'
import { TrendingUp, Target, DollarSign, Building } from 'lucide-react'

export const metadata: Metadata = generateMetadata(
  'RevOps Expert Fort Worth, TX | Revenue Operations Consultant Richard Hudson',
  'Expert Revenue Operations Consultant serving Fort Worth, Texas businesses. Specializing in sales automation, CRM optimization, and partnership program development. SalesLoft & HubSpot certified. $4.8M+ revenue generated. Serving Downtown Fort Worth, Cultural District, and surrounding areas.',
  '/locations/fort-worth',
  {
    keywords: [
      'RevOps Expert Fort Worth',
      'Revenue Operations Consultant Fort Worth Texas',
      'Sales Automation Fort Worth',
      'CRM Consultant Fort Worth',
      'Partnership Program Developer Fort Worth',
      'Business Intelligence Fort Worth',
      'Marketing Automation Fort Worth',
      'Sales Process Optimization Fort Worth',
      'Revenue Operations Downtown Fort Worth',
      'RevOps Cultural District',
      'Sales Consultant Sundance Square',
    ],
  }
)

const FORT_WORTH_STATS = [
  { label: 'Revenue Generated', value: '$4.8M+', icon: <DollarSign className="h-6 w-6" /> },
  { label: 'Growth Achieved', value: '432%', icon: <TrendingUp className="h-6 w-6" /> },
  { label: 'Fort Worth Clients', value: '18+', icon: <Building className="h-6 w-6" /> },
  { label: 'Projects Delivered', value: '30+', icon: <Target className="h-6 w-6" /> },
]

const FORT_WORTH_HIGHLIGHTS = [
  'Extensive experience with Fort Worth manufacturing and logistics companies',
  'SalesLoft Admin Certified (Level 1 & 2) and HubSpot Revenue Operations Certified',
  'Proven success with Fort Worth energy sector and traditional businesses',
  'Local presence with easy access to Downtown Fort Worth and Cultural District',
  'Expert in scaling traditional Fort Worth businesses with modern RevOps strategies',
  'Partnership program implementation with proven $4.8M+ revenue results',
  'On-site consultation available throughout Fort Worth and Tarrant County',
  'Deep understanding of Fort Worth business culture and networking community',
]

const FORT_WORTH_SERVICES = [
  {
    title: 'Sales Operations for Traditional Fort Worth Industries',
    description: 'Modernize your Fort Worth business with cutting-edge sales operations while respecting traditional business values. Perfect for manufacturing, energy, and logistics companies looking to scale efficiently.',
    features: [
      'CRM implementation tailored for Fort Worth industries',
      'Sales process automation for complex B2B sales cycles',
      'Territory management for Fort Worth and surrounding regions',
      'Integration with industry-specific tools and platforms',
      'Commission tracking for complex sales structures',
      'Performance analytics and forecasting systems',
      'Lead management optimized for Fort Worth markets',
      'Mobile-friendly solutions for field sales teams',
    ],
    benefits: [
      '40%+ Sales Efficiency Increase',
      'Reduced Administrative Overhead',
      'Improved Customer Tracking',
      'Better Territory Management',
      'Streamlined Processes',
    ],
    cta: {
      text: 'See Fort Worth Sales Optimization Results',
      href: '/projects/revenue-operations-center',
    },
  },
  {
    title: 'Partnership Program Development for Fort Worth Enterprises',
    description: 'Build strategic partnerships that drive substantial revenue growth. Our methodology has generated $4.8M+ in partnership revenue, perfect for Fort Worth\'s collaborative business environment.',
    features: [
      'Strategic partnership development for Fort Worth markets',
      'Partner onboarding and management automation',
      'Channel partner program design and implementation',
      'Vendor and supplier partnership optimization',
      'Joint venture management systems',
      'Partner performance tracking and analytics',
      'Compliance and contract management automation',
      'Integration with Fort Worth business networks',
    ],
    benefits: [
      '$4.8M+ Revenue Generated',
      '432% Growth Achieved',
      'Streamlined Partner Management',
      'Scalable Program Infrastructure',
      'Measurable Partnership ROI',
    ],
    cta: {
      text: 'View Partnership Program Case Study',
      href: '/projects/partnership-program-implementation',
    },
  },
  {
    title: 'Business Intelligence for Fort Worth Manufacturing',
    description: 'Transform data into actionable insights with custom analytics solutions designed for Fort Worth\'s manufacturing and industrial sectors. Make informed decisions that drive operational efficiency.',
    features: [
      'Manufacturing-specific dashboard development',
      'Supply chain analytics and optimization',
      'Production efficiency tracking and reporting',
      'Quality control and compliance monitoring',
      'Cost analysis and profit margin optimization',
      'Inventory management and forecasting',
      'Customer lifecycle analysis for B2B markets',
      'Executive reporting for Fort Worth stakeholders',
    ],
    benefits: [
      'Operational Efficiency Gains',
      'Cost Reduction Insights',
      'Improved Quality Control',
      'Better Supply Chain Visibility',
      'Data-Driven Decision Making',
    ],
    cta: {
      text: 'Explore Manufacturing BI Solutions',
      href: '/projects/revenue-kpi',
    },
  },
  {
    title: 'CRM Optimization for Fort Worth Service Companies',
    description: 'Optimize your customer relationship management with solutions designed for Fort Worth\'s diverse service sector. From professional services to healthcare, we create systems that enhance customer experiences.',
    features: [
      'Service-industry CRM customization and setup',
      'Customer journey mapping and optimization',
      'Service ticket management and automation',
      'Customer satisfaction tracking and reporting',
      'Billing and payment automation integration',
      'Multi-location management for Fort Worth businesses',
      'Customer communication automation',
      'Performance analytics for service teams',
    ],
    benefits: [
      'Enhanced Customer Experience',
      'Improved Service Delivery',
      'Automated Follow-up Processes',
      'Better Customer Retention',
      'Streamlined Operations',
    ],
    cta: {
      text: 'See CRM Optimization Success Story',
      href: '/projects/customer-lifetime-value',
    },
  },
]

const FORT_WORTH_FAQS = [
  {
    question: 'Why choose a Revenue Operations consultant in Fort Worth specifically?',
    answer: 'As a Fort Worth-focused RevOps expert, I understand the unique blend of traditional business values and modern growth needs that characterize Cowtown. From manufacturing companies in the Alliance corridor to service businesses in Downtown Fort Worth, I create solutions that respect established business practices while driving innovation and growth.',
  },
  {
    question: 'Do you work with Fort Worth manufacturing and industrial companies?',
    answer: 'Absolutely! Fort Worth\'s strong manufacturing and industrial base is a specialty of mine. I\'ve helped numerous Fort Worth manufacturing companies implement CRM systems, optimize supply chain operations, and create data-driven decision-making processes that respect the complexity of industrial operations while driving efficiency gains.',
  },
  {
    question: 'How do you help traditional Fort Worth businesses adopt modern RevOps strategies?',
    answer: 'I take a gradual, respectful approach that honors Fort Worth\'s business traditions while introducing proven modern methodologies. We start with small wins that demonstrate value, then scale successful processes. My $4.8M+ revenue generation track record shows that traditional businesses can achieve dramatic growth with the right RevOps strategies.',
  },
  {
    question: 'What types of Fort Worth companies do you typically work with?',
    answer: 'I work with a diverse range of Fort Worth businesses - from manufacturing companies in the Alliance area to professional services in Downtown Fort Worth, energy sector companies, logistics firms, and healthcare organizations. My solutions are customized for each industry\'s specific needs and Fort Worth market dynamics.',
  },
  {
    question: 'Do you provide on-site consultation in Fort Worth and Tarrant County?',
    answer: 'Yes, I provide comprehensive on-site consultation throughout Fort Worth and Tarrant County, including Downtown Fort Worth, Cultural District, Alliance area, and surrounding business centers. I understand that many Fort Worth businesses prefer face-to-face consultation, and I\'m committed to providing that personal service.',
  },
]

export default function FortWorthLocationPage() {
  return (
    <>
      <BreadcrumbJsonLd 
        items={[
          { name: 'Home', url: 'https://richardwhudsonjr.com' },
          { name: 'Locations', url: 'https://richardwhudsonjr.com/locations' },
          { name: 'Fort Worth', url: 'https://richardwhudsonjr.com/locations/fort-worth' },
        ]}
      />
      <FAQJsonLd faqs={FORT_WORTH_FAQS} />
      
      <LocationHero
        city="Fort Worth"
        state="TX"
        region="Tarrant County & DFW Metroplex"
        description="Modernize your Fort Worth business operations with expert Revenue Operations consulting. I help traditional Fort Worth industries and service companies implement modern sales automation and partnership strategies that have generated $4.8M+ in revenue."
        serviceAreas={[
          'Downtown Fort Worth',
          'Cultural District',
          'Sundance Square',
          'Alliance',
          'Trinity Metro',
          'Near Southside',
          'River District',
          'West Fort Worth',
          'North Fort Worth',
          'Arlington Heights',
        ]}
        stats={FORT_WORTH_STATS}
        highlights={FORT_WORTH_HIGHLIGHTS}
      />
      
      <LocationServices
        city="Fort Worth"
        services={FORT_WORTH_SERVICES}
      />

      {/* FAQ Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              Frequently Asked Questions - Fort Worth RevOps Consulting
            </h2>
            <div className="space-y-8">
              {FORT_WORTH_FAQS.map((faq, index) => (
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