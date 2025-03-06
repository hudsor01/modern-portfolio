'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { 
      hasError: false,
      error: null
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true,
      error 
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // For all errors, use the fallback or default error message
      return this.props.fallback || (
        <div className="p-4 rounded-md bg-red-50 border border-red-100">
          <h2 className="text-lg font-medium text-red-800">
            Something went wrong
          </h2>
          <p className="mt-1 text-sm text-red-700">
            Please try refreshing the page
          </p>
        </div>
      )
    }

    return this.props.children
  }
}
