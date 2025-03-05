import { Button } from '@/components/ui/button'
import { Home, Search } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
	return (
		<div className='flex min-h-screen flex-col items-center justify-center p-6'>
			<div className='w-full max-w-md space-y-6 text-center'>
				<div className='bg-muted/60 mb-2 inline-block rounded-full p-4'>
					<Search className='text-muted-foreground h-10 w-10' />
				</div>
				<h1 className='from-primary to-primary/60 bg-gradient-to-r bg-clip-text text-4xl font-bold tracking-tight text-transparent'>
					Page not found
				</h1>
				<p className='text-muted-foreground text-lg'>
					The page you&apos;re looking for doesn&apos;t exist or has been moved.
				</p>

				<Button variant='default' asChild className='hover-lift'>
					<Link href='/'>
						<Home className='mr-2 size-4' />
						Return home
					</Link>
				</Button>
			</div>
		</div>
	)
}
