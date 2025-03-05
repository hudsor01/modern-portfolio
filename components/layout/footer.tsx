'use client'

import { Button } from '@/components/ui/button'
import { Mail, Github, Linkedin, ArrowUp } from 'lucide-react'
import Link from 'next/link'
import { siteConfig } from '@/lib/config/site'

export function Footer() {
	const handleScrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	return (
		<footer className='border-border/40 bg-background border-t py-8 md:py-12'>
			<div className='container max-w-7xl'>
				<div className='flex flex-col items-center justify-between md:flex-row'>
					<div className='mb-6 md:mb-0'>
						<Link href='/' className='flex items-center space-x-2'>
							<span className='from-primary to-primary/70 bg-gradient-to-r bg-clip-text text-lg font-bold text-transparent'>
								Richard Hudson
							</span>
						</Link>
						<p className='text-muted-foreground mt-2 max-w-xs text-sm'>
							Revenue operations professional driving business growth through
							data-driven insights and process optimization.
						</p>
					</div>

					<div className='flex flex-col items-center gap-4 md:items-end'>
						<div className='flex items-center space-x-4'>
							<Button variant='ghost' size='icon' asChild>
								<a
									href={siteConfig.links.linkedin}
									target='_blank'
									rel='noopener noreferrer'
									aria-label='LinkedIn'>
									<Linkedin className='h-5 w-5' />
								</a>
							</Button>
							<Button variant='ghost' size='icon' asChild>
								<a
									href={siteConfig.links.github}
									target='_blank'
									rel='noopener noreferrer'
									aria-label='GitHub'>
									<Github className='h-5 w-5' />
								</a>
							</Button>
							<Button variant='ghost' size='icon' asChild>
								<a href={`mailto:${siteConfig.links.email}`} aria-label='Email'>
									<Mail className='h-5 w-5' />
								</a>
							</Button>
						</div>

						<Button
							variant='outline'
							size='sm'
							className='mt-2 text-xs'
							onClick={handleScrollToTop}>
							<ArrowUp className='mr-1 h-3 w-3' />
							Back to top
						</Button>
					</div>
				</div>

				<div className='border-border/40 mt-8 flex flex-col items-center justify-between border-t pt-6 md:flex-row'>
					<p className='text-muted-foreground text-xs'>
						&copy; {new Date().getFullYear()} Richard Hudson. All rights reserved.
					</p>
					<div className='text-muted-foreground mt-4 text-xs md:mt-0'>
						<a
							href='https://nextjs.org'
							target='_blank'
							rel='noopener noreferrer'
							className='hover:text-primary transition-colors'>
							Built with Next.js 15
						</a>
					</div>
				</div>
			</div>
		</footer>
	)
}
