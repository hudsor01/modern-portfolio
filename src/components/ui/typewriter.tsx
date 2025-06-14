'use client'

import { useEffect, useState, useCallback } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'framer-motion'

interface TypewriterProps {
  phrases: string[]
  speed?: number
  delay?: number
}

export function Typewriter({ phrases, speed = 50, delay = 2000 }: TypewriterProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Motion value for animating the number of characters displayed
  const count = useMotionValue(0)
  const baseText = phrases[currentIndex] || ''
  const rounded = useTransform(count, (latest) => Math.round(latest))
  const displayText = useTransform(rounded, (latest) => baseText.slice(0, latest))

  // Callback to change to the next phrase
  const changePhrase = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % phrases.length)
  }, [phrases.length])

  useEffect(() => {
    // Reset animation by animating from 0 to the length of the current phrase
    // Store the timeout ID for cleanup
    let timeoutId: number | null = null

    const controls = animate(count, baseText.length, {
      type: 'tween',
      duration: baseText.length / speed,
      ease: 'easeInOut',
      onComplete: () => {
        // After animation completes, wait for the delay then change the phrase
        timeoutId = window.setTimeout(changePhrase, delay)
      },
    })

    // Cleanup: cancel the animation and clear the timeout if set
    return () => {
      controls.cancel()
      if (timeoutId !== null) {
        clearTimeout(timeoutId)
      }
    }
  }, [baseText, speed, delay, changePhrase, count])

  return (
    <span>
      <motion.span>{displayText}</motion.span>
      <BlinkingCursor />
    </span>
  )
}

function BlinkingCursor() {
  return (
    <motion.span
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{
        repeat: Infinity,
        repeatType: 'reverse',
        duration: 0.6,
      }}
      className="ml-0.5"
      aria-hidden="true"
    >
      |
    </motion.span>
  )
}
