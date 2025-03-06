'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

const testimonials = [
  {
    quote: "Richard's strategic approach to revenue operations transformed our business processes, leading to a 40% increase in operational efficiency.",
    author: "Alex Thompson",
    position: "CEO, TechVision Inc."
  },
  {
    quote: "The data-driven insights Richard provided helped us make critical business decisions that drove our company's growth by over 25% in just one year.",
    author: "Sarah Johnson",
    position: "COO, Elevate Solutions"
  },
  {
    quote: "Working with Richard on our sales pipeline optimization was eye-opening. His methodical approach uncovered opportunities we hadn't seen before.",
    author: "Michael Chen",
    position: "VP of Sales, GrowthPath"
  }
]

export function Testimonials() {
  const [active, setActive] = useState(0)
  
  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActive((current) => (current + 1) % testimonials.length)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-20">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Client Testimonials</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Trusted by business leaders to deliver exceptional results
          </p>
        </div>
        
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
          {/* Quote icon */}
          <div className="absolute top-6 left-6 md:top-8 md:left-8 text-blue-100 dark:text-blue-900">
            <Quote size={48} />
          </div>
          
          <div className="relative z-10">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ 
                  opacity: active === idx ? 1 : 0,
                  x: active === idx ? 0 : 20,
                  position: active === idx ? 'relative' : 'absolute'
                }}
                transition={{ duration: 0.5 }}
                className={`${active === idx ? 'block' : 'hidden'} text-center`}
              >
                <blockquote className="text-xl md:text-2xl italic mb-6 text-gray-700 dark:text-gray-300">
                  "{testimonial.quote}"
                </blockquote>
                
                <div>
                  <div className="font-semibold text-lg">{testimonial.author}</div>
                  <div className="text-[#0070f3]">{testimonial.position}</div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Navigation dots */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActive(idx)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  active === idx 
                    ? 'bg-[#0070f3]' 
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
                aria-label={`View testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}