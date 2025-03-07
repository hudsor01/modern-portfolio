'use client';

import React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '@/lib/data/projects';
import SwiperCarousel from '@/components/SwiperCarousel';

interface ProjectTabsProps {
  projects: Project[];
}

export function ProjectTabs({ projects }: ProjectTabsProps) {
  // Extract unique categories from projects
  const allCategories = React.useMemo(() => {
    const categories = new Set<string>();
    projects.forEach((project) => {
      project.technologies?.forEach((tag) => categories.add(tag));
    });
    return ['All', ...Array.from(categories)];
  }, [projects]);

  const [activeCategory, setActiveCategory] = useState('All');

  // Filter projects by category
  const filteredProjects = React.useMemo(() => {
    if (activeCategory === 'All') return projects;
    return projects.filter((project) => project.technologies?.includes(activeCategory));
  }, [projects, activeCategory]);

  return (
    <div className="space-y-8">
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 justify-center">
        {allCategories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 
              ${
                activeCategory === category
                  ? 'bg-[#0070f3] text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Projects display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {filteredProjects.length > 0 ? (
            <SwiperCarousel projects={filteredProjects} />
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-gray-500 dark:text-gray-400">
                No projects found in this category
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
