"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { ExternalLink, Home, RefreshCcw } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex max-w-2xl flex-col items-center gap-4 text-center">
        <h1 className="text-4xl font-bold">Something went wrong!</h1>
        <p className="text-muted-foreground">An error occurred while loading this page. Please try again later.</p>
        <div className="flex gap-2">
          <Button onClick={reset} variant="default">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Try again
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="https://github.com/hudsor01/portfolio/issues" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Report issue
            </Link>
          </Button>
        </div>
        {process.env.NODE_ENV === "development" && (
          <div className="mt-4 rounded-md bg-muted p-4">
            <p className="text-sm text-muted-foreground">{error.message}</p>
          </div>
        )}
      </div>
    </div>
  )
}

