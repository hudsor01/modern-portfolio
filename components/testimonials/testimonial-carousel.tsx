"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TestimonialCard } from "./testimonial-card"
import { ScrollFade } from "@/components/animations/scroll-fade"

interface Testimonial {
  id: string
  content: string
  author: {
    name: string
    title: string
    avatar?: string
  }
  rating: number
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[]
}

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const maxIndex = Math.ceil(testimonials.length / 3) - 1

  const next = () => {
    setCurrentIndex((prev) => (prev === maxIndex ? 0 : prev + 1))
  }

  const previous = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1))
  }

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {testimonials.map((testimonial) => (
            <ScrollFade key={testimonial.id} className="w-full flex-shrink-0 px-4 md:w-1/2 lg:w-1/3">
              <TestimonialCard {...testimonial} />
            </ScrollFade>
          ))}
        </div>
      </div>
      <div className="mt-6 flex justify-center gap-2">
        <Button variant="outline" size="icon" onClick={previous} disabled={currentIndex === 0}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous testimonials</span>
        </Button>
        <Button variant="outline" size="icon" onClick={next} disabled={currentIndex === maxIndex}>
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next testimonials</span>
        </Button>
      </div>
    </div>
  )
}

