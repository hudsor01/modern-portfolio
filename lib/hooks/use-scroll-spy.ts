"use client"

import { useEffect, useState } from "react"

export function useScrollSpy(selectors: string[], options?: IntersectionObserverInit) {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const elements = selectors.map((selector) => document.querySelector(selector))
    if (elements.some((element) => element === null)) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.getAttribute("id"))
          }
        })
      },
      {
        rootMargin: "-20% 0% -35% 0%",
        ...options,
      },
    )

    elements.forEach((element) => {
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [selectors, options])

  return activeId
}

