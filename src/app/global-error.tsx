'use client'

import { Button } from '@/components/ui/button'
import { RefreshCw, AlertTriangle } from 'lucide-react'

// This is for root-level errors that need to replace the entire page
export default function GlobalError({
  error: _error,
  reset
}: Readonly<{
  error: Error & { digest?: string }
  reset: () => void
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-50 dark:bg-slate-900 font-sans">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-md text-center">
            <div className="p-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xs">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-destructive/10 dark:bg-destructive-bg rounded-full">
                <AlertTriangle className="w-8 h-8 text-destructive dark:text-destructive" />
              </div>

              <h2 className="typography-h3 text-slate-900 dark:text-white mb-4">
                Something went wrong
              </h2>

              <p className="text-slate-600 dark:text-slate-400 mb-8">
                A critical error occurred. Please try refreshing the page or contact support if the problem persists.
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
      </body>
    </html>
  )
}