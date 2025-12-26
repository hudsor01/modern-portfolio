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
import type { STARData } from '@/components/projects/star-area-chart'
import { createContextLogger } from '@/lib/monitoring/logger'
import { LRUCache } from 'lru-cache'

const projectLogger = createContextLogger('ProjectDataManager')

// Master project data - server-side only
const MASTER_PROJECT_DATA: (Project & { starData?: STARData })[] = [
  {
    id: 'partnership-program-implementation',
    slug: 'partnership-program-implementation',
    title: 'Enterprise Partnership Program Implementation',
    description:
      'Led comprehensive design and implementation of a company\'s first partnership program, creating automated partner onboarding, commission tracking, and performance analytics. Built production-ready integrations with CRM, billing systems, and partner portals, resulting in a highly successful channel program that became integral to company revenue strategy.',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&h=800&fit=crop&crop=center&q=85',
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
    starData: {
      situation: { phase: 'Situation', impact: 20, efficiency: 15, value: 10 },
      task: { phase: 'Task', impact: 45, efficiency: 40, value: 35 },
      action: { phase: 'Action', impact: 75, efficiency: 80, value: 70 },
      result: { phase: 'Result', impact: 95, efficiency: 98, value: 92 },
    },
    featured: true,
    viewCount: 0,
    clickCount: 0,
    createdAt: new Date('2024-05-01'),
    updatedAt: new Date('2024-05-15'),
  },
  {
    id: 'commission-optimization',
    slug: 'commission-optimization',
    title: 'Commission & Incentive Optimization System',
    description:
      'Advanced commission management and partner incentive optimization platform managing $254K+ commission structures with automated tier adjustments, 23% commission rate optimization, and ROI-driven compensation strategy delivering 34% performance improvement and 87.5% automation efficiency.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop&crop=center&q=85',
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
    starData: {
      situation: { phase: 'Situation', impact: 25, efficiency: 20, value: 15 },
      task: { phase: 'Task', impact: 50, efficiency: 45, value: 40 },
      action: { phase: 'Action', impact: 80, efficiency: 85, value: 75 },
      result: { phase: 'Result', impact: 98, efficiency: 95, value: 94 },
    },
    featured: true,
    viewCount: 0,
    clickCount: 0,
    createdAt: new Date('2024-04-05'),
    updatedAt: new Date('2024-04-08'),
  },
  {
    id: 'multi-channel-attribution',
    slug: 'multi-channel-attribution',
    title: 'Multi-Channel Attribution Analytics Dashboard',
    description:
      'Advanced marketing attribution analytics platform using machine learning models to track customer journeys across 12+ touchpoints. Delivering 92.4% attribution accuracy and $2.3M ROI optimization through data-driven attribution modeling and cross-channel insights.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop&crop=center&q=85',
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
    starData: {
      situation: { phase: 'Situation', impact: 18, efficiency: 22, value: 20 },
      task: { phase: 'Task', impact: 42, efficiency: 48, value: 45 },
      action: { phase: 'Action', impact: 78, efficiency: 82, value: 80 },
      result: { phase: 'Result', impact: 92, efficiency: 96, value: 94 },
    },
    featured: true,
    viewCount: 0,
    clickCount: 0,
    createdAt: new Date('2024-03-30'),
    updatedAt: new Date('2024-04-01'),
  },
  {
    id: 'revenue-operations-center',
    slug: 'revenue-operations-center',
    title: 'Revenue Operations Command Center',
    description:
      'Comprehensive revenue operations dashboard consolidating pipeline health, forecasting accuracy, partner performance, and operational KPIs. Real-time insights with 96.8% forecast accuracy and 89.7% operational efficiency across sales, marketing, and partner channels.',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&h=800&fit=crop&crop=center&q=85',
    link: 'https://demo.revopscommand.example.com',
    github: 'https://github.com/hudsonr01/revenue-operations-center',
    category: 'Revenue Operations',
    tags: [
      'Revenue Operations',
      'Operations Dashboard',
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
    starData: {
      situation: { phase: 'Situation', impact: 22, efficiency: 18, value: 20 },
      task: { phase: 'Task', impact: 48, efficiency: 50, value: 48 },
      action: { phase: 'Action', impact: 82, efficiency: 85, value: 80 },
      result: { phase: 'Result', impact: 97, efficiency: 98, value: 95 },
    },
    featured: true,
    viewCount: 0,
    clickCount: 0,
    createdAt: new Date('2024-03-28'),
    updatedAt: new Date('2024-03-30'),
  },
  {
    id: 'customer-lifetime-value',
    slug: 'customer-lifetime-value',
    title: 'Customer Lifetime Value Predictive Analytics Dashboard',
    description:
      'Advanced CLV analytics platform leveraging BTYD (Buy Till You Die) predictive modeling framework. Achieving 94.3% prediction accuracy through machine learning algorithms and real-time customer behavior tracking across 5 distinct customer segments.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=800&fit=crop&crop=center&q=85',
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
    starData: {
      situation: { phase: 'Situation', impact: 15, efficiency: 25, value: 18 },
      task: { phase: 'Task', impact: 40, efficiency: 52, value: 45 },
      action: { phase: 'Action', impact: 75, efficiency: 88, value: 78 },
      result: { phase: 'Result', impact: 94, efficiency: 97, value: 96 },
    },
    featured: true,
    viewCount: 0,
    clickCount: 0,
    createdAt: new Date('2024-03-25'),
    updatedAt: new Date('2024-03-28'),
  },
  {
    id: 'partner-performance',
    slug: 'partner-performance',
    title: 'Partner Performance Intelligence Dashboard',
    description:
      'Strategic channel analytics and partner ROI intelligence demonstrating 83.2% win rate across multi-tier partner ecosystem. Real-time performance tracking following industry-standard 80/20 partner revenue distribution.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=800&fit=crop&crop=center&q=85',
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
    starData: {
      situation: { phase: 'Situation', impact: 20, efficiency: 15, value: 18 },
      task: { phase: 'Task', impact: 45, efficiency: 42, value: 44 },
      action: { phase: 'Action', impact: 77, efficiency: 80, value: 78 },
      result: { phase: 'Result', impact: 93, efficiency: 95, value: 94 },
    },
    featured: true,
    viewCount: 0,
    clickCount: 0,
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date('2024-03-25'),
  },
  {
    id: 'cac-unit-economics',
    slug: 'cac-unit-economics',
    title: 'Customer Acquisition Cost Optimization & Unit Economics Dashboard',
    description:
      'Comprehensive CAC analysis and LTV:CAC ratio optimization achieving 32% cost reduction through strategic partner channel optimization. Industry-benchmark 3.6:1 efficiency ratio with 8.4-month payback period across multi-tier SaaS products.',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=800&fit=crop&crop=center&q=85',
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
    starData: {
      situation: { phase: 'Situation', impact: 28, efficiency: 22, value: 25 },
      task: { phase: 'Task', impact: 52, efficiency: 48, value: 50 },
      action: { phase: 'Action', impact: 84, efficiency: 82, value: 83 },
      result: { phase: 'Result', impact: 96, efficiency: 94, value: 95 },
    },
    featured: true,
    viewCount: 0,
    clickCount: 0,
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-25'),
  },
  {
    id: 'churn-retention',
    slug: 'churn-retention',
    title: 'Customer Churn & Retention Analytics',
    description:
      'A sophisticated analytics platform that helps businesses understand and reduce customer churn while improving retention rates through predictive modeling and actionable insights.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop&crop=center&q=85',
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
    starData: {
      situation: { phase: 'Situation', impact: 30, efficiency: 25, value: 28 },
      task: { phase: 'Task', impact: 55, efficiency: 50, value: 52 },
      action: { phase: 'Action', impact: 85, efficiency: 88, value: 86 },
      result: { phase: 'Result', impact: 96, efficiency: 97, value: 96 },
    },
    featured: true,
    viewCount: 0,
    clickCount: 0,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-03-10'),
  },
  {
    id: 'deal-funnel',
    slug: 'deal-funnel',
    title: 'Sales Pipeline Funnel Analytics',
    description:
      'A comprehensive sales pipeline visualization tool that tracks conversion rates across different stages of the sales process, helping sales teams identify bottlenecks and optimize their approach.',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&h=800&fit=crop&crop=center&q=85',
    link: 'https://demo.salesfunnel.example.com',
    github: 'https://github.com/hudsonr01/deal-funnel',
    category: 'Sales',
    tags: ['React', 'TypeScript', 'Recharts', 'Tailwind CSS', 'Next.js', 'Redux'],
    starData: {
      situation: { phase: 'Situation', impact: 25, efficiency: 20, value: 22 },
      task: { phase: 'Task', impact: 48, efficiency: 45, value: 46 },
      action: { phase: 'Action', impact: 80, efficiency: 82, value: 81 },
      result: { phase: 'Result', impact: 94, efficiency: 95, value: 94 },
    },
    featured: true,
    viewCount: 0,
    clickCount: 0,
    createdAt: new Date('2023-11-05'),
    updatedAt: new Date('2024-02-20'),
  },
  {
    id: 'lead-attribution',
    slug: 'lead-attribution',
    title: 'Lead Source Attribution Dashboard',
    description:
      'An interactive dashboard for tracking and analyzing lead sources to optimize marketing spend and improve ROI. Visualizes lead attribution data with interactive charts.',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&h=800&fit=crop&crop=center&q=85',
    link: 'https://demo.leadattribution.example.com',
    github: 'https://github.com/hudsonr01/lead-attribution',
    category: 'Marketing',
    tags: ['React', 'TypeScript', 'Recharts', 'Tailwind CSS', 'Next.js'],
    starData: {
      situation: { phase: 'Situation', impact: 18, efficiency: 20, value: 19 },
      task: { phase: 'Task', impact: 42, efficiency: 45, value: 43 },
      action: { phase: 'Action', impact: 76, efficiency: 78, value: 77 },
      result: { phase: 'Result', impact: 90, efficiency: 92, value: 91 },
    },
    featured: true,
    viewCount: 0,
    clickCount: 0,
    createdAt: new Date('2023-09-18'),
    updatedAt: new Date('2024-02-05'),
  },
  {
    id: 'revenue-kpi',
    slug: 'revenue-kpi',
    title: 'Revenue KPI Dashboard',
    description:
      'A comprehensive dashboard that provides a complete view of revenue metrics and KPIs, allowing business leaders to monitor performance, identify trends, and make data-driven decisions.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop&crop=center&q=85',
    link: 'https://demo.revenuekpi.example.com',
    github: 'https://github.com/hudsonr01/revenue-kpi',
    category: 'Finance',
    tags: ['React', 'TypeScript', 'Recharts', 'Tailwind CSS', 'Next.js', 'GraphQL', 'REST API'],
    starData: {
      situation: { phase: 'Situation', impact: 22, efficiency: 18, value: 20 },
      task: { phase: 'Task', impact: 46, efficiency: 48, value: 47 },
      action: { phase: 'Action', impact: 82, efficiency: 84, value: 83 },
      result: { phase: 'Result', impact: 95, efficiency: 97, value: 96 },
    },
    featured: true,
    viewCount: 0,
    clickCount: 0,
    createdAt: new Date('2023-07-25'),
    updatedAt: new Date('2024-01-30'),
  },
]

// Server-side only cache with LRU eviction and memory limits
interface CacheEntry<T> {
  data: T
  ttl: number
}

class ServerProjectCache {
  // LRU cache with 100 max entries and 50MB max memory
  private cache = new LRUCache<string, CacheEntry<unknown>>({
    max: 100, // Maximum 100 cached items
    maxSize: 50 * 1024 * 1024, // 50MB max memory
    sizeCalculation: (value) => {
      // Estimate size of cached data
      return JSON.stringify(value).length * 2 // UTF-16 chars = 2 bytes
    },
    ttl: 10 * 60 * 1000, // Default 10 minute TTL
    updateAgeOnGet: true, // Reset TTL on access
  })
  private static instance: ServerProjectCache

  static getInstance(): ServerProjectCache {
    if (!ServerProjectCache.instance) {
      ServerProjectCache.instance = new ServerProjectCache()
    }
    return ServerProjectCache.instance
  }

  set<T>(key: string, data: T, ttlMs: number = 5 * 60 * 1000): void {
    this.cache.set(key, { data, ttl: ttlMs }, { ttl: ttlMs })
  }

  get<T>(key: string): T | null {
    const cached = this.cache.get(key)
    if (!cached) return null
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

  // Get cache statistics for monitoring
  getStats(): { size: number; calculatedSize: number; max: number; maxSize: number } {
    return {
      size: this.cache.size,
      calculatedSize: this.cache.calculatedSize,
      max: this.cache.max,
      maxSize: this.cache.maxSize,
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
        projectLogger.warn('Project validation errors', { errors: validation.errors })
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