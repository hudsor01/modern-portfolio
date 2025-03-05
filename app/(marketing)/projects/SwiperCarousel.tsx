'use client'

import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, EffectCreative } from 'swiper/modules'
import { Project } from '@/lib/data/projects'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExternalLink } from 'lucide-react'
import { PrevButton, NextButton, CustomPagination } from './swiper-navigation'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-creative'
import './swiper-styles.css'

interface SwiperCarouselProps {
  projects: Project[]
}

function SwiperCarousel({ projects }: SwiperCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  
  if (!projects || projects.length === 0) {
    return <div className="p-6 text-center bg-muted/30 rounded-lg">No projects available</div>
  }
  
  return (
    <div className="relative rounded-xl">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectCreative]}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        grabCursor={true}
        effect="creative"
        creativeEffect={{
          prev: {
            shadow: true,
            translate: [0, 0, -400],
          },
          next: {
            translate: ["100%", 0, 0],
          },
        }}
        className="project-swiper pb-12"
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
      >
        {projects.map((project) => (
          <SwiperSlide key={project.id}>
            <div className="bg-card h-full rounded-xl border p-4 shadow-md project-card">
              <div className="group relative aspect-video overflow-hidden rounded-lg bg-muted/30">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted/50">
                    No Preview
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-all duration-300 group-hover:opacity-100">
                  <div className="absolute bottom-0 w-full p-4">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="bg-background/95 text-xs backdrop-blur-sm"
                      >
                        <Link href={`/projects/${project.id}`}>View Details</Link>
                      </Button>
                      {project.liveUrl && (
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="bg-background/95 text-xs backdrop-blur-sm"
                        >
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-1 h-3 w-3" />
                            Live Demo
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="mt-4 text-lg font-semibold line-clamp-1">{project.title}</h3>
              <p className="text-muted-foreground line-clamp-2 text-sm mt-1">
                {project.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {(project.technologies || []).slice(0, 3).map(tech => (
                  <Badge
                    key={tech}
                    variant="outline"
                    className="bg-primary/5 text-xs"
                  >
                    {tech}
                  </Badge>
                ))}
                {(project.technologies || []).length > 3 && (
                  <Badge
                    variant="outline"
                    className="bg-muted/50 text-xs"
                  >
                    +{(project.technologies || []).length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
        
        <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-center mt-6 mb-2">
          <div className="flex items-center gap-6">
            <PrevButton />
            <CustomPagination totalSlides={projects.length} activeIndex={activeIndex} />
            <NextButton />
          </div>
        </div>
      </Swiper>
    </div>
  )
}

export default SwiperCarousel