'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerFooter,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/lib/config/site'
import { Github, Linkedin, Mail, Menu } from 'lucide-react'

const navItems = [
	{ label: 'Home', href: '/' },
	{ label: 'About', href: '/about' },
	{ label: 'Projects', href: '/projects' },
	{ label: 'Resume', href: '/resume' },
	{ label: 'Contact', href: '/contact' },
]

export function MobileDrawer() {
	const [isOpen, setIsOpen] = useState(false)
	const pathname = usePathname()

	// Close drawer when route changes
	useEffect(() => {
		setIsOpen(false)
	}, [pathname])

	return (
		<>
			<Button
				variant='ghost'
				size='icon'
				aria-label='Menu'
				onClick={() => setIsOpen(true)}
				className='md:hidden'>
				<Menu className='h-5 w-5' />
			</Button>

			<Drawer open={isOpen} onOpenChange={setIsOpen}>
				<DrawerContent>
					<DrawerHeader>
						<DrawerTitle>Menu</DrawerTitle>
					</DrawerHeader>

					<div className='flex flex-col p-6 pt-0'>
						<nav className='grid gap-2'>
							{navItems.map((item, index) => (
								<motion.div
									key={item.href}
									initial={{ opacity: 0, x: -10 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: index * 0.05 }}>
									<Link
										href={item.href}
										className={`flex items-center rounded-md px-3 py-2 text-lg transition-colors ${
											pathname === item.href ?
												'bg-primary/10 text-primary'
											:	'hover:bg-muted'
										}`}>
										{item.label}
										{pathname === item.href && (
											<motion.span
												layoutId='nav-pill'
												className='bg-primary absolute left-0 h-full w-1 rounded-r-md'
											/>
										)}
									</Link>
								</motion.div>
							))}
						</nav>
					</div>

					<DrawerFooter className='border-border border-t pt-4'>
						<div className='flex justify-center space-x-4'>
							<a
								href={siteConfig.links.github}
								target='_blank'
								rel='noopener noreferrer'
								className='text-foreground/70 hover:text-primary transition-colors'
								aria-label='GitHub'>
								<Github className='h-5 w-5' />
							</a>
							<a
								href={siteConfig.links.linkedin}
								target='_blank'
								rel='noopener noreferrer'
								className='text-foreground/70 hover:text-primary transition-colors'
								aria-label='LinkedIn'>
								<Linkedin className='h-5 w-5' />
							</a>
							<a
								href={`mailto:${siteConfig.links.email}`}
								className='text-foreground/70 hover:text-primary transition-colors'
								aria-label='Email'>
								<Mail className='h-5 w-5' />
							</a>
						</div>
						<p className='text-muted-foreground mt-4 text-center text-sm'>
							&copy; {new Date().getFullYear()} {siteConfig.name}
						</p>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</>
	)
}
