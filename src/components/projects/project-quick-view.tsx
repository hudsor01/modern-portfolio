'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ExternalLink, X } from 'lucide-react'
import { SiGithub } from 'react-icons/si'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import type { Project } from '@/types/project' // Changed import path

interface ProjectQuickViewProps {
  project: Project
  open: boolean
  /**
   * Callback fired when the open state of the drawer changes.
   * Renamed to `onOpenChangeAction` to comply with Next.js rules for function props
   * in Client Components. This prop can accept a client-side state updater
   * (e.g., from `useState`) when `ProjectQuickView` is used by a parent Client Component,
   * or a Server Action if appropriate for the use case.
   */
  onOpenChangeAction: (isOpen: boolean) => void
}

export function ProjectQuickView({ project, open, onOpenChangeAction }: ProjectQuickViewProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChangeAction}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="flex items-center justify-between">
          <div>
            <DrawerTitle>{project.title}</DrawerTitle>
            <DrawerDescription className="mt-2 max-w-3xl">{project.description}</DrawerDescription>
          </div>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon">
              <X className="h-4 w-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="px-4 pb-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={project.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=center&q=80'}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <h3 className="text-sm font-medium">Technologies</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {project.technologies?.map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Removed project.features usage as it's not in the Project type */}
          </div>
        </div>

        <DrawerFooter className="flex flex-row justify-end space-x-2">
          <Button asChild variant="outline">
            <Link href={`/projects/${project.id}`}>View Details</Link>
          </Button>

          {project.liveUrl && (
            <Button asChild>
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                <ExternalLink className="mr-2 h-4 w-4" />
                Live Demo
              </a>
            </Button>
          )}

          {project.githubUrl && (
            <Button asChild variant="secondary">
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                <SiGithub className="mr-2 h-4 w-4" />
                Source Code
              </a>
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
