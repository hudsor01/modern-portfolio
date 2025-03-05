'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { fetchProjects } from '@/lib/actions/projects'
import { ProjectTabs } from './project-tabs'
import { HeadlessTabs } from '@/components/ui/tabs-headless'
import { ProjectGrid } from './project-grid'
import { Project } from '@/lib/data/projects'
import SwiperCarousel from './SwiperCarousel'
import { MoveRight, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { SuspenseWrapper } from '@/components/suspense-wrapper'

// The metadata is exported from './metadata.ts' for Next.js SEO

export default function ProjectsPage() {
	const [projects, setProjects] = useState<Project[]>([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const getProjects = async () => {
			try {
				const data = await fetchProjects()
				setProjects(data)
			} catch (error) {
				console.error('Failed to fetch projects', error)
			} finally {
				setIsLoading(false)
			}
		}

		getProjects()
	}, [])

	// Count technology frequencies across all projects
	const getTechnologyCounts = () => {
		const counts: Record<string, number> = {}
		projects.forEach(project => {
			;(project.technologies || []).forEach(tech => {
				counts[tech] = (counts[tech] || 0) + 1
			})
		})
		return Object.entries(counts)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 6)
			.map(([tech, count]) => ({ name: tech, count }))
	}

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
			content: <SwiperCarousel projects={projects} />,
		},
		{
			key: 'categories',
			title: 'Categories',
			content: <ProjectTabs projects={projects} />,
		},
	]

	// Top technologies
	const topTechnologies = getTechnologyCounts()

	return (
		<div className='container mx-auto max-w-7xl px-4 py-16'>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='mb-16 space-y-8'>
				{/* Header Section */}
				<div className='text-center'>
					<Badge className='bg-primary/10 text-primary border-primary/20 mb-4 px-3 py-1'>
						Portfolio
					</Badge>
					<h1 className='mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl'>
						Revenue Operations
						<span className='from-primary to-primary/60 bg-gradient-to-r bg-clip-text text-transparent'>
							{' '}
							Projects
						</span>
					</h1>
					<p className='text-muted-foreground mx-auto mt-4 max-w-2xl text-lg md:text-xl'>
						A collection of innovative solutions showcasing expertise in revenue
						operations, process optimization, and data-driven business intelligence.
					</p>
				</div>

				{/* Technology Badges */}
				{!isLoading && topTechnologies.length > 0 && (
					<div className='flex flex-wrap justify-center gap-3 py-4'>
						<span className='text-muted-foreground mr-2 flex items-center text-sm'>
							<Sparkles className='text-primary mr-1 h-4 w-4' />
							Top technologies:
						</span>
						{topTechnologies.map(({ name, count }) => (
							<Badge
								key={name}
								variant='outline'
								className='bg-primary/5 hover:bg-primary/10 px-3 py-1.5 transition-colors'
								title={`Used in ${count} project${count !== 1 ? 's' : ''}`}>
								{name}
							</Badge>
						))}
						<span className='text-muted-foreground ml-1 flex items-center text-sm'>
							<MoveRight className='mr-1 h-3 w-3' />
							and more
						</span>
					</div>
				)}
			</motion.div>

			{/* Project Views */}
			{isLoading ?
				<div className='flex min-h-[400px] flex-col items-center justify-center space-y-6'>
					<div className='border-primary h-10 w-10 animate-spin rounded-full border-4 border-t-transparent' />
					<p className='text-muted-foreground animate-pulse'>
						Loading amazing projects...
					</p>
				</div>
			:	<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2, duration: 0.5 }}
					className='bg-card/40 rounded-xl border p-6 backdrop-blur-sm'>
					<SuspenseWrapper>
						<HeadlessTabs items={tabItems} variant='pills' />
					</SuspenseWrapper>
				</motion.div>
			}
		</div>
	)
}
