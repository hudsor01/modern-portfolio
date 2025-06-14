'use client'

import { motion } from 'framer-motion'

interface ProjectFilterProps {
  categories: string[]
  onFilterChangeAction: (category: string) => void
  activeFilter: string
}

export function ProjectFilter({ categories, onFilterChangeAction, activeFilter }: ProjectFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8 justify-center">
      {['All', ...categories].map((category) => (
        <motion.button
          key={category}
          onClick={() => onFilterChangeAction(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilter === category
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {category}
        </motion.button>
      ))}
    </div>
  )
}