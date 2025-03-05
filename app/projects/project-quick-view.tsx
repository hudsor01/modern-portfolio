'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ExternalLink, Github, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from '@/components/ui/drawer'
import { Project } from '@/lib/data/projects'

interface ProjectQuickViewProps {
	project: Project
	open: boolean
	onOpenChange: () => void
}

export function ProjectQuickView({ project, open, onOpenChange }: ProjectQuickViewProps) {
	return (
		<Drawer open={open} onOpenChange={onOpenChange}>
			<DrawerContent className='max-h-[90vh]'>
				<DrawerHeader className='flex items-center justify-between'>
					<div>
						<DrawerTitle>{project.title}</DrawerTitle>
						<DrawerDescription className='mt-2 max-w-3xl'>
							{project.description}
						</DrawerDescription>
					</div>
					<DrawerClose asChild>
						<Button variant='ghost' size='icon'>
							<X className='h-4 w-4' />
						</Button>
					</DrawerClose>
				</DrawerHeader>

				<div className='px-4 pb-4'>
					<div className='relative aspect-video w-full overflow-hidden rounded-lg'>
						<Image
							src={project.image || '/images/project-placeholder.jpg'}
							alt={project.title}
							fill
							className='object-cover'
						/>
					</div>

					<div className='mt-6 space-y-4'>
						<div>
							<h3 className='text-sm font-medium'>Technologies</h3>
							<div className='mt-2 flex flex-wrap gap-2'>
								{project.technologies?.map(tech => (
									<Badge key={tech} variant='secondary' className='text-xs'>
										{tech}
									</Badge>
								))}
							</div>
						</div>

						{project.features && project.features.length > 0 && (
							<div>
								<h3 className='text-sm font-medium'>Key Features</h3>
								<ul className='text-muted-foreground mt-2 space-y-1 text-sm'>
									{project.features.map((feature, index) => (
										<li key={index} className='flex items-center'>
											<span className='bg-primary mr-2 h-1 w-1 rounded-full'></span>
											{feature}
										</li>
									))}
								</ul>
							</div>
						)}
					</div>
				</div>

				<DrawerFooter className='flex flex-row justify-end space-x-2'>
					<Button asChild variant='outline'>
						<Link href={`/projects/${project.id}`}>View Details</Link>
					</Button>

					{project.liveUrl && (
						<Button asChild>
							<a href={project.liveUrl} target='_blank' rel='noopener noreferrer'>
								<ExternalLink className='mr-2 h-4 w-4' />
								Live Demo
							</a>
						</Button>
					)}

					{project.githubUrl && (
						<Button asChild variant='secondary'>
							<a href={project.githubUrl} target='_blank' rel='noopener noreferrer'>
								<Github className='mr-2 h-4 w-4' />
								Source Code
							</a>
						</Button>
					)}
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}
