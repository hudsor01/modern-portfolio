'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Project } from '@/lib/data/projects'

interface FeaturedProjectsSectionProps {
  projects: Project[]
}

export function FeaturedProjectsSection({ projects }: FeaturedProjectsSectionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="projects-section" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white"
          >
            Featured Projects
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-600 dark:text-gray-300"
          >
            Explore my work in revenue operations and business analytics
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Link
                href={`/projects/${project.slug}`}
                className="block h-full"
              >
                <div 
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md h-full flex flex-col border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl"
                  style={{ 
                    transform: hoveredIndex === index ? 'translateY(-8px)' : 'translateY(0)'
                  }}
                >
                  <div className="relative h-60 overflow-hidden">
                    <Image
                      src={project.image || '/images/projects/churn-retention.jpg'}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500"
                      style={{ 
                        transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)'
                      }}
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-80" />

                    {/* Project title */}
                    <div className="absolute bottom-0 left-0 p-6 w-full">
                      <div className="flex justify-between items-center">
                        <h3 className="text-white text-xl font-bold transition-colors duration-300">
                          {project.title}
                        </h3>
                        <ArrowUpRight 
                          size={18} 
                          className="text-white opacity-0 transform translate-x-2 transition-all duration-300"
                          style={{ 
                            opacity: hoveredIndex === index ? 1 : 0,
                            transform: hoveredIndex === index ? 'translateX(0)' : 'translateX(8px)'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex-grow flex flex-col">
                    <p className="text-gray-600 dark:text-gray-300 mb-6 flex-grow line-clamp-3">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies?.slice(0, 3).map((tech, techIndex) => (
                        <span 
                          key={techIndex}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies?.length > 3 && (
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                          +{project.technologies.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center mt-auto text-blue-600 dark:text-blue-400 font-medium group-hover:underline">
                      View Project Details
                      <ArrowRight 
                        size={16} 
                        className="ml-1 transition-transform duration-300"
                        style={{ 
                          transform: hoveredIndex === index ? 'translateX(4px)' : 'translateX(0)'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Button asChild variant="outline" size="lg" className="border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-6 py-6">
            <Link href="/projects" className="flex items-center gap-2">
              View All Projects
              <ArrowRight size={16} />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
