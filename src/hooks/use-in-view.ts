import { useEffect, useState } from 'react'

/**
 * Custom useInView hook using IntersectionObserver
 * Tracks when an element enters the viewport
 *
 * @param ref - React ref to the element to observe
 * @param options - Optional configuration
 * @param options.once - If true, stop observing after first intersection
 * @returns boolean indicating if element is in view
 */
export function useInView(
  ref: React.RefObject<HTMLElement | null>,
  options?: { once?: boolean }
) {
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInView(true)
          if (options?.once) {
            observer.disconnect()
          }
        } else if (!options?.once) {
          setIsInView(false)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, options?.once])

  return isInView
}
