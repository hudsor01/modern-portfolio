import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Github, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { fetchProjectById } from '@/lib/actions/projects'
import { getProjects } from '@/lib/data/projects'

interface ProjectPageProps {
	params: {
		slug: string
	}
	searchParams: { [key: string]: string | string[] | undefined }
}

// Generate static params for all projects
export async function generateStaticParams() {
	const projects = await getProjects()

	return projects.map(project => ({
		slug: project.slug,
	}))
}

export default async function ProjectPage({ params }: ProjectPageProps) {
	let project = null
	try {
		project = await fetchProjectById(params.slug)
		if (!project) {
			notFound()
		}
	} catch (error) {
		console.error('Failed to fetch project:', error)
		notFound()
	}

	const projectDescription = `This project was developed to streamline the revenue operations process and
  provide better visibility into key performance metrics. The solution
  incorporates data visualization, automated reporting, and user-friendly
  interfaces to make complex information accessible to stakeholders at all
  levels.`

	return (
		<div className='container-custom animate-fade-in py-16'>
			<Link
				href={{ pathname: '/projects' }}
				className='text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-1'>
				<ArrowLeft className='h-4 w-4' />
				<span>Back to all projects</span>
			</Link>

			<div className='mb-8'>
				<h1 className='text-4xl font-bold tracking-tight sm:text-5xl'>{project.title}</h1>
				<div className='mt-4 flex flex-wrap gap-2'>
					{project.technologies?.map((tech: string) => (
						<Badge
							key={tech}
							variant='secondary'
							className='bg-primary/10 text-primary'>
							{tech}
						</Badge>
					))}
				</div>
				<div className='mt-6 flex flex-wrap gap-4'>
					{project.liveUrl && (
						<Button asChild className='flex items-center gap-2'>
							<a href={project.liveUrl} target='_blank' rel='noopener noreferrer'>
								<ExternalLink className='h-4 w-4' />
								View Live Project
							</a>
						</Button>
					)}
					{project.githubUrl && (
						<Button asChild variant='outline' className='flex items-center gap-2'>
							<a href={project.githubUrl} target='_blank' rel='noopener noreferrer'>
								<Github className='h-4 w-4' />
								View Source Code
							</a>
						</Button>
					)}
				</div>
			</div>

			<div className='border-border/30 mb-10 overflow-hidden rounded-lg border shadow-md'>
				<div className='relative h-[300px] w-full sm:h-[400px] md:h-[500px]'>
					<Image
						src={project.image || '/images/project-placeholder.jpg'}
						alt={project.title}
						fill
						className='object-cover'
						priority
					/>
				</div>
			</div>

			<div className='content-container mx-auto'>
				<section className='mb-10'>
					<h2 className='mb-4 text-2xl font-bold'>Project Overview</h2>
					<p className='text-foreground/80'>{project.description}</p>
					<p className='text-foreground/80'>{projectDescription}</p>
				</section>

				<section className='mb-10'>
					<h2 className='mb-4 text-2xl font-bold'>Key Features</h2>
					<ul className='text-foreground/80 space-y-2'>
						<li>Interactive dashboard for real-time performance monitoring</li>
						<li>Automated reporting and alert system</li>
						<li>Seamless integration with existing CRM systems</li>
						<li>Custom analytics for revenue forecasting</li>
						<li>Role-based access controls for secure data sharing</li>
					</ul>
				</section>

				<section className='mb-10'>
					<h2 className='mb-4 text-2xl font-bold'>Technologies Used</h2>
					<p className='text-foreground/80 mb-4'>
						This project leverages a modern technology stack to deliver a responsive and
						powerful solution:
					</p>
					<div className='grid gap-4 sm:grid-cols-2'>
						<div>
							<h3 className='text-lg font-semibold'>Frontend</h3>
							<ul className='text-foreground/80'>
								<li>React & Next.js</li>
								<li>TypeScript</li>
								<li>Tailwind CSS</li>
								<li>Data visualization libraries</li>
							</ul>
						</div>
						<div>
							<h3 className='text-lg font-semibold'>Backend & Infrastructure</h3>
							<ul className='text-foreground/80'>
								<li>Node.js</li>
								<li>PostgreSQL database</li>
								<li>RESTful API design</li>
								<li>Cloud deployment</li>
							</ul>
						</div>
					</div>
				</section>

				<section className='mb-10'>
					<h2 className='mb-4 text-2xl font-bold'>Results & Impact</h2>
					<p className='text-foreground/80'>
						Implementation of this solution resulted in:
					</p>
					<ul className='text-foreground/80 space-y-2'>
						<li>40% reduction in time spent on manual reporting tasks</li>
						<li>35% improvement in forecast accuracy</li>
						<li>25% increase in team productivity through process automation</li>
						<li>Improved data-driven decision making across the organization</li>
					</ul>
				</section>

				<div className='border-border mt-12 border-t pt-8 text-center'>
					<p className='mb-6 text-lg'>
						Interested in working together on a similar project?
					</p>
					<Button asChild size='lg'>
						<Link href={{ pathname: '/contact' }}>Get In Touch</Link>
					</Button>
				</div>
			</div>
		</div>
	)
}
