'use client'

import Link from 'next/link'
import { useState, useRef } from 'react'
import type { Swiper as SwiperType } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, EffectCreative } from 'swiper/modules'
import { ArrowRight, Zap } from 'lucide-react'
import type { Project } from '@/types/project'
import { useQuickViewModal } from '@/hooks/use-quick-view-modal'
import { ProjectQuickView } from '@/components/projects/project-quick-view'
import { ProjectSwiperCard } from '@/components/projects/project-swiper-card'
import {
  SwiperPrevButton,
  SwiperNextButton,
  SwiperPagination,
} from '@/components/projects/swiper-navigation'

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

const SWIPER_BREAKPOINTS = {
  640: { slidesPerView: 2 },
  1024: { slidesPerView: 3 },
  1280: { slidesPerView: 4 },
}

const AUTOPLAY_CONFIG = {
  delay: 6000,
  disableOnInteraction: false,
  pauseOnMouseEnter: true,
}

function SectionHeader({
  title,
  subtitle,
  showViewAll,
}: {
  title?: string
  subtitle?: string
  showViewAll: boolean
}) {
  if (!title && !subtitle) return null

  return (
    <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between">
      <div>
        {title && (
          <h2 className="flex items-center gap-2 typography-h2 border-none pb-0 text-2xl">
            <Zap className="text-primary h-6 w-6 animate-pulse" />
            {title}
          </h2>
        )}
        {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
      </div>

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
  )
}

function EmptyState() {
  return (
    <div className="bg-muted/30 rounded-lg p-6 text-center shadow-xs">
      No projects available
    </div>
  )
}

export function ProjectSwiper({
  title,
  subtitle,
  projects,
  showViewAll = true,
}: ProjectSwiperProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const swiperRef = useRef<SwiperType | null>(null)
  const quickView = useQuickViewModal<Project>()

  if (!projects || projects.length === 0) {
    return <EmptyState />
  }

  return (
    <section className="relative py-12">
      <SectionHeader title={title} subtitle={subtitle} showViewAll={showViewAll} />

      <div className="relative rounded-xl">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectCreative]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={SWIPER_BREAKPOINTS}
          autoplay={AUTOPLAY_CONFIG}
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
              <ProjectSwiperCard
                project={project}
                index={index}
                onQuickView={quickView.open}
              />
            </SwiperSlide>
          ))}

          <div className="absolute right-0 bottom-0 left-0 z-10 mt-6 mb-2 flex justify-center">
            <div className="flex items-center gap-6">
              <SwiperPrevButton />
              <SwiperPagination totalSlides={projects.length} activeIndex={activeIndex} />
              <SwiperNextButton />
            </div>
          </div>
        </Swiper>
      </div>

      {quickView.selectedItem && (
        <ProjectQuickView
          open={quickView.isOpen}
          onOpenChangeAction={quickView.setOpen}
          project={{
            ...quickView.selectedItem,
            id: quickView.selectedItem.id || '',
            title: quickView.selectedItem.title || '',
            description: quickView.selectedItem.description || '',
            image: quickView.selectedItem.image || '',
            slug: quickView.selectedItem.slug || '',
            category: quickView.selectedItem.category || '',
            tags: quickView.selectedItem.tags || [],
            featured: quickView.selectedItem.featured || false,
          }}
        />
      )}
    </section>
  )
}
