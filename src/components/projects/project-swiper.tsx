'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef } from 'react'
import type { Swiper as SwiperType } from 'swiper'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Project } from '@/types/project' // Changed import path
import { ExternalLink, Info, ArrowRight, Zap } from 'lucide-react' // Added ArrowRight, Zap
import { ProjectQuickView } from '@/components/projects/project-quick-view'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, EffectCreative } from 'swiper/modules'
import { PrevButton, NextButton, CustomPagination } from '@/components/layout/swiper-navigation'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-creative'
import '@/components/swiper-styles-project.css'

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
  showViewAll = true,
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
      <div className="bg-muted/30 rounded-lg p-6 text-center shadow-xs">No projects available</div>
    )
  }

  return (
    <section className="relative py-12">
      {/* Title and subtitle section with enhanced styling */}
      {(title || subtitle) && (
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between">
          <div>
            {title && (
              <h2 className="flex items-center gap-2 text-3xl font-bold">
                <Zap className="text-primary h-6 w-6 animate-pulse" />
                {title}
              </h2>
            )}
            {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
          </div>

          {/* View All Projects link */}
          {showViewAll && (
            <Link
              href="/projects"
              className="group text-muted-foreground hover:text-primary mt-4 inline-flex items-center text-sm font-medium transition-colors md:mt-0"
            >
              View all projects
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>
      )}

      {/* Swiper Carousel */}
      <div className="relative rounded-xl">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectCreative]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          autoplay={{ delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          loop={true}
          grabCursor={true}
          className="project-swiper pb-12"
          onSwiper={(swiper) => {
            swiperRef.current = swiper
          }}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.realIndex)
          }}
        >
          {projects.map((project, index) => (
            <SwiperSlide key={project.id} className="pb-1">
              <div className="bg-card project-card h-full rounded-xl border p-4 shadow-md transition-all duration-300 ease-in-out motion-reduce:transition-none hover:-translate-y-[5px] hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)]">
                <div className="group bg-muted/30 relative aspect-video overflow-hidden rounded-lg">
                  {/* Project image with enhanced effects */}
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-[1.02]"
                      sizes="(max-width: 640px) 85vw, (max-width: 1024px) 40vw, (max-width: 1280px) 30vw, 25vw"
                      loading={index < 2 ? 'eager' : 'lazy'}
                      quality={80}
                    />
                  ) : (
                    <div className="from-muted/40 to-muted/70 text-muted-foreground flex h-full w-full items-center justify-center bg-gradient-to-br">
                      No Preview
                    </div>
                  )}
                  {/* Enhanced image overlay with improved hover effects */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100">
                    <div className="absolute bottom-0 w-full p-4">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          onClick={() => handleOpenQuickView(project)}
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
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                              <ExternalLink className="mr-1 h-3 w-3" />
                              Live Demo
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Project title and description with improved styling */}
                <h3 className="mt-4 line-clamp-1 text-lg font-semibold">{project.title}</h3>
                <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                  {project.description}
                </p>
                {/* Project technologies with enhanced styling */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(project.technologies || []).slice(0, 3).map((tech) => (
                    <Badge
                      key={tech}
                      variant="outline"
                      className="bg-primary/5 hover:bg-primary/10 text-xs transition-colors"
                    >
                      {tech}
                    </Badge>
                  ))}
                  {/* Show "+n more" badge if there are more than 3 technologies */}
                  {(project.technologies || []).length > 3 && (
                    <Badge
                      variant="outline"
                      className="bg-muted/50 hover:bg-muted/60 text-xs transition-colors"
                    >
                      +{(project.technologies || []).length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}

          {/* Custom Navigation */}
          <div className="absolute right-0 bottom-0 left-0 z-10 mt-6 mb-2 flex justify-center">
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
          onOpenChangeAction={(isOpen: boolean) => {
            setIsDrawerOpen(isOpen)
            if (!isOpen) {
              setSelectedProject(null) // Optionally clear selected project when drawer closes
            }
          }}
          project={{
            ...selectedProject,
            id: selectedProject.id || '', // Ensure id is present
            title: selectedProject.title || '', // Ensure title is present
            description: selectedProject.description || '', // Ensure description is present
            image: selectedProject.image || '',
            slug: selectedProject.slug || '',
            category: selectedProject.category || '',
            tags: selectedProject.tags || [],
            featured: selectedProject.featured || false,
            // metrics, charts, details removed as they are not in the canonical Project type
            // If ProjectQuickView needs these, its prop type or the canonical Project type must be updated.
          }}
        />
      )}
    </section>
  )
}
