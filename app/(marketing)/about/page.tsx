import Image from 'next/image'
import Link from 'next/link'
import { BadgeCheck, Briefcase, GraduationCap, Coffee, Medal, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata = {
	title: 'About Richard | Revenue Operations & Process Optimization Specialist',
	description:
		"Learn about Richard Hudson's background, expertise, and approach to revenue operations and process optimization.",
}

export default function AboutPage() {
	return (
		<div className='container-custom py-16'>
			<div className='mb-12 text-center'>
				<h1 className='text-4xl font-bold tracking-tight sm:text-5xl'>About Richard</h1>
				<p className='text-foreground/70 mx-auto mt-4 max-w-2xl text-lg'>
					Revenue Operations specialist with a passion for optimizing business processes
					and driving growth.
				</p>
			</div>

			<div className='grid gap-10 md:grid-cols-5'>
				{/* Sidebar - Photo and Quick Info */}
				<div className='md:col-span-2'>
					<div className='sticky top-24 space-y-8'>
						<div className='border-border/40 bg-card overflow-hidden rounded-lg border shadow-sm'>
							<div className='relative h-64 w-full overflow-hidden sm:h-80'>
								<Image
									src='/images/richard.jpg'
									alt='Richard Hudson'
									fill
									className='object-cover object-center'
								/>
							</div>

							<div className='p-6'>
								<h2 className='mb-4 text-xl font-semibold'>Quick Info</h2>

								<ul className='space-y-3'>
									<li className='flex items-center gap-2'>
										<Briefcase className='text-primary h-5 w-5' />
										<span>Revenue Operations Consultant</span>
									</li>
									<li className='flex items-center gap-2'>
										<GraduationCap className='text-primary h-5 w-5' />
										<span>Based in Plano, Texas</span>
									</li>
									<li className='flex items-center gap-2'>
										<BadgeCheck className='text-primary h-5 w-5' />
										<span>LinkedIn: /hudsor01</span>
									</li>
									<li className='flex items-center gap-2'>
										<Coffee className='text-primary h-5 w-5' />
										<span>Email: hello@richardwhudsonjr.com</span>
									</li>
									<li className='flex items-center gap-2'>
										<Medal className='text-primary h-5 w-5' />
										<span>U.S. Army Veteran</span>
									</li>
								</ul>

								<div className='mt-6 flex justify-center'>
									<Button asChild>
										<Link href='/contact'>Get In Touch</Link>
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Main Content */}
				<div className='prose-custom md:col-span-3'>
					<div className='border-border/40 bg-card space-y-8 rounded-lg border p-8 shadow-sm'>
						<section>
							<h2 className='mb-4 flex items-center gap-2 text-2xl font-bold'>
								<span className='bg-primary/10 rounded-full p-1'>
									<Briefcase className='text-primary h-5 w-5' />
								</span>
								Professional Background
							</h2>
							<p>
								Results-driven Revenue Operations Consultant with over 8 years of
								experience optimizing revenue processes and driving operational
								excellence at Thryv. Expertise in implementing Salesforce and
								PartnerStack to enhance partner programs, boost efficiency, and
								increase profitability.
							</p>
							<p>
								My diverse background spans data analysis, partner management, and
								digital marketing, combined with a strong foundation in business
								administration from The University of Texas at Dallas. I excel at
								leveraging technology to achieve business objectives in dynamic
								environments.
							</p>
						</section>

						<section>
							<h2 className='mb-4 flex items-center gap-2 text-2xl font-bold'>
								<span className='bg-primary/10 rounded-full p-1'>
									<BadgeCheck className='text-primary h-5 w-5' />
								</span>
								Expertise & Skills
							</h2>
							<p>
								My approach combines systematic process optimization with
								data-driven decision making. I believe effective revenue operations
								should connect sales, marketing, and customer success while
								eliminating friction points in the revenue generation process.
							</p>
							<div className='grid gap-4 sm:grid-cols-2'>
								<div>
									<h3 className='text-lg font-semibold'>Revenue Operations</h3>
									<ul>
										<li>Salesforce Administration</li>
										<li>PartnerStack Implementation</li>
										<li>Data Analysis & Visualization</li>
										<li>Partner Channel Management</li>
										<li>Revenue Process Optimization</li>
									</ul>
								</div>
								<div>
									<h3 className='text-lg font-semibold'>Technical Skills</h3>
									<ul>
										<li>Python & Django</li>
										<li>Data Visualization Tools</li>
										<li>
											AI/LLM Implementation (OpenAI, Anthropic, Google Gemini)
										</li>
										<li>CRM System Configuration</li>
										<li>Automated Reporting Solutions</li>
									</ul>
								</div>
							</div>
						</section>

						<section>
							<h2 className='mb-4 flex items-center gap-2 text-2xl font-bold'>
								<span className='bg-primary/10 rounded-full p-1'>
									<Medal className='text-primary h-5 w-5' />
								</span>
								Military Service
							</h2>
							<p>
								I&apos;m proud to have served in the United States Army, where I
								developed valuable skills in leadership, discipline, and strategic
								thinking. My military experience has profoundly shaped my work ethic
								and approach to solving complex problems under pressure.
							</p>
							<p>
								The teamwork, attention to detail, and commitment to excellence I
								learned in the military continue to influence my professional
								approach and dedication to delivering results in the business world.
							</p>
						</section>

						<section>
							<h2 className='mb-4 flex items-center gap-2 text-2xl font-bold'>
								<span className='bg-primary/10 rounded-full p-1'>
									<Heart className='text-primary h-5 w-5' />
								</span>
								Beyond Work
							</h2>
							<p>
								When I&apos;m not optimizing revenue operations, I enjoy exploring
								emerging technologies, particularly in the AI and machine learning
								space. I&apos;ve been working with various LLM platforms to develop
								practical business applications that streamline processes.
							</p>
							<p>
								I&apos;m passionate about continuous learning and regularly expand
								my skill set to stay ahead of industry trends. I believe in
								leveraging the right technology solutions to solve real business
								challenges and drive meaningful growth.
							</p>
						</section>

						<div className='mt-8 flex flex-wrap justify-center gap-4 pt-6'>
							<Button asChild variant='outline'>
								<Link href='/resume'>View Resume</Link>
							</Button>
							<Button asChild variant='outline'>
								<Link href='/projects'>See Projects</Link>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
