'use client'

import { useState, useEffect } from 'react'

interface TypewriterTitleProps {
  titles: string[]
  typingSpeed?: number
  pauseDuration?: number
  className?: string
}

export function TypewriterTitle({
  titles,
  typingSpeed = 100,
  pauseDuration = 2000,
  className = '',
}: TypewriterTitleProps) {
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [cursorVisible, setCursorVisible] = useState(true)

  // Enhanced validation for titles array
  const safeTitles =
    Array.isArray(titles) && titles.length > 0
      ? titles.filter((title) => typeof title === 'string' && title.trim().length > 0)
      : []

  useEffect(() => {
    // Additional guard against empty or invalid titles array during runtime
    if (!Array.isArray(safeTitles) || safeTitles.length === 0) {
      setDisplayedText('')
      setIsTyping(false)
      return
    }

    // Guard against out-of-bounds index with additional safety
    const safeIndex = Math.max(0, Math.min(currentTitleIndex, safeTitles.length - 1))
    const currentTitle = safeTitles[safeIndex] || ''

    if (isTyping) {
      // Typing phase with bounds checking
      if (displayedText.length < currentTitle.length) {
        const timer = setTimeout(
          () => {
            setDisplayedText(currentTitle.slice(0, displayedText.length + 1))
          },
          Math.max(10, typingSpeed)
        ) // Ensure minimum typing speed
        return () => clearTimeout(timer)
      } else {
        // Finished typing, pause before backspacing
        const timer = setTimeout(
          () => {
            setIsTyping(false)
          },
          Math.max(500, pauseDuration)
        ) // Ensure minimum pause duration
        return () => clearTimeout(timer)
      }
    } else {
      // Backspacing phase with bounds checking
      if (displayedText.length > 0) {
        const timer = setTimeout(
          () => {
            setDisplayedText(displayedText.slice(0, -1))
          },
          Math.max(10, typingSpeed / 2)
        ) // Backspace faster but with minimum speed
        return () => clearTimeout(timer)
      } else {
        // Finished backspacing, move to next title with enhanced safety
        setCurrentTitleIndex((prev) => {
          if (safeTitles.length === 0) return 0
          const nextIndex = prev + 1
          return nextIndex % safeTitles.length
        })
        setIsTyping(true)
        return
      }
    }
  }, [displayedText, isTyping, currentTitleIndex, safeTitles, typingSpeed, pauseDuration])

  // Cursor blinking effect
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setCursorVisible((prev) => !prev)
    }, 500)
    return () => clearInterval(cursorTimer)
  }, [])

  // If no valid titles, show fallback
  if (safeTitles.length === 0) {
    return (
      <span className={className}>
        <span
          className={`inline-block w-0.5 h-[1em] bg-current ml-1 transition-opacity ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}
        />
      </span>
    )
  }

  return (
    <span className={className}>
      {displayedText}
      <span
        className={`inline-block w-0.5 h-[1em] bg-current ml-1 transition-opacity ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}
      />
    </span>
  )
}

// Pre-configured component for Richard's titles
export function RichardTypewriterTitle({ className }: { className?: string }) {
  const revOpsTitles = [
    'Revenue Operations Specialist',
    'Sales Automation Expert',
    'CRM Implementation Leader',
    'Business Intelligence Architect',
    'Partnership Program Developer',
    'Revenue Growth Strategist',
    'Marketing Operations Specialist',
    'Data Analytics Professional',
    'Process Automation Expert',
    'Revenue Forecasting Analyst',
    'Customer Lifecycle Strategist',
    'Commission Structure Designer',
    'Lead Attribution Specialist',
    'SaaS Metrics Analyst',
    'Pipeline Optimization Expert',
    'Revenue Technology Consultant',
    'Growth Operations Leader',
    'Sales Ops Automation Specialist',
    'RevOps System Architect',
    'Strategic Revenue Analyst',
  ]

  return (
    <TypewriterTitle
      titles={revOpsTitles}
      typingSpeed={80}
      pauseDuration={1500}
      className={className}
    />
  )
}
