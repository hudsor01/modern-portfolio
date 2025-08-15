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
  Globe,
  Calendar,
  GraduationCap,
  BadgeCheck,
  MapPin,
  Eye,
} from 'lucide-react'
import { SiGithub, SiLinkedin } from 'react-icons/si'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ResumeViewer } from './resume-viewer'

const experience = [
  {
    title: 'Revenue Operations Consultant',
    company: 'Thryv',
    period: 'December 2022 - November 2024',
    location: 'Grapevine, TX',
    type: 'Full-time',
    description: [
      'Drove $1.1M+ revenue growth through data-driven forecasting and optimization strategies while scaling partner network by 2,200%',
      'Grew partner network by 2,200% and increased transaction volume by 432%',
      'Architected revenue modeling framework in Power BI and Salesforce achieving 95% forecast accuracy across all divisions',
      'Transformed commission processes through automation, reducing processing time by 80% and increasing accuracy to 100%',
    ],
    technologies: ['Salesforce', 'Power BI', 'Python', 'SQL', 'Tableau']
  },
  {
    title: 'Sales Operations Analyst',
    company: 'Thryv',
    period: 'February 2022 - December 2022',
    location: 'Grapevine, TX',
    type: 'Full-time',
    description: [
      'Built automated KPI dashboards driving 28% quota attainment growth across teams and divisions',
      'Automated commission management system achieving 100% accuracy and reducing processing time by 73%',
      'Improved forecast accuracy by 40% through standardized metrics and reporting frameworks',
    ],
    technologies: ['HubSpot', 'SalesLoft', 'Excel', 'JavaScript', 'API Integrations']
  },
  {
    title: 'Channel Operations Lead',
    company: 'Thryv',
    period: 'March 2020 - March 2022',
    location: 'Grapevine, TX',
    type: 'Full-time',
    description: [
      'Scaled network to over 300 active affiliates, resellers, and Managed Service Providers (MSPs), maintaining 99.9% data accuracy',
      'Reduced onboarding time by 45% through PartnerStack automation and workflow optimization',
      'Built scalable infrastructure driving 432% volume growth and 67% faster processing time',
      'Implemented real-time analytics framework streamlining performance tracking and reporting',
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
    items: ['Sales Operations', 'Cross-functional Collaboration', 'Process Optimization', 'Strategic Planning', 'Data Visualization', 'Forecasting & Analytics'],
  },
  {
    category: 'Tools & Platforms',
    items: ['Salesforce', 'HubSpot', 'SalesLoft', 'PartnerStack', 'Power BI', 'Tableau'],
  },
  {
    category: 'Technical Skills',
    items: ['Python', 'JavaScript', 'React & Next.js', 'Webhooks', 'API Integrations', 'Financial Modeling'],
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

        <div className="container relative z-10 px-4 mx-auto max-w-6xl py-16 space-y-16">
          {/* Hero Header */}
          <motion.div
            ref={heroRef}
            variants={staggerContainer}
            initial="initial"
            animate={isHeroInView ? "animate" : "initial"}
            className="text-center space-y-8 max-w-4xl mx-auto"
          >

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
              className="flex flex-col items-center mb-8"
            >
              <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed text-center">
                Experienced Revenue Operations Professional with a proven track record of driving business growth through data-driven insights, process optimization, and strategic operational improvements. Expert in building scalable systems that increase efficiency and revenue performance.
              </p>
            </motion.div>

            {/* Interactive Action Buttons */}
            <motion.div
              variants={fadeInUp}
              className="relative max-w-4xl mx-auto pt-8"
            >
              {/* Enhanced Action Buttons Container */}
              <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25">
                <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
                  {/* Action Buttons Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* Download Resume - Primary Action */}
                    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-400/30 hover:border-blue-400/50 transition-all duration-500 hover:scale-105">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <Button
                        size="lg"
                        className="relative w-full h-20 bg-transparent hover:bg-transparent text-white border-0 shadow-none p-6"
                        onClick={handleDownloadResume}
                        disabled={isDownloading}
                      >
                        <div className="flex flex-col items-center justify-center space-y-1">
                          <FileDown size={20} className="text-blue-400 group-hover:animate-bounce transition-all duration-300" />
                          <span className="text-sm font-medium">
                            {isDownloading ? 'Downloading...' : 'Download PDF'}
                          </span>
                        </div>
                      </Button>
                    </div>

                    {/* View Toggle - Interactive */}
                    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 border border-purple-400/30 hover:border-purple-400/50 transition-all duration-500 hover:scale-105">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <Button
                        size="lg"
                        className="relative w-full h-20 bg-transparent hover:bg-transparent text-white border-0 shadow-none p-6"
                        onClick={handleToggleView}
                      >
                        <div className="flex flex-col items-center justify-center space-y-1">
                          <Eye size={20} className="text-purple-400 group-hover:scale-110 transition-all duration-300" />
                          <span className="text-sm font-medium">
                            {showPdf ? 'Interactive View' : 'PDF View'}
                          </span>
                        </div>
                      </Button>
                    </div>

                    {/* Contact - Call to Action */}
                    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-500 hover:scale-105">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <Link
                        href="/contact"
                        className="relative block w-full h-20 bg-transparent hover:bg-transparent text-white p-6 rounded-lg transition-all duration-200"
                      >
                        <div className="flex flex-col items-center justify-center space-y-1 h-full">
                          <Mail size={20} className="text-emerald-500 group-hover:scale-110 transition-all duration-300" />
                          <span className="text-sm font-medium">Let's Connect</span>
                        </div>
                      </Link>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>

            {/* Enhanced Social Icons Container */}
            <motion.div
              variants={fadeInUp}
              className="max-w-2xl mx-auto pt-8"
            >
              <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25">
                <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
                  <div className="flex justify-center gap-6">
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
                      <SiLinkedin className="h-7 w-7" />
                    </a>
                    <a
                      href="https://github.com/hudsor01"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-400 social-icon"
                      aria-label="GitHub"
                    >
                      <SiGithub className="h-7 w-7" />
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
                  </div>
                </div>
              </div>
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
              {/* About Section - Clean Professional Style */}
              <motion.section variants={fadeInUp}>
                <div className="bg-slate-800/95 border border-slate-700 rounded-xl p-8 shadow-lg hover:bg-slate-700/95 hover:border-slate-600 transition-all duration-200">
                  <div className="flex flex-col lg:flex-row items-center gap-8">
                    {/* Profile Image */}
                    <div className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-2xl overflow-hidden border-4 border-blue-500/40 shadow-xl shadow-blue-500/20 flex-shrink-0">
                      <Image
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=face&q=80"
                        alt="Richard Hudson - Revenue Operations Consultant specializing in Salesforce automation, data analytics, and business growth strategies in Dallas, TX"
                        fill
                        sizes="(max-width: 768px) 128px, 160px"
                        className="object-cover"
                        priority
                      />
                    </div>

                    {/* About Content */}
                    <div className="flex-1 text-center lg:text-left space-y-4">
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        Revenue Operations Professional
                      </h3>
                      <p className="text-blue-400 font-medium">
                        4+ Years Experience | Dallas-Fort Worth, TX
                      </p>
                      <p className="text-slate-300 text-base leading-relaxed">
                        Experienced Revenue Operations Professional with a proven track record of driving business growth 
                        through data-driven insights, process optimization, and strategic operational improvements. 
                        Expert in building scalable systems that increase efficiency and revenue performance.
                      </p>
                      
                      <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                        <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-blue-900/50 text-blue-300 border border-blue-800/50">
                          Salesforce Certified
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-blue-900/50 text-blue-300 border border-blue-800/50">
                          HubSpot Certified
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-emerald-900/50 text-emerald-300 border border-emerald-800/50">
                          Revenue Operations
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Professional Experience */}
              <motion.section variants={fadeInUp}>
                <div className="space-y-12">
                  {experience.map((job) => (
                    <motion.div key={job.title} variants={fadeInUp} className="space-y-6">
                      {/* Job Title Outside Container */}
                      <div className="text-center">
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold section-heading-gradient mb-2 tracking-tight">{job.title}</h3>
                      </div>

                      {/* Job Content Container - Clean Professional Style */}
                      <div className="bg-slate-800/95 border border-slate-700 rounded-xl p-8 shadow-lg hover:bg-slate-700/95 hover:border-slate-600 transition-all duration-200">
                        {/* Company and Details Header */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                          <div>
                            <h4 className="text-xl font-semibold text-white">
                              {job.company}
                            </h4>
                            <p className="text-blue-400 flex items-center gap-2 mt-1">
                              <MapPin className="w-4 h-4" />
                              {job.location} • {job.period}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {job.technologies.map((tech, i) => (
                              <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-600 text-slate-200 border border-slate-500">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Job Description */}
                        <div className="space-y-4">
                          {job.description.map((item, i) => (
                            <p key={i} className="text-slate-300 text-base leading-relaxed">
                              • {item}
                            </p>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* Education & Certifications */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                <motion.section variants={fadeInUp} className="group h-full">
                  <div className="relative bg-white/5 backdrop-blur border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-500 h-full flex flex-col hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25">
                    <div className="p-8 flex-1 flex flex-col">
                      {/* Inner Container for Content */}
                      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 flex-1 flex flex-col h-[320px]">
                        <div className="text-center mb-6">
                          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-500 bg-clip-text text-transparent flex items-center justify-center gap-3">
                            <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
                            Education
                          </h3>
                        </div>

                        <div className="flex-1 flex flex-col justify-center">
                          {education.map((edu, index) => (
                            <div key={index} className="space-y-3">
                              <h4 className="text-lg font-bold text-white leading-tight">{edu.degree}</h4>
                              <p className="text-blue-400 font-medium">{edu.institution}</p>
                              <div className="flex items-center gap-2 text-gray-400">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm">{edu.period}</span>
                              </div>
                              <p className="text-gray-300 text-sm">{edu.focus}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.section>

                <motion.section variants={fadeInUp} className="group h-full">
                  <div className="relative bg-white/5 backdrop-blur border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-500 h-full flex flex-col hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25">
                    <div className="p-8 flex-1 flex flex-col">
                      {/* Inner Container for Content */}
                      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 flex-1 flex flex-col h-[320px]">
                        <div className="text-center mb-6">
                          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-500 bg-clip-text text-transparent flex items-center justify-center gap-3">
                            <BadgeCheck className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
                            Certifications
                          </h3>
                        </div>

                        <div className="space-y-4 flex-1 flex flex-col justify-center">
                          {certifications.map((cert, index) => (
                            <div key={index} className="flex items-center">
                              <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 flex-shrink-0"></div>
                              <p className="text-gray-300 text-sm leading-relaxed">
                                {cert}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.section>
              </div>

              {/* Interactive Skills Showcase */}
              <motion.section variants={fadeInUp}>
                <div className="text-center mb-12">
                  <h3 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-500 bg-clip-text text-transparent">
                    Skills & Expertise
                  </h3>
                  <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Interactive skill matrix with expertise levels and proficiency indicators
                  </p>
                </div>

                {/* Interactive Skills Grid */}
                <div className="relative max-w-6xl mx-auto">
                  {/* Premium Glassmorphism Container */}
                  <div className="relative bg-gradient-to-br from-white/8 via-white/4 to-white/4 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                    {/* Subtle background pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 via-purple-500/2 to-indigo-500/3 rounded-3xl" />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {skills.map((skillGroup, index) => (
                        <motion.div
                          key={index}
                          variants={fadeInUp}
                          className="group relative"
                          whileHover={{ y: -8 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          {/* Skill Category Card */}
                          <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur border border-white/20 rounded-2xl overflow-hidden transition-all duration-500 group-hover:border-white/40 group-hover:shadow-2xl group-hover:shadow-blue-500/20 h-full">
                            {/* Gradient Background Effect */}
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${index === 0 ? 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10' :
                              index === 1 ? 'bg-gradient-to-br from-purple-500/10 to-pink-500/10' :
                                'bg-gradient-to-br from-emerald-500/10 to-green-500/10'
                              }`} />

                            <div className="relative z-10 p-6">
                              {/* Category Header */}
                              <div className="flex items-center justify-between mb-6">
                                <h4 className={`text-xl font-bold tracking-tight text-center w-full ${index === 0 ? 'text-blue-400' :
                                  index === 1 ? 'text-purple-400' :
                                    'text-emerald-500'
                                  }`}>
                                  {skillGroup.category}
                                </h4>
                              </div>

                              {/* Skills List */}
                              <div className="space-y-3 flex-1 flex flex-col justify-center">
                                {skillGroup.items.map((skill, i) => (
                                  <motion.div
                                    key={i}
                                    className="group/skill"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 + i * 0.05 }}
                                  >
                                    {/* Skill Item */}
                                    <div className="bg-white/5 rounded-xl p-3 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 text-center">
                                      <span className="text-gray-200 text-sm font-medium">
                                        {skill}
                                      </span>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                  </div>
                </div>
              </motion.section>
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  )
}
