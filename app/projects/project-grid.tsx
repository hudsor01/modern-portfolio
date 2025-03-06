'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Project } from '@/lib/data/projects'

interface ProjectGridProps {
  projects: Project[]
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="group"
        >
          <Link href={`/projects/${project.slug}`}>
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2 border border-gray-100 dark:border-gray-700 h-full flex flex-col">
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={project.image || '/images/project-placeholder.jpg'}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70" />
                
                {/* Project title */}
                <div className="absolute bottom-0 left-0 p-4 w-full">
                  <h3 className="text-white text-xl font-bold">{project.title}</h3>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow line-clamp-3">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.technologies?.slice(0, 3).map((tech) => (
                    <Badge key={tech} variant="outline" className="bg-[#0070f3]/5 text-[#0070f3] border-[#0070f3]/20">
                      {tech}
                    </Badge>
                  ))}
                  {project.technologies && project.technologies.length > 3 && (
                    <Badge variant="outline" className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                      +{project.technologies.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}