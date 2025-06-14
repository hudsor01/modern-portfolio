'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ContactModal } from '@/components/ui/contact-modal'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
  Mail,
  MapPin,
  TrendingUp,
  Star,
  Briefcase,
  Clock,
  ArrowRight,
  Award,
  Users,
  Target,
} from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'

interface Skill {
  name: string
  level: number
  years: number
}

interface SkillCategory {
  category: string
  icon: string
  description: string
  skills: Skill[]
}

interface ExperienceStat {
  label: string
  value: string
  icon: string
}

interface PersonalInfo {
  name: string
  title: string
  location: string
  email: string
  bio: string
  highlights: string[]
}

interface AboutContentProps {
  skills?: SkillCategory[]
  experienceStats?: ExperienceStat[]
  personalInfo?: PersonalInfo
}

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
}

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 2000 }: { value: string; duration?: number }) => {
  const [count, setCount] = useState(0)
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      const numericValue = parseInt(value.replace(/\D/g, ''))
      let startTime: number

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / duration, 1)

        setCount(Math.floor(progress * numericValue))

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      requestAnimationFrame(animate)
    }
  }, [isInView, value, duration])

  return (
    <span ref={ref}>
      {count}
      {value.replace(/\d/g, '')}
    </span>
  )
}

// Enhanced Skill Bar Component
const EnhancedSkillBar = ({ skill, index }: { skill: Skill; index: number }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group"
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <motion.span
            className="font-semibold text-white"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.2 }}
          >
            {skill.name}
          </motion.span>
          <Badge
            variant="secondary"
            className="text-xs bg-white/10 border border-white/20 text-gray-100"
          >
            {skill.years}y
          </Badge>
        </div>
        <motion.span
          className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-br from-blue-300 via-sky-400 to-indigo-400"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {skill.level}%
        </motion.span>
      </div>

      <div className="relative">
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-300 via-sky-400 to-indigo-400 rounded-full relative"
            initial={{ width: 0 }}
            animate={{ width: `${skill.level}%` }}
            transition={{ delay: index * 0.1 + 0.3, duration: 1, ease: 'easeOut' }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20"
              animate={{ x: isHovered ? ['-100%', '100%'] : 0 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            />
          </motion.div>
        </div>

        {/* Skill level indicator */}
        <motion.div
          className="absolute top-0 w-2 h-2 bg-white rounded-full shadow-lg"
          style={{ left: `${skill.level}%` }}
          animate={{
            scale: isHovered ? 1.5 : 1,
            y: isHovered ? -2 : -1,
          }}
          transition={{ duration: 0.2 }}
        />
      </div>
    </motion.div>
  )
}

export default function AboutContent({ skills, experienceStats, personalInfo }: AboutContentProps) {
  const [activeTab, setActiveTab] = useState('0')
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const heroRef = useRef(null)
  const statsRef = useRef(null)
  const bioRef = useRef(null)
  const skillsRef = useRef(null)
  const achievementsRef = useRef(null)
  const testimonialsRef = useRef(null)

  const isHeroInView = useInView(heroRef, { once: true })
  const isStatsInView = useInView(statsRef, { once: true })
  const isBioInView = useInView(bioRef, { once: true })
  const isSkillsInView = useInView(skillsRef, { once: true })
  const isAchievementsInView = useInView(achievementsRef, { once: true })
  const isTestimonialsInView = useInView(testimonialsRef, { once: true })

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      setScrollProgress(scrollTop / (scrollHeight - clientHeight))
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <Navbar />
      <section className="relative min-h-screen bg-[#0f172a] text-white overflow-hidden pt-20">
        {/* Grid Background */}
        <div
          className="absolute inset-0 bg-[image:linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:50px_50px]"
          aria-hidden="true"
        />

        {/* Animated Blobs */}
        <div
          className="absolute top-0 -left-4 w-72 h-72 sm:w-96 sm:h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"
          aria-hidden="true"
        />
        <div
          className="absolute top-0 -right-4 w-72 h-72 sm:w-96 sm:h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob [animation-delay:2s]"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 left-20 w-72 h-72 sm:w-96 sm:h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob [animation-delay:4s]"
          aria-hidden="true"
        />

        <div className="container relative z-10 px-4 mx-auto max-w-7xl py-16 space-y-16">
          {/* Enhanced Hero Section */}
          <motion.div
            ref={heroRef}
            variants={fadeInUp}
            initial="initial"
            animate={isHeroInView ? 'animate' : 'initial'}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center space-y-8 max-w-4xl mx-auto pt-16"
          >
            <motion.h1
              variants={fadeInUp}
              initial="initial"
              animate={isHeroInView ? 'animate' : 'initial'}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="font-bold text-5xl sm:text-6xl md:text-7xl tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-blue-300 via-sky-400 to-indigo-400"
            >
              {personalInfo?.name || 'About Me'}
            </motion.h1>

            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate={isHeroInView ? 'animate' : 'initial'}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="space-y-6"
            >
              <h2 className="text-xl md:text-2xl text-gray-200 leading-relaxed font-light">
                {personalInfo?.title || 'Revenue Operations Consultant & Full-Stack Developer'}
              </h2>

              <div className="flex items-center justify-center gap-6 text-blue-300">
                <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05 }}>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <MapPin size={16} />
                  <span className="text-sm">
                    {personalInfo?.location || 'Remote • Available Worldwide'}
                  </span>
                </motion.div>

                <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05 }}>
                  <Mail size={16} />
                  <span className="text-sm">{personalInfo?.email || 'richard@example.com'}</span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Enhanced Experience Stats */}
          {experienceStats && (
            <motion.div
              ref={statsRef}
              variants={fadeInUp}
              initial="initial"
              animate={isStatsInView ? 'animate' : 'initial'}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {experienceStats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  initial="initial"
                  animate={isStatsInView ? 'animate' : 'initial'}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-all duration-300 group"
                >
                  <motion.div
                    className="text-4xl mb-4 filter drop-shadow-lg"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.2,
                    }}
                  >
                    {stat.icon}
                  </motion.div>

                  <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-blue-300 via-sky-400 to-indigo-400 mb-2">
                    <AnimatedCounter value={stat.value} />
                  </div>

                  <p className="text-sm font-medium text-gray-300">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Enhanced Bio Section */}
          {personalInfo && (
            <motion.div
              ref={bioRef}
              variants={fadeInUp}
              initial="initial"
              animate={isBioInView ? 'animate' : 'initial'}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid md:grid-cols-2 gap-12"
            >
              {/* Bio Content */}
              <motion.div
                variants={fadeInUp}
                initial="initial"
                animate={isBioInView ? 'animate' : 'initial'}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-300 via-sky-400 to-indigo-400 rounded-lg flex items-center justify-center">
                    <Briefcase className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-blue-300 via-sky-400 to-indigo-400">
                      My Story
                    </h2>
                    <p className="text-sm text-gray-400">Professional background</p>
                  </div>
                </div>

                <p className="text-lg leading-relaxed text-gray-300 mb-8">{personalInfo.bio}</p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                    asChild
                  >
                    <Link href="/contact">
                      <Mail className="mr-2" size={18} />
                      Get In Touch
                      <ArrowRight
                        size={18}
                        className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <Mail className="mr-2" size={18} />
                    Get In Touch
                  </Button>
                </div>
              </motion.div>

              {/* Key Highlights */}
              <motion.div
                variants={fadeInUp}
                initial="initial"
                animate={isBioInView ? 'animate' : 'initial'}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-300 via-sky-400 to-indigo-400 rounded-lg flex items-center justify-center">
                    <Star className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-blue-300 via-sky-400 to-indigo-400">
                      Key Highlights
                    </h3>
                    <p className="text-sm text-gray-400">Core competencies</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {personalInfo.highlights.map((highlight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={isBioInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                      className="flex items-start gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 group"
                    >
                      <motion.div
                        className="w-2 h-2 bg-gradient-to-r from-blue-300 via-sky-400 to-indigo-400 rounded-full mt-3 flex-shrink-0"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.2,
                        }}
                      />
                      <p className="text-gray-300 leading-relaxed">{highlight}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Enhanced Skills Section */}
          {skills && skills.length > 0 && (
            <motion.div
              ref={skillsRef}
              variants={fadeInUp}
              initial="initial"
              animate={isSkillsInView ? 'animate' : 'initial'}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <motion.h2
                  variants={fadeInUp}
                  initial="initial"
                  animate={isSkillsInView ? 'animate' : 'initial'}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-blue-300 via-sky-400 to-indigo-400"
                >
                  Skills & Expertise
                </motion.h2>
                <motion.p
                  variants={fadeInUp}
                  initial="initial"
                  animate={isSkillsInView ? 'animate' : 'initial'}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="text-gray-200 text-lg max-w-2xl mx-auto leading-relaxed font-light"
                >
                  A comprehensive overview of my technical abilities and professional competencies
                </motion.p>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <motion.div
                  variants={fadeInUp}
                  initial="initial"
                  animate={isSkillsInView ? 'animate' : 'initial'}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <TabsList className="grid w-full grid-cols-3 bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-0 shadow-md">
                    {skills.map((category, index) => (
                      <TabsTrigger
                        key={index}
                        value={index.toString()}
                        className="flex items-center gap-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-300 data-[state=active]:via-sky-400 data-[state=active]:to-indigo-400 data-[state=active]:text-white rounded-xl transition-all duration-300 text-white"
                      >
                        <span className="text-xl">{category.icon}</span>
                        <span className="hidden sm:inline font-medium">{category.category}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </motion.div>

                {skills.map((category, categoryIndex) => (
                  <TabsContent key={categoryIndex} value={categoryIndex.toString()}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="mt-8 bg-white/5 backdrop-blur border border-white/10 rounded-xl overflow-hidden"
                    >
                      <div className="bg-white/5 p-6 border-b border-white/10">
                        <div className="flex items-center gap-4">
                          <motion.div
                            className="w-16 h-16 bg-gradient-to-r from-blue-300 via-sky-400 to-indigo-400 rounded-2xl flex items-center justify-center text-3xl"
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                          >
                            {category.icon}
                          </motion.div>
                          <div>
                            <h3 className="text-2xl md:text-3xl font-bold text-white">
                              {category.category}
                            </h3>
                            <p className="text-gray-400 font-normal text-lg">
                              {category.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="space-y-10">
                          {category.skills.map((skill, skillIndex) => (
                            <EnhancedSkillBar key={skillIndex} skill={skill} index={skillIndex} />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </TabsContent>
                ))}
              </Tabs>
            </motion.div>
          )}

          {/* Key Achievements Section */}
          <motion.div
            ref={achievementsRef}
            variants={fadeInUp}
            initial="initial"
            animate={isAchievementsInView ? 'animate' : 'initial'}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-12"
          >
            <div className="text-center space-y-4">
              <motion.h2
                variants={fadeInUp}
                initial="initial"
                animate={isAchievementsInView ? 'animate' : 'initial'}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-blue-300 via-sky-400 to-indigo-400"
              >
                Key Achievements
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                initial="initial"
                animate={isAchievementsInView ? 'animate' : 'initial'}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-gray-200 text-lg max-w-2xl mx-auto leading-relaxed font-light"
              >
                Delivering measurable results through strategic planning and execution
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  value: '$3.7M+',
                  label: 'Revenue Growth',
                  description:
                    'Drove significant annual revenue growth through data-driven forecasting and optimization strategies.',
                  icon: TrendingUp,
                },
                {
                  value: '2,200%',
                  label: 'Network Expansion',
                  description:
                    'Grew partner network and increased transaction volume through strategic partnership development.',
                  icon: Users,
                },
                {
                  value: '40%',
                  label: 'Process Optimization',
                  description:
                    'Implemented cross-functional workflow integrations, reducing processing time and improving efficiency.',
                  icon: Target,
                },
              ].map((achievement, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  initial="initial"
                  animate={isAchievementsInView ? 'animate' : 'initial'}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.2 }}
                  className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-8 text-center hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-300 via-sky-400 to-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <achievement.icon className="text-white" size={32} />
                  </div>

                  <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-blue-300 via-sky-400 to-indigo-400 mb-4">
                    {achievement.value}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">{achievement.label}</h3>

                  <p className="text-gray-300 leading-relaxed">{achievement.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Client Testimonials */}
          <motion.div
            ref={testimonialsRef}
            variants={fadeInUp}
            initial="initial"
            animate={isTestimonialsInView ? 'animate' : 'initial'}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-12"
          >
            <div className="text-center space-y-4">
              <motion.h2
                variants={fadeInUp}
                initial="initial"
                animate={isTestimonialsInView ? 'animate' : 'initial'}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-blue-300 via-sky-400 to-indigo-400"
              >
                What Clients Say
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                initial="initial"
                animate={isTestimonialsInView ? 'animate' : 'initial'}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-gray-200 text-lg max-w-2xl mx-auto leading-relaxed font-light"
              >
                Trusted by business leaders to deliver exceptional results
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote:
                    "Richard's data-driven approach transformed our sales process and increased conversion rates by 35% in just three months.",
                  name: 'Sarah Johnson',
                  title: 'VP of Sales, TechCorp Inc.',
                  avatar: 'SJ',
                },
                {
                  quote:
                    "His strategic insights helped us identify bottlenecks we didn't know existed. A true game-changer for our operations.",
                  name: 'Michael Chen',
                  title: 'COO, GrowthMetrics',
                  avatar: 'MC',
                },
                {
                  quote:
                    "Richard's expertise in revenue operations helped us scale our channel program to new heights. Remarkable results.",
                  name: 'Jessica Williams',
                  title: 'Partner Operations Director',
                  avatar: 'JW',
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  initial="initial"
                  animate={isTestimonialsInView ? 'animate' : 'initial'}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.2 }}
                  className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all duration-300 h-full"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  <p className="text-gray-300 leading-relaxed mb-6 italic">"{testimonial.quote}"</p>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-300 via-sky-400 to-indigo-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{testimonial.name}</h4>
                      <p className="text-sm text-gray-400">{testimonial.title}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Enhanced Call to Action */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate={isTestimonialsInView ? 'animate' : 'initial'}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="text-center space-y-8 max-w-4xl mx-auto"
          >
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-8 md:p-12">
              <div className="flex items-center justify-center gap-4 mb-6">
                <Award className="w-8 h-8 text-blue-400" />
                <h3 className="font-bold text-2xl sm:text-3xl md:text-4xl tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-blue-300 via-sky-400 to-indigo-400">
                  Let's Work Together
                </h3>
              </div>

              <p className="text-gray-200 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light mb-8">
                Ready to optimize your revenue operations and drive growth? Let's discuss how we can
                achieve your business goals together.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                  asChild
                >
                  <Link href="/projects">
                    <TrendingUp className="mr-2" size={20} />
                    View My Projects
                    <ArrowRight
                      size={18}
                      className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                </Button>

                <Button
                  size="lg"
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                  asChild
                >
                  <Link href="/contact">
                    <Mail className="mr-2" size={20} />
                    Get In Touch
                    <ArrowRight
                      size={18}
                      className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10">
                <div className="text-center">
                  <Clock className="w-6 h-6 text-blue-400 mx-auto mb-3" />
                  <h4 className="font-semibold text-white mb-2">Response Time</h4>
                  <p className="text-blue-300 text-sm">Within 24 hours</p>
                </div>

                <div className="text-center">
                  <MapPin className="w-6 h-6 text-blue-400 mx-auto mb-3" />
                  <h4 className="font-semibold text-white mb-2">Location</h4>
                  <p className="text-blue-300 text-sm">On-site | Remote | Hybrid</p>
                </div>

                <div className="text-center">
                  <Award className="w-6 h-6 text-blue-400 mx-auto mb-3" />
                  <h4 className="font-semibold text-white mb-2">Experience</h4>
                  <p className="text-blue-300 text-sm">10+ Years</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating Scroll Progress Indicator */}
          <motion.button
            className="fixed bottom-8 right-8 z-50"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <motion.div
              className="w-16 h-16 bg-white/10 backdrop-blur border border-white/20 rounded-full shadow-2xl flex items-center justify-center cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div
                className="w-12 h-12 rounded-full relative"
                style={{
                  background: `conic-gradient(#3b82f6 ${scrollProgress * 360}deg, rgba(255,255,255,0.2) 0deg)`,
                }}
              >
                <div className="absolute inset-1 bg-[#0f172a] rounded-full flex items-center justify-center">
                  <motion.div
                    animate={{ y: [-2, 2, -2] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="text-blue-400 text-xl font-bold"
                  >
                    ↑
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.button>
        </div>
      </section>

      {/* Contact Modal */}
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
