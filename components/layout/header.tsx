'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Moon, Sun, Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useTheme } from 'next-themes'

const routes = [
	{ name: 'Home', path: '/' },
	{ name: 'About', path: '/about' },
	{ name: 'Projects', path: '/projects' },
	{ name: 'Resume', path: '/resume' },
	{ name: 'Contact', path: '/contact' },
]

export function MainNav({ className }: React.HTMLAttributes<HTMLElement>) {
	const pathname = usePathname()

	return (
		<nav className={cn('flex items-center space-x-4 lg:space-x-6', className)}>
			{routes.map(route => (
				<Link
					key={route.path}
					href={route.path}
					className={cn(
						'hover:text-primary text-sm font-medium transition-colors',
						pathname === route.path ?
							'text-foreground font-semibold'
						:	'text-muted-foreground'
					)}>
					{route.name}
				</Link>
			))}
		</nav>
	)
}

export function MobileNav() {
	const [open, setOpen] = React.useState(false)
	const pathname = usePathname()

	// Close the mobile menu when route changes
	React.useEffect(() => {
		setOpen(false)
	}, [pathname])

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button variant='ghost' size='icon' className='md:hidden'>
					<Menu className='h-5 w-5' />
					<span className='sr-only'>Toggle menu</span>
				</Button>
			</SheetTrigger>
			<SheetContent side='left' className='pr-0 sm:max-w-xs'>
				<div className='px-2'>
					<div className='flex flex-col space-y-3 pt-6'>
						{routes.map(route => (
							<Link
								key={route.path}
								href={route.path}
								className={cn(
									'flex items-center rounded-md px-3 py-2.5 text-base font-medium transition-colors',
									pathname === route.path ?
										'bg-primary/10 text-primary font-semibold'
									:	'text-muted-foreground hover:bg-muted'
								)}>
								{route.name}
							</Link>
						))}
					</div>
				</div>
			</SheetContent>
		</Sheet>
	)
}

export function ThemeToggle() {
	const { setTheme, theme } = useTheme()

	return (
		<Button
			variant='ghost'
			size='icon'
			onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
			className='hover:bg-muted'>
			<Sun className='h-5 w-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
			<Moon className='absolute h-5 w-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
			<span className='sr-only'>Toggle theme</span>
		</Button>
	)
}

export function Header() {
	return (
		<header className='border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur'>
			<div className='container-custom flex h-16 items-center justify-between'>
				<div className='flex items-center gap-2'>
					<MobileNav />
					<Link href='/' className='flex items-center space-x-2'>
						<span className='from-primary to-primary/70 bg-gradient-to-r bg-clip-text text-xl font-bold text-transparent'>
							Richard Hudson
						</span>
					</Link>
					<div className='hidden md:ml-6 md:flex'>
						<MainNav />
					</div>
				</div>
				<div className='flex items-center gap-2'>
					<ThemeToggle />
				</div>
			</div>
		</header>
	)
}
