'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '@/lib/data/projects';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProjectShowcaseProps {
  projects: Project[];
}

export function ProjectShowcase({ projects }: ProjectShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProject = projects[activeIndex];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Project thumbnails */}
      <div className="lg:col-span-2 flex flex-col space-y-4">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <button
              onClick={() => setActiveIndex(index)}
              className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                activeIndex === index
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-[#0070f3]'
                  : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-l-4 border-transparent'
              }`}
            >
              <h3
                className={`font-semibold text-lg mb-1 ${
                  activeIndex === index ? 'text-[#0070f3]' : ''
                }`}
              >
                {project.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                {project.description}
              </p>
            </button>
          </motion.div>
        ))}
      </div>

      {/* Featured project detail */}
      <div className="lg:col-span-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeProject.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg"
          >
            <div className="relative h-64 md:h-72">
              <Image
                src={activeProject.image || '/images/project-placeholder.jpg'}
                alt={activeProject.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">{activeProject.title}</h3>

              <div className="flex flex-wrap gap-2 mb-4">
                {activeProject.technologies?.slice(0, 5).map((tech) => (
                  <Badge key={tech} className="bg-blue-50 dark:bg-blue-900/20 text-[#0070f3]">
                    {tech}
                  </Badge>
                ))}
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-6">{activeProject.description}</p>

              <div className="flex gap-4">
                <Button asChild>
                  <Link
                    href={`/projects/${activeProject.slug}`}
                    className="flex items-center gap-1"
                  >
                    View Details
                    <ArrowRight size={16} />
                  </Link>
                </Button>

                {activeProject.liveUrl && (
                  <Button asChild variant="outline">
                    <a
                      href={activeProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      Live Demo
                      <ExternalLink size={16} />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
