'use client'

import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function ScrollIndicator() {
  const [isVisible, setIsVisible] = useState(true)
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 200], [1, 0])
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  
  if (!isVisible) return null
  
  return (
    <motion.div 
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center"
      style={{ opacity }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.5 }}
    >
      <span className="text-white/70 text-sm mb-2 font-light">Scroll to explore</span>
      <motion.div 
        className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
        animate={{ 
          boxShadow: ["0 0 0 rgba(255, 255, 255, 0)", "0 0 8px rgba(255, 255, 255, 0.5)", "0 0 0 rgba(255, 255, 255, 0)"]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.div 
          className="w-1 h-2 bg-white/70 rounded-full mt-2"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  )
}
