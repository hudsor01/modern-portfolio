'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, Heart } from 'lucide-react'
import { siteConfig } from '@/lib/config/site'

export function Footer() {
	const currentYear = new Date().getFullYear()

	const container = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	}

	const item = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0 },
	}

	return (
		<footer className='bg-background border-border/30 border-t py-12'>
			<div className='container mx-auto px-4 sm:px-6 lg:px-8'>
				<motion.div
					className='grid gap-8 md:grid-cols-2 lg:grid-cols-4'
					variants={container}
					initial='hidden'
					whileInView='show'
					viewport={{ once: true, margin: '-100px' }}>
					{/* About */}
					<motion.div variants={item}>
						<h3 className='mb-4 text-lg font-semibold'>{siteConfig.name}</h3>
						<p className='text-foreground/70 text-sm'>{siteConfig.description}</p>
					</motion.div>

					{/* Links */}
					<motion.div variants={item}>
						<h3 className='mb-4 text-lg font-semibold'>Navigation</h3>
						<ul className='space-y-2 text-sm'>
							<motion.li
								whileHover={{ x: 5 }}
								transition={{ type: 'spring', stiffness: 300 }}>
								<Link
									href='/'
									className='text-foreground/70 hover:text-primary transition-colors'>
									Home
								</Link>
							</motion.li>
							<motion.li
								whileHover={{ x: 5 }}
								transition={{ type: 'spring', stiffness: 300 }}>
								<Link
									href='/about'
									className='text-foreground/70 hover:text-primary transition-colors'>
									About
								</Link>
							</motion.li>
							<motion.li
								whileHover={{ x: 5 }}
								transition={{ type: 'spring', stiffness: 300 }}>
								<Link
									href='/projects'
									className='text-foreground/70 hover:text-primary transition-colors'>
									Projects
								</Link>
							</motion.li>
							<motion.li
								whileHover={{ x: 5 }}
								transition={{ type: 'spring', stiffness: 300 }}>
								<Link
									href='/resume'
									className='text-foreground/70 hover:text-primary transition-colors'>
									Resume
								</Link>
							</motion.li>
							<motion.li
								whileHover={{ x: 5 }}
								transition={{ type: 'spring', stiffness: 300 }}>
								<Link
									href='/contact'
									className='text-foreground/70 hover:text-primary transition-colors'>
									Contact
								</Link>
							</motion.li>
						</ul>
					</motion.div>

					{/* Contact */}
					<motion.div variants={item}>
						<h3 className='mb-4 text-lg font-semibold'>Contact</h3>
						<ul className='space-y-2 text-sm'>
							<motion.li
								className='text-foreground/70 flex items-center'
								whileHover={{ y: -2 }}>
								<Mail className='mr-2 h-4 w-4' />
								<a
									href={`mailto:${siteConfig.links.email}`}
									className='hover:text-primary transition-colors'>
									{siteConfig.links.email}
								</a>
							</motion.li>
						</ul>
					</motion.div>

					{/* Social */}
					<motion.div variants={item}>
						<h3 className='mb-4 text-lg font-semibold'>Social</h3>
						<div className='flex space-x-4'>
							<motion.a
								href={siteConfig.links.github}
								target='_blank'
								rel='noopener noreferrer'
								className='text-foreground/70 hover:text-primary transition-colors'
								aria-label='GitHub'
								whileHover={{ scale: 1.2, rotate: 5 }}
								whileTap={{ scale: 0.9 }}>
								<Github className='h-5 w-5' />
							</motion.a>
							<motion.a
								href={siteConfig.links.linkedin}
								target='_blank'
								rel='noopener noreferrer'
								className='text-foreground/70 hover:text-primary transition-colors'
								aria-label='LinkedIn'
								whileHover={{ scale: 1.2, rotate: 5 }}
								whileTap={{ scale: 0.9 }}>
								<Linkedin className='h-5 w-5' />
							</motion.a>
						</div>
					</motion.div>
				</motion.div>

				<motion.div
					className='border-border/30 text-foreground/60 mt-8 border-t pt-8 text-center text-sm'
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ delay: 0.5 }}>
					<p className='flex items-center justify-center'>
						&copy; {currentYear} {siteConfig.name}. All rights reserved.
						<motion.span
							className='ml-2 inline-flex items-center'
							animate={{
								scale: [1, 1.1, 1],
							}}
							transition={{
								repeat: Infinity,
								repeatDelay: 1,
								duration: 0.6,
							}}>
							Made with{' '}
							<Heart className='mx-1 h-3 w-3 text-red-500' fill='currentColor' /> in
							React
						</motion.span>
					</p>
				</motion.div>
			</div>
		</footer>
	)
}
