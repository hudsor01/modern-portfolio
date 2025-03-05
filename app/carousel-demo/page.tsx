'use client'

import {
	Carousel,
	AutoplayCarousel,
	FadeCarousel,
	EffectCarousel,
	ProjectCarousel,
	InteractiveCarousel,
} from '@/components/ui/carousel'
import type { CarouselImage } from '@/components/ui/carousel'

export default function CarouselDemoPage() {
	// Example image data for all carousels
	const demoImages: CarouselImage[] = [
		{
			src: '/images/projects/revenue-dashboard.jpg',
			alt: 'Revenue Dashboard',
		},
		{
			src: '/images/projects/marketing-automation.jpg',
			alt: 'Marketing Automation',
		},
		{
			src: '/images/projects/lead-generation.jpg',
			alt: 'Lead Generation',
		},
		{
			src: '/images/projects/data-visualization.jpg',
			alt: 'Data Visualization',
		},
	]

	// Fallback for missing images
	const placeholderImages: CarouselImage[] = [
		{
			src: '/placeholder.svg?height=600&width=800',
			alt: 'Demo Slide 1',
		},
		{
			src: '/placeholder.svg?height=600&width=800',
			alt: 'Demo Slide 2',
		},
		{
			src: '/placeholder.svg?height=600&width=800',
			alt: 'Demo Slide 3',
		},
		{
			src: '/placeholder.svg?height=600&width=800',
			alt: 'Demo Slide 4',
		},
	]

	// Use real images if available, fallback to placeholders
	const images = demoImages[0].src.includes('placeholder') ? placeholderImages : demoImages

	return (
		<div className='container-custom py-16'>
			<h1 className='mb-8 text-4xl font-bold'>Carousel Components</h1>
			<p className='text-muted-foreground mb-12 max-w-3xl'>
				A collection of responsive, accessible carousel components for your projects. Each
				carousel offers different features, transitions, and customization options.
			</p>

			<div className='space-y-16'>
				{/* Basic Carousel */}
				<section>
					<h2 className='mb-6 text-2xl font-bold'>Basic Carousel</h2>
					<p className='text-muted-foreground mb-4'>
						A simple carousel with navigation arrows and pagination dots.
					</p>
					<Carousel
						images={images}
						height={400}
						showNavigation={true}
						showPagination={true}
					/>
				</section>

				{/* Autoplay Carousel */}
				<section>
					<h2 className='mb-6 text-2xl font-bold'>Autoplay Carousel</h2>
					<p className='text-muted-foreground mb-4'>
						This carousel automatically transitions between slides every 3 seconds.
					</p>
					<AutoplayCarousel images={images} height={400} autoplayDelay={3000} />
				</section>

				{/* Fade Transition */}
				<section>
					<h2 className='mb-6 text-2xl font-bold'>Fade Transition</h2>
					<p className='text-muted-foreground mb-4'>
						A carousel with smooth fade transitions between slides.
					</p>
					<FadeCarousel images={images} height={400} autoplay={true} />
				</section>

				{/* Cube Effect */}
				<section>
					<h2 className='mb-6 text-2xl font-bold'>Cube Effect</h2>
					<p className='text-muted-foreground mb-4'>
						A 3D cube rotation effect between slides.
					</p>
					<EffectCarousel images={images} effect='cube' height={400} />
				</section>

				{/* Flip Effect */}
				<section>
					<h2 className='mb-6 text-2xl font-bold'>Flip Effect</h2>
					<p className='text-muted-foreground mb-4'>
						A 3D flip transition between slides.
					</p>
					<EffectCarousel images={images} effect='flip' height={400} />
				</section>

				{/* Cards Effect */}
				<section>
					<h2 className='mb-6 text-2xl font-bold'>Cards Effect</h2>
					<p className='text-muted-foreground mb-4'>A card-stack transition effect.</p>
					<EffectCarousel images={images} effect='cards' height={400} />
				</section>

				{/* Project Carousel */}
				<section>
					<h2 className='mb-6 text-2xl font-bold'>Project Carousel</h2>
					<p className='text-muted-foreground mb-4'>
						A carousel specifically designed for showcasing projects with a title and
						description.
					</p>
					<ProjectCarousel
						images={images}
						title='Revenue Dashboard Project'
						description='An interactive dashboard for tracking and analyzing revenue metrics with advanced visualization features.'
						height={400}
						autoplay={true}
					/>
				</section>

				{/* Interactive Demo */}
				<section>
					<h2 className='mb-6 text-2xl font-bold'>Interactive Demo</h2>
					<p className='text-muted-foreground mb-4'>
						A fully customizable carousel where you can experiment with different
						settings.
					</p>
					<InteractiveCarousel images={images} initialEffect='slide' />
				</section>
			</div>
		</div>
	)
}
