'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

// Skills data organized by categories
const skillsData = [
  {
    category: "Revenue Operations",
    skills: [
      "Revenue Operations",
      "Data Analytics",
      "Process Optimization",
      "Strategic Planning",
      "Sales Operations",
      "Business Analysis"
    ]
  },
  {
    category: "Tools & Platforms",
    skills: [
      "Salesforce",
      "HubSpot",
      "SalesLoft",
      "PartnerStack",
      "Workato",
      "Power BI"
    ]
  },
  {
    category: "Technical Skills",
    skills: [
      "Python",
      "JavaScript",
      "React & Next.js",
      "SQL",
      "Data Visualization",
      "API Integrations"
    ]
  }
];

export function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState(skillsData[0].category);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white"
          >
            Skills & Expertise
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-600 dark:text-gray-300"
          >
            Specialized capabilities that drive results across various business functions
          </motion.p>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-4">
          {skillsData.map((category, idx) => (
            <motion.button
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              onClick={() => setActiveCategory(category.category)}
              className={`px-4 py-2 rounded-full text-sm md:text-base font-medium transition-all ${
                activeCategory === category.category
                  ? 'bg-blue-600 text-white dark:bg-blue-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {category.category}
            </motion.button>
          ))}
        </div>

        {skillsData.map((category) => (
          <div
            key={category.category}
            className={activeCategory === category.category ? 'block' : 'hidden'}
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
            >
              {category.skills.map((skill, index) => (
                <motion.div
                  key={skill}
                  variants={itemVariants}
                  className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 text-center aspect-square flex flex-col items-center justify-center hover:shadow-md transition-shadow"
                  whileHover={{ y: -5, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                    <span className="text-blue-600 dark:text-blue-400 font-bold text-xl">
                      {index + 1}
                    </span>
                  </div>
                  <span className="text-gray-900 dark:text-white font-medium">{skill}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        ))}
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 p-8 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Continuous Development</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                I'm committed to staying at the forefront of revenue operations best practices and technologies. 
                Through ongoing professional development, I constantly expand my knowledge and skills to deliver 
                exceptional results.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                My approach combines proven methodologies with innovative techniques to address complex business challenges.
              </p>
            </div>
            <div className="space-y-4">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Revenue Strategy</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">95%</span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200 dark:bg-gray-700">
                  <div style={{ width: "95%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"></div>
                </div>
              </div>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Data Analytics</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">90%</span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200 dark:bg-gray-700">
                  <div style={{ width: "90%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"></div>
                </div>
              </div>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Process Optimization</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">98%</span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200 dark:bg-gray-700">
                  <div style={{ width: "98%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
