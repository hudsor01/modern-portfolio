import React from 'react'
import { generateMetadata } from '@/app/shared-metadata'
import { getProjects } from '@/app/projects/data/projects'
import ProjectsClientBoundary from '@/components/projects/projects-client-boundary'
import { Footer } from '@/components/layout/footer'
import type { Project } from '@/types/project'

export const metadata = generateMetadata(
  'Revenue Operations Projects & Case Studies | Richard Hudson',
  'Explore proven RevOps success stories: $4.8M+ revenue generated, 25% churn reduction, 35% conversion optimization. Real-world case studies in sales automation, data analytics, and business intelligence.',
  '/projects'
)

export default async function ProjectsPage() {
  // Get projects data directly on server
  const projects = await getProjects()
  
  // Convert to the expected Project type for the component
  const convertedProjects: Project[] = projects.map(p => ({
    id: p.id,
    title: p.title,
    slug: p.slug || p.id,
    description: p.description,
    content: p.content,
    featured: p.featured ?? false,
    image: p.image,
    link: p.link,
    github: p.github,
    category: p.category || 'Other',
    tags: p.tags,
    createdAt: p.createdAt instanceof Date ? p.createdAt : new Date(p.createdAt || Date.now()),
    updatedAt: p.updatedAt ? (p.updatedAt instanceof Date ? p.updatedAt : new Date(p.updatedAt)) : undefined,
    technologies: p.tags,
    liveUrl: p.link,
    githubUrl: p.github,
  }))

  return (
    <>
      <ProjectsClientBoundary initialProjects={convertedProjects} />
      <Footer />
    </>
  )
}
