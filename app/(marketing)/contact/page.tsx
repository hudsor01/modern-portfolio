import { Mail, MapPin, Phone, Linkedin, Twitter, Github } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Animate } from '@/components/ui/animate'
import { ContactForm } from '@/app/(marketing)/contact/contact-form'

export const metadata = {
	title: 'Contact | Richard Hudson',
	description:
		'Get in touch with Richard Hudson for frontend development projects and consulting.',
}

export default function ContactPage() {
	return (
		<div className='container-custom py-16'>
			<div className='mb-12 text-center'>
				<h1 className='text-4xl font-bold tracking-tight sm:text-5xl'>Get In Touch</h1>
				<p className='text-muted-foreground mx-auto mt-4 max-w-2xl text-lg'>
					Have a project in mind or want to discuss how I can help bring your web
					application ideas to life? Let&apos;s connect!
				</p>
			</div>

			<div className='grid gap-8 lg:grid-cols-2'>
				<Animate variant='fade'>
					<Card>
						<CardHeader className='space-y-1'>
							<CardTitle className='text-2xl'>Send a Message</CardTitle>
							<CardDescription>
								Fill out the form below and I will get back to you as soon as
								possible.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ContactForm />
						</CardContent>
					</Card>
				</Animate>

				<div className='space-y-6'>
					<Animate variant='fade' delay={0.1}>
						<Card>
							<CardHeader className='pb-3'>
								<CardTitle className='text-2xl'>Contact Information</CardTitle>
								<CardDescription>
									Here are the best ways to reach me.
								</CardDescription>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='flex items-start space-x-4'>
									<div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full'>
										<Mail className='text-primary h-5 w-5' />
									</div>
									<div>
										<p className='font-medium'>Email</p>
										<a
											href='mailto:hello@richardwhudsonjr.com'
											className='text-primary hover:underline'>
											hello@richardwhudsonjr.com
										</a>
									</div>
								</div>

								<div className='flex items-start space-x-4'>
									<div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full'>
										<Phone className='text-primary h-5 w-5' />
									</div>
									<div>
										<p className='font-medium'>Phone</p>
										<a
											href='tel:+15555555555'
											className='text-primary hover:underline'>
											(555) 555-5555
										</a>
									</div>
								</div>

								<div className='flex items-start space-x-4'>
									<div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full'>
										<MapPin className='text-primary h-5 w-5' />
									</div>
									<div>
										<p className='font-medium'>Location</p>
										<p className='text-muted-foreground'>Plano, Texas</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</Animate>

					<Animate variant='fade' delay={0.2}>
						<Card>
							<CardHeader className='pb-3'>
								<CardTitle className='text-2xl'>Connect</CardTitle>
								<CardDescription>Find me on these platforms.</CardDescription>
							</CardHeader>
							<CardContent>
								<div className='flex flex-wrap gap-3'>
									<a
										href='https://linkedin.com/in/hudsor01'
										target='_blank'
										rel='noopener noreferrer'
										className='flex items-center justify-center rounded-full bg-[#0077B5] p-3 text-white transition-transform hover:scale-110'
										aria-label='LinkedIn'>
										<Linkedin className='h-5 w-5' />
									</a>
									<a
										href='https://github.com/hudsor01'
										target='_blank'
										rel='noopener noreferrer'
										className='flex items-center justify-center rounded-full bg-[#181717] p-3 text-white transition-transform hover:scale-110'
										aria-label='GitHub'>
										<Github className='h-5 w-5' />
									</a>
									<a
										href='https://twitter.com'
										target='_blank'
										rel='noopener noreferrer'
										className='flex items-center justify-center rounded-full bg-[#1DA1F2] p-3 text-white transition-transform hover:scale-110'
										aria-label='Twitter'>
										<Twitter className='h-5 w-5' />
									</a>
								</div>
							</CardContent>
						</Card>
					</Animate>

					<Animate variant='fade' delay={0.3}>
						<Card>
							<CardHeader className='pb-3'>
								<CardTitle className='text-2xl'>Office Hours</CardTitle>
								<CardDescription>When I am available to chat.</CardDescription>
							</CardHeader>
							<CardContent className='space-y-2'>
								<div className='flex justify-between'>
									<span className='font-medium'>Monday - Friday</span>
									<span>9:00 AM - 5:00 PM CST</span>
								</div>
								<div className='flex justify-between'>
									<span className='font-medium'>Saturday</span>
									<span>By appointment</span>
								</div>
								<div className='flex justify-between'>
									<span className='font-medium'>Sunday</span>
									<span>Closed</span>
								</div>
								<p className='text-muted-foreground mt-4 text-sm'>
									I typically respond to inquiries within 24 business hours.
								</p>
							</CardContent>
						</Card>
					</Animate>
				</div>
			</div>
		</div>
	)
}
