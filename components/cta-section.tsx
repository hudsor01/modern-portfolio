'use client';

import Link from 'next/link';
import type { Route } from 'next'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

type CTASectionProps = {
  buttonTextColor?: string
  buttonBgColor?: string
}

export function CTASection({ buttonTextColor, buttonBgColor }: CTASectionProps) {
  return (
    <section className="w-full section-bg-secondary py-24 md:py-32 lg:py-36">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
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
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 max-w-3xl mx-auto bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400"
          >
            Ready to Optimize Your Business Operations?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed font-medium"
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
              className={`${buttonBgColor || 'bg-blue-600'} ${
                buttonTextColor || 'text-white'
              } hover:bg-blue-700 px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group`}
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
            className="text-sm text-slate-500 dark:text-slate-400 font-medium tracking-wide"
          >
            No commitment required. Let&apos;s start with a conversation.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
