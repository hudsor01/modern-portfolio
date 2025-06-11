'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Skill {
  name: string
  level: number
  category: 'technical' | 'business' | 'soft'
}

interface SkillsSectionProps {
  skills?: Skill[]
  variant?: 'default' | 'minimal' | 'progress'
}

const defaultSkills: Skill[] = [
  // Technical skills
  { name: 'JavaScript', level: 90, category: 'technical' },
  { name: 'TypeScript', level: 85, category: 'technical' },
  { name: 'React', level: 90, category: 'technical' },
  { name: 'Next.js', level: 85, category: 'technical' },
  { name: 'Node.js', level: 80, category: 'technical' },
  { name: 'SQL', level: 75, category: 'technical' },
  { name: 'Python', level: 70, category: 'technical' },
  { name: 'AWS', level: 65, category: 'technical' },
  { name: 'Docker', level: 60, category: 'technical' },
  { name: 'GraphQL', level: 70, category: 'technical' },
  
  // Business skills
  { name: 'Revenue Operations', level: 95, category: 'business' },
  { name: 'Data Analysis', level: 90, category: 'business' },
  { name: 'Project Management', level: 85, category: 'business' },
  { name: 'Strategic Planning', level: 80, category: 'business' },
  { name: 'Process Optimization', level: 90, category: 'business' },
  { name: 'CRM Systems', level: 85, category: 'business' },
  { name: 'Sales Operations', level: 90, category: 'business' },
  { name: 'Marketing Operations', level: 80, category: 'business' },
  
  // Soft skills
  { name: 'Communication', level: 95, category: 'soft' },
  { name: 'Leadership', level: 90, category: 'soft' },
  { name: 'Problem Solving', level: 95, category: 'soft' },
  { name: 'Teamwork', level: 90, category: 'soft' },
  { name: 'Adaptability', level: 85, category: 'soft' },
  { name: 'Time Management', level: 80, category: 'soft' },
]

export function SkillsSection({ skills = defaultSkills, variant = 'default' }: SkillsSectionProps) {
  const [activeTab, setActiveTab] = useState('technical')
  
  const filteredSkills = skills.filter(skill => skill.category === activeTab)
  
  // Minimal variant with just badges
  if (variant === 'minimal') {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Skills & Expertise</h2>
            <p className="text-gray-600 dark:text-gray-300">
              A collection of technical and business skills I've developed throughout my career
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
            {skills.map((skill) => (
              <Badge 
                key={skill.name}
                variant="secondary" 
                className="text-sm py-1 px-3 bg-white dark:bg-gray-800 shadow-sm"
              >
                {skill.name}
              </Badge>
            ))}
          </div>
        </div>
      </section>
    )
  }
  
  // Progress bar variant
  if (variant === 'progress') {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Skills & Expertise</h2>
            <p className="text-gray-600 dark:text-gray-300">
              A collection of technical and business skills I've developed throughout my career
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Tabs defaultValue="technical" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="technical">Technical</TabsTrigger>
                <TabsTrigger value="business">Business</TabsTrigger>
                <TabsTrigger value="soft">Soft Skills</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="space-y-6">
                {filteredSkills.map((skill) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-sm text-gray-500">{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    )
  }
  
  // Default variant with animated grid
  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Skills & Expertise
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            A collection of technical and business skills I've developed throughout my career
          </p>
        </motion.div>
        
        <Tabs defaultValue="technical" onValueChange={setActiveTab} className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-12">
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="soft">Soft Skills</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredSkills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center hover:shadow-md transition-shadow"
                >
                  <div className="mb-2">
                    <div className="inline-block w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-blue-600/30 flex items-center justify-center">
                          <div className="w-4 h-4 rounded-full bg-blue-600"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-medium">{skill.name}</h3>
                  <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full" 
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
