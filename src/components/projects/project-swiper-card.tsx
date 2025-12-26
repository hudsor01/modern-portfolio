'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Project } from '@/types/project'
import { ExternalLink, Info } from 'lucide-react'

interface ProjectSwiperCardProps {
  project: Project
  index: number
  onQuickView: (project: Project) => void
}

function ProjectImage({ project, index }: { project: Project; index: number }) {
  if (project.image) {
    return (
      <Image
        src={project.image}
        alt={project.title}
        fill
        className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-[1.02]"
        sizes="(max-width: 640px) 85vw, (max-width: 1024px) 40vw, (max-width: 1280px) 30vw, 25vw"
        loading={index < 2 ? 'eager' : 'lazy'}
        quality={80}
      />
    )
  }

  return (
    <div className="from-muted/40 to-muted/70 text-muted-foreground flex h-full w-full items-center justify-center bg-gradient-to-br">
      No Preview
    </div>
  )
}

interface CardActionsProps {
  project: Project
  onQuickView: () => void
}

function CardActions({ project, onQuickView }: CardActionsProps) {
  return (
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100">
      <div className="absolute bottom-0 w-full p-4">
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={onQuickView}
            variant="outline"
            size="sm"
            className="bg-background/95 hover:bg-background/100 text-xs backdrop-blur transition-all"
          >
            <Info className="mr-1 h-3 w-3" />
            Quick View
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="bg-background/95 hover:bg-background/100 text-xs backdrop-blur transition-all"
          >
            <Link href={`/projects/${project.slug}`}>Details</Link>
          </Button>
          {project.liveUrl && (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="bg-background/95 hover:bg-background/100 text-xs backdrop-blur transition-all"
            >
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <ExternalLink className="mr-1 h-3 w-3" />
                Live Demo
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function TechnologyBadges({ technologies }: { technologies: string[] }) {
  const visibleTechnologies = technologies.slice(0, 3)
  const remainingCount = technologies.length - 3

  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {visibleTechnologies.map((tech) => (
        <Badge
          key={tech}
          variant="outline"
          className="bg-primary/5 hover:bg-primary/10 text-xs transition-colors"
        >
          {tech}
        </Badge>
      ))}
      {remainingCount > 0 && (
        <Badge
          variant="outline"
          className="bg-muted/50 hover:bg-muted/60 text-xs transition-colors"
        >
          +{remainingCount} more
        </Badge>
      )}
    </div>
  )
}

export function ProjectSwiperCard({
  project,
  index,
  onQuickView,
}: ProjectSwiperCardProps) {
  const technologies = project.technologies || []

  return (
    <div className="bg-card project-card h-full rounded-xl border p-4 shadow-md transition-all duration-300 ease-in-out motion-reduce:transition-none hover:-translate-y-[5px] hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)]">
      <div className="group bg-muted/30 relative aspect-video overflow-hidden rounded-lg">
        <ProjectImage project={project} index={index} />
        <CardActions project={project} onQuickView={() => onQuickView(project)} />
      </div>

      <h3 className="mt-4 line-clamp-1 typography-large">{project.title}</h3>
      <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
        {project.description}
      </p>

      {technologies.length > 0 && <TechnologyBadges technologies={technologies} />}
    </div>
  )
}
