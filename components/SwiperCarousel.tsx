'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/lib/data/projects';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ExternalLink, ArrowRight } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface SwiperCarouselProps {
  projects: Project[];
}

export default function SwiperCarousel({ projects }: SwiperCarouselProps) {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={30}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      className="rounded-xl overflow-hidden"
      style={
        {
          // Custom styles for navigation arrows
          '--swiper-navigation-color': '#0070f3',
          '--swiper-pagination-color': '#0070f3',
        } as React.CSSProperties
      }
      breakpoints={{
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      }}
    >
      {projects.map((project) => (
        <SwiperSlide key={project.id} className="pb-12">
          <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }} className="h-full">
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg h-full flex flex-col border border-gray-100 dark:border-gray-700">
              <div className="relative h-48">
                <Image
                  src={project.image || '/images/project-placeholder.jpg'}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-grow">
                  {project.description}
                </p>

                <div className="mt-auto flex justify-between items-center">
                  {project.liveUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="text-[#0070f3] border-[#0070f3]"
                    >
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Demo
                      </a>
                    </Button>
                  )}

                  <Button variant="ghost" size="sm" asChild className="ml-auto">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="flex items-center gap-1 text-[#0070f3]"
                    >
                      Details
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
