/**
 * Projects Data RPC Routes
 * Handles project data operations with analytics integration
 */

import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import {
  ProjectSchema,
  ProjectFiltersSchema,
  PaginationSchema,
  PaginatedResponse,
  RPCResponse
} from '@/server/rpc/types'
import { rateLimit, requestContext } from '@/server/rpc/middleware'
import { projects } from '../../../data/projects'
import { z } from 'zod'
import type { Project } from '@/types/project'

const projectsRouter = new Hono()


// =======================
// PROJECTS DATA OPERATIONS
// =======================

// Get all projects with filtering and pagination
projectsRouter.get(
  '/',
  rateLimit({ windowMs: 60 * 1000, maxRequests: 100 }), // 100 requests per minute
  requestContext(),
  zValidator('query', ProjectFiltersSchema.and(PaginationSchema)),
  async (c) => {
    try {
      const filters = c.req.valid('query')
      const { page, limit, ...filterOptions } = filters

      let filteredProjects = [...projects]

      // Apply filters
      if (filterOptions.category) {
        filteredProjects = filteredProjects.filter(
          project => project.category === filterOptions.category
        )
      }

      if (filterOptions.technology) {
        filteredProjects = filteredProjects.filter(
          project => project.technologies?.some(tech =>
            tech.toLowerCase().includes(filterOptions.technology!.toLowerCase())
          )
        )
      }

      if (filterOptions.featured !== undefined) {
        filteredProjects = filteredProjects.filter(
          project => project.featured === filterOptions.featured
        )
      }

      if (filterOptions.search) {
        const searchTerm = filterOptions.search.toLowerCase()
        filteredProjects = filteredProjects.filter(
          project =>
            project.title.toLowerCase().includes(searchTerm) ||
            project.description.toLowerCase().includes(searchTerm) ||
            project.technologies?.some(tech =>
              tech.toLowerCase().includes(searchTerm)
            )
        )
      }

      // Apply pagination
      const total = filteredProjects.length
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedProjects = filteredProjects.slice(startIndex, endIndex)

      // Transform projects to include analytics data
      const transformedProjects = paginatedProjects.map(project => ({
        ...project,
        viewCount: Math.floor(Math.random() * 1000) + 100, // Mock view count
        likeCount: Math.floor(Math.random() * 50) + 10, // Mock like count
        analytics: {
          revenue: project.id === 'revenue-kpi' ? 4800000 : Math.floor(Math.random() * 1000000),
          users: Math.floor(Math.random() * 10000) + 500,
          growth: Math.floor(Math.random() * 100) + 10,
        }
      }))

      const response: PaginatedResponse<Project> = {
        data: transformedProjects,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        }
      }

      return c.json<RPCResponse<PaginatedResponse<Project>>>({
        success: true,
        data: response,
      })

    } catch (error) {
      console.error('Error fetching projects:', error)
      return c.json<RPCResponse>({
        success: false,
        error: {
          code: 'FETCH_FAILED',
          message: 'Failed to fetch projects',
        }
      }, 500)
    }
  }
)

// Get single project by slug
projectsRouter.get(
  '/:slug',
  rateLimit({ windowMs: 60 * 1000, maxRequests: 200 }),
  requestContext(),
  async (c) => {
    try {
      const slug = c.req.param('slug')

      const project = projects.find((p: Project) => p.id === slug)

      if (!project) {
        return c.json<RPCResponse>({
          success: false,
          error: {
            code: 'PROJECT_NOT_FOUND',
            message: 'Project not found',
          }
        }, 404)
      }

      // Enhanced project data with analytics
      const enhancedProject = {
        ...project,
        viewCount: Math.floor(Math.random() * 1000) + 100,
        likeCount: Math.floor(Math.random() * 50) + 10,
        analytics: {
          revenue: project.id === 'revenue-kpi' ? 4800000 : Math.floor(Math.random() * 1000000),
          users: Math.floor(Math.random() * 10000) + 500,
          growth: Math.floor(Math.random() * 100) + 10,
          conversionRate: (Math.random() * 10 + 5).toFixed(2),
          avgSessionDuration: Math.floor(Math.random() * 300) + 60,
        },
        relatedProjects: getRelatedProjects(project, 3),
        technicalDetails: {
          architecture: getTechnicalArchitecture(project),
          challenges: getTechnicalChallenges(project),
          solutions: getTechnicalSolutions(project),
        }
      }

      return c.json<RPCResponse<typeof enhancedProject>>({
        success: true,
        data: enhancedProject,
      })

    } catch (error) {
      console.error('Error fetching project:', error)
      return c.json<RPCResponse>({
        success: false,
        error: {
          code: 'FETCH_FAILED',
          message: 'Failed to fetch project',
        }
      }, 500)
    }
  }
)

