'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { HeadlessTabs } from '@/components/ui/tabs-headless'
import { ProjectCarousel } from './project-carousel'
import { Project as BaseProject } from '@/lib/data/projects'

// Extend the Project interface to include tags
interface Project extends BaseProject {
	tags?: string[]
}

interface ProjectTabsProps {
	projects: Project[]
}

export function ProjectTabs({ projects }: ProjectTabsProps) {
	// Generate unique categories from project tags/technologies
	const allCategories = React.useMemo(() => {
		const categories = new Set<string>()
		projects.forEach(project => {
			project.tags?.forEach((tag: string) => categories.add(tag))
		})
		return ['All', ...Array.from(categories)]
	}, [projects])

	// Filter projects by category
	const getFilteredProjects = (category: string): Project[] => {
		if (category === 'All') return projects
		return projects.filter(project => project.tags?.includes(category))
	}

	// Create tab items
	const tabItems = allCategories.map(category => ({
		key: category,
		title: category,
		content: (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.3 }}>
				<ProjectCarousel
					projects={getFilteredProjects(category)}
					subtitle={`${getFilteredProjects(category).length} projects in this category`}
				/>
			</motion.div>
		),
	}))

	return (
		<div className='my-8'>
			<HeadlessTabs items={tabItems} variant='pills' />
		</div>
	)
}
