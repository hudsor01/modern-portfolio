'use client'

import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      // Show after 300px but hide when near bottom (last 800px)
      const nearBottom = scrollPosition + windowHeight > documentHeight - 800
      setIsVisible(scrollPosition > 300 && !nearBottom)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Run once on mount
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-card/95 backdrop-blur-sm border-t border-border lg:hidden z-50 animate-slideUp">
      <div className="max-w-screen-sm mx-auto">
        <Button
          asChild
          className="w-full h-12 text-base font-semibold"
          size="lg"
        >
          <Link href="/contact">
            <Mail className="mr-2 h-5 w-5" />
            Get in Touch
          </Link>
        </Button>
      </div>
    </div>
  )
}
