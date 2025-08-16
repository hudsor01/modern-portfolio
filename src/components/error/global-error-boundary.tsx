'use client'

import React from 'react'
import { logger } from '@/lib/monitoring/logger'
import { ModernCard, ModernCardContent } from '@/components/ui/modern-card'
import { Button } from '@/components/ui/button'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>
}

export class GlobalErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    }
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('React Error Boundary caught error', error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: 'GlobalErrorBoundary',
    })
    
    this.setState({
      error,
      errorInfo,
    })
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return (
          <FallbackComponent 
            error={this.state.error!} 
            retry={this.handleRetry} 
          />
        )
      }

      return (
        <DefaultErrorFallback 
          error={this.state.error!} 
          retry={this.handleRetry}
        />
      )
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ 
  error, 
  retry 
}: { 
  error: Error
  retry: () => void 
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <ModernCard variant="highlight" className="max-w-md">
        <ModernCardContent className="text-center space-y-4">
          <div className="text-red-400 text-4xl">⚠️</div>
          <h2 className="text-xl font-bold text-white">Something went wrong</h2>
          <p className="text-gray-300">
            An unexpected error occurred. Our team has been notified.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <details className="text-left text-sm bg-gray-900/50 p-3 rounded">
              <summary className="cursor-pointer text-red-400 mb-2">
                Error Details
              </summary>
              <pre className="text-gray-300 whitespace-pre-wrap">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}
          <div className="flex gap-3 justify-center">
            <Button onClick={retry} variant="gradient">
              Try Again
            </Button>
            <Button 
              onClick={() => window.location.href = '/'} 
              variant="outline"
            >
              Go Home
            </Button>
          </div>
        </ModernCardContent>
      </ModernCard>
    </div>
  )
}