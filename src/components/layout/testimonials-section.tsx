'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Quote } from 'lucide-react'

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
      <div className="w-full mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="typography-h2 border-none pb-0 text-3xl md:text-4xl text-foreground animate-fade-in-up">
            What My Clients Say
          </h2>
          <p className="typography-muted animate-fade-in-up animate-delay-100">
            I&apos;ve helped businesses across various industries optimize their revenue operations
            and drive growth.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Testimonial Cards */}
          <div className="lg:col-span-8">
            <div className="relative min-h-[300px]">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`bg-card rounded-xl p-8 shadow-lg border border-border absolute inset-0 transition-all duration-300 ${
                    activeIndex === index
                      ? 'opacity-100 translate-x-0 scale-100 z-10'
                      : 'opacity-0 translate-x-5 scale-95 z-0 pointer-events-none'
                  }`}
                >
                  <Quote className="text-primary w-12 h-12 mb-4 opacity-20" />
                  <blockquote className="typography-blockquote text-foreground mb-6">
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
                            <span className="typography-large text-primary dark:text-primary/70">
                              {testimonial.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="typography-large text-foreground">
                        {testimonial.name}
                      </h4>
                      <p className="typography-small text-muted-foreground">
                        {testimonial.title}
                      </p>
                    </div>
                  </div>
                </div>
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
                      ? 'bg-primary/5 dark:bg-primary-bg border-l-4 border-primary dark:border-primary/50'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <h4 className="typography-large text-foreground">{testimonial.name}</h4>
                  <p className="typography-small text-muted-foreground">{testimonial.title}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
