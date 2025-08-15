'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCw, AlertTriangle } from 'lucide-react'

interface ProjectErrorBoundaryProps {
  children: React.ReactNode
}

interface ProjectErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ProjectErrorBoundary extends React.Component<
  ProjectErrorBoundaryProps,
  ProjectErrorBoundaryState
> {
  constructor(props: ProjectErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ProjectErrorBoundaryState {
    return { hasError: true, error }
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Project Error Boundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined })
    // Optionally reload the page or refetch data
    window.location.reload()
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-16 px-4">
          <div className="relative bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8 md:p-12 max-w-lg mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-orange-500/5 rounded-3xl" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-6">
                <div className="relative bg-red-500/10 backdrop-blur border border-red-500/20 rounded-2xl p-4">
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">
                Something went wrong
              </h3>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                We encountered an error while loading the projects. This might be a temporary issue.
              </p>
              
              {this.state.error && process.env.NODE_ENV === 'development' && (
                <details className="mb-6 text-left">
                  <summary className="text-gray-400 cursor-pointer mb-2">
                    Error details (development only)
                  </summary>
                  <pre className="text-xs text-red-300 bg-red-900/20 p-4 rounded-lg overflow-auto">
                    {this.state.error.message}
                    {this.state.error.stack && `\n${this.state.error.stack}`}
                  </pre>
                </details>
              )}
              
              <Button
                onClick={this.handleReset}
                className="relative bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-blue-500/20 hover:scale-105 transition-all duration-300 group border border-blue-400/20"
              >
                <span className="relative z-10 flex items-center">
                  <RefreshCw className="mr-2 w-4 h-4" />
                  Try Again
                </span>
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Functional error fallback component for simpler use cases
interface ProjectErrorFallbackProps {
  error?: Error
  onRetry?: () => void
}

export const ProjectErrorFallback: React.FC<ProjectErrorFallbackProps> = ({ 
  error, 
  onRetry 
}) => {
  return (
    <div className="text-center py-12 px-4">
      <div className="relative bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8 max-w-md mx-auto">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-orange-500/5 rounded-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-4">
            <div className="relative bg-red-500/10 backdrop-blur border border-red-500/20 rounded-2xl p-3">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-3">
            Error loading projects
          </h3>
          
          <p className="text-gray-300 mb-6">
            {error?.message || 'An unexpected error occurred. Please try again.'}
          </p>
          
          {onRetry && (
            <Button
              onClick={onRetry}
              className="relative bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:shadow-blue-500/20 hover:scale-105 transition-all duration-300 group border border-blue-400/20"
            >
              <span className="relative z-10 flex items-center">
                <RefreshCw className="mr-2 w-4 h-4" />
                Retry
              </span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}