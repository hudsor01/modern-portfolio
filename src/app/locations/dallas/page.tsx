import React from 'react'
import { Metadata } from 'next'
import { generateMetadata } from '@/app/shared-metadata'
import { LocationHero } from '@/components/locations/location-hero'
import { LocationServices } from '@/components/locations/location-services'
import { BreadcrumbJsonLd, FAQJsonLd } from '@/components/seo/json-ld'
import { TrendingUp, Target, DollarSign, Building } from 'lucide-react'

export const metadata: Metadata = generateMetadata(
  'Revenue Operations Consultant Dallas, TX | Richard Hudson RevOps Expert',
  'Expert Revenue Operations Consultant serving Dallas, Texas businesses. Specializing in sales automation, CRM optimization, and partnership program development. SalesLoft & HubSpot certified. $4.8M+ revenue generated. Serving Downtown Dallas, Deep Ellum, Uptown, and surrounding areas.',
  '/locations/dallas',
  {
    keywords: [
      'Revenue Operations Consultant Dallas',
      'RevOps Expert Dallas Texas',
      'Sales Automation Dallas',
      'CRM Consultant Dallas',
      'Partnership Program Developer Dallas',
      'Business Intelligence Dallas',
      'Marketing Automation Dallas',
      'Sales Process Optimization Dallas',
      'Revenue Operations Downtown Dallas',
      'RevOps Deep Ellum',
      'Sales Consultant Uptown Dallas',
    ],
  }
)

const DALLAS_STATS = [
  { label: 'Revenue Generated', value: '$4.8M+', icon: <DollarSign className="h-6 w-6" /> },
  { label: 'Growth Achieved', value: '432%', icon: <TrendingUp className="h-6 w-6" /> },
  { label: 'Dallas Clients', value: '25+', icon: <Building className="h-6 w-6" /> },
  { label: 'Projects Delivered', value: '40+', icon: <Target className="h-6 w-6" /> },
]

const DALLAS_HIGHLIGHTS = [
  'Deep understanding of Dallas business ecosystem and market dynamics',
  'SalesLoft Admin Certified (Level 1 & 2) and HubSpot Revenue Operations Certified',
  'Proven track record with Dallas startups, mid-market, and enterprise companies',
  'Local presence with offices accessible from Downtown, Deep Ellum, and Uptown',
  'Expert in scaling businesses through Dallas tech corridors and business districts',
  'Partnership program implementation with proven $4.8M+ revenue results',
  'On-site consultation available throughout Dallas metropolitan area',
  'Integration with popular Dallas business networks and communities',
]

const DALLAS_SERVICES = [
  {
    title: 'Sales Operations Optimization for Dallas Businesses',
    description: 'Transform your Dallas sales team performance with data-driven operations strategies. We implement CRM systems, optimize sales processes, and create automated workflows that scale with your business growth.',
    features: [
      'Salesforce implementation and optimization for Dallas market',
      'HubSpot CRM setup with Dallas-specific lead routing',
      'Sales pipeline automation and stage optimization',
      'Territory management for Dallas geographic regions',
      'Commission structure design and automation',
      'Sales team performance analytics and dashboards',
      'Lead scoring models optimized for Dallas demographics',
      'Integration with popular Dallas business tools and platforms',
    ],
    benefits: [
      '40%+ Sales Efficiency Increase',
      'Reduced Sales Cycle Time',
      'Improved Lead Conversion',
      'Better Territory Coverage',
      'Automated Reporting',
    ],
    cta: {
      text: 'See Dallas Sales Optimization Case Study',
      href: '/projects/revenue-operations-center',
    },
  },
  {
    title: 'Partnership Program Development for Dallas Companies',
    description: 'Launch and scale partnership programs that drive significant revenue growth. Our proven methodology has generated $4.8M+ in partnership revenue for Dallas-area businesses.',
    features: [
      'Partnership strategy development for Dallas market',
      'Partner onboarding automation and workflows',
      'Commission tracking and management systems',
      'Partner portal development and maintenance',
      'Co-selling program implementation',
      'Partner performance analytics and reporting',
      'Integration with existing Dallas business networks',
      'Compliance and contract management automation',
    ],
    benefits: [
      '$4.8M+ Revenue Generated',
      '432% Growth Achieved',
      'Automated Partner Management',
      'Scalable Program Structure',
      'Measurable ROI',
    ],
    cta: {
      text: 'View Partnership Program Success Story',
      href: '/projects/partnership-program-implementation',
    },
  },
  {
    title: 'Business Intelligence & Analytics for Dallas Enterprises',
    description: 'Make data-driven decisions with custom dashboards and analytics solutions. We build comprehensive reporting systems that provide actionable insights for Dallas business leaders.',
    features: [
      'Custom dashboard development using Tableau and Power BI',
      'Revenue analytics and forecasting models',
      'Customer lifecycle analysis and segmentation',
      'Marketing attribution and ROI analysis',
      'Real-time performance monitoring systems',
      'Automated reporting and alert systems',
      'Data integration from multiple business systems',
      'Executive-level reporting and KPI tracking',
    ],
    benefits: [
      'Data-Driven Decision Making',
      'Real-Time Insights',
      'Improved Forecasting',
      'Cost Optimization',
      'Performance Transparency',
    ],
    cta: {
      text: 'Explore Business Intelligence Solutions',
      href: '/projects/revenue-kpi',
    },
  },
  {
    title: 'Marketing Automation for Dallas Growth Companies',
    description: 'Scale your marketing efforts with intelligent automation that nurtures leads and drives conversions. Perfect for Dallas companies looking to expand their market reach efficiently.',
    features: [
      'HubSpot and Marketo implementation for Dallas markets',
      'Lead nurturing campaigns with Dallas-specific content',
      'Email marketing automation and segmentation',
      'Landing page optimization for Dallas audiences',
      'Marketing attribution and lead source tracking',
      'Integration with Dallas event and networking platforms',
      'A/B testing and conversion optimization',
      'Marketing and sales alignment strategies',
    ],
    benefits: [
      'Increased Lead Quality',
      'Higher Conversion Rates',
      'Automated Lead Nurturing',
      'Better Marketing ROI',
      'Scalable Growth',
    ],
    cta: {
      text: 'See Marketing Automation Results',
      href: '/projects/multi-channel-attribution',
    },
  },
]

