import Link from 'next/link'
import { ArrowRight, Briefcase } from 'lucide-react'
import { ProjectPreview } from '@/components/projects/project-preview'
import type { Project } from '@/types/project'

// ============================================================================
// Component
// ============================================================================

export type FeaturedProject = Pick<
  Project,
  'slug' | 'title' | 'description' | 'results' | 'displayMetrics'
>

interface FeaturedProjectsProps {
  className?: string
  projects: FeaturedProject[]
}

export function FeaturedProjects({ className = '', projects }: FeaturedProjectsProps) {
  return (
    <div className={`bg-card border border-border rounded-2xl p-8 flex flex-col ${className}`}>
      <h3 className="typography-h4 mb-6 flex items-center gap-2">
        <Briefcase className="w-5 h-5 text-primary" aria-hidden="true" />
        Featured Work
      </h3>
      <div className="space-y-4 flex-1 flex flex-col justify-center">
        {projects.map((project) => (
          <Link
            key={project.slug}
            data-track="Project Click"
            data-track-location="contact-featured"
            href={`/projects/${project.slug}`}
            className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl hover:bg-primary/10 hover:border-primary/30 border border-border transition-all duration-300 ease-out group"
          >
            <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-muted">
              <ProjectPreview size="thumb" project={project} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-base font-semibold text-foreground">{project.title}</span>
              <div className="typography-small text-muted-foreground truncate">
                {project.description}
              </div>
            </div>
            <ArrowRight
              className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform shrink-0"
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>
    </div>
  )
}
