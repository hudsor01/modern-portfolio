'use client'

import { EnhancedErrorBoundary } from '@/components/ui/enhanced-error-boundary'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body>
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-md">
            <EnhancedErrorBoundary
              showErrorDetails={process.env.NODE_ENV === 'development'}
              showReset={true}
              onError={(err) => {
                console.error('Global error:', err, error.digest)
              }}
              fallback={
                <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-2">
                    Application Error
                  </h2>
                  <p className="text-red-600 dark:text-red-300 mb-4">
                    We're sorry, but something went wrong. Our team has been notified.
                  </p>
                  <button
                    onClick={reset}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              }
            >
              {/* Empty children element to satisfy the required 'children' prop */}
              <></>
            </EnhancedErrorBoundary>
          </div>
        </div>
      </body>
    </html>
  )
}
