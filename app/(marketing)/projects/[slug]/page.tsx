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
}

// Generate static params for all projects
export async function generateStaticParams() {
	const projects = await getProjects();

	return projects.map(project => ({
		slug: project.id,
	}));
}

export default async function ProjectPage({ params }: ProjectPageProps) {
	const project = await fetchProjectById(params.slug)

	if (!project) {
		notFound()
	}

	return (
		<div className='container-custom animate-fade-in py-16'>
			<Link
				href='/projects'
				className='text-muted-foreground mb-8 inline-flex items-center gap-1 hover:text-[var(--color-foreground)]'>
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
							<Link href={project.liveUrl} target='_blank' rel='noopener noreferrer'>
								<ExternalLink className='h-4 w-4' />
								View Live Project
							</Link>
						</Button>
					)}
					{project.githubUrl && (
						<Button asChild variant='outline' className='flex items-center gap-2'>
							<Link
								href={project.githubUrl}
								target='_blank'
								rel='noopener noreferrer'>
								<Github className='h-4 w-4' />
								View Source Code
							</Link>
						</Button>
					)}
				</div>
			</div>

			<div className='mb-10 overflow-hidden rounded-lg border border-[var(--color-border)/30] shadow-md'>
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

			<div className='prose-custom mx-auto max-w-3xl'>
				<section className='mb-10'>
					<h2 className='mb-4 text-2xl font-bold'>Project Overview</h2>
					<p className='text-[var(--color-foreground)/80]'>{project.description}</p>
					<p className='text-[var(--color-foreground)/80]'>
						This project was developed to streamline the revenue operations process and
						provide better visibility into key performance metrics. The solution
						incorporates data visualization, automated reporting, and user-friendly
						interfaces to make complex information accessible to stakeholders at all
						levels.
					</p>
				</section>

				<section className='mb-10'>
					<h2 className='mb-4 text-2xl font-bold'>Key Features</h2>
					<ul className='space-y-2 text-[var(--color-foreground)/80]'>
						<li>Interactive dashboard for real-time performance monitoring</li>
						<li>Automated reporting and alert system</li>
						<li>Seamless integration with existing CRM systems</li>
						<li>Custom analytics for revenue forecasting</li>
						<li>Role-based access controls for secure data sharing</li>
					</ul>
				</section>

				<section className='mb-10'>
					<h2 className='mb-4 text-2xl font-bold'>Technologies Used</h2>
					<p className='mb-4 text-[var(--color-foreground)/80]'>
						This project leverages a modern technology stack to deliver a responsive and
						powerful solution:
					</p>
					<div className='grid gap-4 sm:grid-cols-2'>
						<div>
							<h3 className='text-lg font-semibold'>Frontend</h3>
							<ul className='text-[var(--color-foreground)/80]'>
								<li>React & Next.js</li>
								<li>TypeScript</li>
								<li>Tailwind CSS</li>
								<li>Data visualization libraries</li>
							</ul>
						</div>
						<div>
							<h3 className='text-lg font-semibold'>Backend & Infrastructure</h3>
							<ul className='text-[var(--color-foreground)/80]'>
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
					<p className='text-[var(--color-foreground)/80]'>
						Implementation of this solution resulted in:
					</p>
					<ul className='space-y-2 text-[var(--color-foreground)/80]'>
						<li>40% reduction in time spent on manual reporting tasks</li>
						<li>35% improvement in forecast accuracy</li>
						<li>25% increase in team productivity through process automation</li>
						<li>Improved data-driven decision making across the organization</li>
					</ul>
				</section>

				<div className='mt-12 border-t border-[var(--color-border)] pt-8 text-center'>
					<p className='mb-6 text-lg'>
						Interested in working together on a similar project?
					</p>
					<Button asChild size='lg'>
						<Link href='/contact'>Get In Touch</Link>
					</Button>
				</div>
			</div>
		</div>
	)
}
