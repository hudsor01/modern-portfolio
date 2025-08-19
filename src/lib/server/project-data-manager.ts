/**
 * Server-Side Project Data Manager
 * Handles all project data operations on the server with secure caching
 */

import { Project, ProjectsResponse, ProjectFilter } from '@/types/project'
import { 
  validateProjectsResponse,
  safeValidateProjectsArray,
  sanitizeProjectForAPI,
  type ValidatedProject 
} from '@/lib/validations/project-schema'

// Master project data - server-side only
const MASTER_PROJECT_DATA: Project[] = [
  {
    id: 'partnership-program-implementation',
    slug: 'partnership-program-implementation',
    title: 'Enterprise Partnership Program Implementation',
    description:
      'Led comprehensive design and implementation of a company\'s first partnership program, creating automated partner onboarding, commission tracking, and performance analytics. Built production-ready integrations with CRM, billing systems, and partner portals, resulting in a highly successful channel program that became integral to company revenue strategy.',
    image: '/images/projects/partner-analytics.jpg',
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
    image: '/images/projects/multi-channel.jpg',
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
    image: '/images/projects/lead-attribution.jpg',
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
    image: '/images/projects/revenue-kpi.jpg',
    link: 'https://demo.revenuekpi.example.com',
    github: 'https://github.com/hudsonr01/revenue-kpi',
    category: 'Finance',
    tags: ['React', 'TypeScript', 'Recharts', 'Tailwind CSS', 'Next.js', 'GraphQL', 'REST API'],
    featured: true,
    createdAt: new Date('2023-07-25'),
    updatedAt: new Date('2024-01-30'),
  },
]

// Server-side only cache (not accessible from client)
class ServerProjectCache {
  private cache = new Map<string, { data: unknown; timestamp: number; ttl: number }>()
  private static instance: ServerProjectCache

  static getInstance(): ServerProjectCache {
    if (!ServerProjectCache.instance) {
      ServerProjectCache.instance = new ServerProjectCache()
    }
    return ServerProjectCache.instance
  }

  set<T>(key: string, data: T, ttlMs: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    })
  }

  get<T>(key: string): T | null {
    const cached = this.cache.get(key)
    if (!cached) return null

    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key)
      return null
    }

    return cached.data as T
  }

  clear(): void {
    this.cache.clear()
  }

  invalidate(pattern?: string): void {
    if (!pattern) {
      this.clear()
      return
    }

    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key)
      }
    }
  }
}

const serverCache = ServerProjectCache.getInstance()

/**
 * Server-Side Project Data Manager
 * All data operations secured on the server
 */
export class ProjectDataManager {
  private static validatedProjects: ValidatedProject[] | null = null

