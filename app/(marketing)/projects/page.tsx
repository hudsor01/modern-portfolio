'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getAllProjects } from '@/lib/data/projects'
import { ProjectTabs } from './project-tabs'
import { HeadlessTabs } from '@/components/ui/tabs-headless'
import { ProjectGrid } from './project-grid'
import { ProjectCarousel } from './project-carousel'
import { Project } from '@/lib/data/projects'

export default function ProjectsPage() {
	const [projects, setProjects] = useState<Project[]>([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const fetchProjects = async () => {
			try {
				const data = await getAllProjects()
				setProjects(data)
			} catch (error) {
				console.error('Failed to fetch projects', error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchProjects()
	}, [])

	// Views for different project display options
	const tabItems = [
		{
			key: 'grid',
			title: 'Grid View',
			content: <ProjectGrid projects={projects} />,
		},
		{
			key: 'carousel',
			title: 'Carousel',
			content: <ProjectCarousel projects={projects} />,
		},
		{
			key: 'categories',
			title: 'Categories',
			content: <ProjectTabs projects={projects} />,
		},
	]

	return (
		<div className='container-custom py-16'>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='mb-12 text-center'>
				<h1 className='text-4xl font-bold tracking-tight sm:text-5xl'>Projects</h1>
				<p className='text-muted-foreground mx-auto mt-4 max-w-2xl text-lg'>
					A collection of my recent projects showcasing expertise in revenue operations,
					process optimization, and data-driven solutions.
				</p>
			</motion.div>

			{isLoading ?
				<div className='flex h-60 items-center justify-center'>
					<div className='border-primary h-10 w-10 animate-spin rounded-full border-4 border-t-transparent' />
				</div>
			:	<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2, duration: 0.5 }}>
					<HeadlessTabs items={tabItems} variant='pills' />
				</motion.div>
			}
		</div>
	)
}
