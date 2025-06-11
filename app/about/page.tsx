import React from 'react'
import { generateMetadata } from '@/app/shared-metadata'
import AboutContent from '@/components/about/about-content'

const SKILLS = [
  {
    category: 'Technical',
    skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Next.js', 'GraphQL', 'PostgreSQL'],
  },
  {
    category: 'Business',
    skills: [
      'Revenue Operations',
      'Strategic Planning',
      'Process Optimization',
      'Data Analysis',
      'Project Management',
      'Team Leadership',
    ],
  },
  {
    category: 'Tools',
    skills: [
      'Salesforce',
      'HubSpot',
      'Marketo',
      'Tableau',
      'Power BI',
      'Google Analytics',
      'Zapier',
    ],
  },
]

export const metadata = generateMetadata(
  'About | Richard Hudson',
  'Learn more about Richard Hudson, a revenue operations consultant with expertise in business optimization and growth strategies.',
  '/about'
)

export default function AboutPage() {
  return <AboutContent skills={SKILLS} />
}
