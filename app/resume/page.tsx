'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Animate } from '@/components/ui/animate'
import { FileDown, ExternalLink } from 'lucide-react'

export default function ResumePage() {
	const [isDownloading, setIsDownloading] = useState(false)

	const handleDownloadResume = async () => {
		setIsDownloading(true)

		try {
			toast.loading('Generating resume PDF...', { id: 'resume-download' })

			// Call API route to generate PDF
			const response = await fetch('/api/generate-resume-pdf', {
				method: 'GET',
			})

			if (!response.ok) {
				throw new Error('Failed to generate PDF')
			}

			const blob = await response.blob()
			const url = window.URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.style.display = 'none'
			a.href = url
			a.download = 'richard-hudson-resume.pdf'
			document.body.appendChild(a)
			a.click()
			window.URL.revokeObjectURL(url)
			document.body.removeChild(a)

			toast.success('Resume downloaded successfully!', { id: 'resume-download' })
		} catch (error) {
			console.error('Download error:', error)
			toast.error('Failed to download resume. Please try again.', { id: 'resume-download' })
		} finally {
			setIsDownloading(false)
		}
	}

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
			className='container-custom py-16'>
			<div className='mb-12 text-center'>
				<motion.h1
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2, duration: 0.7 }}
					className='text-4xl font-bold tracking-tight sm:text-5xl'>
					Resume
				</motion.h1>
				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3, duration: 0.7 }}
					className='text-foreground/70 mx-auto mt-4 max-w-2xl text-lg'>
					My professional experience and qualifications
				</motion.p>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4, duration: 0.7 }}
					className='mt-6 flex justify-center gap-4'>
					<Button
						className='hover-lift flex items-center gap-2'
						onClick={handleDownloadResume}
						disabled={isDownloading}>
						<FileDown className='h-4 w-4' />
						{isDownloading ? 'Generating PDF...' : 'Download Resume'}
					</Button>
					<Button variant='outline' asChild className='hover-lift'>
						<Link href='/contact' className='flex items-center gap-2'>
							<ExternalLink className='h-4 w-4' />
							Contact Me
						</Link>
					</Button>
				</motion.div>
			</div>

			<div className='space-y-10'>
				<Animate variant='fade' delay={0.2}>
					<section className='space-y-4'>
						<h2 className='text-2xl font-bold'>Professional Experience</h2>

						<motion.div
							whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
							transition={{ duration: 0.3 }}>
							<Card>
								<CardContent className='p-6'>
									<div className='mb-4 flex flex-wrap items-start justify-between gap-2'>
										<div>
											<h3 className='text-xl font-semibold'>
												Revenue Operations Manager
											</h3>
											<p className='text-primary font-medium'>Thryv</p>
										</div>
										<p className='text-muted-foreground'>Jan 2020 - Present</p>
									</div>
									<ul className='text-foreground/80 ml-6 list-disc space-y-2'>
										<li>
											Led implementation of Salesforce Partner Portal
											resulting in 40% reduction in partner onboarding time.
										</li>
										<li>
											Developed automated reporting dashboards that increased
											visibility into partner performance by 85%.
										</li>
										<li>
											Implemented streamlined commission calculation process
											reducing errors by 95% and saving 20 hours/month.
										</li>
										<li>
											Created comprehensive partner success metrics framework
											increasing retention by 25%.
										</li>
									</ul>
								</CardContent>
							</Card>
						</motion.div>

						<motion.div
							whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
							transition={{ duration: 0.3 }}>
							<Card>
								<CardContent className='p-6'>
									<div className='mb-4 flex flex-wrap items-start justify-between gap-2'>
										<div>
											<h3 className='text-xl font-semibold'>
												Channel Partner Specialist
											</h3>
											<p className='text-primary font-medium'>Thryv</p>
										</div>
										<p className='text-muted-foreground'>Mar 2018 - Dec 2019</p>
									</div>
									<ul className='text-foreground/80 ml-6 list-disc space-y-2'>
										<li>
											Managed relationships with 50+ channel partners,
											increasing average partner revenue by 32%.
										</li>
										<li>
											Developed partner onboarding materials and training
											programs.
										</li>
										<li>
											Created performance analytics tools improving
											data-driven decision making.
										</li>
										<li>
											Optimized partner commission structures leading to 28%
											increase in partner sales activity.
										</li>
									</ul>
								</CardContent>
							</Card>
						</motion.div>

						<motion.div
							whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
							transition={{ duration: 0.3 }}>
							<Card>
								<CardContent className='p-6'>
									<div className='mb-4 flex flex-wrap items-start justify-between gap-2'>
										<div>
											<h3 className='text-xl font-semibold'>
												Digital Marketing Analyst
											</h3>
											<p className='text-primary font-medium'>
												MarketStrat Group
											</p>
										</div>
										<p className='text-muted-foreground'>Jun 2016 - Mar 2018</p>
									</div>
									<ul className='text-foreground/80 ml-6 list-disc space-y-2'>
										<li>
											Developed and implemented digital marketing campaigns
											for B2B clients.
										</li>
										<li>
											Created comprehensive performance reports and ROI
											analysis.
										</li>
										<li>
											Conducted market research to identify new business
											opportunities.
										</li>
										<li>
											Optimized lead generation processes resulting in 40%
											increase in qualified leads.
										</li>
									</ul>
								</CardContent>
							</Card>
						</motion.div>
					</section>
				</Animate>

				<Animate variant='fade' delay={0.3}>
					<section className='space-y-4'>
						<h2 className='text-2xl font-bold'>Education</h2>

						<motion.div
							whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
							transition={{ duration: 0.3 }}>
							<Card>
								<CardContent className='p-6'>
									<div className='mb-4 flex flex-wrap items-start justify-between gap-2'>
										<div>
											<h3 className='text-xl font-semibold'>
												Bachelor of Business Administration (BBA)
											</h3>
											<p className='text-primary font-medium'>
												The University of Texas at Dallas
											</p>
										</div>
										<p className='text-muted-foreground'>2012 - 2016</p>
									</div>
									<p className='text-foreground/80'>
										Concentration in Marketing and Business Analytics. Graduated
										with honors.
									</p>
								</CardContent>
							</Card>
						</motion.div>
					</section>
				</Animate>

				<Animate variant='fade' delay={0.4}>
					<section className='space-y-4'>
						<h2 className='text-2xl font-bold'>Skills & Expertise</h2>

						<div className='grid gap-4 sm:grid-cols-2'>
							<motion.div
								whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
								transition={{ duration: 0.3 }}>
								<Card className='h-full'>
									<CardContent className='p-6'>
										<h3 className='mb-3 text-lg font-semibold'>
											Revenue Operations
										</h3>
										<ul className='text-foreground/80 ml-6 list-disc space-y-1'>
											<li>Salesforce Administration</li>
											<li>Partner Relationship Management</li>
											<li>Sales Pipeline Optimization</li>
											<li>Commission Structure Design</li>
											<li>Sales & Marketing Alignment</li>
										</ul>
									</CardContent>
								</Card>
							</motion.div>

							<motion.div
								whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
								transition={{ duration: 0.3 }}>
								<Card className='h-full'>
									<CardContent className='p-6'>
										<h3 className='mb-3 text-lg font-semibold'>
											Data Analysis
										</h3>
										<ul className='text-foreground/80 ml-6 list-disc space-y-1'>
											<li>Business Intelligence Reporting</li>
											<li>KPI Development</li>
											<li>Excel & Google Sheets Advanced</li>
											<li>Data Visualization</li>
											<li>Python for Data Analysis</li>
										</ul>
									</CardContent>
								</Card>
							</motion.div>

							<motion.div
								whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
								transition={{ duration: 0.3 }}>
								<Card className='h-full'>
									<CardContent className='p-6'>
										<h3 className='mb-3 text-lg font-semibold'>
											Partner Management
										</h3>
										<ul className='text-foreground/80 ml-6 list-disc space-y-1'>
											<li>Channel Partner Programs</li>
											<li>Partner Onboarding</li>
											<li>Training & Development</li>
											<li>Performance Tracking</li>
											<li>Relationship Building</li>
										</ul>
									</CardContent>
								</Card>
							</motion.div>

							<motion.div
								whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
								transition={{ duration: 0.3 }}>
								<Card className='h-full'>
									<CardContent className='p-6'>
										<h3 className='mb-3 text-lg font-semibold'>
											Technical Skills
										</h3>
										<ul className='text-foreground/80 ml-6 list-disc space-y-1'>
											<li>Salesforce & CRM Systems</li>
											<li>Business Intelligence Tools</li>
											<li>SQL & Database Management</li>
											<li>Python & Data Analysis Libraries</li>
											<li>PartnerStack Implementation</li>
										</ul>
									</CardContent>
								</Card>
							</motion.div>
						</div>
					</section>
				</Animate>

				<Animate variant='fade' delay={0.5}>
					<section className='space-y-4'>
						<h2 className='text-2xl font-bold'>Certifications</h2>

						<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
							<motion.div
								whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
								transition={{ duration: 0.3 }}>
								<Card>
									<CardContent className='p-6'>
										<h3 className='text-lg font-semibold'>
											Salesforce Certified Administrator
										</h3>
										<p className='text-muted-foreground'>Salesforce</p>
									</CardContent>
								</Card>
							</motion.div>

							<motion.div
								whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
								transition={{ duration: 0.3 }}>
								<Card>
									<CardContent className='p-6'>
										<h3 className='text-lg font-semibold'>
											Revenue Operations Certification
										</h3>
										<p className='text-muted-foreground'>HubSpot Academy</p>
									</CardContent>
								</Card>
							</motion.div>

							<motion.div
								whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
								transition={{ duration: 0.3 }}>
								<Card>
									<CardContent className='p-6'>
										<h3 className='text-lg font-semibold'>
											Data Analysis Professional
										</h3>
										<p className='text-muted-foreground'>Google</p>
									</CardContent>
								</Card>
							</motion.div>
						</div>
					</section>
				</Animate>
			</div>

			<Animate variant='fade' delay={0.6}>
				<div className='mt-12 text-center'>
					<p className='text-muted-foreground mb-6'>
						For more details on my work experience or to discuss how I can help with
						your business, please don&apos;t hesitate to reach out.
					</p>
					<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
						<Button asChild className='hover-lift'>
							<Link href='/contact'>Contact Me</Link>
						</Button>
					</motion.div>
				</div>
			</Animate>
		</motion.div>
	)
}
