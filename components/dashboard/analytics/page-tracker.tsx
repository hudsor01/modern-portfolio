"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { trackPageView } from "@/lib/actions/analytics"

export function PageTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handlePageView = async () => {
      try {
        const url = searchParams.toString() ? `${pathname}?${searchParams}` : pathname
        const result = await trackPageView(url)

        if (!result.success) {
          console.warn("Analytics tracking failed:", result.error)
        }
      } catch (error) {
        // Log error but don't break the app
        console.error("Failed to track page view:", error)
      }
    }

    // Don't block the main thread
    setTimeout(handlePageView, 0)
  }, [pathname, searchParams])

  return null
}

