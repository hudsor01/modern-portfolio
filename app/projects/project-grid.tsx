'use client'

import { useState } from 'react'
import { ProjectCard } from './project-card'
import type { Project } from '@/lib/data/projects'

interface ProjectGridProps {
	projects: Project[]
	featured?: boolean
	maxDisplay?: number
}

export function ProjectGrid({ projects, featured = false, maxDisplay = 100 }: ProjectGridProps) {
	const [filter, setFilter] = useState<string | null>(null)

	// Get unique technologies from all projects
	const allTechnologies = Array.from(
		new Set(projects.flatMap(project => project.technologies || []))
	).sort()

	// Apply featured filter if needed
	const featuredFiltered = featured ? projects.filter(p => p.featured) : projects

	// Filter projects by technology if filter is set
	const filteredProjects =
		filter ? featuredFiltered.filter(p => p.technologies?.includes(filter)) : featuredFiltered

	// Limit number of displayed projects
	const displayProjects = filteredProjects.slice(0, maxDisplay)

	return (
		<div className='space-y-8'>
			{allTechnologies.length > 0 && (
				<div className='mb-6 flex flex-wrap items-center gap-2'>
					<span className='text-sm font-medium'>Filter by:</span>
					<div className='flex flex-wrap gap-2'>
						<button
							className={`rounded-full px-3 py-1 text-sm transition-colors ${
								filter === null ?
									'bg-[var(--color-primary)] text-white'
								:	'bg-[var(--color-primary)/10] text-[var(--color-primary)] hover:bg-[var(--color-primary)/20]'
							}`}
							onClick={() => setFilter(null)}>
							All
						</button>
						{allTechnologies.map(tech => (
							<button
								key={tech}
								className={`rounded-full px-3 py-1 text-sm transition-colors ${
									filter === tech ?
										'bg-[var(--color-primary)] text-white'
									:	'bg-[var(--color-primary)/10] text-[var(--color-primary)] hover:bg-[var(--color-primary)/20]'
								}`}
								onClick={() => setFilter(tech)}>
								{tech}
							</button>
						))}
					</div>
				</div>
			)}

			<div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
				{displayProjects.map(project => (
					<ProjectCard key={project.id} project={project} />
				))}
			</div>

			{displayProjects.length === 0 && (
				<div className='py-12 text-center'>
					<p className='text-[var(--color-foreground)/70]'>
						No projects found matching your criteria.
					</p>
				</div>
			)}
		</div>
	)
}
