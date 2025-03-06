'use client'

import { Animate, AnimatedCard } from '@/components/ui/animate'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Github, ExternalLink, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Project } from '@/app/projects/types'

export function AnimatedProjectCard({ project }: { project: Project }) {
	return (
		<AnimatedCard className='h-full overflow-hidden'>
			<Card className='group h-full overflow-hidden'>
				<div className='relative aspect-video overflow-hidden'>
					<Image
						src={project.image || '/images/project-placeholder.jpg'}
						alt={project.title}
						fill
						className='object-cover transition-transform duration-300 group-hover:scale-105'
					/>
					{project.featured && (
						<Badge className='absolute top-2 right-2 z-10'>Featured</Badge>
					)}
				</div>
				<CardHeader className='p-4'>
					<h3 className='line-clamp-1 text-xl font-semibold'>{project.title}</h3>
				</CardHeader>
				<CardContent className='p-4 pt-0'>
					<p className='text-muted-foreground line-clamp-3 text-sm'>
						{project.description}
					</p>
					<div className='mt-4 flex flex-wrap gap-2'>
						{project.tags.slice(0, 3).map(tag => (
							<Badge key={tag} variant='outline'>
								{tag}
							</Badge>
						))}
						{project.tags.length > 3 && (
							<Badge variant='outline'>+{project.tags.length - 3}</Badge>
						)}
					</div>
				</CardContent>
				<CardFooter className='flex gap-2 p-4 pt-0'>
					<Button asChild variant='outline' size='sm' className='flex-1'>
						<Link href={`/projects/${project.slug}`}>
							Details
							<ArrowRight className='ml-2 h-4 w-4' />
						</Link>
					</Button>
					{project.githubUrl && (
						<Button asChild variant='outline' size='icon' className='shrink-0'>
							<Link href={project.githubUrl} target='_blank' rel='noreferrer'>
								<span className='sr-only'>GitHub Repository</span>
								<Github className='h-4 w-4' />
							</Link>
						</Button>
					)}
					{project.demoUrl && (
						<Button asChild variant='outline' size='icon' className='shrink-0'>
							<Link href={project.demoUrl} target='_blank' rel='noreferrer'>
								<span className='sr-only'>Live Demo</span>
								<ExternalLink className='h-4 w-4' />
							</Link>
						</Button>
					)}
				</CardFooter>
			</Card>
		</AnimatedCard>
	)
}

export function AnimatedProjectGrid({ projects }: { projects: Project[] }) {
	//const pathname = usePathname() // Removed this line

	return (
		<div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
			{projects.map((project, index) => (
				<Animate key={project.id} variant='slide-up' delay={0.1 * index} duration={0.5}>
					<AnimatedProjectCard project={project} />
				</Animate>
			))}
		</div>
	)
}
