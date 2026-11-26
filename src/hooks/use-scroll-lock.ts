import { useEffect } from 'react'

/**
 * Locks page scrolling while `locked` is true by setting `overflow: hidden`
 * on <html>, the single owner of root scrolling. It pairs with
 * `scrollbar-gutter: stable` in globals.css, so hiding the scrollbar does not
 * change the layout width (no layout shift).
 *
 * The previous inline value is captured at lock time and restored on release.
 * Every release path must flip `locked` to false; the effect cleanup also runs
 * on unmount, so a lock can never outlive its owner.
 */
export function useScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = 'hidden'
    return () => {
      root.style.overflow = previous
    }
  }, [locked])
}
