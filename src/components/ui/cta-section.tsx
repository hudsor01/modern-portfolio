'use client'

import Link from 'next/link'
import type { Route } from 'next'
import { m as motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function CTASection() {
  return (
    <section className="w-full bg-gradient-to-br from-zinc-900 via-slate-800 to-zinc-900 py-24 md:py-32 lg:py-36">
      <div className="portfolio-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mb-6 max-w-3xl text-3xl font-bold text-white md:text-4xl lg:text-5xl"
          >
            Ready to Optimize Your Business Operations?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mb-10 max-w-2xl text-lg font-medium leading-relaxed text-white/90 md:text-xl"
          >
            Let&apos;s discuss how my expertise in revenue operations and data analytics can help
            drive your business growth.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mb-8"
          >
            <Button
              asChild
              size="lg"
              className="portfolio-button-primary group px-8 py-6 text-lg rounded-xl portfolio-shadow-dark hover:scale-105 transition-all duration-300"
            >
              <Link href={'/contact' as Route<string>} className="flex items-center gap-2">
                Let&apos;s Connect
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </Link>
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-sm font-medium tracking-wide text-white/70"
          >
            No commitment required. Let&apos;s start with a conversation.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
