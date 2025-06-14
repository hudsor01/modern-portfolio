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
  { label: 'Projects Delivered', value: '8+', icon: '✅' },
  { label: 'Revenue Generated', value: '$3.7M+', icon: '💰' },
  { label: 'Transaction Growth', value: '432%', icon: '📈' },
  { label: 'Network Expansion', value: '2,217%', icon: '🚀' },
]

const PERSONAL_INFO = {
  name: 'Richard Hudson',
  title: 'Revenue Operations Consultant & Business Growth Expert',
  location: 'Plano, TX • Serving Dallas-Fort Worth Metroplex • Remote & On-Site Available',
  email: 'contact@richardwhudsonjr.com',
  bio: `I'm a Revenue Operations Consultant specializing in transforming business operations through data-driven strategies. 
        With over 10 years of experience optimizing sales processes, implementing marketing automation, and building 
        business intelligence solutions, I help companies achieve sustainable revenue growth. My expertise spans 
        CRM optimization (Salesforce, HubSpot), advanced analytics, and process automation that has generated 
        over $3.7M in revenue and achieved 432% transaction growth for my clients.`,
  highlights: [
    'Specialized in revenue operations and growth analytics with proven track record',
    'Expert in building automated reporting systems and data-driven decision frameworks',
    'Proven track record of increasing revenue efficiency by 40%+ across multiple organizations',
    'Certified in Salesforce, HubSpot, and advanced analytics platforms',
  ],
}

export const metadata = generateMetadata(
  'About Richard Hudson | Revenue Operations Expert & Business Growth Consultant',
  'Plano, Texas Revenue Operations Consultant serving Dallas-Fort Worth metroplex with 10+ years experience. Expert in Salesforce, HubSpot, data analytics, and process automation. Helping businesses in Frisco, Richardson, Allen, McKinney, and surrounding DFW areas achieve growth. $3.7M+ revenue generated, 432% transaction growth achieved.',
  '/about'
)

export default function AboutPage() {
  return (
    <AboutContent 
      skills={SKILLS} 
      experienceStats={EXPERIENCE_STATS}
      personalInfo={PERSONAL_INFO}
    />
  )
}
