'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { BarChart2, Users2, Lightbulb } from 'lucide-react'

// Stats data
const achievements = [
  {
    value: 1.1,
    suffix: 'M+',
    prefix: '$',
    label: 'Revenue Growth',
    description: 'Drove significant annual revenue growth through data-driven forecasting and optimization strategies.',
    icon: BarChart2,
    color: 'blue'
  },
  {
    value: 2200,
    suffix: '%',
    label: 'Network Expansion',
    description: 'Grew partner network and increased transaction volume by 432% through strategic partnership development.',
    icon: Users2,
    color: 'purple'
  },
  {
    value: 40,
    suffix: '%',
    label: 'Process Optimization',
    description: 'Implemented cross-functional workflow integrations, reducing processing time and improving operational efficiency.',
    icon: Lightbulb,
    color: 'amber'
  }
];

// AnimatedCounter component for counting animation
const AnimatedCounter = ({ value, duration = 2, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const inView = useInView(countRef, { once: true, margin: "0px 0px -100px 0px" });
  
  useEffect(() => {
    if (inView) {
      let start = 0;
      const end = value;
      const totalFrames = Math.max(Math.floor(duration * 60), 1);
      const increment = end / totalFrames;
      
      const counter = setInterval(() => {
        start += increment;
        setCount(Math.min(start, end));
        
        if (start >= end) {
          clearInterval(counter);
          setCount(end);
        }
      }, 1000 / 60);
      
      return () => clearInterval(counter);
    }
  }, [inView, value, duration]);
  
  return (
    <span ref={countRef} className="text-3xl font-bold">
      {prefix}{Math.floor(count)}{suffix}
    </span>
  );
};

export function AchievementsSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white"
          >
            Key Achievements
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-600 dark:text-gray-300"
          >
            Delivering measurable results through strategic planning and execution
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            >
              <div className="flex items-center mb-6">
                <div className={`
                  w-12 h-12 rounded-lg flex items-center justify-center mr-4
                  ${achievement.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 
                    achievement.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 
                    'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'}
                `}>
                  <achievement.icon className="w-6 h-6" />
                </div>
                <AnimatedCounter 
                  value={achievement.value} 
                  prefix={achievement.prefix || ''} 
                  suffix={achievement.suffix || ''} 
                />
              </div>

              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                {achievement.label}
              </h3>

              <p className="text-gray-600 dark:text-gray-300">
                {achievement.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
