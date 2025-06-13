'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui Button
import { ErrorBoundaryProps, ErrorBoundaryState } from '@/types/ui';
import { AlertTriangle, RefreshCw, HomeIcon } from 'lucide-react';

/**
 * ErrorBoundary Component
 * 
 * A class component that catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // Here you would typically log to a service like Sentry
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.captureException(error);
    // }
  }

  handleReset = (): void => {
    // Reset the error boundary state
    this.setState({ hasError: false, error: null });
    
    // Call the onReset callback if provided
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // If a custom fallback is provided as a function, call it with the error and reset function
      if (this.props.fallback && typeof this.props.fallback === 'function') {
        return this.props.fallback(this.state.error!, this.handleReset);
      }
      
      // If a custom fallback is provided as a ReactNode, render it
      if (this.props.fallback && typeof this.props.fallback !== 'function') {
        return this.props.fallback;
      }
      
      // Default fallback UI
      return (
        <div className="container mx-auto max-w-2xl py-12 px-4">
          <div className="bg-card text-card-foreground p-6 sm:p-8 rounded-lg shadow-lg border border-border">
            <div className="text-center mb-6">
              <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
              <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">
                Something went wrong
              </h2>
              <p className="text-muted-foreground">
                We're sorry, but an error occurred while rendering this part of the page.
              </p>
              {this.state.error && (
                <div className="mt-4 p-3 bg-destructive/10 text-destructive text-sm rounded-md text-left font-mono overflow-x-auto">
                  {this.state.error.toString()}
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button
                variant="outline"
                onClick={() => window.location.href = '/'}
              >
                <HomeIcon className="mr-2 h-4 w-4" />
                Go to Homepage
              </Button>
              <Button
                variant="default"
                onClick={this.handleReset}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      );
    }

    // If there's no error, render children normally
    return this.props.children;
  }
}

/**
 * withErrorBoundary HOC
 * 
 * A higher-order component that wraps a component with an ErrorBoundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
): React.FC<P> {
  const displayName = Component.displayName || Component.name || 'Component';
  
  const WrappedComponent: React.FC<P> = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${displayName})`;
  
  return WrappedComponent;
}
