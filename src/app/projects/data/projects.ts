import { Project, ProjectsResponse } from '@/types/projects-types'
import path from 'path'
import fs from 'fs/promises'
import matter from 'gray-matter'

// Cache projects to avoid reading from disk on every request
let projectsCache: Project[] | null = null

export async function getProjects(): Promise<Project[]> {
  if (projectsCache) return projectsCache

  try {
    const projectsDirectory = path.join(process.cwd(), 'content/projects')
    const fileNames = await fs.readdir(projectsDirectory)

    const projects = await Promise.all(
      fileNames.map(async (fileName) => {
        const slug = fileName.replace(/\.mdx$/, '')
        return await getProjectBySlug(slug)
      })
    )

    // Filter out any null values and sort by date
    const validProjects = projects
      .filter((p): p is Project => p !== null)
      .sort((a, b) => {
        const aDate = typeof a.createdAt !== 'undefined' ? a.createdAt : Date.now();
        const bDate = typeof b.createdAt !== 'undefined' ? b.createdAt : Date.now();
        return new Date(bDate).getTime() - new Date(aDate).getTime();
      })

    projectsCache = validProjects
    return validProjects
  } catch (error) {
    console.error('Error loading projects:', error)
    return []
  }
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
  try {
    const fullPath = path.join(process.cwd(), 'content/projects', `${slug}.mdx`)
    const fileContents = await fs.readFile(fullPath, 'utf8')

    const { data, content } = matter(fileContents)

    return {
      id: slug,
      slug,
      title: data.title || '',
      description: data.description || '',
      content,
      featured: data.featured || false,
      image: data.image || '',
      link: data.link || '',
      github: data.github || '',
      category: data.category || 'uncategorized',
      tags: data.tags || [],
      createdAt: new Date(data.date || Date.now()),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
    }
  } catch (error) {
    console.error(`Error loading project ${slug}:`, error)
    return null
  }
}

/**
 * Get a specific project by its slug from the cached project list
 */
export function getProjectById(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}

// Sample project data
const projects: Project[] = [
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

export { projects }