  /**
   * Get all validated projects with server-side caching
   */
  static async getProjects(): Promise<Project[]> {
    const cacheKey = 'all-projects'
    const cached = serverCache.get<Project[]>(cacheKey)
    
    if (cached) {
      return cached
    }

    if (!this.validatedProjects) {
      // Validate and sanitize master data on server
      const validation = safeValidateProjectsArray(MASTER_PROJECT_DATA)
      
      if (!validation.success && validation.errors.length > 0) {
        console.warn('Project validation errors:', validation.errors)
      }

      this.validatedProjects = validation.data.map(sanitizeProjectForAPI)
    }

    const sortedProjects = this.validatedProjects.sort((a, b) => {
      const aDate = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt || 0).getTime()
      const bDate = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt || 0).getTime()
      return bDate - aDate
    })

    // Server-side cache for 5 minutes
    serverCache.set(cacheKey, sortedProjects, 5 * 60 * 1000)
    
    return sortedProjects
  }

  /**
   * Get projects with filters and metadata (server-side)
   */
  static async getProjectsWithFilters(): Promise<ProjectsResponse> {
    const cacheKey = 'projects-with-filters'
    const cached = serverCache.get<ProjectsResponse>(cacheKey)
    
    if (cached) {
      return cached
    }

    const projects = await this.getProjects()

    const categories = projects.reduce<Record<string, number>>((acc, project) => {
      const category = project.category || 'uncategorized'
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {})

    const filters: ProjectFilter[] = Object.entries(categories).map(([category, count]) => ({
      category,
      count,
    }))

    const response: ProjectsResponse = {
      projects,
      filters,
      total: projects.length,
    }

    // Validate response on server
    const validatedResponse = validateProjectsResponse(response)
    
    // Server-side cache for 5 minutes
    serverCache.set(cacheKey, validatedResponse, 5 * 60 * 1000)

    return validatedResponse
  }

  /**
   * Get project by slug with server-side caching
   */
  static async getProjectBySlug(slug: string): Promise<Project | null> {
    const cacheKey = `project-${slug}`
    const cached = serverCache.get<Project>(cacheKey)
    
    if (cached) {
      return cached
    }

    const projects = await this.getProjects()
    const project = projects.find(p => p.slug === slug || p.id === slug)
    
    if (project) {
      // Cache individual projects for 10 minutes
      serverCache.set(cacheKey, project, 10 * 60 * 1000)
    }

    return project || null
  }

  /**
   * Get featured projects (server-side)
   */
  static async getFeaturedProjects(): Promise<Project[]> {
    const cacheKey = 'featured-projects'
    const cached = serverCache.get<Project[]>(cacheKey)
    
    if (cached) {
      return cached
    }

    const projects = await this.getProjects()
    const featured = projects.filter(p => p.featured)
    
    // Server-side cache for 10 minutes
    serverCache.set(cacheKey, featured, 10 * 60 * 1000)

    return featured
  }

  /**
   * Search projects by query (server-side processing)
   */
  static async searchProjects(query: string): Promise<Project[]> {
    const projects = await this.getProjects()
    const lowercaseQuery = query.toLowerCase()

    return projects.filter(project => 
      project.title.toLowerCase().includes(lowercaseQuery) ||
      project.description.toLowerCase().includes(lowercaseQuery) ||
      project.category?.toLowerCase().includes(lowercaseQuery) ||
      project.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    )
  }

  /**
   * Filter projects by category (server-side)
   */
  static async getProjectsByCategory(category: string): Promise<Project[]> {
    const cacheKey = `projects-category-${category}`
    const cached = serverCache.get<Project[]>(cacheKey)
    
    if (cached) {
      return cached
    }

    const projects = await this.getProjects()
    const filtered = projects.filter(p => p.category === category)
    
    // Server-side cache for 10 minutes
    serverCache.set(cacheKey, filtered, 10 * 60 * 1000)

    return filtered
  }

  /**
   * Get project statistics (server-side computation)
   */
  static async getProjectStats(): Promise<{
    total: number
    featured: number
    categories: Record<string, number>
    technologies: Record<string, number>
  }> {
    const cacheKey = 'project-stats'
    const cached = serverCache.get<{
      total: number
      featured: number
      categories: Record<string, number>
      technologies: Record<string, number>
    }>(cacheKey)
    
    if (cached) {
      return cached
    }

    const projects = await this.getProjects()
    
    const categories: Record<string, number> = {}
    const technologies: Record<string, number> = {}

    projects.forEach(project => {
      // Count categories
      if (project.category) {
        categories[project.category] = (categories[project.category] || 0) + 1
      }

      // Count technologies
      project.tags?.forEach(tag => {
        technologies[tag] = (technologies[tag] || 0) + 1
      })
    })

    const stats = {
      total: projects.length,
      featured: projects.filter(p => p.featured).length,
      categories,
      technologies,
    }

    // Server-side cache for 1 hour
    serverCache.set(cacheKey, stats, 60 * 60 * 1000)

    return stats
  }

  /**
   * Invalidate server cache
   */
  static invalidateCache(pattern?: string): void {
    serverCache.invalidate(pattern)
  }

  /**
   * Warm server cache with all data
   */
  static async warmCache(): Promise<void> {
    await Promise.all([
      this.getProjects(),
      this.getProjectsWithFilters(),
      this.getFeaturedProjects(),
      this.getProjectStats(),
    ])
  }
}