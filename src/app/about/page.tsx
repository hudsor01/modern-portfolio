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
  { label: 'Accuracy Rate', value: '96.8%', icon: '🎯' },
  { label: 'Automation Rate', value: '87.5%', icon: '⚡' },
]

const PERSONAL_INFO = {
  name: 'Richard Hudson',
  title: 'Revenue Operations Consultant & Full-Stack Developer',
  location: 'Remote • Available Worldwide',
  email: 'richard@example.com',
  bio: `I'm a Revenue Operations professional with over 10 years of experience building scalable systems 
        and driving business growth through data-driven insights. My unique combination of technical expertise 
        and business acumen allows me to bridge the gap between strategy and execution, creating solutions 
        that deliver measurable results. I'm passionate about optimizing processes, analyzing complex datasets, 
        and implementing strategic solutions that drive sustainable growth.`,
  highlights: [
    'Specialized in revenue operations and growth analytics with proven track record',
    'Expert in building automated reporting systems and data-driven decision frameworks',
    'Proven track record of increasing revenue efficiency by 40%+ across multiple organizations',
    'Experience leading cross-functional teams and strategic initiatives in fast-paced environments',
    'Full-stack development skills enabling end-to-end solution implementation',
    'Certified in Salesforce, HubSpot, and advanced analytics platforms',
  ],
}

export const metadata = generateMetadata(
  'About | Richard Hudson',
  'Learn more about Richard Hudson, a revenue operations consultant with expertise in business optimization and growth strategies.',
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
