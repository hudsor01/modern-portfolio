"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { logger } from "@/lib/logger"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error("Uncaught error:", { error, errorInfo })
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Alert variant="destructive" className="m-4">
          <AlertTitle>Something went wrong!</AlertTitle>
          <AlertDescription className="mt-2">
            <div className="mb-4">
              {process.env.NODE_ENV === "development" ? (
                <pre className="mt-2 w-full overflow-auto rounded-md bg-slate-950 p-4 text-sm">
                  {this.state.error?.message}
                </pre>
              ) : (
                "An error occurred while rendering this component."
              )}
            </div>
            <Button onClick={this.handleReset} variant="outline" size="sm">
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      )
    }

    return this.props.children
  }
}
