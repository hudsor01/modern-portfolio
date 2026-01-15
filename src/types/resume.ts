/**
 * Static resume data for portfolio
 */

export interface WorkExperience {
  title: string
  company: string
  location: string
  startDate: string
  endDate: string | null
  descriptions: string[]
}

export interface ResumeEducation {
  degree: string
  institution: string
  location: string
  startDate: string
  endDate: string
  description: string | null
}

export interface ResumeSkillCategory {
  category: string
  items: string[]
}

export interface ResumeCertification {
  name: string
  issuer: string
  date: string
  url?: string
}

export interface ResumeData {
  name: string
  title: string
  email: string
  phone: string
  location: string
  summary: string
  workExperience: WorkExperience[]
  education: ResumeEducation[]
  skills: ResumeSkillCategory[]
  certifications: ResumeCertification[]
}

export const resume: ResumeData = {
  name: 'Richard Hudson',
  title: 'Revenue Operations & Process Optimization Specialist',
  email: 'hello@richardwhudsonjr.com',
  phone: '',
  location: 'Plano, Texas',
  summary:
    'Results-driven Revenue Operations Consultant with over 8 years of experience optimizing revenue processes and driving operational excellence. Expertise in implementing Salesforce and PartnerStack to enhance partner programs, boost efficiency, and increase profitability.',

  workExperience: [
    {
      title: 'Revenue Operations Manager',
      company: 'Thryv',
      location: 'Dallas, TX',
      startDate: '2020-01',
      endDate: null,
      descriptions: [
        'Led implementation of Salesforce Partner Portal resulting in 40% reduction in partner onboarding time.',
        'Developed automated reporting dashboards that increased visibility into partner performance by 85%.',
        'Implemented streamlined commission calculation process reducing errors by 95% and saving 20 hours/month.',
        'Created comprehensive partner success metrics framework increasing retention by 25%.',
      ],
    },
    {
      title: 'Channel Partner Specialist',
      company: 'Thryv',
      location: 'Dallas, TX',
      startDate: '2018-03',
      endDate: '2019-12',
      descriptions: [
        'Managed relationships with 50+ channel partners, increasing average partner revenue by 32%.',
        'Developed partner onboarding materials and training programs.',
        'Created performance analytics tools improving data-driven decision making.',
        'Optimized partner commission structures leading to 28% increase in partner sales activity.',
      ],
    },
    {
      title: 'Digital Marketing Analyst',
      company: 'MarketStrat Group',
      location: 'Austin, TX',
      startDate: '2016-06',
      endDate: '2018-03',
      descriptions: [
        'Developed and implemented digital marketing campaigns for B2B clients.',
        'Created comprehensive performance reports and ROI analysis.',
        'Conducted market research to identify new business opportunities.',
        'Optimized lead generation processes resulting in 40% increase in qualified leads.',
      ],
    },
  ],

  education: [
    {
      degree: 'Bachelor of Business Administration (BBA)',
      institution: 'The University of Texas at Dallas',
      location: 'Richardson, TX',
      startDate: '2012-09',
      endDate: '2016-05',
      description: 'Concentration in Marketing and Business Analytics. Graduated with honors.',
    },
  ],

  skills: [
    {
      category: 'Revenue Operations',
      items: [
        'Salesforce Administration',
        'Partner Relationship Management',
        'Sales Pipeline Optimization',
        'Commission Structure Design',
        'Sales & Marketing Alignment',
      ],
    },
    {
      category: 'Data Analysis',
      items: [
        'Business Intelligence Reporting',
        'KPI Development',
        'Excel & Google Sheets Advanced',
        'Data Visualization',
        'Python for Data Analysis',
      ],
    },
    {
      category: 'Partner Management',
      items: [
        'Channel Partner Programs',
        'Partner Onboarding',
        'Training & Development',
        'Performance Tracking',
        'Relationship Building',
      ],
    },
    {
      category: 'Technical Skills',
      items: [
        'Salesforce & CRM Systems',
        'Business Intelligence Tools',
        'SQL & Database Management',
        'Python & Data Analysis Libraries',
        'PartnerStack Implementation',
      ],
    },
  ],

  certifications: [
    {
      name: 'Salesforce Certified Administrator',
      issuer: 'Salesforce',
      date: '2021-06',
      url: 'https://trailblazer.me/id/rhudson01',
    },
    {
      name: 'Revenue Operations Certification',
      issuer: 'HubSpot Academy',
      date: '2020-08',
      url: 'https://app.hubspot.com/academy/achievements',
    },
    {
      name: 'Data Analysis Professional',
      issuer: 'Google',
      date: '2019-11',
      url: 'https://www.coursera.org/professional-certificates/google-data-analytics',
    },
  ],
}

/**
 * Helper function to get resume data
 */
export function getResumeData(): ResumeData {
  return resume
}
