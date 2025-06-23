'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ContactModal } from '@/components/ui/contact-modal'
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
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
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

interface Certification {
  name: string
  issuer: string
  badge: string
  description: string
  skills: string[]
}

interface AboutContentProps {
  skills?: SkillCategory[]
  experienceStats?: ExperienceStat[]
  personalInfo?: PersonalInfo
  certifications?: Certification[]
}

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
}

// Animated Counter Component with proper formatting
const AnimatedCounter = ({ value, duration = 2000 }: { value: string; duration?: number }) => {
  const [displayValue, setDisplayValue] = useState(value)
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      // Handle different value formats
      if (value.includes('$') && value.includes('M')) {
        // Handle "$3.7M+" format
        const numMatch = value.match(/(\d+\.?\d*)/)
        if (numMatch && numMatch[1]) {
          const targetNum = parseFloat(numMatch[1])
          let startTime: number
          
          const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime
            const progress = Math.min((currentTime - startTime) / duration, 1)
            const current = progress * targetNum
            
            setDisplayValue(value.replace(/\d+\.?\d*/, current.toFixed(1)))
            
            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }
          
          requestAnimationFrame(animate)
        }
      } else if (value.includes('%')) {
        // Handle percentage values like "432%" or "2,217%"
        const numMatch = value.match(/(\d+,?\d*)/)
        if (numMatch && numMatch[1]) {
          const targetNum = parseInt(numMatch[1].replace(',', ''))
          let startTime: number
          
          const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime
            const progress = Math.min((currentTime - startTime) / duration, 1)
            const current = Math.floor(progress * targetNum)
            
            // Add comma formatting for large numbers
            const formatted = current >= 1000 ? current.toLocaleString() : current.toString()
            setDisplayValue(value.replace(/\d+,?\d*/, formatted))
            
            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }
          
          requestAnimationFrame(animate)
        }
      } else {
        // Handle simple numbers like "8+"
        const numMatch = value.match(/(\d+)/)
        if (numMatch && numMatch[1]) {
          const targetNum = parseInt(numMatch[1])
          let startTime: number
          
          const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime
            const progress = Math.min((currentTime - startTime) / duration, 1)
            const current = Math.floor(progress * targetNum)
            
            setDisplayValue(value.replace(/\d+/, current.toString()))
            
            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }
          
          requestAnimationFrame(animate)
        }
      }
    }
  }, [isInView, value, duration])

  return <span ref={ref}>{displayValue}</span>
}


