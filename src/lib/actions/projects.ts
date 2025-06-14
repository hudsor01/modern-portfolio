import { getProjectById } from '@/data/projects'
import { getProjects } from '@/lib/content/projects'
import type { Project } from '@/types/project'

export async function fetchProjects(): Promise<Project[]> {
  try {
    const projects = await getProjects()
    // Ensure each project has a createdAt property
    return projects.map((project: Partial<Project>) => ({
      ...project,
      createdAt: project.createdAt ?? new Date().toISOString(), // Then ensure createdAt is set
    })) as Project[]
  } catch (error) {
    console.error('Error fetching projects:', error instanceof Error ? error.stack : error)
    return []
  }
}

export async function fetchFeaturedProjects(): Promise<Project[]> {
  try {
    const projects = await getProjects()
    return (
      projects
        ?.filter((project: Partial<Project>) => Boolean(project.featured))
        .map((project: Partial<Project>) => ({ // project here is the result of filter, still Partial<Project>
          ...project,
          createdAt: project.createdAt ?? new Date().toISOString(), // Then ensure createdAt is set
        })) as Project[]
    ) || []
  } catch (error) {
    console.error('Error fetching featured projects:', error instanceof Error ? error.stack : error)
    return []
  }
}

export async function fetchProjectById(slug: string): Promise<Project | null> {
  try {
    const project = await getProjectById(slug)
    if (!project || typeof project.slug !== 'string') {
      return null
    }
    // Ensure createdAt is present and slug is string
    return {
      createdAt: project.createdAt ?? new Date().toISOString(),
      ...project,
      slug: project.slug, // guaranteed to be string here
    } as Project
  } catch (error) {
    console.error(`Error fetching project with slug ${slug}:`, error instanceof Error ? error.stack : error)
    return null
  }
}
