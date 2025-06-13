'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { reportError, ErrorSeverity } from '@/lib/error-utils'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { useToast } from '@/hooks/use-sonner-toast'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  componentName?: string
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  resetOnPropsChange?: boolean
  showReset?: boolean
  showErrorDetails?: boolean
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

function ErrorToast({ error }: { error: Error }) {
  const { error: showError } = useToast()

  React.useEffect(() => {
    showError(`An error occurred: ${error.message}`)
  }, [error, showError])

  return null
}

export class EnhancedErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Report the error to our error tracking system
    reportError(error, ErrorSeverity.ERROR, this.props.componentName, {
      componentStack: errorInfo.componentStack,
    })

    // Store error info for potential display
    this.setState({ errorInfo })

    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Development logging with structured error information
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Boundary Caught Error')
      console.error('Error:', error.message)
      console.error('Stack:', error.stack)
      console.error('Component Stack:', errorInfo.componentStack)
      console.error('Component Name:', this.props.componentName || 'Unknown')
      console.groupEnd()
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (
      this.state.hasError &&
      this.props.resetOnPropsChange &&
      prevProps.children !== this.props.children
    ) {
      this.reset()
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Show toast notification when error occurs
      const errorToast = this.state.error ? <ErrorToast error={this.state.error} /> : null

      // Use custom fallback if provided
      if (this.props.fallback) {
        return (
          <>
            {errorToast}
            {this.props.fallback}
          </>
        )
      }

      return (
        <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg shadow-sm">
          {errorToast}
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            <h3 className="text-lg font-medium text-red-800 dark:text-red-300">
              Something went wrong
            </h3>
          </div>

          {this.props.showErrorDetails && this.state.error && (
            <div className="mb-4">
              <p className="text-sm text-red-600 dark:text-red-300 mb-2">
                {this.state.error.message}
              </p>
              {this.state.errorInfo && (
                <pre className="text-xs bg-red-100 dark:bg-red-900/40 p-3 rounded overflow-auto max-h-32">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>
          )}

          {(this.props.showReset !== false) && (
            <div className="flex gap-3">
              <Button
                onClick={this.reset}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try again
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="ghost"
                size="sm"
              >
                Reload page
              </Button>
            </div>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
