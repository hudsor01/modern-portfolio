"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { trackPageView } from "@/lib/analytics/track"

export function PageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const track = async () => {
      const path = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "")

      await trackPageView({
        path,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        language: navigator.language,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
      })
    }

    // Only track in production
    if (process.env.NODE_ENV === "production") {
      track()
    }
  }, [pathname, searchParams])

  return null
}

