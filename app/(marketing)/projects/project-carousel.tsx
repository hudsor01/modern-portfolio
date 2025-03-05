import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Info, ExternalLink } from 'lucide-react'
import { Project } from '@/lib/data/projects'
import { ProjectQuickView } from './project-quick-view'
import { DotButton, PrevButton, NextButton } from './carousel-buttons'

interface Props {
	title?: string
	subtitle?: string
	projects: Project[]
}

export default function ProjectCarousel({ title, subtitle, projects }: Props) {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false)

	const [selectedProject, setSelectedProject] = useState<Project | null>(null)

	// Initialize Embla Carousel with loop, dragFree, and Autoplay plugins
	const [emblaRef, emblaApi] = useEmblaCarousel(
		{ loop: true, dragFree: true }, // Enable looping and drag-free scrolling
		[
			Autoplay({
				stopOnInteraction: true, // Stop autoplay on user interaction (dragging, clicking)
				stopOnMouseEnter: false, // Don't stop autoplay on mouse hover (optional, can be changed to true)
				delay: 5000, // Delay between slides in milliseconds (5 seconds)
			}),
		]
	)

	const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

	// Function to open the quick view modal
	const handleOpenQuickView = (project: Project) => {
		setSelectedProject(project)
		setIsDrawerOpen(true)
	}

	// Function to update the scroll snaps
	const onSelect = useCallback(() => {
		if (!emblaApi) return // Return early if emblaApi is not yet initialized
		setScrollSnaps(emblaApi.scrollSnapList()) // Update the scroll snaps
	}, [emblaApi])

	// Effect hook to manage the onSelect function
	useEffect(() => {
		if (!emblaApi) return // Return early if emblaApi is not yet initialized

		onSelect() // Call onSelect to set the scrollSnaps

		// Add event listeners for 'select' and 'reInit' events
		emblaApi.on('select', onSelect)
		emblaApi.on('reInit', onSelect)
	}, [emblaApi, onSelect])

	// Return early if there are no projects
	if (!projects || projects.length === 0) {
		return <div className='p-4 text-center'>No projects available</div>
	}

	return (
		<section className='py-10'>
			{/* Title and subtitle section (optional) */}
			{(title || subtitle) && (
				<div className='mb-8 text-center'>
					{title && <h2 className='text-3xl font-bold'>{title}</h2>}
					{subtitle && <p className='text-muted-foreground mt-2'>{subtitle}</p>}
				</div>
			)}

			{/* Main carousel container */}
			<div className='relative'>
				{/* Embla carousel viewport */}
				<div className='overflow-hidden' ref={emblaRef}>
					{/* Embla carousel container */}
					<div className='flex touch-pan-y gap-4'>
						{/* Map over the projects to create carousel slides */}
						{projects.map(project => (
							<div
								key={project.id}
								className='relative min-w-[80%] flex-[0_0_80%] px-4 sm:min-w-[50%] sm:flex-[0_0_50%] md:min-w-[33.33333%] md:flex-[0_0_33.33333%] lg:min-w-[25%] lg:flex-[0_0_25%]'>
								<div className='bg-card h-full rounded-lg border p-3 shadow-sm'>
									<div className='group relative aspect-video overflow-hidden rounded-lg'>
										{/* Project image (if available) */}
										{project.image ?
											<Image
												src={project.image}
												alt={project.title}
												fill
												className='object-cover transition-transform duration-300 group-hover:scale-105'
												sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
												priority
											/>
										:	<div className='bg-muted-foreground/20 flex h-full w-full items-center justify-center'>
												No Image
											</div>
										}
										{/* Image overlay with buttons */}
										<div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
											<div className='absolute bottom-0 w-full p-4'>
												<div className='flex flex-wrap gap-2'>
													<Button
														onClick={() => handleOpenQuickView(project)}
														variant='outline'
														size='sm'
														className='bg-background/95 text-xs backdrop-blur-sm'>
														<Info className='mr-1 h-3 w-3' />
														Quick View
													</Button>
													<Button
														asChild
														variant='outline'
														size='sm'
														className='bg-background/95 text-xs backdrop-blur-sm'>
														<Link href={`/projects/${project.id}`}>
															Details
														</Link>
													</Button>
													{project.liveUrl && (
														<Button
															asChild
															variant='outline'
															size='sm'
															className='bg-background/95 text-xs backdrop-blur-sm'>
															<a
																href={project.liveUrl}
																target='_blank'
																rel='noopener noreferrer'>
																<ExternalLink className='mr-1 h-3 w-3' />
																Live Demo
															</a>
														</Button>
													)}
												</div>
											</div>
										</div>
									</div>
									{/* Project title and description */}
									<h3 className='mt-3 text-lg font-semibold'>{project.title}</h3>
									<p className='text-muted-foreground line-clamp-2 text-sm'>
										{project.description}
									</p>
									{/* Project technologies (badges) */}
									<div className='mt-3 flex flex-wrap gap-2'>
										{(project.technologies || []).slice(0, 3).map(tech => (
											<Badge
												key={tech}
												variant='outline'
												className='bg-primary/5 text-xs'>
												{tech}
											</Badge>
										))}
										{/* Show "+n more" badge if there are more than 3 technologies */}
										{(project.technologies || []).length > 3 && (
											<Badge
												variant='outline'
												className='bg-muted/50 text-xs'>
												+{(project.technologies || []).length - 3} more
											</Badge>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Carousel navigation buttons and dots */}
				<div className='mt-4 flex w-full items-center justify-between px-4'>
					<PrevButton embla={emblaApi} />
					<div className='flex items-center gap-2'>
						{scrollSnaps.map((_, index) => (
							<DotButton key={index} embla={emblaApi} index={index} />
						))}
					</div>
					<NextButton embla={emblaApi} />
				</div>
			</div>

			{/* Project quick view modal */}
			{selectedProject && (
				<ProjectQuickView
					open={isDrawerOpen}
					onOpenChange={() => setIsDrawerOpen(false)}
					project={selectedProject}
				/>
			)}
		</section>
	)
}
function useState(arg0: boolean): [any, any] {
	throw new Error('Function not implemented.')
}

function useState(arg0: boolean): [any, any] {
	throw new Error('Function not implemented.')
}
