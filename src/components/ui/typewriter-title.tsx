'use client'

import { useState, useEffect } from 'react'
import { m as motion } from 'framer-motion'

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
  className = ''
}: TypewriterTitleProps) {
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    if (titles.length === 0) return
    
    const currentTitle = titles[currentTitleIndex] || ''
    
    if (isTyping) {
      // Typing phase
      if (displayedText.length < currentTitle.length) {
        const timer = setTimeout(() => {
          setDisplayedText(currentTitle.slice(0, displayedText.length + 1))
        }, typingSpeed)
        return () => clearTimeout(timer)
      } else {
        // Finished typing, pause before backspacing
        const timer = setTimeout(() => {
          setIsTyping(false)
        }, pauseDuration)
        return () => clearTimeout(timer)
      }
    } else {
      // Backspacing phase
      if (displayedText.length > 0) {
        const timer = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1))
        }, typingSpeed / 2) // Backspace faster
        return () => clearTimeout(timer)
      } else {
        // Finished backspacing, move to next title
        setCurrentTitleIndex((prev) => (prev + 1) % titles.length)
        setIsTyping(true)
        return
      }
    }
  }, [displayedText, isTyping, currentTitleIndex, titles, typingSpeed, pauseDuration])

  // Cursor blinking effect
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)
    return () => clearInterval(cursorTimer)
  }, [])

  return (
    <span className={className}>
      {displayedText}
      <motion.span
        animate={{ opacity: showCursor ? 1 : 0 }}
        transition={{ duration: 0.1 }}
        className="inline-block w-0.5 h-[1em] bg-current ml-1"
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
    'Strategic Revenue Analyst'
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