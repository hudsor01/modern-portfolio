'use client'

import { useState } from 'react'
import { m as motion } from 'framer-motion'
import { ArrowLeft, Calendar, Tag, ExternalLink, TrendingUp, Users, Settings, BarChart } from 'lucide-react'
import { SiGithub } from 'react-icons/si'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ContactModal } from '@/components/ui/contact-modal'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ProjectJsonLd } from '@/components/seo/json-ld'

const project = {
  id: 'partnership-program-implementation',
  title: 'Enterprise Partnership Program Implementation',
  description: 'Led comprehensive design and implementation of a company\'s first partnership program, creating automated partner onboarding, commission tracking, and performance analytics. Built production-ready integrations with CRM, billing systems, and partner portals, resulting in a highly successful channel program that became integral to company revenue strategy.',
  image: '/images/projects/partner-analytics.jpg',
  category: 'Revenue Operations',
  tags: [
    'Partnership Program',
    'Channel Operations', 
    'Partner Onboarding',
    'Commission Automation',
    'CRM Integration',
    'Production Implementation',
    'Revenue Channel Development',
    'Partner Analytics'
  ],
  createdAt: '2024-05-01',
  updatedAt: '2024-05-15',
  link: 'https://demo.partnershipprogram.example.com',
  github: 'https://github.com/hudsonr01/partnership-program'
}

const achievements = [
  {
    metric: 'Partner Program',
    value: 'First Implementation',
    description: 'Designed and built company\'s first-ever partnership program from concept to production',
    icon: <Users className="w-6 h-6" />
  },
  {
    metric: 'System Integration',
    value: 'Full Production',
    description: 'Production-ready integrations with CRM, billing systems, and partner portals',
    icon: <Settings className="w-6 h-6" />
  },
  {
    metric: 'Automation Level',
    value: '90%+',
    description: 'Automated partner onboarding, commission tracking, and performance reporting',
    icon: <BarChart className="w-6 h-6" />
  },
  {
    metric: 'Business Impact',
    value: 'Strategic Success',
    description: 'Program became integral to company revenue strategy and growth',
    icon: <TrendingUp className="w-6 h-6" />
  }
]

const technicalDetails = [
  {
    title: 'Partner Onboarding Automation',
    description: 'Built automated partner registration and approval workflows with document verification, background checks, and training completion tracking.',
    technologies: ['Salesforce', 'DocuSign API', 'Custom Workflows']
  },
  {
    title: 'Commission Tracking System',
    description: 'Implemented real-time commission calculation engine with multi-tier structures, dispute resolution, and automated payouts.',
    technologies: ['Custom API', 'Database Design', 'Payment Integration']
  },
  {
    title: 'Performance Analytics Dashboard',
    description: 'Created comprehensive partner performance tracking with revenue attribution, conversion metrics, and predictive analytics.',
    technologies: ['React', 'TypeScript', 'Data Visualization']
  },
  {
    title: 'Integration Architecture',
    description: 'Designed and implemented production integrations connecting CRM, billing systems, partner portals, and internal tools.',
    technologies: ['REST APIs', 'Webhooks', 'Data Synchronization']
  }
]

export default function PartnershipProgramPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <ProjectJsonLd
        title={project.title}
        description={project.description}
        slug="partnership-program-implementation"
        category="Revenue Operations"
        tags={project.tags}
      />
      
      <Navbar />
      
      <main className="min-h-screen bg-[#0f172a] text-white pt-20">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Back Navigation */}
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Projects
              </Link>

              {/* Project Header */}
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>May 2024</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag size={16} />
                    <span>{project.category}</span>
                  </div>
                </div>

                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-500 bg-clip-text text-transparent leading-tight">
                  {project.title}
                </h1>

                <p className="text-xl text-gray-300 leading-relaxed max-w-4xl">
                  {project.description}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  <Link
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg transition-all duration-200"
                  >
                    <ExternalLink className="mr-2" size={20} />
                    View Demo
                  </Link>
                  
                  <Link
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium border border-blue-500/50 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-200"
                  >
                    <SiGithub className="mr-2" size={20} />
                    View Code
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Project Image */}
        <section className="py-8">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative rounded-2xl overflow-hidden"
            >
              <Image
                src={project.image}
                alt={project.title}
                width={1200}
                height={600}
                className="w-full h-auto object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiIHZpZXdCb3g9IjAgMCAxMjAwIDYwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjMWUyOTNiIi8+CjxwYXRoIGQ9Ik00ODAgMzAwTDU2MCAyNDBMNjQwIDMwMEw1NjAgMzYwTDQ4MCAzMDBaIiBmaWxsPSIjMzc0MTUxIi8+Cjx0ZXh0IHg9IjYwMCIgeT0iNDIwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM2YjczODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlBhcnRuZXJzaGlwIFByb2dyYW0gRGFzaGJvYXJkPC90ZXh0Pgo8L3N2Zz4='
                }}
              />
            </motion.div>
          </div>
        </section>

        {/* Key Achievements */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                  Key Achievements
                </h2>
                <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                  Strategic implementation results and business impact
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                    className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="text-blue-400 mb-4">
                      {achievement.icon}
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-white">{achievement.value}</div>
                      <div className="text-sm font-medium text-blue-400">{achievement.metric}</div>
                      <div className="text-sm text-gray-400 leading-relaxed">{achievement.description}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Technical Implementation */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                  Technical Implementation
                </h2>
                <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                  Production-ready systems and integrations built from the ground up
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {technicalDetails.map((detail, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.0 + index * 0.1 }}
                    className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
                  >
                    <h3 className="text-xl font-bold text-white mb-4">{detail.title}</h3>
                    <p className="text-gray-300 mb-6 leading-relaxed">{detail.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {detail.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm border border-blue-500/30"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="text-center space-y-8"
            >
              <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8 md:p-12">
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent mb-6">
                  Interested in Partnership Program Development?
                </h2>
                <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                  Ready to build a successful partnership program for your organization? Let's discuss how we can create a strategic channel program that drives revenue growth.
                </p>
                <Button
                  size="lg"
                  onClick={() => setIsModalOpen(true)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                >
                  <TrendingUp className="mr-2" size={20} />
                  Discuss Your Partnership Strategy
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}