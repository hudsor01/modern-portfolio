'use client'

import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules'
import { Project } from '@/lib/data/projects'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExternalLink } from 'lucide-react'
import { projectPaths } from '@/lib/data/projects-paths'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

interface SwiperCarouselProps {
	projects: Project[]
}

function SwiperCarousel({ projects = [] }: SwiperCarouselProps) {

	if (!projects || projects.length === 0) {
		return <div className='bg-muted/30 rounded-lg p-6 text-center'>No projects available</div>
	}

	const safeProjects = Array.isArray(projects) ? projects : []

	return (
		<div className='space-y-8'>
			<Swiper
				modules={[Navigation, Pagination, Autoplay, EffectFade]}
				effect='fade'
				slidesPerView={1}
				spaceBetween={30}
				loop={true}
				autoplay={{
					delay: 5000,
					disableOnInteraction: false,
				}}
				pagination={{
					clickable: true,
				}}
				navigation={true}
				className='overflow-hidden rounded-xl'
				>
				{safeProjects.map(project => (
					<SwiperSlide key={project.id || `project-${Math.random()}`}>
						<div className='relative aspect-[16/9] w-full'>
							<Image
								src={project.image || '/placeholder.svg'}
								alt={project.title || 'Project Image'}
								fill
								className='object-cover'
								sizes='(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px'
								priority={true}
							/>
							<div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent'>
								<div className='absolute bottom-0 left-0 w-full p-6 md:p-8'>
									<h3 className='mb-2 text-xl font-bold text-white md:text-2xl'>
										{project.title || 'Project'}
									</h3>
									<p className='mb-4 line-clamp-2 max-w-2xl text-white/80 md:line-clamp-3'>
										{project.description || 'No description available'}
									</p>
									<div className='mb-4 flex flex-wrap gap-2'>
										{(project.technologies || [])
											.slice(0, 5)
											.map((tech, index) => (
												<Badge
													key={`${tech}-${index}`}
													variant='secondary'
													className='bg-primary/20 text-white'>
													{tech}
												</Badge>
											))}
									</div>
									<div className='flex flex-wrap gap-3'>
										{project.id && (
											<Button
												asChild
												variant='default'
												className='hover:bg-primary/90'>
												<Link
													href={projectPaths[project.id] || '/projects'}>
													View Details
												</Link>
											</Button>
										)}
										{project.liveUrl && (
											<Button
												asChild
												variant='outline'
												className='bg-background/20 hover:bg-background/30 border-white/20 text-white backdrop-blur-sm hover:text-white'>
												<a
													href={project.liveUrl}
													target='_blank'
													rel='noopener noreferrer'>
													<ExternalLink className='mr-2 h-4 w-4' />
													Live Demo
												</a>
											</Button>
										)}
									</div>
								</div>
							</div>
						</div>
					</SwiperSlide>
				))}
			</Swiper>

			<div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
				{safeProjects.map((project, index) => (
					<div
						key={project.id || `grid-project-${index}`}
						className='card-hover bg-card overflow-hidden rounded-lg border'>
						<div className='group relative aspect-video w-full overflow-hidden'>
							{project.image && (
								<Image
									src={project.image}
									alt={project.title || 'Project Image'}
									fill
									className='object-cover transition-all duration-300 group-hover:scale-105'
									sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
								/>
							)}
							<div className='absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-all duration-300 group-hover:opacity-100'>
								<div className='absolute bottom-0 w-full p-4'>
									<div className='flex flex-wrap gap-2'>
										{project.id && (
											<Button
												asChild
												variant='outline'
												size='sm'
												className='bg-background/80 backdrop-blur-sm'>
												<Link
													href={projectPaths[project.id] || '/projects'}>
													View Details
												</Link>
											</Button>
										)}
									</div>
								</div>
							</div>
						</div>

						<div className='p-4'>
							<h3 className='line-clamp-1 text-lg font-semibold'>
								{project.title || 'Project'}
							</h3>
							<p className='text-muted-foreground mt-1 line-clamp-2 text-sm'>
								{project.description || 'No description available'}
							</p>
							<div className='mt-3 flex flex-wrap gap-1.5'>
								{(project.technologies || []).slice(0, 3).map((tech, idx) => (
									<Badge
										key={`${tech}-${idx}`}
										variant='outline'
										className='bg-primary/5 text-xs'>
										{tech}
									</Badge>
								))}
								{(project.technologies || []).length > 3 && (
									<Badge variant='outline' className='bg-muted/50 text-xs'>
										+{(project.technologies || []).length - 3} more
									</Badge>
								)}
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default SwiperCarousel
