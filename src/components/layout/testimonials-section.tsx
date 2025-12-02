'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Quote } from 'lucide-react'
import { m as motion } from 'framer-motion'

// Testimonials data
const testimonials = [
  {
    quote:
      "Richard's data-driven approach to revenue operations transformed our sales process and increased our conversion rates by 35% in just three months.",
    name: 'Sarah Johnson',
    title: 'VP of Sales, TechCorp Inc.',
    image: '',
  },
  {
    quote:
      "Working with Richard on our process optimization initiative was a game-changer. His strategic insights and analytical skills helped us identify bottlenecks we didn't even know existed.",
    name: 'Michael Chen',
    title: 'COO, GrowthMetrics',
    image: '',
  },
  {
    quote:
      "Richard's expertise in partner management and revenue operations helped us scale our channel program to new heights. His ability to translate data into actionable strategies is remarkable.",
    name: 'Jessica Williams',
    title: 'Partner Operations Director, ScaleUp Solutions',
    image: '',
  },
]

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
          >
            What My Clients Say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted-foreground"
          >
            I&apos;ve helped businesses across various industries optimize their revenue operations
            and drive growth.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Testimonial Cards */}
          <div className="lg:col-span-8">
            <div className="relative">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{
                    opacity: activeIndex === index ? 1 : 0,
                    x: activeIndex === index ? 0 : 20,
                    scale: activeIndex === index ? 1 : 0.95,
                  }}
                  transition={{ duration: 0.4 }}
                  className={`bg-card rounded-xl p-8 shadow-lg border border-border absolute inset-0 ${
                    activeIndex === index ? 'z-10' : 'z-0'
                  }`}
                  style={{ display: activeIndex === index ? 'block' : 'none' }}
                >
                  <Quote className="text-primary w-12 h-12 mb-4 opacity-20" />
                  <blockquote className="text-xl text-foreground mb-6 leading-relaxed">
                    &quot;{testimonial.quote}&quot;
                  </blockquote>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-border mr-4">
                      <div className="relative w-full h-full">
                        {testimonial.image ? (
                          <Image
                            src={testimonial.image}
                            alt={testimonial.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="bg-primary/10 dark:bg-primary/20 w-full h-full flex items-center justify-center">
                            <span className="text-lg font-bold text-primary dark:text-primary/70">
                              {testimonial.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.title}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-4">
            <div className="space-y-4">
              {testimonials.map((testimonial, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                    activeIndex === index
                      ? 'bg-primary/5 dark:bg-primary/20/30 border-l-4 border-primary dark:border-primary/50'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
