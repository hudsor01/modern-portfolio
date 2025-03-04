'use client'

import React, { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AnimateProps {
	children: ReactNode
	className?: string
	variant?: 'fade' | 'slide-up' | 'slide-down' | 'scale' | 'rotate' | 'bounce'
	delay?: number
	duration?: number
	once?: boolean
}

export function Animate({
	children,
	className,
	variant = 'fade',
	delay = 0,
	duration = 0.5,
	once = true,
}: AnimateProps) {
	const getVariants = () => {
		switch (variant) {
			case 'fade':
				return {
					hidden: { opacity: 0 },
					visible: { opacity: 1 },
				}
			case 'slide-up':
				return {
					hidden: { opacity: 0, y: 20 },
					visible: { opacity: 1, y: 0 },
				}
			case 'slide-down':
				return {
					hidden: { opacity: 0, y: -20 },
					visible: { opacity: 1, y: 0 },
				}
			case 'scale':
				return {
					hidden: { opacity: 0, scale: 0.8 },
					visible: { opacity: 1, scale: 1 },
				}
			case 'rotate':
				return {
					hidden: { opacity: 0, rotate: -5 },
					visible: { opacity: 1, rotate: 0 },
				}
			case 'bounce':
				return {
					hidden: { opacity: 0, y: 20 },
					visible: {
						opacity: 1,
						y: 0,
						transition: {
							type: 'spring',
							stiffness: 400,
							damping: 10,
						},
					},
				}
			default:
				return {
					hidden: { opacity: 0 },
					visible: { opacity: 1 },
				}
		}
	}

	return (
		<motion.div
			className={cn(className)}
			initial='hidden'
			whileInView='visible'
			viewport={{ once }}
			variants={getVariants()}
			transition={{
				duration,
				delay,
				ease: 'easeOut',
			}}>
			{children}
		</motion.div>
	)
}

// Button hover animation
export function AnimatedButton({
	children,
	className,
	...props
}: Omit<React.ComponentProps<typeof motion.button>, 'transition' | 'whileHover' | 'whileTap'>) {
	return (
		<motion.button
			className={className}
			whileHover={{ scale: 1.03 }}
			whileTap={{ scale: 0.97 }}
			transition={{ duration: 0.2 }}
			{...props}>
			{children}
		</motion.button>
	)
}

// Card hover animation
export function AnimatedCard({
	children,
	className,
	...props
}: Omit<React.ComponentProps<typeof motion.div>, 'transition' | 'whileHover'>) {
	return (
		<motion.div
			className={className}
			whileHover={{
				y: -5,
				boxShadow:
					'0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
			}}
			transition={{ duration: 0.2 }}
			{...props}>
			{children}
		</motion.div>
	)
}

// Image hover animation
export function AnimatedImage({
	children,
	className,
	...props
}: Omit<React.ComponentProps<typeof motion.div>, 'transition' | 'whileHover'>) {
	return (
		<motion.div
			className={className}
			whileHover={{ scale: 1.05 }}
			transition={{ duration: 0.3 }}
			{...props}>
			{children}
		</motion.div>
	)
}

// Link hover animation
export function AnimatedLink({
	children,
	className,
	...props
}: Omit<React.ComponentProps<typeof motion.a>, 'transition' | 'whileHover' | 'whileTap'>) {
	return (
		<motion.a
			className={className}
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			transition={{ duration: 0.2 }}
			{...props}>
			{children}
		</motion.a>
	)
}
export function PageTransition({ children }: { children: ReactNode }) {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3 }}>
			{children}
		</motion.div>
	)
}
