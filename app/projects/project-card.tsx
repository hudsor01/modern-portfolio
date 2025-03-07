'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { RevenueDashboardPreview } from './revenue-dashboard-preview'
import type { Project } from '@/lib/data/projects'
import { projectPaths } from '@/lib/data/projects-paths'

interface ProjectCardProps {
	title?: string
	description?: string
	imageUrl?: string
	technologies?: string[]
	date?: string
	githubUrl?: string
	liveUrl?: string
	project: Project
}

// Component implementation
function ProjectCardComponent({ project }: ProjectCardProps) {
	return (
		<Card className='overflow-hidden' withGradient>
			{project.image && (
				<div className='relative aspect-video w-full overflow-hidden'>
					<Image
						src={project.image}
						alt={project.title}
						fill
						className='object-cover transition-all hover:scale-105'
						sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
						loading='lazy'
						priority={project.featured}
						blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAEogJbKxoRiQAAAABJRU5ErkJggg=='
						placeholder='blur'
					/>
				</div>
			)}

			{project.id === 'revenue-dashboard' && (
				<div className='bg-muted/20 h-48 w-full overflow-hidden'>
					<RevenueDashboardPreview />
				</div>
			)}

			<CardHeader>
				<CardTitle className='line-clamp-1'>{project.title}</CardTitle>
				<CardDescription className='line-clamp-2'>{project.description}</CardDescription>
			</CardHeader>

			{project.technologies && project.technologies.length > 0 && (
				<CardContent>
					<div className='flex flex-wrap gap-2'>
						{project.technologies.map(tag => (
							<span
								key={tag}
								className='bg-muted text-muted-foreground rounded-xs px-2 py-1 text-xs'>
								{tag}
							</span>
						))}
					</div>
				</CardContent>
			)}

			<CardFooter>
				<Button variant='ghost' className='group ml-auto' asChild>
					<Link href={projectPaths[project.id] || '/projects'}>
						View Project
						<ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
					</Link>
				</Button>
			</CardFooter>
		</Card>
	)
}

// Memoize the component to prevent unnecessary re-renders
export const ProjectCard = React.memo(ProjectCardComponent)