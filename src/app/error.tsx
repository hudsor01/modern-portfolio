'use client'

import { Button } from '@/components/ui/button'
import { RefreshCw, AlertTriangle } from 'lucide-react'

export default function GlobalError({ 
  reset 
}: { 
  error: Error & { digest?: string }
  reset: () => void 
}) {
  return (
    <html>
      <body>
        <div className="flex items-center justify-center min-h-screen p-4 bg-slate-50 dark:bg-slate-900">
          <div className="w-full max-w-md text-center">
            <div className="p-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-red-100 dark:bg-red-900/20 rounded-full">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
                Something went wrong
              </h2>
              
              <p className="text-slate-600 dark:text-slate-400 mb-8">
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
      </body>
    </html>
  )
}