"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { getTestimonials } from "@/lib/content"
import Image from "next/image"

export function TestimonialsSlider() {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const { data: testimonials = [] } = useQuery({
    queryKey: ["testimonials"],
    queryFn: getTestimonials,
  })

  const next = React.useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1 === testimonials.length ? 0 : prevIndex + 1))
  }, [testimonials.length])

  const previous = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 < 0 ? testimonials.length - 1 : prevIndex - 1))
  }

  React.useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <section className="bg-muted py-12 md:py-24 lg:py-32">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-8"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold md:text-4xl">What People Are Saying</h2>
            <p className="mt-4 text-muted-foreground">Testimonials from clients and colleagues</p>
          </div>
          <div className="relative mx-auto max-w-4xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-8">
                  <Quote className="mb-4 h-8 w-8 text-primary" />
                  <blockquote className="mb-6 text-xl">{testimonials[currentIndex]?.content}</blockquote>
                  <div className="flex items-center gap-4">
                    {testimonials[currentIndex]?.image && (
                      <Image
                        src={testimonials[currentIndex].image || "/placeholder.svg"}
                        alt={testimonials[currentIndex].name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                    )}
                    <div>
                      <div className="font-semibold">{testimonials[currentIndex]?.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonials[currentIndex]?.role} at {testimonials[currentIndex]?.company}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>
            <div className="absolute -left-4 -right-4 top-1/2 flex -translate-y-1/2 justify-between">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={previous}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={next}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

