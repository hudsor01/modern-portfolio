'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface TypewriterProps {
	words: {
		text: string
		className?: string
	}[]
	className?: string
	cursorClassName?: string
}

export function TypewriterEffect({ words, className, cursorClassName }: TypewriterProps) {
	const [currentWordIndex, setCurrentWordIndex] = useState(0)
	const [currentText, setCurrentText] = useState('')
	const [isDeleting, setIsDeleting] = useState(false)

	useEffect(() => {
		const typingSpeed = 80 // Speed for typing
		const deletingSpeed = 40 // Speed for deleting
		const delayBetweenWords = 2000 // Pause between words

		const word = words[currentWordIndex].text

		const timeout = setTimeout(
			() => {
				if (!isDeleting) {
					// Typing
					if (currentText !== word) {
						setCurrentText(word.slice(0, currentText.length + 1))
					} else {
						// Word completed, wait before deleting
						setTimeout(() => setIsDeleting(true), delayBetweenWords)
					}
				} else {
					// Deleting
					if (currentText === '') {
						setIsDeleting(false)
						setCurrentWordIndex(prev => (prev + 1) % words.length)
					} else {
						setCurrentText(word.slice(0, currentText.length - 1))
					}
				}
			},
			isDeleting ? deletingSpeed : typingSpeed
		)

		return () => clearTimeout(timeout)
	}, [currentText, isDeleting, currentWordIndex, words])

	return (
		<div className={cn('inline-flex items-center', className)}>
			<motion.span
				className='inline-block text-center'
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.3 }}>
				{currentText}
			</motion.span>
			<motion.span
				className={cn(
					'inline-block h-[1em] w-[4px] bg-[var(--color-primary)]',
					cursorClassName
				)}
				animate={{
					opacity: [1, 0, 1],
					marginLeft: '2px',
				}}
				transition={{
					opacity: {
						duration: 0.8,
						repeat: Infinity,
						repeatType: 'loop',
					},
					marginLeft: {
						duration: 0.1,
					},
				}}
			/>
		</div>
	)
}
