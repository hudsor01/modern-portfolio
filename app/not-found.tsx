import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
	return (
		<div className='flex min-h-screen flex-col items-center justify-center p-6'>
			<div className='w-full max-w-md space-y-6 text-center'>
				<h1 className='text-4xl font-bold tracking-tight'>Page not found</h1>
				<p className='text-muted-foreground text-lg'>
					The page you&apos;re looking for doesn&apos;t exist or has been moved.
				</p>

				<Button variant='default' asChild>
					<Link href='/'>
						<Home className='mr-2 size-4' />
						Return home
					</Link>
				</Button>
			</div>
		</div>
	)
}
