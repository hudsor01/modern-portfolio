import { useMemo } from 'react'

export interface Skill {
  name: string
  level: number
  years: number
}

export interface SkillCategory {
  category: string
  icon: string
  description: string
  skills: Skill[]
}

export interface ExperienceStat {
  label: string
  value: string
  icon: string
}

export interface PersonalInfo {
  name: string
  title: string
  location: string
  email: string
  bio: string
  highlights: string[]
}

export interface Certification {
  name: string
  issuer: string
  badge: string
  description: string
  skills: string[]
}

export interface AboutData {
  personalInfo: PersonalInfo
  skills: SkillCategory[]
  experienceStats: ExperienceStat[]
  certifications: Certification[]
}

export function useAboutData(): AboutData {
  return useMemo(() => ({
    personalInfo: {
      name: 'Richard Hudson',
      title: 'Revenue Operations Professional',
      location: 'Austin, TX',
      email: 'richard@example.com',
      bio: 'Passionate Revenue Operations professional with 8+ years of experience driving $4.8M+ in revenue growth through data-driven strategies, process optimization, and cross-functional collaboration.',
      highlights: [
        'Revenue Growth Expert',
        'Process Optimization',
        'Data Analytics',
        'Team Leadership',
        'Strategic Planning'
      ]
    },
    skills: [
      {
        category: 'Revenue Analytics',
        icon: '📊',
        description: 'Advanced analytics and business intelligence',
        skills: [
          { name: 'SQL & Database Management', level: 95, years: 8 },
          { name: 'Tableau & Power BI', level: 90, years: 6 },
          { name: 'Python for Analytics', level: 85, years: 4 },
          { name: 'Statistical Analysis', level: 88, years: 7 }
        ]
      },
      {
        category: 'Operations & Automation',
        icon: '⚙️',
        description: 'Process optimization and workflow automation',
        skills: [
          { name: 'CRM Management (Salesforce)', level: 92, years: 7 },
          { name: 'Marketing Automation', level: 86, years: 5 },
          { name: 'Workflow Design', level: 90, years: 6 },
          { name: 'Integration Development', level: 80, years: 4 }
        ]
      },
      {
        category: 'Strategic Leadership',
        icon: '🎯',
        description: 'Strategic planning and team leadership',
        skills: [
          { name: 'Cross-functional Leadership', level: 93, years: 8 },
          { name: 'Strategic Planning', level: 89, years: 6 },
          { name: 'Project Management', level: 91, years: 7 },
          { name: 'Stakeholder Management', level: 87, years: 8 }
        ]
      }
    ],
    experienceStats: [
      {
        label: 'Revenue Generated',
        value: '$4.8M+',
        icon: 'trending-up'
      },
      {
        label: 'Growth Rate',
        value: '432%',
        icon: 'star'
      },
      {
        label: 'Years Experience',
        value: '8+',
        icon: 'briefcase'
      },
      {
        label: 'Network Expansion',
        value: '2,217%',
        icon: 'clock'
      }
    ],
    certifications: [
      {
        name: 'Salesforce Certified Administrator',
        issuer: 'Salesforce',
        badge: '🏆',
        description: 'Certified in Salesforce platform administration, customization, and user management.',
        skills: ['CRM Management', 'Process Automation', 'Data Management', 'User Training']
      },
      {
        name: 'Google Analytics Certified',
        issuer: 'Google',
        badge: '📈',
        description: 'Advanced certification in web analytics, conversion tracking, and digital marketing measurement.',
        skills: ['Web Analytics', 'Conversion Optimization', 'Digital Marketing', 'Reporting']
      },
      {
        name: 'HubSpot Revenue Operations',
        issuer: 'HubSpot Academy',
        badge: '🚀',
        description: 'Specialized certification in revenue operations strategy, alignment, and optimization.',
        skills: ['Revenue Operations', 'Sales Enablement', 'Marketing Alignment', 'Process Design']
      },
      {
        name: 'Tableau Desktop Specialist',
        issuer: 'Tableau',
        badge: '📊',
        description: 'Certification in advanced data visualization, dashboard creation, and business intelligence.',
        skills: ['Data Visualization', 'Dashboard Design', 'Business Intelligence', 'Analytics']
      }
    ]
  }), [])
}