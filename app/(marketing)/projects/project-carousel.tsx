import React, { useState } from 'react'
import { Carousel, CarouselPrevious, CarouselNext } from 'react-spring-carousel/dist/types'
import Image from 'next/image'
import { Button, Badge } from '@/components/ui'
import { Info, ExternalLink } from 'lucide-react'
import { Project } from '@/types/project'

type Props = {
  title?: string
  subtitle?: string
  projects: Project[]
}

export default function ProjectCarousel({ title, subtitle, projects }: Props) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const handleOpenQuickView = (project: Project) => {
    setSelectedProject(project)
    setIsDrawerOpen(true)
  }

  return (
    <section className='py-10'>
      {(title || subtitle) && (
        <div className='mb-8 text-center'>
          {title && <h2 className='text-3xl font-bold'>{title}</h2>}
          {subtitle && <p className='text-muted-foreground mt-2'>{subtitle}</p>}
        </div>
      )}
      <Carousel
        opts={{
          loop: true,
          align: 'start',
          slidesToScroll: 1,
        }}
        className='relative'
      >
<<<<<<< tabby-ABY2BE
        <CarouselContent -ml-4 md:-ml-6>
        <CarouselNext -ml-4 md:-ml-6>
>>>>>>> tabby-ABY2BE [-+]
          {projects.map((project) => (
            <div
              key={project.id}
              className='pl-4 md:pl-6 sm:basis-1/2 md:basis-1/3 lg:basis-1/4'
            >
              <div className='h-full rounded-lg border bg-card p-3 shadow-sm'>
                <div className='group relative aspect-video overflow-hidden rounded-lg'>
                  <Image
                    src={project.image || '/images/project-placeholder.jpg'}
                    alt={project.title}
                    fill
                    className='object-cover transition-transform duration-300 group-hover:scale-105'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                    <div className='absolute bottom-0 w-full p-4'>
                      <div className='flex flex-wrap gap-2'>
                        <Button
                          onClick={() => handleOpenQuickView(project)}
                          variant='outline'
                          size='sm'
                          className='bg-background/95 text-xs backdrop-blur-sm'
                        >
                          <Info className='mr-1 h-3 w-3' />
                          Quick View
                        </Button>
                        <Button asChild variant='outline' size='sm' className='bg-background/95 text-xs backdrop-blur-sm'>
                          <Link href={`/projects/${project.id}`}>
                            Details
                          </Link>
                        </Button>
                        {project.liveUrl && (
                          <Button
                            asChild
                            variant='outline'
                            size='sm'
                            className='bg-background/95 text-xs backdrop-blur-sm'
                          >
                            <a
                              href={project.liveUrl}
                              target='_blank'
                              rel='noopener noreferrer'
                            >
                              <ExternalLink className='mr-1 h-3 w-3' />
                              Live Demo
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className='mt-3 text-lg font-semibold'>{project.title}</h3>
                <p className='text-muted-foreground line-clamp-2 text-sm'>
                  {project.description}
                </p>
                <div className='mt-3 flex flex-wrap gap-2'>
                  {project.technologies?.slice(0, 3).map((tech) => (
                    <Badge key={tech} variant='outline' className='bg-primary/5 text-xs'>
                      {tech}
                    </Badge>
                  ))}
                  {(project.technologies?.length || 0) > 3 && (
                    <Badge variant='outline' className='bg-muted/50 text-xs'>
                      +{(project.technologies?.length || 0) - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CarouselContent>
        <CarouselPrevious className='left-0 -translate-x-1/2' />
        <CarouselNext className='right-0 translate-x-1/2' />
      </Carousel>
      {selectedProject && (
        <ProjectQuickView
          open={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
          project={selectedProject}
        />
      )}
    </section>
  )
}