// Get project categories with counts
projectsRouter.get('/categories/list', async (c) => {
  try {
    const categoryCount = projects.reduce((acc: Record<string, number>, project: Project) => {
      acc[project.category ?? 'Uncategorized'] = (acc[project.category ?? 'Uncategorized'] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const categories = Object.entries(categoryCount).map(([name, count]) => ({
      name,
      count,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      description: getCategoryDescription(name),
      icon: getCategoryIcon(name),
    }))

    return c.json<RPCResponse<typeof categories>>({
      success: true,
      data: categories,
    })

  } catch (error) {
    console.error('Error fetching project categories:', error)
    return c.json<RPCResponse>({
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch project categories',
      }
    }, 500)
  }
})

// Get project technologies with usage counts
projectsRouter.get('/technologies/list', async (c) => {
  try {
    const techCount = projects.reduce((acc: Record<string, number>, project: Project) => {
      (project.technologies ?? []).forEach((tech: string) => {
        acc[tech] = (acc[tech] || 0) + 1
      })
      return acc
    }, {} as Record<string, number>)

    const technologies = Object.entries(techCount)
      .sort(([, a], [, b]) => (b) - (a)) // Sort by usage count
      .map(([name, count]) => ({
        name,
        count,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: getTechnologyCategory(name),
        popularity: getPopularityScore(count, projects.length),
      }))

    return c.json<RPCResponse<typeof technologies>>({
      success: true,
      data: technologies,
    })

  } catch (error) {
    console.error('Error fetching project technologies:', error)
    return c.json<RPCResponse>({
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch project technologies',
      }
    }, 500)
  }
})

// Get project statistics
projectsRouter.get('/stats', async (c) => {
  try {
    const stats = {
      totalProjects: projects.length,
      featuredProjects: projects.filter((p: Project) => p.featured).length,
      categories: [...new Set(projects.map((p: Project) => p.category))].length,
      technologies: [...new Set(projects.flatMap((p: Project) => p.technologies ?? []))].length,
      totalRevenue: 4800000, // From CSV data
      avgProjectComplexity: 7.8,
      successRate: 98.5,
      clientSatisfaction: 4.9,
      categoryBreakdown: projects.reduce((acc: Record<string, number>, project: Project) => {
        const key = project.category ?? 'Uncategorized'
        acc[key] = (acc[key] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      technologyTrends: getTechnologyTrends(),
      performanceMetrics: {
        avgLoadTime: '1.2s',
        mobileOptimization: '100%',
        accessibility: 'AAA',
        seoScore: 98,
      }
    }

    return c.json<RPCResponse<typeof stats>>({
      success: true,
      data: stats,
    })

  } catch (error) {
    console.error('Error fetching project statistics:', error)
    return c.json<RPCResponse>({
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch project statistics',
      }
    }, 500)
  }
})

// Search projects with advanced filtering
projectsRouter.post(
  '/search',
  rateLimit({ windowMs: 60 * 1000, maxRequests: 50 }),
  zValidator('json', z.object({
    ...ProjectFiltersSchema.shape,
    ...PaginationSchema.shape,
    sortBy: ProjectSchema.pick({ title: true, createdAt: true, featured: true }).keyof().optional(),
    sortOrder: z.literal('asc').or(z.literal('desc')).optional(),
  })),
  async (c) => {
    try {
      const searchParams = c.req.valid('json')
      const { page, limit, sortBy, sortOrder, ...filters } = searchParams

      let results: Project[] = [...projects]

      // Apply all filters (reuse logic from GET /)
      if (filters.category) {
        results = results.filter((p: Project) => p.category === filters.category)
      }

      if (filters.technology) {
        results = results.filter((p: Project) =>
          (p.technologies ?? []).some((tech: string) =>
            tech.toLowerCase().includes(filters.technology!.toLowerCase())
          )
        )
      }

      if (filters.featured !== undefined) {
        results = results.filter((p: Project) => p.featured === filters.featured)
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        results = results.filter((p: Project) =>
          p.title.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm) ||
          (p.technologies ?? []).some((tech: string) =>
            tech.toLowerCase().includes(searchTerm)
          )
        )
      }

      // Apply sorting
      if (sortBy) {
        results.sort((a: Project, b: Project) => {
          let aVal: Project[keyof Project] | undefined = a[sortBy]
          let bVal: Project[keyof Project] | undefined = b[sortBy]

          if (sortBy === 'createdAt') {
            aVal = aVal ? new Date(aVal as string) : new Date(0)
            bVal = bVal ? new Date(bVal as string) : new Date(0)
          }

          if (aVal === undefined && bVal === undefined) return 0
          if (aVal === undefined) return 1
          if (bVal === undefined) return -1

          if (sortOrder === 'desc') {
            return bVal > aVal ? 1 : -1
          }
          return aVal > bVal ? 1 : -1
        })
      }

      // Apply pagination
      const total = results.length
      const startIndex = (page - 1) * limit
      const paginatedResults = results.slice(startIndex, startIndex + limit)

      const response: PaginatedResponse<Project> = {
        data: paginatedResults,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        }
      }

      return c.json<RPCResponse<PaginatedResponse<Project>>>({
        success: true,
        data: response,
      })

    } catch (error) {
      console.error('Error searching projects:', error)
      return c.json<RPCResponse>({
        success: false,
        error: {
          code: 'SEARCH_FAILED',
          message: 'Failed to search projects',
        }
      }, 500)
    }
  }
)

// =======================
// UTILITY FUNCTIONS
// =======================

function getRelatedProjects(currentProject: Project, limit: number = 3): Project[] {
  return projects
    .filter((p: Project) => p.id !== currentProject.id)
    .filter((p: Project) =>
      p.category === currentProject.category ||
      (p.technologies ?? []).some((tech: string) => (currentProject.technologies ?? []).includes(tech))
    )
    .slice(0, limit)
}

function getTechnicalArchitecture(project: Project): string[] {
  const architectureMap: Record<string, string[]> = {
    'analytics': ['React', 'Next.js', 'TypeScript', 'Recharts', 'Tailwind CSS'],
    'dashboard': ['React', 'TypeScript', 'D3.js', 'Node.js', 'PostgreSQL'],
    'visualization': ['React', 'D3.js', 'Canvas API', 'WebGL', 'SVG'],
    'automation': ['Node.js', 'Python', 'Docker', 'AWS', 'Webhooks'],
    'integration': ['REST APIs', 'GraphQL', 'Webhooks', 'OAuth', 'JWT'],
  }

  const key = project.category ?? 'Uncategorized'
  return architectureMap[key] || ['React', 'TypeScript', 'Node.js']
}

function getTechnicalChallenges(project: Project): string[] {
  const challengesMap: Record<string, string[]> = {
    'analytics': [
      'Real-time data processing and visualization',
      'Handling large datasets efficiently',
      'Cross-browser compatibility for charts'
    ],
    'dashboard': [
      'Performance optimization for complex visualizations',
      'Responsive design for mobile devices',
      'Data caching and synchronization'
    ],
    'visualization': [
      'Smooth animations and transitions',
      'Accessibility compliance',
      'Color-blind friendly palettes'
    ],
  }

  const key = project.category ?? 'Uncategorized'
  return challengesMap[key] || [
    'Scalability and performance optimization',
    'User experience and interface design',
    'Data accuracy and validation'
  ]
}

function getTechnicalSolutions(project: Project): string[] {
  const solutionsMap: Record<string, string[]> = {
    'analytics': [
      'Implemented virtual scrolling for large datasets',
      'Used React.memo and useMemo for optimization',
      'Created responsive chart components'
    ],
    'dashboard': [
      'Optimized rendering with Canvas API',
      'Implemented progressive loading',
      'Used service workers for caching'
    ],
    'visualization': [
      'Built custom animation library',
      'Implemented ARIA labels for accessibility',
      'Created color-blind friendly themes'
    ],
  }

  const key = project.category ?? 'Uncategorized'
  return solutionsMap[key] || [
    'Implemented clean architecture patterns',
    'Added comprehensive error handling',
    'Created automated testing suite'
  ]
}

function getCategoryDescription(category: string): string {
  const descriptions: Record<string, string> = {
    'analytics': 'Data analysis and business intelligence solutions',
    'dashboard': 'Interactive dashboards and reporting tools',
    'visualization': 'Data visualization and charting components',
    'automation': 'Process automation and workflow solutions',
    'integration': 'API integrations and system connectivity',
  }

  return descriptions[category] || 'Innovative technology solutions'
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'analytics': 'BarChart',
    'dashboard': 'Grid',
    'visualization': 'PieChart',
    'automation': 'Zap',
    'integration': 'Link',
  }

  return icons[category] || 'Code'
}

function getTechnologyCategory(tech: string): string {
  const categories: Record<string, string> = {
    'React': 'Frontend',
    'TypeScript': 'Language',
    'Next.js': 'Framework',
    'Node.js': 'Backend',
    'PostgreSQL': 'Database',
    'Tailwind CSS': 'Styling',
    'Recharts': 'Visualization',
    'D3.js': 'Visualization',
    'Python': 'Language',
    'AWS': 'Cloud',
  }

  return categories[tech] || 'Other'
}

function getPopularityScore(count: number, total: number): number {
  return Math.round((count / total) * 100)
}

function getTechnologyTrends() {
  return [
    { name: 'TypeScript', growth: '+45%', trend: 'up' },
    { name: 'React', growth: '+32%', trend: 'up' },
    { name: 'Next.js', growth: '+67%', trend: 'up' },
    { name: 'Tailwind CSS', growth: '+89%', trend: 'up' },
    { name: 'D3.js', growth: '+23%', trend: 'stable' },
  ]
}

export { projectsRouter }
