'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  FileDown,
  Mail,
  Linkedin,
  Globe,
  Calendar,
  GraduationCap,
  BadgeCheck,
  Github,
  MapPin,
  ArrowRight,
  Eye,
} from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { ResumeViewer } from './resume-viewer'

const experience = [
  {
    title: 'Revenue Operations Consultant',
    company: 'Thryv',
    period: 'December 2022 - November 2024',
    location: 'Dallas, TX',
    type: 'Full-time',
    description: [
      'Drove $1.1M+ revenue growth through data-driven forecasting and optimization strategies',
      'Grew partner network by 2,200% and increased transaction volume by 432%',
      'Architected revenue modeling framework in Power BI and Salesforce achieving 95% forecast accuracy',
    ],
    technologies: ['Salesforce', 'Power BI', 'Python', 'SQL', 'Tableau']
  },
  {
    title: 'Sales Operations Analyst',
    company: 'Thryv',
    period: 'March 2022 - December 2022',
    location: 'Dallas, TX',
    type: 'Full-time',
    description: [
      'Built automated KPI dashboards driving 28% quota attainment growth across teams',
      'Automated commission management system achieving 100% accuracy and reducing processing time by 73%',
      'Improved forecast accuracy by 40% through standardized metrics and reporting frameworks',
    ],
    technologies: ['HubSpot', 'SalesLoft', 'Excel', 'JavaScript', 'API Integrations']
  },
  {
    title: 'Channel Operations Lead',
    company: 'Thryv',
    period: 'March 2020 - March 2022',
    location: 'Dallas, TX',
    type: 'Full-time',
    description: [
      'Scaled network to over 300 active affiliates, resellers, and MSPs, maintaining 99.9% data accuracy',
      'Reduced onboarding time by 45% through PartnerStack automation and workflow optimization',
      'Built scalable infrastructure driving 432% volume growth and 67% faster processing time',
    ],
    technologies: ['PartnerStack', 'Salesforce', 'Automation Tools', 'Data Analytics']
  },
]

const education = [
  {
    degree: 'Bachelor of Science (BS) in Business Administration',
    institution: 'The University of Texas at Dallas',
    period: '2012 - 2015',
    focus: 'Concentration in Entrepreneurship',
  },
]

const skills = [
  {
    category: 'Revenue Operations',
    items: ['Sales Operations', 'Cross-functional Collaboration', 'Process Optimization', 'Strategic Planning', 'Data Visualization'],
  },
  {
    category: 'Tools & Platforms',
    items: ['Salesforce', 'HubSpot', 'SalesLoft', 'PartnerStack', 'Power BI', 'Tableau'],
  },
  {
    category: 'Technical Skills',
    items: [
      'Python',
      'JavaScript',
      'React & Next.js',
      'Webhooks',
      'API Integrations',
      'Financial Modeling',
    ],
  },
]

