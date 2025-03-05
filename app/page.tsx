import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ProjectSwiper } from '@/app/projects/project-swiper'
import { fetchFeaturedProjects } from '@/lib/actions/projects'
import { Button } from '@/components/ui/button'
import { ResumeDownload } from '@/app/resume/resume-download'
import { FileText, Github, Linkedin, Mail } from 'lucide-react'

async function HomePage() {
	// Get featured projects using server action
	const featuredProjects = await fetchFeaturedProjects()

	return (
		<div className='container mx-auto space-y-20 px-4 py-12'>
			{/* Hero Section */}
			<section className='grid grid-cols-1 items-center gap-10 md:grid-cols-5'>
				<div className='space-y-6 md:col-span-3'>
					<div>
						<h1 className='from-primary to-primary/60 animate-in slide-in-from-left mb-4 bg-gradient-to-r bg-clip-text text-5xl font-bold tracking-tight text-transparent duration-500'>
							Richard Hudson
						</h1>
						<p className='text-muted-foreground animate-in slide-in-from-left text-2xl delay-150 duration-500'>
							Revenue Operations Professional
						</p>
					</div>

					<p className='text-muted-foreground animate-in slide-in-from-left max-w-2xl text-lg delay-300 duration-500'>
						Driving business growth through data-driven insights, process optimization,
						and strategic operational improvements.
					</p>

					<div className='animate-in slide-in-from-left flex flex-wrap gap-4 delay-500 duration-500'>
						<ResumeDownload variant='default' size='lg' label='Download Resume' />
						<Button asChild variant='outline' size='lg'>
							<Link href='/resume'>
								<FileText className='mr-2 h-4 w-4' />
								View Resume
							</Link>
						</Button>
					</div>

					<div className='animate-in slide-in-from-left flex items-center gap-6 pt-2 delay-700 duration-500'>
						<a
							href='https://linkedin.com/in/richardhudsonjr'
							target='_blank'
							rel='noopener noreferrer'
							className='text-muted-foreground hover:text-primary transition-colors'>
							<Linkedin className='h-5 w-5' />
							<span className='sr-only'>LinkedIn</span>
						</a>
						<a
							href='https://github.com/hudsonr01'
							target='_blank'
							rel='noopener noreferrer'
							className='text-muted-foreground hover:text-primary transition-colors'>
							<Github className='h-5 w-5' />
							<span className='sr-only'>GitHub</span>
						</a>
						<a
							href='mailto:richard.hudson@example.com'
							className='text-muted-foreground hover:text-primary transition-colors'>
							<Mail className='h-5 w-5' />
							<span className='sr-only'>Email</span>
						</a>
					</div>
				</div>

				<div className='animate-in slide-in-from-right flex justify-center duration-700 md:col-span-2 md:justify-end'>
					<div className='ring-background relative h-60 w-60 overflow-hidden rounded-full shadow-2xl ring-4 md:h-80 md:w-80'>
						<Image
							src='/images/richard.jpg'
							alt='Richard Hudson'
							fill
							priority
							className='object-cover'
							sizes='(max-width: 768px) 240px, 320px'
							quality={90}
						/>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className='grid grid-cols-1 gap-8 py-10 md:grid-cols-3'>
				<div className='bg-muted/50 border-border animate-in fade-in-50 rounded-lg border p-6 shadow-sm duration-1000'>
					<p className='text-primary mb-2 text-4xl font-bold'>$1.1M+</p>
					<h3 className='mb-2 text-xl font-medium'>Revenue Growth</h3>
					<p className='text-muted-foreground'>
						Spearheaded strategies resulting in annual revenue growth through
						data-driven optimization.
					</p>
				</div>
				<div className='bg-muted/50 border-border animate-in fade-in-50 rounded-lg border p-6 shadow-sm delay-300 duration-1000'>
					<p className='text-primary mb-2 text-4xl font-bold'>2,200%</p>
					<h3 className='mb-2 text-xl font-medium'>Network Expansion</h3>
					<p className='text-muted-foreground'>
						Led initiatives resulting in significant partner network growth and
						transaction increase.
					</p>
				</div>
				<div className='bg-muted/50 border-border animate-in fade-in-50 rounded-lg border p-6 shadow-sm delay-600 duration-1000'>
					<p className='text-primary mb-2 text-4xl font-bold'>40%</p>
					<h3 className='mb-2 text-xl font-medium'>Process Optimization</h3>
					<p className='text-muted-foreground'>
						Implemented cross-functional workflow integrations, reducing processing
						time.
					</p>
				</div>
			</section>

			<ProjectSwiper
				projects={featuredProjects}
				title='Featured Projects'
				subtitle='Check out some of my recent work'
			/>

			{/* Skills Section */}
			<section className='py-10'>
				<h2 className='animate-in slide-in-from-bottom mb-8 text-3xl font-bold duration-700'>
					Skills & Expertise
				</h2>
				<div className='animate-in slide-in-from-bottom flex flex-wrap gap-3 delay-300 duration-700'>
					{[
						'Data Analysis',
						'Revenue Operations',
						'Process Optimization',
						'Strategic Planning',
						'Cross-functional Leadership',
						'Business Intelligence',
						'Project Management',
						'Team Leadership',
						'Sales Enablement',
						'Pipeline Management',
						'KPI Development',
						'CRM Systems',
					].map(skill => (
						<div
							key={skill}
							className='bg-primary/10 text-primary-foreground rounded-full px-4 py-2 text-sm font-medium'>
							{skill}
						</div>
					))}
				</div>
			</section>
		</div>
	)
}

export default HomePage
