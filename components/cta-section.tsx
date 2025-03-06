'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto max-w-7xl px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-xl border border-gray-100 dark:border-gray-700 text-center relative overflow-hidden"
        >
          {/* Background elements */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-100 dark:bg-blue-900/20 rounded-full opacity-70 blur-3xl"></div>
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-indigo-100 dark:bg-indigo-900/20 rounded-full opacity-70 blur-3xl"></div>
          
          <div className="relative z-10">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white max-w-3xl mx-auto"
            >
              Ready to Optimize Your Business Operations?
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
            >
              Let's discuss how my expertise in revenue operations and data analytics can help drive your business growth.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg">
                <Link href="/contact" className="flex items-center gap-2">
                  Let's Connect
                  <ArrowRight size={18} />
                </Link>
              </Button>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-6 text-sm text-gray-500 dark:text-gray-400"
            >
              No commitment required. Let's start with a conversation.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
