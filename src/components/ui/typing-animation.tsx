"use client"

import { useEffect, useState, useCallback } from "react"
import { cn } from "@/lib/utils"

interface TypingAnimationProps {
  /**
   * An array of words/phrases to cycle through with typing effect
   */
  words: string[]
  /**
   * Additional CSS classes
   */
  className?: string
  /**
   * Typing speed in milliseconds per character
   * @default 100
   */
  typingSpeed?: number
  /**
   * Deletion speed in milliseconds per character
   * @default 50
   */
  deletingSpeed?: number
  /**
   * Delay before starting to delete (in ms)
   * @default 2000
   */
  delayBetweenWords?: number
  /**
   * Whether to loop through words continuously
   * @default true
   */
  loop?: boolean
  /**
   * Custom cursor character
   * @default "|"
   */
  cursor?: string
  /**
   * Whether to show the cursor
   * @default true
   */
  showCursor?: boolean
}

export function TypingAnimation({
  words,
  className,
  typingSpeed = 100,
  deletingSpeed = 50,
  delayBetweenWords = 2000,
  loop = true,
  cursor = "|",
  showCursor = true,
}: TypingAnimationProps) {
  const [displayText, setDisplayText] = useState("")
  const [wordIndex, setWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isWaiting, setIsWaiting] = useState(false)

  const currentWord = words[wordIndex] || ""

  const typeNextChar = useCallback(() => {
    if (isWaiting) return

    if (!isDeleting) {
      // Typing phase
      if (displayText.length < currentWord.length) {
        setDisplayText(currentWord.slice(0, displayText.length + 1))
      } else {
        // Word complete, wait then delete
        setIsWaiting(true)
        setTimeout(() => {
          setIsWaiting(false)
          setIsDeleting(true)
        }, delayBetweenWords)
      }
    } else {
      // Deleting phase
      if (displayText.length > 0) {
        setDisplayText(displayText.slice(0, -1))
      } else {
        // Deletion complete, move to next word
        setIsDeleting(false)
        if (loop || wordIndex < words.length - 1) {
          setWordIndex((prev) => (prev + 1) % words.length)
        }
      }
    }
  }, [displayText, currentWord, isDeleting, isWaiting, loop, wordIndex, words.length, delayBetweenWords])

  useEffect(() => {
    const timeout = setTimeout(
      typeNextChar,
      isDeleting ? deletingSpeed : typingSpeed
    )
    return () => clearTimeout(timeout)
  }, [typeNextChar, isDeleting, deletingSpeed, typingSpeed])

  return (
    <span className={cn("inline-flex items-center", className)}>
      <span>{displayText}</span>
      {showCursor && (
        <span className="animate-blink ml-0.5 inline-block">{cursor}</span>
      )}
    </span>
  )
}
