'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import type { Route } from 'next'
import type { NextLinkHref } from '@/types/next-types'
import { getRouteKey } from '@/lib/utils'
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

type NavItem = {
	label: string;
	href: NextLinkHref;
}

const navItems: NavItem[] = [
	{ label: 'Home', href: '/' as Route<string> },
	{ label: 'About', href: '/about' as Route<string> },
	{ label: 'Projects', href: '/projects' as Route<string> },
	{ label: 'Resume', href: '/resume' as Route<string> },
	{ label: 'Contact', href: '/contact' as Route<string> },
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
				className='md:hidden hover:bg-[rgb(var(--color-pewter-blue))]/10 dark:hover:bg-slate-800/50 text-[rgb(var(--color-pewter-blue))]'>
				<Menu className='h-6 w-6' />
			</Button>

			<Drawer open={isOpen} onOpenChange={setIsOpen}>
				<DrawerContent className="rounded-t-xl border-t-4 border-[rgb(var(--color-pewter-blue))]">
					<DrawerHeader className="border-b border-slate-100 dark:border-slate-800">
						<DrawerTitle className="text-[rgb(var(--color-pewter-blue))] font-bold text-xl">
							Richard Hudson
						</DrawerTitle>
					</DrawerHeader>

					<div className='flex flex-col p-6 pt-4'>
						<nav className='grid gap-3'>
							{navItems.map((item, index) => (
								<motion.div
									key={getRouteKey(item.href, index)}
									initial={{ opacity: 0, x: -10 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: index * 0.05 }}>
									<Link
										href={item.href}
										className={`flex items-center rounded-lg px-4 py-3 text-lg transition-colors relative overflow-hidden ${
											pathname === item.href ?
												'bg-[rgb(var(--color-pewter-blue))]/10 text-[rgb(var(--color-pewter-blue))] font-medium'
											:	'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
										}`}>
										{item.label}
										{pathname === item.href && (
											<motion.span
												layoutId='nav-pill'
												className='bg-[rgb(var(--color-pewter-blue))] absolute left-0 h-full w-1 rounded-r-md'
											/>
										)}
									</Link>
								</motion.div>
							))}
						</nav>
					</div>

					<DrawerFooter className='border-t border-slate-100 dark:border-slate-800 pt-4 pb-8'>
						<div className='flex justify-center space-x-6'>
							<a
								href={siteConfig.links.github}
								target='_blank'
								rel='noopener noreferrer'
								className='text-slate-600 dark:text-slate-400 hover:text-[rgb(var(--color-pewter-blue))] transition-colors'
								aria-label='GitHub'>
								<Github className='h-5 w-5' />
							</a>
							<a
								href={siteConfig.links.linkedin}
								target='_blank'
								rel='noopener noreferrer'
								className='text-slate-600 dark:text-slate-400 hover:text-[rgb(var(--color-pewter-blue))] transition-colors'
								aria-label='LinkedIn'>
								<Linkedin className='h-5 w-5' />
							</a>
							<a
								href={`mailto:${siteConfig.links.email}`}
								className='text-slate-600 dark:text-slate-400 hover:text-[rgb(var(--color-pewter-blue))] transition-colors'
								aria-label='Email'>
								<Mail className='h-5 w-5' />
							</a>
						</div>
						<p className='text-slate-500 dark:text-slate-400 mt-6 text-center text-sm'>
							&copy; {new Date().getFullYear()} Richard Hudson
						</p>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</>
	)
}
