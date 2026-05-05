'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'
import { Button } from '@/components/ui/button'
import { RefreshCw, AlertTriangle } from 'lucide-react'

export default function ErrorPage({
  error,
  reset
}: Readonly<{
  error: Error & { digest?: string }
  reset: () => void
}>) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-background">
      <div className="w-full max-w-md text-center">
        <div className="p-8 bg-card border border-border rounded-xl shadow-xs">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-destructive/10 rounded-full">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>

          <h2 className="typography-h3 text-foreground mb-4">
            Something went wrong
          </h2>

          <p className="text-muted-foreground mb-8">
            We're sorry, but something unexpected happened. Please try again or contact support if the problem persists.
          </p>

          <div className="space-y-4">
            <Button
              onClick={reset}
              className="w-full"
              size="lg"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>

            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Go Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
