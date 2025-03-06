'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-16">
      <div className="text-center max-w-md">
        <h2 className="text-3xl font-bold mb-4">Something went wrong</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          We apologize for the inconvenience. An unexpected error has occurred.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Button onClick={reset} className="flex items-center gap-2">
            <RefreshCw size={16} />
            Try again
          </Button>
          
          <Button asChild variant="outline">
            <Link href="/">
              Return Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}