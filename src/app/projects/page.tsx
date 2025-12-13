import { generateMetadata } from '@/app/shared-metadata'
import { getProjects } from '@/lib/content/projects'
import ProjectsClientBoundary from '@/components/projects/projects-client-boundary'
import { Footer } from '@/components/layout/footer'
import type { Project } from '@/types/project'

export const metadata = generateMetadata(
  'Revenue Operations Projects & Case Studies | Richard Hudson',
  'Explore Richard Hudson\'s 11+ proven RevOps projects including first-ever partnership program implementation: $4.8M+ revenue generated, 25% churn reduction, 35% conversion optimization. Real-world case studies in sales automation, data analytics, business intelligence, and production system implementation.',
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
    ...(p.content && { content: p.content }),
    featured: p.featured ?? false,
    image: p.image,
    ...(p.link && { link: p.link }),
    ...(p.github && { github: p.github }),
    category: p.category || 'Other',
    ...(p.tags && { tags: p.tags }),
    createdAt: p.createdAt instanceof Date ? p.createdAt : new Date(p.createdAt || '2024-01-01'),
    ...(p.updatedAt && { updatedAt: p.updatedAt instanceof Date ? p.updatedAt : new Date(p.updatedAt) }),
    ...(p.tags && { technologies: p.tags }),
    ...(p.link && { liveUrl: p.link }),
    ...(p.github && { githubUrl: p.github }),
    ...('starData' in p && p.starData && { starData: p.starData }),
    viewCount: p.viewCount ?? 0,
    clickCount: p.clickCount ?? 0,
  }))

  return (
    <>
      <ProjectsClientBoundary initialProjects={convertedProjects} />
      <Footer />
    </>
  )
}
