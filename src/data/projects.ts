// Consolidated project data - single source of truth
// This file replaces the previous fragmented data sources

import { Project, ProjectsResponse } from '@/types/project'

// Cache projects to avoid reading from disk on every request
let projectsCache: Project[] | null = null

export async function getProjects(): Promise<Project[]> {
  if (projectsCache) return projectsCache

  // Use static project data
  const validProjects = projects.sort((a, b) => {
    const aDate = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt || 0).getTime();
    const bDate = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt || 0).getTime();
    return bDate - aDate;
  })

  projectsCache = validProjects
  return validProjects
}

export async function getProjectsWithFilters(): Promise<ProjectsResponse> {
  const projects = await getProjects()

  const categories = projects.reduce<Record<string, number>>((acc, project) => {
    const category = project.category || 'uncategorized'
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {})

  const filters = Object.entries(categories).map(([category, count]) => ({
    category,
    count,
  }))

  return {
    projects,
    filters,
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  // Find project from static data
  const project = projects.find(p => p.slug === slug || p.id === slug)
  return project || null
}

/**
 * Get a specific project by its slug from the cached project list
 */
export function getProjectById(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}

// Master project data - consolidated from all previous sources
const projects: Project[] = [
  {
    id: 'partnership-program-implementation',
    slug: 'partnership-program-implementation',
    title: 'Enterprise Partnership Program Implementation',
    description:
      'Led comprehensive design and implementation of a company\'s first partnership program, creating automated partner onboarding, commission tracking, and performance analytics. Built production-ready integrations with CRM, billing systems, and partner portals, resulting in a highly successful channel program that became integral to company revenue strategy.',
    image: '/images/projects/partnership-program.jpg',
    link: 'https://demo.partnershipprogram.example.com',
    github: 'https://github.com/hudsonr01/partnership-program',
    category: 'Revenue Operations',
    tags: [
      'Partnership Program',
      'Channel Operations',
      'Partner Onboarding',
      'Commission Automation',
      'CRM Integration',
      'Production Implementation',
      'Revenue Channel Development',
      'Partner Analytics',
      'Process Automation',
      'Salesforce Integration',
      'React',
      'TypeScript',
    ],
    featured: true,
    createdAt: new Date('2024-05-01'),
    updatedAt: new Date('2024-05-15'),
  },
  {
    id: 'commission-optimization',
    slug: 'commission-optimization',
    title: 'Commission & Incentive Optimization System',
    description:
      'Advanced commission management and partner incentive optimization platform managing $254K+ commission structures with automated tier adjustments, 23% commission rate optimization, and ROI-driven compensation strategy delivering 34% performance improvement and 87.5% automation efficiency.',
    image: '/images/projects/commission-dashboard.jpg',
    link: 'https://demo.commissionoptimization.example.com',
    github: 'https://github.com/hudsonr01/commission-optimization',
    category: 'Revenue Operations',
    tags: [
      'Commission Management',
      'Incentive Optimization',
      'Partner Compensation',
      'Performance Analytics',
      'Commission Structure',
      'ROI Optimization',
      'Revenue Operations',
      'Automation Efficiency',
      'React',
      'TypeScript',
      'Recharts',
    ],
    featured: true,
    createdAt: new Date('2024-04-05'),
    updatedAt: new Date('2024-04-08'),
  },
  {
    id: 'multi-channel-attribution',
    slug: 'multi-channel-attribution',
    title: 'Multi-Channel Attribution Analytics Dashboard',
    description:
      'Advanced marketing attribution analytics platform using machine learning models to track customer journeys across 12+ touchpoints. Delivering 92.4% attribution accuracy and $2.3M ROI optimization through data-driven attribution modeling and cross-channel insights.',
    image: '/images/projects/lead-attribution.jpg',
    link: 'https://demo.attribution.example.com',
    github: 'https://github.com/hudsonr01/multi-channel-attribution',
    category: 'Marketing',
    tags: [
      'Multi-Channel Attribution',
      'Marketing Analytics',
      'Customer Journey',
      'Attribution Modeling',
      'Marketing ROI',
      'Touchpoint Analysis',
      'Marketing Mix',
      'Machine Learning',
      'React',
      'TypeScript',
      'Recharts',
    ],
    featured: true,
    createdAt: new Date('2024-03-30'),
    updatedAt: new Date('2024-04-01'),
  },
  {
    id: 'revenue-operations-center',
    slug: 'revenue-operations-center',
    title: 'Revenue Operations Command Center',
    description:
      'Comprehensive executive revenue operations dashboard consolidating pipeline health, forecasting accuracy, partner performance, and operational KPIs. Real-time insights with 96.8% forecast accuracy and 89.7% operational efficiency across sales, marketing, and partner channels.',
    image: '/images/projects/revenue-operations.jpg',
    link: 'https://demo.revopscommand.example.com',
    github: 'https://github.com/hudsonr01/revenue-operations-center',
    category: 'Revenue Operations',
    tags: [
      'Revenue Operations',
      'Executive Dashboard',
      'Pipeline Analytics',
      'Revenue Forecasting',
      'Sales Operations',
      'Business Intelligence',
      'Real-time Analytics',
      'Operational KPIs',
      'React',
      'TypeScript',
      'Recharts',
    ],
    featured: true,
    createdAt: new Date('2024-03-28'),
    updatedAt: new Date('2024-03-30'),
  },
  {
    id: 'customer-lifetime-value',
    slug: 'customer-lifetime-value',
    title: 'Customer Lifetime Value Predictive Analytics Dashboard',
    description:
      'Advanced CLV analytics platform leveraging BTYD (Buy Till You Die) predictive modeling framework. Achieving 94.3% prediction accuracy through machine learning algorithms and real-time customer behavior tracking across 5 distinct customer segments.',
    image: '/images/projects/customer-analytics.jpg',
    link: 'https://demo.clvanalytics.example.com',
    github: 'https://github.com/hudsonr01/customer-lifetime-value',
    category: 'Revenue Operations',
    tags: [
      'Customer Lifetime Value',
      'Predictive Analytics',
      'CLV Dashboard',
      'Machine Learning',
      'BTYD Model',
      'Customer Segmentation',
      'Revenue Forecasting',
      'Behavioral Analytics',
      'React',
      'TypeScript',
      'Recharts',
    ],
    featured: true,
    createdAt: new Date('2024-03-25'),
    updatedAt: new Date('2024-03-28'),
  },
  {
    id: 'partner-performance',
    slug: 'partner-performance',
    title: 'Partner Performance Intelligence Dashboard',
    description:
      'Strategic channel analytics and partner ROI intelligence demonstrating 83.2% win rate across multi-tier partner ecosystem. Real-time performance tracking following industry-standard 80/20 partner revenue distribution.',
    image: '/images/projects/partner-intelligence.jpg',
    link: 'https://demo.partnerintelligence.example.com',
    github: 'https://github.com/hudsonr01/partner-performance',
    category: 'Revenue Operations',
    tags: [
      'Partner Performance Intelligence',
      'Channel Analytics Dashboard',
      'Revenue Operations KPIs',
      'Partner ROI Metrics',
      'SaaS Quick Ratio',
      'Channel Management',
      'Business Intelligence',
      'Pareto Analysis',
      'React',
      'TypeScript',
      'Recharts',
    ],
    featured: true,
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date('2024-03-25'),
  },
  {
    id: 'cac-unit-economics',
    slug: 'cac-unit-economics',
    title: 'Customer Acquisition Cost Optimization & Unit Economics Dashboard',
    description:
      'Comprehensive CAC analysis and LTV:CAC ratio optimization achieving 32% cost reduction through strategic partner channel optimization. Industry-benchmark 3.6:1 efficiency ratio with 8.4-month payback period across multi-tier SaaS products.',
    image: '/images/projects/cac-analytics.jpg',
    link: 'https://demo.cacanalytics.example.com',
    github: 'https://github.com/hudsonr01/cac-unit-economics',
    category: 'Revenue Operations',
    tags: [
      'CAC Optimization',
      'LTV:CAC Ratio',
      'Unit Economics',
      'Partner ROI',
      'SaaS Metrics',
      'Revenue Operations',
      'Business Intelligence',
      'Payback Period',
      'React',
      'TypeScript',
      'Recharts',
    ],
    featured: true,
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-25'),
  },
  {
    id: 'churn-retention',
    slug: 'churn-retention',
    title: 'Customer Churn & Retention Analytics',
    description:
      'A sophisticated analytics platform that helps businesses understand and reduce customer churn while improving retention rates through predictive modeling and actionable insights.',
    image: '/images/projects/churn-retention.jpg',
    link: 'https://demo.churnanalytics.example.com',
    github: 'https://github.com/hudsonr01/churn-retention',
    category: 'Analytics',
    tags: [
      'React',
      'TypeScript',
      'Recharts',
      'Tailwind CSS',
      'Next.js',
      'Machine Learning',
      'Python',
      'FastAPI',
    ],
    featured: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-03-10'),
  },
  {
    id: 'deal-funnel',
    slug: 'deal-funnel',
    title: 'Sales Pipeline Funnel Analytics',
    description:
      'A comprehensive sales pipeline visualization tool that tracks conversion rates across different stages of the sales process, helping sales teams identify bottlenecks and optimize their approach.',
    image: '/images/projects/deal-funnel.jpg',
    link: 'https://demo.salesfunnel.example.com',
    github: 'https://github.com/hudsonr01/deal-funnel',
    category: 'Sales',
    tags: ['React', 'TypeScript', 'Recharts', 'Tailwind CSS', 'Next.js', 'Redux'],
    featured: true,
    createdAt: new Date('2023-11-05'),
    updatedAt: new Date('2024-02-20'),
  },
  {
    id: 'lead-attribution',
    slug: 'lead-attribution',
    title: 'Lead Source Attribution Dashboard',
    description:
      'An interactive dashboard for tracking and analyzing lead sources to optimize marketing spend and improve ROI. Visualizes lead attribution data with interactive charts.',
    image: '/images/projects/multi-channel.jpg',
    link: 'https://demo.leadattribution.example.com',
    github: 'https://github.com/hudsonr01/lead-attribution',
    category: 'Marketing',
    tags: ['React', 'TypeScript', 'Recharts', 'Tailwind CSS', 'Next.js'],
    featured: true,
    createdAt: new Date('2023-09-18'),
    updatedAt: new Date('2024-02-05'),
  },
  {
    id: 'revenue-kpi',
    slug: 'revenue-kpi',
    title: 'Revenue KPI Dashboard',
    description:
      'An executive dashboard that provides a comprehensive view of revenue metrics and KPIs, allowing business leaders to monitor performance, identify trends, and make data-driven decisions.',
    image: '/images/projects/business-intelligence.jpg',
    link: 'https://demo.revenuekpi.example.com',
    github: 'https://github.com/hudsonr01/revenue-kpi',
    category: 'Finance',
    tags: ['React', 'TypeScript', 'Recharts', 'Tailwind CSS', 'Next.js', 'GraphQL', 'REST API'],
    featured: true,
    createdAt: new Date('2023-07-25'),
    updatedAt: new Date('2024-01-30'),
  },
]

// Alias for backward compatibility
export const getProject = getProjectBySlug

export { projects }