const certifications = [
  'HubSpot Revenue Operations Certification',
  'SalesLoft Certified Administrator',
  'Career Essentials in Data Analysis',
  'Career Essentials in Business Analysis',
  'Atlassian Agile Project Management',
]

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function ResumePage() {
  const [showPdf, setShowPdf] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [pdfUrl, setPdfUrl] = useState('')
  
  // Refs for scroll animations
  const heroRef = useRef(null)
  const contentRef = useRef(null)
  
  // In-view hooks
  const isHeroInView = useInView(heroRef, { once: true })
  const isContentInView = useInView(contentRef, { once: true })

  useEffect(() => {
    // Set the PDF URL once on client side
    setPdfUrl('/Richard Hudson - Resume.pdf')
  }, [])

  const handleDownloadResume = async () => {
    setIsDownloading(true)
    toast.loading('Preparing your resume...', { id: 'resume-download', duration: 3000 })

    try {
      // Direct download of the PDF file
      const a = document.createElement('a')
      a.href = '/Richard Hudson - Resume.pdf'
      a.download = 'Richard_Hudson_Resume.pdf'
      document.body.appendChild(a)
      a.click()
      a.remove()

      toast.success('Resume downloaded successfully!', { id: 'resume-download' })
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to download resume. Please try again.', { id: 'resume-download' })
    } finally {
      setIsDownloading(false)
    }
  }

  const handleToggleView = () => {
    setShowPdf(!showPdf)
  }

  return (
    <>
      <Navbar />
      <section className="relative min-h-screen bg-[#0f172a] text-white overflow-hidden">
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

        <div className="container relative z-10 px-4 mx-auto max-w-6xl py-16 space-y-16">
          {/* Hero Header */}
          <motion.div 
            ref={heroRef}
            variants={staggerContainer}
            initial="initial"
            animate={isHeroInView ? "animate" : "initial"}
            className="text-center space-y-8 max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="mb-8">
              <span className="inline-flex items-center rounded-full bg-blue-500/10 border border-blue-500/30 px-3 py-1 text-sm font-medium text-blue-400">
                <Eye className="mr-2 h-4 w-4" />
                Professional Resume
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8"
            >
              <span className="block hero-name-gradient">
                Richard Hudson
              </span>
            </motion.h1>

            <motion.h2
              variants={fadeInUp}
              className="text-2xl sm:text-3xl md:text-4xl font-light max-w-4xl mx-auto mb-6"
            >
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-400/40 px-6 py-3 text-blue-300 font-medium backdrop-blur-sm shadow-lg shadow-blue-500/25">
                Revenue Operations Professional
              </span>
            </motion.h2>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col items-center gap-8 mb-8"
            >
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-4 border-blue-400/30 shadow-2xl shadow-blue-500/20">
                <Image
                  src="/images/richard.jpg"
                  alt="Richard Hudson"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed text-center">
                Experienced Revenue Operations Professional with a proven track record of driving business growth through data-driven insights, process optimization, and strategic operational improvements. Expert in building scalable systems that increase efficiency and revenue performance.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
            >
              <Button
                size="lg"
                className="premium-button-gradient hover:shadow-2xl hover:shadow-blue-500/25 text-white px-10 py-5 text-lg font-semibold rounded-2xl shadow-xl hover:scale-110 transition-all duration-500 group flex items-center gap-4 border border-blue-400/20"
                onClick={handleDownloadResume}
                disabled={isDownloading}
              >
                <FileDown size={22} className="text-white group-hover:animate-bounce" />
                <span>{isDownloading ? 'Downloading...' : 'Download Resume'}</span>
                <ArrowRight size={20} className="transition-transform duration-500 group-hover:translate-x-2" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 hover:cta-hover-gradient border-2 border-white/30 hover:border-blue-400/50 text-white hover:text-white px-10 py-5 text-lg font-medium rounded-2xl hover:scale-105 transition-all duration-300 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/25"
                onClick={handleToggleView}
              >
                {showPdf ? 'Show Details' : 'View PDF'}
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-gradient-to-r from-white/10 to-white/5 hover:cta-hover-gradient border-2 border-white/30 hover:border-blue-400/50 text-white hover:text-white px-10 py-5 text-lg font-medium rounded-2xl hover:scale-105 transition-all duration-300 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/25"
              >
                <Link href="/contact" className="flex items-center gap-3">
                  <Mail size={20} />
                  <span>Get In Touch</span>
                </Link>
              </Button>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              variants={fadeInUp}
              className="flex justify-center gap-6 pt-12"
            >
              <a
                href="mailto:hello@richardwhudsonjr.com"
                className="text-gray-400 hover:text-blue-400 social-icon"
                aria-label="Email"
              >
                <Mail className="h-7 w-7" />
              </a>
              <a
                href="https://linkedin.com/in/hudsor01"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 social-icon"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-7 w-7" />
              </a>
              <a
                href="https://github.com/hudsor01"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 social-icon"
                aria-label="GitHub"
              >
                <Github className="h-7 w-7" />
              </a>
              <a
                href="https://richardwhudsonjr.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 social-icon"
                aria-label="Website"
              >
                <Globe className="h-7 w-7" />
              </a>
            </motion.div>
          </motion.div>

          {showPdf ? (
            // PDF viewer
            <motion.div 
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="bg-white/5 backdrop-blur border border-white/10 rounded-xl overflow-hidden"
            >
              {pdfUrl && <ResumeViewer pdfUrl={pdfUrl} />}
            </motion.div>
          ) : (
            // Resume content
            <motion.div 
              ref={contentRef}
              variants={staggerContainer}
              initial="initial"
              animate={isContentInView ? "animate" : "initial"}
              className="space-y-16"
            >

              {/* Professional Experience */}
              <motion.section variants={fadeInUp}>
                <div className="space-y-12">
                  {experience.map((job, index) => (
                    <motion.div key={index} variants={fadeInUp} className="space-y-6">
                      {/* Job Title Outside Container */}
                      <div className="text-center">
                        <h3 className="text-3xl md:text-4xl font-bold section-heading-gradient mb-2 tracking-tight">{job.title}</h3>
                      </div>
                      
                      {/* Job Content Container */}
                      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-blue-400/30 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10">
                        {/* Company and Dates - Symmetrical */}
                        <div className="flex justify-between items-center mb-8">
                          <div className="text-left">
                            <h4 className="text-2xl font-semibold text-blue-400">{job.company}</h4>
                            <p className="text-gray-400 flex items-center gap-2 mt-1">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-400 flex items-center gap-2 justify-end">
                              <Calendar className="w-4 h-4" />
                              {job.period}
                            </p>
                          </div>
                        </div>
                        
                        {/* Job Description */}
                        <div className="space-y-4">
                          {job.description.map((item, i) => (
                            <p key={i} className="text-gray-300 leading-relaxed text-lg">
                              {item}
                            </p>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* Education & Certifications */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:items-stretch">
                <motion.section variants={fadeInUp} className="flex flex-col h-full">
                  <h3 className="text-2xl font-bold mb-8 text-white flex items-center gap-3">
                    <GraduationCap className="w-6 h-6 text-blue-400" />
                    Education
                  </h3>
                  <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-8 flex-1 h-full">
                    {education.map((edu, index) => (
                      <div key={index}>
                        <h4 className="text-xl font-bold text-white mb-2">{edu.degree}</h4>
                        <p className="text-blue-400 font-medium mb-2">{edu.institution}</p>
                        <div className="flex items-center gap-2 text-gray-400 mb-2">
                          <Calendar className="w-4 h-4" />
                          <span>{edu.period}</span>
                        </div>
                        <p className="text-gray-300">{edu.focus}</p>
                      </div>
                    ))}
                  </div>
                </motion.section>

                <motion.section variants={fadeInUp} className="flex flex-col h-full">
                  <h3 className="text-2xl font-bold mb-8 text-white flex items-center gap-3">
                    <BadgeCheck className="w-6 h-6 text-blue-400" />
                    Certifications
                  </h3>
                  <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-8 flex-1 h-full">
                    <div className="space-y-4">
                      {certifications.map((cert, index) => (
                        <p key={index} className="text-gray-300 text-lg leading-relaxed">
                          {cert}
                        </p>
                      ))}
                    </div>
                  </div>
                </motion.section>
              </div>

              {/* Skills */}
              <motion.section variants={fadeInUp}>
                <h3 className="text-4xl md:text-5xl font-bold mb-16 text-center section-heading-gradient">
                  Skills & Expertise
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  {skills.map((skillGroup, index) => (
                    <motion.div 
                      key={index} 
                      variants={fadeInUp}
                      className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-blue-400/30 transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/10"
                    >
                      <h4 className="text-2xl font-bold mb-8 text-blue-400 text-center tracking-tight">{skillGroup.category}</h4>
                      <div className="space-y-4">
                        {skillGroup.items.map((skill, i) => (
                          <p key={i} className="text-gray-300 text-lg leading-relaxed text-center">
                            {skill}
                          </p>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            </motion.div>
          )}
        </div>
      </section>
    </>
  )
}