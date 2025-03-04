'use client'

import React from 'react'
import { Tab } from '@headlessui/react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface TabItem {
	key: string
	title: React.ReactNode
	content: React.ReactNode
}

interface TabsProps {
	items: TabItem[]
	defaultIndex?: number
	className?: string
	variant?: 'default' | 'pills' | 'underline'
}

export function HeadlessTabs({
	items,
	defaultIndex = 0,
	className,
	variant = 'default',
}: TabsProps) {
	return (
		<Tab.Group defaultIndex={defaultIndex}>
			<Tab.List
				className={cn(
					'flex w-full',
					variant === 'pills' && 'bg-muted/20 space-x-1 rounded-xl p-1',
					variant === 'underline' && 'border-border border-b',
					variant === 'default' && 'border-border border-b',
					className
				)}>
				{items.map(item => (
					<Tab
						key={item.key}
						className={({ selected }) =>
							cn(
								'relative flex-1 py-2.5 text-sm font-medium whitespace-nowrap transition-all focus:outline-none',

								// Pills variant
								variant === 'pills' &&
									cn(
										'rounded-lg px-3 py-2.5',
										selected ?
											'bg-primary text-white shadow'
										:	'text-foreground/70 hover:bg-muted/30 hover:text-foreground'
									),

								// Underline variant
								variant === 'underline' &&
									cn(
										'border-b-2 border-transparent px-4',
										selected ?
											'border-primary text-primary'
										:	'text-foreground/70 hover:border-border/80 hover:text-foreground'
									),

								// Default variant
								variant === 'default' &&
									cn(
										'px-4',
										selected ? 'text-primary' : (
											'text-foreground/70 hover:text-foreground'
										)
									)
							)
						}>
						{({ selected }) => (
							<>
								{item.title}
								{selected && variant === 'default' && (
									<motion.div
										layoutId='tab-indicator'
										className='bg-primary absolute inset-x-0 -bottom-[1px] h-0.5'
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ duration: 0.3 }}
									/>
								)}
							</>
						)}
					</Tab>
				))}
			</Tab.List>
			<Tab.Panels className='mt-4'>
				<AnimatePresence mode='wait'>
					{items.map(item => (
						<Tab.Panel key={item.key} className='focus:outline-none' unmount={false}>
							{() => (
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									transition={{ duration: 0.3 }}>
									{item.content}
								</motion.div>
							)}
						</Tab.Panel>
					))}
				</AnimatePresence>
			</Tab.Panels>
		</Tab.Group>
	)
}
