"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { trackEvent } from "@/lib/analytics/track"

export function PageTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const track = async () => {
      const path = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "")

      await trackEvent({
        type: "page_view",
        path,
        metadata: {
          referrer: document.referrer,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        },
      })
    }

    // Only track if not in development
    if (process.env.NODE_ENV !== "development") {
      track()
    }
  }, [pathname, searchParams])

  return null
}

