'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Project } from '@/lib/data/projects';

interface FeaturedProjectsSectionProps {
  projects: Project[];
}

export function FeaturedProjectsSection({ projects }: FeaturedProjectsSectionProps) {
  // Only show the first 2 projects on homepage
  const displayedProjects = projects.slice(0, 2);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section
      id="projects-section"
      className="py-24 md:py-32 lg:py-36 section-transition section-bg-secondary"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary dark:from-primary dark:to-primary"
          >
            Featured Projects
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted-foreground"
          >
            Explore my work in revenue operations and business analytics
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayedProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group transform transition-all duration-300 hover:-translate-y-2"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Link href={`/projects/${project.slug}`} className="block h-full">
                <div className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl h-full flex flex-col border border-border transition-all duration-300 relative">
                  <div className="relative h-60 overflow-hidden">
                    <Image
                      src={project.image || '/images/projects/churn-retention.jpg'}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-80" />

                    {/* Project title */}
                    <div className="absolute bottom-0 left-0 p-6 w-full">
                      <div className="flex justify-between items-center">
                        <h3 className="text-white text-xl font-bold transition-colors duration-300 group-hover:text-primary">
                          {project.title}
                        </h3>
                        <ArrowUpRight
                          size={18}
                          className="text-white opacity-0 translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex-grow flex flex-col">
                    <p className="text-card-foreground/80 mb-6 flex-grow line-clamp-3">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies?.slice(0, 3).map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies && project.technologies.length > 3 && (
                        <span className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                          +{project.technologies?.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center mt-auto text-primary font-medium group-hover:underline">
                      View Project Details
                      <ArrowRight
                        size={16}
                        className="ml-1 transition-transform duration-300 group-hover:translate-x-1"
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
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-primary text-primary dark:text-primary hover:bg-primary/10 dark:hover:bg-primary/20 px-6 py-6 text-lg rounded-xl group shadow-sm hover:shadow-md transition-all"
          >
            <Link href="/projects" className="flex items-center gap-2">
              View All Projects
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1.5 transition-transform duration-300"
              />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
