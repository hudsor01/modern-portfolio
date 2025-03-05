'use client'

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

interface ProjectCardProps {
	project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
	return (
		<Card className='overflow-hidden transition-all hover:shadow-lg'>
			{project.image && (
				<div className='relative h-48 w-full overflow-hidden'>
					<Image
						src={project.image}
						alt={project.title}
						fill
						className='object-cover transition-all hover:scale-105'
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
								className='bg-muted text-muted-foreground rounded-md px-2 py-1 text-xs'>
								{tag}
							</span>
						))}
					</div>
				</CardContent>
			)}

			<CardFooter>
				<Button variant='ghost' className='group ml-auto' asChild>
					<Link href={`/projects/${project.id}`}>
						View Project
						<ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
					</Link>
				</Button>
			</CardFooter>
		</Card>
	)
}
