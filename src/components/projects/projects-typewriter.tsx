'use client'

import { useState, useEffect } from 'react'

interface ProjectsTypewriterProps {
  phrases: string[]
  typingSpeed?: number
  deleteSpeed?: number
  delayBeforeDelete?: number
}

export function ProjectsTypewriter({
  phrases,
  typingSpeed = 100,
  deleteSpeed = 50,
  delayBeforeDelete = 1500,
}: ProjectsTypewriterProps) {
  const [currentText, setCurrentText] = useState('')
  const [currentPhrase, setCurrentPhrase] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [typingDelay, setTypingDelay] = useState(typingSpeed)

  useEffect(() => {
    const phrase = phrases[currentPhrase] || '';

    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        setCurrentText(phrase.substring(0, currentText.length + 1))
        setTypingDelay(typingSpeed)

        // Start deleting when full phrase is typed
        if (currentText === phrase) {
          setIsDeleting(true)
          setTypingDelay(delayBeforeDelete)
        }
      } else {
        // Deleting
        setCurrentText(phrase.substring(0, currentText.length - 1))
        setTypingDelay(deleteSpeed)

        // Move to next phrase when deleted
        if (currentText === '') {
          setIsDeleting(false)
          setCurrentPhrase((current) => (current + 1) % phrases.length)
        }
      }
    }, typingDelay)

    return () => clearTimeout(timer)
  }, [
    currentText,
    currentPhrase,
    isDeleting,
    phrases,
    typingSpeed,
    deleteSpeed,
    delayBeforeDelete,
    typingDelay,
  ])

  return (
    <div className="relative inline-block min-h-[3.5rem] max-w-full overflow-hidden">
      <h1 className="text-3xl sm:text-4xl md:typography-h1 text-5xl tracking-tight opacity-100 transition-opacity duration-500">
        <span className="text-gradient">{currentText}</span>
        <span className="inline-block w-2 h-8 bg-primary-hover ml-1 animate-blink align-middle"></span>
      </h1>
    </div>
  )
}
