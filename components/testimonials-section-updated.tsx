'use client'

import { useState } from 'react'
import { Quote } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useMediaQuery } from '@/hooks/use-media-query'

// Sample testimonials data
const testimonials = [
  {
    quote: "Richard's data-driven approach to revenue operations transformed our sales process and increased our conversion rates by 35% in just three months.",
    name: "Sarah Johnson",
    title: "VP of Sales, TechCorp Inc.",
    image: "" // Placeholder - will use fallback with initials
  },
  {
    quote: "Working with Richard on our process optimization initiative was a game-changer. His strategic insights and analytical skills helped us identify bottlenecks we didn't even know existed.",
    name: "Michael Chen",
    title: "COO, GrowthMetrics",
    image: "" // Placeholder - will use fallback with initials
  },
  {
    quote: "Richard's expertise in partner management and revenue operations helped us scale our channel program to new heights. His ability to translate data into actionable strategies is remarkable.",
    name: "Jessica Williams",
    title: "Partner Operations Director, ScaleUp Solutions",
    image: "" // Placeholder - will use fallback with initials
  }
];

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <section className="py-20 bg-muted/30">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4"
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
            I've helped businesses across various industries optimize their revenue operations and drive growth.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Mobile view: Testimonial cards stacked vertically */}
          {isMobile && (
            <div className="lg:col-span-12">
              <div className="flex flex-col gap-6">
                {testimonials.map((testimonial, index) => (
                  <div 
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`bg-card rounded-xl p-6 shadow-md cursor-pointer transition-all duration-300 border ${
                      activeIndex === index 
                        ? 'border-primary shadow-lg scale-[1.02]' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="mb-4">
                      <Quote className="text-primary/20 w-10 h-10" />
                    </div>
                    
                    <p className="text-card-foreground mb-6">
                      "{testimonial.quote}"
                    </p>
                    
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold mr-4">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold">{testimonial.name}</h4>
                        <p className="text-muted-foreground text-sm">{testimonial.title}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Desktop view: Current testimonial card with navigation */}
          {!isMobile && (
            <>
              {/* Left side: Testimonial content */}
              <div className="lg:col-span-8">
                <div className="relative h-[350px]">
                  <AnimatePresence mode="wait">
                    {testimonials.map((testimonial, index) => (
                      activeIndex === index && (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.4 }}
                          className="absolute inset-0"
                        >
                          <div className="bg-card h-full p-8 rounded-xl shadow-md border border-border flex flex-col justify-between">
                            <div>
                              <Quote className="text-primary/20 w-14 h-14 mb-4" />
                              <p className="text-card-foreground text-lg leading-relaxed">
                                "{testimonial.quote}"
                              </p>
                            </div>
                            
                            <div className="flex items-center mt-6">
                              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold mr-4">
                                {testimonial.name.charAt(0)}
                              </div>
                              <div>
                                <h4 className="font-bold">{testimonial.name}</h4>
                                <p className="text-muted-foreground">{testimonial.title}</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    ))}
                  </AnimatePresence>
                </div>
              </div>
              
              {/* Right side: Navigation */}
              <div className="lg:col-span-4">
                <div className="bg-card rounded-xl overflow-hidden shadow-sm border border-border">
                  {testimonials.map((testimonial, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      className={`w-full text-left p-4 border-b border-border last:border-b-0 transition-colors ${
                        activeIndex === index 
                          ? 'bg-primary/5 border-l-4 border-l-primary pl-4' 
                          : 'hover:bg-muted border-l-4 border-l-transparent pl-4'
                      }`}
                    >
                      <h4 className="font-bold">{testimonial.name}</h4>
                      <p className="text-muted-foreground text-sm">{testimonial.title}</p>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
