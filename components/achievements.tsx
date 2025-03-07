'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { BarChart2, Users, Lightbulb } from 'lucide-react';

export function Achievements() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const achievements = [
    {
      stat: '$1.1M+',
      title: 'Revenue Growth',
      description:
        'Spearheaded strategies resulting in significant annual revenue growth through data-driven optimization.',
      icon: BarChart2,
      color: '#60a5fa',
    },
    {
      stat: '2,200%',
      title: 'Network Expansion',
      description:
        'Led initiatives resulting in significant partner network growth and transaction increase.',
      icon: Users,
      color: '#60a5fa',
    },
    {
      stat: '40%',
      title: 'Process Optimization',
      description: 'Implemented cross-functional workflow integrations, reducing processing time.',
      icon: Lightbulb,
      color: '#60a5fa',
    },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-4"
          >
            Key Achievements
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Results-driven professional with a proven track record of success in revenue operations
          </motion.p>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                  style={{ backgroundColor: `${achievement.color}10` }}
                >
                  <achievement.icon size={24} color={achievement.color} />
                </div>
                <h3 className="text-4xl font-bold" style={{ color: achievement.color }}>
                  {achievement.stat}
                </h3>
              </div>

              <h4 className="text-xl font-semibold mb-3">{achievement.title}</h4>

              <p className="text-gray-600 dark:text-gray-300">{achievement.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