const DALLAS_FAQS = [
  {
    question: 'Why choose a Revenue Operations consultant in Dallas specifically?',
    answer: 'As a Dallas-based RevOps expert, I understand the unique business landscape, from the thriving tech scene in Deep Ellum to the financial services in Downtown Dallas. This local knowledge, combined with my SalesLoft and HubSpot certifications, allows me to create solutions that resonate with Dallas market dynamics and business networks.',
  },
  {
    question: 'What makes Richard Hudson different from other RevOps consultants in Dallas?',
    answer: 'I bring a proven track record of $4.8M+ revenue generated and 432% growth achieved, specifically for businesses in the Dallas-Fort Worth metroplex. My dual SalesLoft Admin Certifications (Level 1 & 2) and HubSpot Revenue Operations certification, combined with deep partnership program expertise, set me apart in the Dallas consulting landscape.',
  },
  {
    question: 'Do you work with Dallas startups or only established companies?',
    answer: 'I work with businesses at all stages across Dallas - from early-stage startups in the Dallas Entrepreneur Center ecosystem to established enterprises in Downtown Dallas. My scalable RevOps strategies are designed to grow with your business, whether you\'re a 5-person startup or a 500-person company.',
  },
  {
    question: 'How quickly can you implement RevOps solutions for Dallas businesses?',
    answer: 'Implementation timelines vary based on complexity, but typical Dallas projects see initial results within 30-60 days. Simple CRM optimizations can be completed in 2-3 weeks, while comprehensive partnership program implementations may take 8-12 weeks. All projects include ongoing optimization and support.',
  },
  {
    question: 'Do you provide on-site consultation in Dallas?',
    answer: 'Yes, I provide on-site consultation throughout the Dallas metropolitan area, including Downtown Dallas, Deep Ellum, Uptown, Bishop Arts District, and surrounding business centers. I also offer hybrid remote/on-site engagements for maximum flexibility and efficiency.',
  },
]

export default function DallasLocationPage() {
  return (
    <>
      <BreadcrumbJsonLd 
        items={[
          { name: 'Home', url: 'https://richardwhudsonjr.com' },
          { name: 'Locations', url: 'https://richardwhudsonjr.com/locations' },
          { name: 'Dallas', url: 'https://richardwhudsonjr.com/locations/dallas' },
        ]}
      />
      <FAQJsonLd faqs={DALLAS_FAQS} />
      
      <LocationHero
        city="Dallas"
        state="TX"
        region="Dallas-Fort Worth Metroplex"
        description="Transform your Dallas business with expert Revenue Operations consulting. I specialize in sales automation, partnership program development, and data-driven growth strategies that have generated $4.8M+ in revenue for Dallas-area companies."
        serviceAreas={[
          'Downtown Dallas',
          'Deep Ellum',
          'Uptown Dallas',
          'Bishop Arts District',
          'Design District',
          'Victory Park',
          'Trinity Groves',
          'Oak Cliff',
          'East Dallas',
          'North Dallas',
        ]}
        stats={DALLAS_STATS}
        highlights={DALLAS_HIGHLIGHTS}
      />
      
      <LocationServices
        city="Dallas"
        services={DALLAS_SERVICES}
      />

      {/* FAQ Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              Frequently Asked Questions - Dallas RevOps Consulting
            </h2>
            <div className="space-y-8">
              {DALLAS_FAQS.map((faq, index) => (
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