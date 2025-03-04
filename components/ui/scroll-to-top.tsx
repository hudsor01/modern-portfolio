'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function ScrollToTop() {
	const [show, setShow] = useState(false)

	useEffect(() => {
		const handleScroll = () => {
			setShow(window.scrollY > 400)
		}

		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	return (
		<AnimatePresence>
			{show && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 20 }}
					className='fixed right-8 bottom-8 z-50'>
					<Button
						variant='outline'
						size='icon'
						className='rounded-full'
						onClick={scrollToTop}
						aria-label='Scroll to top'>
						<ArrowUp className='size-4' />
					</Button>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
