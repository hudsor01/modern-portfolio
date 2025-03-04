'use client'

import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ErrorBoundaryProps {
	children: ReactNode
	fallback?: ReactNode
	className?: string
	onError?: () => void
	resetText?: string
}

interface ErrorBoundaryState {
	hasError: boolean
	error?: Error
}

/**
 * Simple error boundary component that can be used throughout the application
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	public state: ErrorBoundaryState = {
		hasError: false,
	}

	public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error }
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error('Uncaught error:', error, errorInfo)
		if (this.props.onError) {
			this.props.onError()
		}
	}

	private handleReset = () => {
		this.setState({ hasError: false, error: undefined })
	}

	public render() {
		if (this.state.hasError) {
			return (
				this.props.fallback || (
					<div
						className={cn(
							'bg-background flex min-h-[200px] w-full flex-col items-center justify-center gap-4 rounded-[var(--radius)] border p-6 text-center',
							this.props.className
						)}>
						<AlertTriangle className='h-8 w-8 text-amber-500' />
						<div className='space-y-2'>
							<h2 className='text-lg font-semibold'>Something went wrong</h2>
							<p className='text-sm text-[var(--muted-foreground)]'>
								{this.state.error?.message ||
									'An error occurred while rendering this content'}
							</p>
						</div>
						<Button onClick={this.handleReset} className='button mt-2 gap-2' size='sm'>
							<RefreshCw className='h-4 w-4' />
							{this.props.resetText || 'Try again'}
						</Button>
					</div>
				)
			)
		}

		return this.props.children
	}
}

/**
 * Error fallback component that can be used with react-error-boundary
 */
interface ErrorFallbackProps {
	error: Error
	resetErrorBoundary: () => void
	className?: string
	title?: string
	resetText?: string
}

export function ErrorFallback({
	error,
	resetErrorBoundary,
	className,
	title = 'Something went wrong',
	resetText = 'Try again',
}: ErrorFallbackProps) {
	return (
		<div
			className={cn(
				'bg-background flex min-h-[200px] w-full flex-col items-center justify-center gap-4 rounded-[var(--radius)] border p-6 text-center',
				className
			)}>
			<AlertTriangle className='h-8 w-8 text-amber-500' />
			<div className='space-y-2'>
				<h2 className='text-lg font-semibold'>{title}</h2>
				<p className='text-sm text-[var(--muted-foreground)]'>
					{error?.message || 'An error occurred while rendering this content'}
				</p>
			</div>
			<Button onClick={resetErrorBoundary} className='button mt-2 gap-2' size='sm'>
				<RefreshCw className='h-4 w-4' />
				{resetText}
			</Button>
		</div>
	)
}
