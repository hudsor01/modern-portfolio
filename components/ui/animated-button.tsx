'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps } from 'class-variance-authority'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export interface AnimatedButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		// Create proper component based on asChild prop
		if (asChild) {
			return (
				<Slot
					className={cn(buttonVariants({ variant, size }), className)}
					ref={ref}
					{...props}
				/>
			)
		}

		// Use motion.button with animation props
		const buttonProps = props
		return (
			<motion.button
				className={cn(buttonVariants({ variant, size }), className)}
				ref={ref}
				whileHover={{ scale: 1.03 }}
				whileTap={{ scale: 0.97 }}
				transition={{
					type: 'spring',
					stiffness: 500,
					damping: 15,
				}}
				{...(buttonProps as any)}
			/>
		)
	}
)

AnimatedButton.displayName = 'AnimatedButton'

export { AnimatedButton }
