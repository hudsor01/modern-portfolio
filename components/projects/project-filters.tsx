'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import type { Project } from '@/types/project' // Changed import path
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

interface ProjectFiltersProps {
  projects: Project[]
}

export function ProjectFilters({ projects }: ProjectFiltersProps) {
  // Get all unique technologies from projects
  const allTechnologies = [...new Set(projects.flatMap((p) => p.technologies || []))]

  const [selectedFilter, setSelectedFilter] = useState<string>('All')
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects)

  const handleFilterChange = useCallback(
    (filter: string) => {
      setSelectedFilter(filter)

      if (filter === 'All') {
        setFilteredProjects(projects)
      } else {
        setFilteredProjects(projects.filter((project) => project.technologies?.includes(filter)))
      }
    },
    [projects]
  )

  // Initialize with all projects
  useEffect(() => {
    setFilteredProjects(projects)
  }, [projects])

  return (
    <div className="space-y-12">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={() => handleFilterChange('All')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            selectedFilter === 'All'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          All Projects
        </button>

        {allTechnologies.map((tech) => (
          <button
            key={tech}
            onClick={() => handleFilterChange(tech)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedFilter === tech
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {tech}
          </button>
        ))}
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="wait">
          {filteredProjects.length > 0 ? (
            <>
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group"
                >
                  <Link href={`/projects/${project.slug}`}>
                    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 h-full flex flex-col transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                      <div className="relative h-52 overflow-hidden">
                        <Image
                          src={project.image || '/images/project-placeholder.jpg'}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Tag for featured projects */}
                        {project.featured && (
                          <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded">
                            Featured
                          </div>
                        )}

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70" />

                        {/* Project title */}
                        <div className="absolute bottom-0 left-0 p-4 w-full">
                          <h3 className="text-white text-xl font-bold line-clamp-2">
                            {project.title}
                          </h3>
                        </div>
                      </div>

                      <div className="p-5 flex flex-col flex-grow">
                        <p className="text-muted-foreground mb-4 flex-grow line-clamp-3">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies?.slice(0, 3).map((tech) => (
                            <Badge
                              key={tech}
                              className="bg-primary/10 text-primary border-0"
                            >
                              {tech}
                            </Badge>
                          ))}
                          {project.technologies && project.technologies.length > 3 && (
                            <Badge className="bg-muted text-muted-foreground border-0">
                              +{project.technologies.length - 3}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center mt-auto text-primary font-medium">
                          View Details <ArrowRight size={16} className="ml-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-12"
            >
              <p className="text-lg text-muted-foreground">
                No projects found with the selected technology.
              </p>
              <Button className="mt-4" onClick={() => handleFilterChange('All')}>
                Show All Projects
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