export default function AboutContent({ experienceStats, personalInfo, certifications }: AboutContentProps) {
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
              <h2 className="text-xl sm:text-2xl md:text-3xl text-gray-200 leading-relaxed font-light">
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

          {/* Enhanced Experience Stats - Container-in-Container Design */}
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
                  className="group relative bg-white/5 backdrop-blur border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25"
                >
                  <div className="p-6">
                    <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 text-center h-full flex flex-col">
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

                      <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-blue-300 via-sky-400 to-indigo-400 mb-2">
                        <AnimatedCounter value={stat.value} />
                      </div>

                      <p className="text-sm sm:text-base font-medium text-gray-300">{stat.label}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Enhanced Bio Section - Container-in-Container Design */}
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
                className="group relative bg-white/5 backdrop-blur border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25"
              >
                <div className="p-8">
                  <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 h-full flex flex-col">
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

                    <p className="text-lg leading-relaxed text-gray-300 mb-8 flex-grow">{personalInfo.bio}</p>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-blue-500/20 hover:scale-105 transition-all duration-300 group border border-blue-400/20"
                        onClick={() => setIsModalOpen(true)}
                      >
                        <Mail className="mr-2" size={18} />
                        Get In Touch
                        <ArrowRight
                          size={18}
                          className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Key Highlights */}
              <motion.div
                variants={fadeInUp}
                initial="initial"
                animate={isBioInView ? 'animate' : 'initial'}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="group relative bg-white/5 backdrop-blur border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25"
              >
                <div className="p-8">
                  <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 h-full flex flex-col">
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

                    <div className="space-y-4 flex-grow">
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
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Revenue Operations Case Studies - SEO Optimized */}
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
                Revenue Operations Expertise
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                initial="initial"
                animate={isSkillsInView ? 'animate' : 'initial'}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-gray-200 text-lg max-w-2xl mx-auto leading-relaxed font-light"
              >
                Proven track record in sales operations, marketing automation, and business intelligence solutions
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Sales Operations Excellence',
                  description: 'Streamlined CRM systems and sales processes, resulting in 35% increase in conversion rates and 25% reduction in sales cycle time.',
                  features: ['Salesforce CRM Optimization', 'Pipeline Management Systems', 'Lead Scoring & Qualification', 'Revenue Forecasting Models'],
                  icon: '📊'
                },
                {
                  title: 'Marketing Automation Strategy',
                  description: 'Implemented multi-touch attribution models and automated marketing workflows, driving 45% improvement in marketing ROI.',
                  features: ['HubSpot Marketing Automation', 'Lead Nurturing Campaigns', 'Attribution Modeling', 'Campaign Performance Analytics'],
                  icon: '🎯'
                },
                {
                  title: 'Business Intelligence Solutions',
                  description: 'Built comprehensive BI dashboards and reporting systems, enabling data-driven decision making across organizations.',
                  features: ['Custom Dashboard Development', 'Real-time Performance Metrics', 'Predictive Analytics', 'Executive Reporting Systems'],
                  icon: '📈'
                }
              ].map((expertise, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  initial="initial"
                  animate={isSkillsInView ? 'animate' : 'initial'}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.2 }}
                  className="group relative bg-white/5 backdrop-blur border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25"
                >
                  <div className="p-8">
                    <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 h-full flex flex-col">
                      <div className="text-4xl mb-4">{expertise.icon}</div>
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                        {expertise.title}
                      </h3>
                      <p className="text-gray-300 mb-6 leading-relaxed flex-grow">
                        {expertise.description}
                      </p>
                      <div className="space-y-2 mt-auto">
                        {expertise.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-3 text-sm">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                            <span className="text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Industry Experience & Certifications - SEO Optimized */}
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
                Industry Experience & Credentials
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                initial="initial"
                animate={isAchievementsInView ? 'animate' : 'initial'}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-gray-200 text-lg max-w-2xl mx-auto leading-relaxed font-light"
              >
                Deep expertise across multiple industries with proven results in revenue operations and business transformation
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Industry Experience */}
              <motion.div
                variants={fadeInUp}
                initial="initial"
                animate={isAchievementsInView ? 'animate' : 'initial'}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="group relative bg-white/5 backdrop-blur border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25"
              >
                <div className="p-8">
                  <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center">
                        <Briefcase className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-500 bg-clip-text text-transparent">
                          Industry Expertise
                        </h3>
                        <p className="text-sm text-gray-400">10+ years across multiple sectors</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4 flex-grow">
                      {[
                        'SaaS & Technology Companies',
                        'Financial Services & Fintech',
                        'Healthcare & Life Sciences',
                        'E-commerce & Retail',
                        'Professional Services',
                        'Manufacturing & Distribution'
                      ].map((industry, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                          <span className="text-gray-300">{industry}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Certifications & Technical Skills */}
              <motion.div
                variants={fadeInUp}
                initial="initial"
                animate={isAchievementsInView ? 'animate' : 'initial'}
                transition={{ duration: 0.5, delay: 1.0 }}
                className="group relative bg-white/5 backdrop-blur border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25"
              >
                <div className="p-8">
                  <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center">
                        <Award className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-500 bg-clip-text text-transparent">
                          Technical Certifications
                        </h3>
                        <p className="text-sm text-gray-400">Professional credentials & expertise</p>
                      </div>
                    </div>
                    
                    <div className="space-y-6 flex-grow">
                      {certifications && certifications.map((cert, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={isAchievementsInView ? { opacity: 1, y: 0 } : {}}
                          transition={{ delay: 1.2 + i * 0.2, duration: 0.5 }}
                          className="group p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              <Image
                                src={cert.badge}
                                alt={`${cert.name} Badge`}
                                width={64}
                                height={64}
                                className="w-16 h-16 rounded-lg object-cover border border-white/20"
                                onError={(e) => {
                                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iOCIgZmlsbD0iIzEyNGFkZCIvPgo8cGF0aCBkPSJNMjAgMzJMMjcgMzlMMTQgNDYiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjx0ZXh0IHg9IjMyIiB5PSIyMCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q0VSVDwvdGV4dD4KICA8L3N2Zz4='
                                }}
                              />
                            </div>
                            <div className="flex-grow">
                              <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors mb-1">
                                {cert.name}
                              </h4>
                              <p className="text-sm text-blue-300 mb-2">{cert.issuer}</p>
                              <p className="text-xs text-gray-300 mb-3 leading-relaxed">{cert.description}</p>
                              <div className="flex flex-wrap gap-2">
                                {cert.skills.map((skill, j) => (
                                  <span
                                    key={j}
                                    className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded-md border border-blue-500/30"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      
                      {/* Fallback if no certifications provided */}
                      {(!certifications || certifications.length === 0) && (
                        <div className="space-y-4">
                          {[
                            'SalesLoft Admin Certified',
                            'HubSpot Revenue Operations Certified',
                            'Advanced Analytics & Reporting',
                            'CRM Implementation & Optimization',
                            'Process Automation & Integration',
                            'Business Intelligence & Data Visualization'
                          ].map((cert, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm">
                              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                              <span className="text-gray-300">{cert}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
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
                  className="group relative bg-white/5 backdrop-blur border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25 h-full"
                >
                  <div className="p-8">
                    <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 h-full flex flex-col">
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                        ))}
                      </div>

                      <p className="text-gray-300 leading-relaxed mb-6 italic flex-grow">"{testimonial.quote}"</p>

                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-300 via-sky-400 to-indigo-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <h4 className="font-bold text-white">{testimonial.name}</h4>
                          <p className="text-sm text-gray-400">{testimonial.title}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Enhanced Call to Action - Container-in-Container Design */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate={isTestimonialsInView ? 'animate' : 'initial'}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="text-center space-y-8 max-w-4xl mx-auto"
          >
            <div className="group relative bg-white/5 backdrop-blur border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25">
              <div className="p-8 md:p-12">
                <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8">
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
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg rounded-xl shadow-lg hover:shadow-blue-500/20 hover:scale-105 transition-all duration-300 group border border-blue-400/20"
                      asChild
                    >
                      <Link href="/projects">
                        <TrendingUp className="mr-2" size={20} />
                        View My Projects
                        <ArrowRight
                          size={20}
                          className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </Link>
                    </Button>

                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 group border border-blue-400/20"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <Mail className="mr-2" size={20} />
                      Get In Touch
                      <ArrowRight
                        size={20}
                        className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                      />
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
