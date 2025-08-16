import React from 'react'
import { generateMetadata } from '@/app/shared-metadata'
import AboutContent from '@/components/about/about-content'

const SKILLS = [
  {
    category: 'Technical',
    icon: '💻',
    description: 'Full-stack development expertise',
    skills: [
      { name: 'JavaScript', level: 95, years: 8 },
      { name: 'TypeScript', level: 90, years: 5 },
      { name: 'React', level: 95, years: 6 },
      { name: 'Node.js', level: 85, years: 6 },
      { name: 'Next.js', level: 90, years: 4 },
      { name: 'GraphQL', level: 80, years: 3 },
      { name: 'PostgreSQL', level: 75, years: 5 },
      { name: 'Python', level: 70, years: 3 },
      { name: 'AWS', level: 80, years: 4 },
    ],
  },
  {
    category: 'Business',
    icon: '📊',
    description: 'Strategic operations and growth',
    skills: [
      { name: 'Revenue Operations', level: 95, years: 10 },
      { name: 'Strategic Planning', level: 90, years: 8 },
      { name: 'Process Optimization', level: 88, years: 7 },
      { name: 'Data Analysis', level: 85, years: 9 },
      { name: 'Project Management', level: 92, years: 8 },
      { name: 'Team Leadership', level: 87, years: 6 },
      { name: 'Business Intelligence', level: 85, years: 7 },
      { name: 'Financial Modeling', level: 80, years: 5 },
    ],
  },
  {
    category: 'Tools',
    icon: '🛠️',
    description: 'Industry-leading platforms',
    skills: [
      { name: 'Salesforce', level: 90, years: 8 },
      { name: 'HubSpot', level: 85, years: 6 },
      { name: 'Marketo', level: 80, years: 4 },
      { name: 'Tableau', level: 85, years: 5 },
      { name: 'Power BI', level: 80, years: 4 },
      { name: 'Google Analytics', level: 90, years: 7 },
      { name: 'Zapier', level: 85, years: 5 },
      { name: 'Looker', level: 75, years: 3 },
      { name: 'Mixpanel', level: 78, years: 4 },
    ],
  },
]

const EXPERIENCE_STATS = [
  { label: 'Projects Delivered', value: '10+', icon: '✅' },
  { label: 'Revenue Generated', value: '$4.8M+', icon: '💰' },
  { label: 'Transaction Growth', value: '432%', icon: '📈' },
  { label: 'Network Expansion', value: '2,217%', icon: '🚀' },
]

const CERTIFICATIONS = [
  {
    name: 'SalesLoft Admin Certification Level 1',
    issuer: 'SalesLoft',
    badge: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop&crop=center&q=80',
    description: 'Foundational administration and configuration of SalesLoft sales engagement platform',
    skills: ['Platform Setup', 'User Management', 'Basic Cadences', 'Email Templates']
  },
  {
    name: 'SalesLoft Admin Certification Level 2',
    issuer: 'SalesLoft',
    badge: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150&h=150&fit=crop&crop=center&q=80',
    description: 'Advanced administration including complex automation, integrations, and advanced analytics',
    skills: ['Advanced Automation', 'CRM Integrations', 'Advanced Analytics', 'Complex Workflows']
  },
  {
    name: 'HubSpot Revenue Operations Certification',
    issuer: 'HubSpot Academy',
    badge: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=150&h=150&fit=crop&crop=center&q=80',
    description: 'Comprehensive revenue operations strategy, process optimization, and performance analysis',
    skills: ['Revenue Operations', 'Sales Process Optimization', 'Marketing Alignment', 'Analytics & Forecasting']
  }
]

const PERSONAL_INFO = {
  name: 'Richard Hudson',
  title: 'Revenue Operations Consultant & Business Growth Expert',
  location: 'Plano, TX • Serving Dallas-Fort Worth Metroplex • Remote & On-Site Available',
  email: 'contact@richardwhudsonjr.com',
  bio: `I'm a Revenue Operations Consultant specializing in transforming business operations through data-driven strategies across the Dallas-Fort Worth metroplex. With over 10 years of experience optimizing sales processes, implementing marketing automation, and building business intelligence solutions, I help companies achieve sustainable revenue growth.

My expertise spans CRM optimization, advanced analytics, partnership program development, and process automation that has generated over $4.8M in revenue and achieved 432% transaction growth. I hold SalesLoft Admin Certifications (Level 1 & 2) and HubSpot Revenue Operations certification, positioning me as a leading RevOps expert in the Texas market.

Based in Plano, I serve businesses throughout Dallas, Fort Worth, Frisco, and the greater DFW metroplex. My approach combines deep technical expertise with practical business acumen, ensuring implementations that drive measurable results. Whether you're a fast-growing startup in Dallas's tech corridor or an established enterprise in Fort Worth's business district, I create scalable revenue operations that power sustainable growth.

My specialization in partnership program implementation has been particularly impactful, helping companies establish and optimize strategic partnerships that become significant revenue drivers. This expertise, combined with my technical skills in CRM systems, marketing automation platforms, and business intelligence tools, enables me to deliver comprehensive RevOps solutions that address every aspect of the revenue generation process.`,
  highlights: [
    'Based in Plano, TX with deep knowledge of Dallas-Fort Worth business ecosystem and market dynamics',
    'SalesLoft Admin Certified (Level 1 & 2) and HubSpot Revenue Operations Certified professional',
    'Specialized in revenue operations and growth analytics with proven $4.8M+ revenue generation track record',
    'Expert in partnership program development and implementation with 432% growth achievements',
    'Proven track record of increasing revenue efficiency by 40%+ across multiple DFW organizations',
    'Comprehensive experience with Dallas tech startups, Fort Worth traditional industries, and enterprise headquarters',
    'Expert in building automated reporting systems and data-driven decision frameworks',
    'Active member of Dallas-Fort Worth business community with extensive local network',
    'On-site consultation available throughout DFW metroplex with rapid response capability',
    'Specialized knowledge of Texas business regulations, local market conditions, and industry best practices',
  ],
}


export const metadata = generateMetadata(
  'About Richard Hudson | Revenue Operations Expert & Business Growth Consultant',
  'Richard Hudson - Plano, Texas Revenue Operations Consultant serving Dallas-Fort Worth metroplex with 10+ years experience. SalesLoft Admin certified (Level 1 & 2) and HubSpot Revenue Operations certified. Partnership program implementation expert with production system integration experience. Expert in data analytics, process automation, and CRM optimization. $4.8M+ revenue generated across 11+ projects, 432% transaction growth achieved.',
  '/about'
)

const AboutPage = React.memo(function AboutPage() {
  return (
    <AboutContent 
      skills={SKILLS} 
      experienceStats={EXPERIENCE_STATS}
      personalInfo={PERSONAL_INFO}
      certifications={CERTIFICATIONS}
    />
  )
})

export default AboutPage
