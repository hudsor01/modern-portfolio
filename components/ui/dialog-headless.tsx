'use client'

import React, { Fragment } from 'react'
import { Dialog as HeadlessDialog, Transition } from '@headlessui/react'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import { motion } from 'framer-motion'

interface DialogProps {
	open: boolean
	onClose: () => void
	children: React.ReactNode
	initialFocus?: React.RefObject<HTMLElement>
	className?: string
}

export function Dialog({ open, onClose, children, initialFocus, className }: DialogProps) {
	return (
		<Transition appear show={open} as={Fragment}>
			<HeadlessDialog
				as='div'
				className='relative z-50'
				onClose={onClose}
				initialFocus={initialFocus}>
				<Transition.Child
					as={Fragment}
					enter='ease-out duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'>
					<div className='fixed inset-0 bg-black/40 backdrop-blur-sm' />
				</Transition.Child>

				<div className='fixed inset-0 overflow-y-auto'>
					<div className='flex min-h-full items-center justify-center p-4 text-center'>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 scale-95'
							enterTo='opacity-100 scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 scale-100'
							leaveTo='opacity-0 scale-95'>
							<HeadlessDialog.Panel
								className={cn(
									'bg-background w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all',
									className
								)}>
								{children}
							</HeadlessDialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</HeadlessDialog>
		</Transition>
	)
}

export function DialogContent({
	children,
	className,
	withCloseIcon = true,
	onClose,
}: {
	children: React.ReactNode
	className?: string
	withCloseIcon?: boolean
	onClose?: () => void
}) {
	return (
		<div className={cn('relative', className)}>
			{withCloseIcon && (
				<button
					onClick={onClose}
					className='text-foreground/70 hover:bg-muted hover:text-foreground absolute top-2 right-2 rounded-full p-1.5 transition-colors'>
					<X className='h-5 w-5' />
					<span className='sr-only'>Close</span>
				</button>
			)}
			{children}
		</div>
	)
}

export function DialogHeader({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) {
	return (
		<div className={cn('mb-4', className)}>
			<motion.div
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}>
				{children}
			</motion.div>
		</div>
	)
}

export function DialogTitle({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) {
	return (
		<HeadlessDialog.Title
			as='h3'
			className={cn('text-foreground text-lg leading-6 font-medium', className)}>
			{children}
		</HeadlessDialog.Title>
	)
}

export function DialogDescription({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) {
	return (
		<HeadlessDialog.Description className={cn('text-muted-foreground mt-2 text-sm', className)}>
			{children}
		</HeadlessDialog.Description>
	)
}

export function DialogFooter({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) {
	return (
		<div
			className={cn(
				'mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
				className
			)}>
			{children}
		</div>
	)
}
