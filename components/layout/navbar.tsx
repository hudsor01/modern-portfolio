'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/lib/config/site'
import { MobileDrawer } from '@/components/mobile-drawer'
import { ContactDialog } from '@/components/contact-dialog'

const navItems = [
	{ label: 'Home', href: '/' },
	{ label: 'About', href: '/about' },
	{ label: 'Projects', href: '/projects' },
	{ label: 'Resume', href: '/resume' },
]

export function Navbar() {
	const [isScrolled, setIsScrolled] = useState(false)
	const [contactDialogOpen, setContactDialogOpen] = useState(false)
	const pathname = usePathname()

	// Handle scroll events to add background on scroll
	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10)
		}

		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	return (
		<>
			<motion.header
				initial={{ y: -100 }}
				animate={{ y: 0 }}
				transition={{ type: 'spring', stiffness: 100, damping: 15 }}
				className={`fixed top-0 z-50 w-full transition-all duration-300 ${
					isScrolled ?
						'bg-background/90 border-border/40 border-b shadow-xs backdrop-blur-sm-md'
					:	'bg-transparent'
				}`}>
				<div className='container-custom'>
					<div className='flex h-16 items-center justify-between'>
						{/* Logo */}
						<motion.div
							className='flex'
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.1 }}>
							<Link href='/' className='text-xl font-bold tracking-tight'>
								{siteConfig.name}
							</Link>
						</motion.div>

						{/* Desktop Navigation */}
						<nav className='hidden items-center space-x-6 md:flex'>
							{navItems.map((item, index) => (
								<motion.div
									key={item.href}
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.1 * index }}>
									<Link
										href={item.href}
										className={`hover:text-primary relative text-sm font-medium transition-colors ${
											pathname === item.href ?
												'text-primary'
											:	'text-foreground/70 hover:text-foreground'
										}`}>
										{item.label}
										{pathname === item.href && (
											<motion.span
												className='bg-primary absolute -bottom-1 left-0 h-0.5 w-full'
												layoutId='navbar-indicator'
												transition={{
													type: 'spring',
													stiffness: 300,
													damping: 30,
												}}
											/>
										)}
									</Link>
								</motion.div>
							))}

							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.5 }}>
								<Button
									size='sm'
									className='gap-2'
									onClick={() => setContactDialogOpen(true)}>
									<Send className='h-4 w-4' />
									Contact
								</Button>
							</motion.div>
						</nav>

						{/* Mobile Menu Button */}
						<div className='md:hidden'>
							<MobileDrawer />
						</div>
					</div>
				</div>
			</motion.header>

			{/* Contact Dialog */}
			<ContactDialog open={contactDialogOpen} onClose={() => setContactDialogOpen(false)} />
		</>
	)
}
