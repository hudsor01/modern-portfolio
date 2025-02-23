"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"
import { motion } from "framer-motion"

interface Testimonial {
  quote: string
  author: string
  role: string
  company: string
}

const testimonials: Testimonial[] = [
  {
    quote:
      "Richard's implementation of automated commission management transformed our operations, saving countless hours and eliminating errors.",
    author: "David Martinez",
    role: "Sales Director",
    company: "Thryv",
  },
  {
    quote:
      "His expertise in revenue modeling and forecasting helped us achieve unprecedented accuracy in our projections.",
    author: "Jennifer Lee",
    role: "Revenue Operations Manager",
    company: "Thryv",
  },
  {
    quote:
      "The KPI dashboards Richard developed gave us clear visibility into our performance metrics and drove significant improvements.",
    author: "Michael Thompson",
    role: "VP of Sales",
    company: "Thryv",
  },
]

export function Testimonials() {
  return (
    <section className="py-12 bg-muted/50">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">What Colleagues Say</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <CardContent className="p-6 space-y-4">
                  <Quote className="h-8 w-8 text-primary/40" />
                  <p className="text-lg">{testimonial.quote}</p>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

