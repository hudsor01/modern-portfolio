'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef } from 'react'
import type { Swiper as SwiperType } from 'swiper'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Info, ExternalLink, Zap, ArrowRight } from 'lucide-react'
import { Project } from '@/lib/data/projects'
import { ProjectQuickView } from './project-quick-view'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, EffectCreative } from 'swiper/modules'
import { PrevButton, NextButton, CustomPagination } from './swiper-navigation'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-creative'
import './swiper-styles-project.css'

interface ProjectSwiperProps {
  title?: string
  subtitle?: string
  projects: Project[]
  showViewAll?: boolean
}

export function ProjectSwiper({
  title,
  subtitle,
  projects,
  showViewAll = true
}: ProjectSwiperProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const swiperRef = useRef<SwiperType | null>(null)

  // Function to open the quick view modal
  const handleOpenQuickView = (project: Project) => {
    setSelectedProject(project)
    setIsDrawerOpen(true)
  }

  // Return early if there are no projects
  if (!projects || projects.length === 0) {
    return (
      <div className='p-6 text-center bg-muted/30 rounded-lg shadow-sm'>
        No projects available
      </div>
    )
  }

  return (
    <section className='py-12 relative'>
      {/* Title and subtitle section with enhanced styling */}
      {(title || subtitle) && (
        <div className='mb-10 flex flex-col md:flex-row md:items-end md:justify-between'>
          <div>
            {title && (
              <h2 className='text-3xl font-bold flex items-center gap-2'>
                <Zap className='h-6 w-6 text-primary animate-pulse' />
                {title}
              </h2>
            )}
            {subtitle && <p className='text-muted-foreground mt-2'>{subtitle}</p>}
          </div>

          {/* View All Projects link */}
          {showViewAll && (
            <Link
              href='/projects'
              className='group mt-4 md:mt-0 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors'>
              View all projects
              <ArrowRight className='ml-1 h-4 w-4 transition-transform group-hover:translate-x-1' />
            </Link>
          )}
        </div>
      )}

      {/* Swiper Carousel */}
      <div className='relative rounded-xl'>
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectCreative]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 }
          }}
          autoplay={{ delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          loop={true}
          grabCursor={true}
          className='project-swiper pb-12'
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.realIndex);
          }}
        >
          {projects.map((project, index) => (
            <SwiperSlide key={project.id} className='pb-1'>
              <div className='bg-card h-full rounded-xl border p-4 shadow-md project-card'>
                <div className='group relative aspect-video overflow-hidden rounded-lg bg-muted/30'>
                  {/* Project image with enhanced effects */}
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className='object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-[1.02]'
                      sizes='(max-width: 640px) 85vw, (max-width: 1024px) 40vw, (max-width: 1280px) 30vw, 25vw'
                      loading={index < 2 ? 'eager' : 'lazy'}
                      quality={80}
                    />
                  ) : (
                    <div className='flex h-full w-full items-center justify-center bg-gradient-to-br from-muted/40 to-muted/70 text-muted-foreground'>
                      No Preview
                    </div>
                  )}
                  {/* Enhanced image overlay with improved hover effects */}
                  <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100'>
                    <div className='absolute bottom-0 w-full p-4'>
                      <div className='flex flex-wrap gap-2'>
                        <Button
                          onClick={() => handleOpenQuickView(project)}
                          variant='outline'
                          size='sm'
                          className='bg-background/95 text-xs backdrop-blur-sm transition-all hover:bg-background/100'>
                          <Info className='mr-1 h-3 w-3' />
                          Quick View
                        </Button>
                        <Button
                          asChild
                          variant='outline'
                          size='sm'
                          className='bg-background/95 text-xs backdrop-blur-sm transition-all hover:bg-background/100'>
                          <Link href={`/projects/${project.id}`}>
                            Details
                          </Link>
                        </Button>
                        {project.liveUrl && (
                          <Button
                            asChild
                            variant='outline'
                            size='sm'
                            className='bg-background/95 text-xs backdrop-blur-sm transition-all hover:bg-background/100'>
                            <a
                              href={project.liveUrl}
                              target='_blank'
                              rel='noopener noreferrer'>
                              <ExternalLink className='mr-1 h-3 w-3' />
                              Live Demo
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Project title and description with improved styling */}
                <h3 className='mt-4 text-lg font-semibold line-clamp-1'>{project.title}</h3>
                <p className='text-muted-foreground line-clamp-2 text-sm mt-1'>
                  {project.description}
                </p>
                {/* Project technologies with enhanced styling */}
                <div className='mt-3 flex flex-wrap gap-1.5'>
                  {(project.technologies || []).slice(0, 3).map(tech => (
                    <Badge
                      key={tech}
                      variant='outline'
                      className='bg-primary/5 hover:bg-primary/10 transition-colors text-xs'>
                      {tech}
                    </Badge>
                  ))}
                  {/* Show "+n more" badge if there are more than 3 technologies */}
                  {(project.technologies || []).length > 3 && (
                    <Badge
                      variant='outline'
                      className='bg-muted/50 hover:bg-muted/60 transition-colors text-xs'>
                      +{(project.technologies || []).length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}

          {/* Custom Navigation */}
          <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-center mt-6 mb-2">
            <div className="flex items-center gap-6">
              <PrevButton />
              <CustomPagination totalSlides={projects.length} activeIndex={activeIndex} />
              <NextButton />
            </div>
          </div>
        </Swiper>
      </div>

      {/* Project quick view modal */}
      {selectedProject && (
        <ProjectQuickView
          open={isDrawerOpen}
          onOpenChange={() => setIsDrawerOpen(false)}
          project={selectedProject}
        />
      )}
    </section>
  )
}