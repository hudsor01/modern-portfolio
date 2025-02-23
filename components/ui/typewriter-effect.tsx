"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface TypewriterProps {
  words: {
    text: string
    className?: string
  }[]
  className?: string
  cursorClassName?: string
}

export function TypewriterEffect({ words, className, cursorClassName }: TypewriterProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const typingSpeed = 100
    const deletingSpeed = 50
    const delayBetweenWords = 1500

    const word = words[currentWordIndex].text

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          // Typing
          if (currentText !== word) {
            setCurrentText(word.slice(0, currentText.length + 1))
          } else {
            // Word completed, wait before deleting
            setTimeout(() => setIsDeleting(true), delayBetweenWords)
          }
        } else {
          // Deleting
          if (currentText === "") {
            setIsDeleting(false)
            setCurrentWordIndex((prev) => (prev + 1) % words.length)
          } else {
            setCurrentText(word.slice(0, currentText.length - 1))
          }
        }
      },
      isDeleting ? deletingSpeed : typingSpeed,
    )

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, currentWordIndex, words])

  return (
    <div className={cn("flex items-center gap-1 my-6", className)}>
      <span className="inline-block text-4xl sm:text-5xl md:text-6xl font-bold text-center">{currentText}</span>
      <span className={cn("inline-block w-[4px] h-12 bg-primary animate-pulse", cursorClassName)} />
    </div>
  )
}

