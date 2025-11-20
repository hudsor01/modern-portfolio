'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { createContextLogger } from '@/lib/logging/logger'

const logger = createContextLogger('ErrorBoundary')

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode)
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

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo })

    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Error logging
    if (process.env.NODE_ENV === 'production') {
      // Production: log basic error info
      logger.error('Error Boundary caught error', error)
    } else {
      // Development: include additional context in error data
      const errorData = {
        ...(error instanceof Error ? { name: error.name, message: error.message } : error),
        componentStack: errorInfo.componentStack,
        componentName: this.props.componentName || 'Unknown',
      }
      logger.error('Error Boundary caught error (Dev)', errorData)
    }
  }

  override componentDidUpdate(prevProps: ErrorBoundaryProps) {
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

  override render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback if provided
      if (this.props.fallback) {
        if (typeof this.props.fallback === 'function') {
          return this.props.fallback(this.state.error!, this.reset)
        }
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <div className="flex items-center justify-center min-h-[400px] p-6">
          <div className="w-full max-w-md text-center">
            <div className="p-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-red-100 dark:bg-red-900/20 rounded-full">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Something went wrong
              </h3>

              {this.props.showErrorDetails && this.state.error && process.env.NODE_ENV === 'development' && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-left">
                  <p className="text-sm text-red-700 dark:text-red-300 mb-2 font-mono">
                    {this.state.error.message}
                  </p>
                  {this.state.errorInfo?.componentStack && (
                    <pre className="text-xs text-red-600 dark:text-red-400 overflow-auto max-h-32">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              )}

              <p className="text-slate-600 dark:text-slate-400 mb-8">
                {process.env.NODE_ENV === 'development' 
                  ? 'Check the console for more details.'
                  : 'Please refresh the page or try again later.'
                }
              </p>

              {this.props.showReset !== false && (
                <div className="space-y-3">
                  <Button
                    onClick={this.reset}
                    className="w-full"
                    size="lg"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try again
                  </Button>
                  
                  <Button
                    onClick={() => window.location.href = '/'}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Go Home
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
): React.FC<P> {
  const displayName = Component.displayName || Component.name || 'Component'
  
  const WrappedComponent: React.FC<P> = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )
  
  WrappedComponent.displayName = `withErrorBoundary(${displayName})`
  
  return WrappedComponent
}