'use client'

import React, { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { 
  Mail, 
  MapPin, 
  Phone, 
  Clock, 
  Send, 
  CheckCircle, 
  AlertCircle,
  Linkedin,
  Github,
  Twitter,
  Calendar,
  Coffee,
  Star,
  ArrowRight
} from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import Link from 'next/link'

interface FormData {
  name: string
  email: string
  company: string
  subject: string
  message: string
  phone: string
}

const contactInfo = {
  location: {
    address: "Dallas-Fort Worth Metroplex",
    city: "Dallas, TX",
    timezone: "Central Time (CT)"
  },
  phone: "+1 (214) 555-0123",
  email: "contact@richardwhudsonjr.com",
  linkedin: "https://www.linkedin.com/in/hudsor01",
  github: "https://github.com/hudsor01",
  twitter: "https://twitter.com/richardhudson",
  officeHours: {
    "Mon-Thu": "9:00 AM - 6:00 PM CT",
    "Friday": "9:00 AM - 5:00 PM CT", 
    "Weekend": "By Appointment"
  }
}

const socialLinks = [
  {
    name: 'LinkedIn',
    icon: Linkedin,
    url: contactInfo.linkedin,
    description: 'Professional network'
  },
  {
    name: 'GitHub',
    icon: Github,
    url: contactInfo.github,
    description: 'Code repositories'
  },
  {
    name: 'Twitter',
    icon: Twitter,
    url: contactInfo.twitter,
    description: 'Latest updates'
  }
]

const services = [
  {
    title: 'Revenue Operations',
    description: 'Optimize sales processes and drive growth',
    features: ['Sales Process Optimization', 'Revenue Forecasting', 'Pipeline Management']
  },
  {
    title: 'Data Analytics',
    description: 'Transform data into actionable insights',
    features: ['Custom Dashboards', 'Predictive Analytics', 'Performance Metrics']
  },
  {
    title: 'Process Automation',
    description: 'Streamline operations with automation',
    features: ['Workflow Automation', 'Integration Solutions', 'Efficiency Optimization']
  }
]

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    phone: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  
  const heroRef = useRef(null)
  const contactRef = useRef(null)
  const servicesRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true })
  const isContactInView = useInView(contactRef, { once: true })
  const isServicesInView = useInView(servicesRef, { once: true })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: '',
        phone: ''
      })
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
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

      <div className="container relative z-10 px-4 mx-auto max-w-7xl py-16 space-y-16">
        
        {/* Hero Section */}
        <motion.div 
          ref={heroRef}
          variants={fadeInUp}
          initial="initial"
          animate={isHeroInView ? "animate" : "initial"}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center space-y-8 max-w-4xl mx-auto pt-16"
        >
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate={isHeroInView ? "animate" : "initial"}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-8"
          >
            <span className="inline-flex items-center rounded-full bg-blue-500/10 border border-blue-500/30 px-3 py-1 text-sm font-medium text-blue-400">
              Available for New Projects
            </span>
          </motion.div>

          <motion.h1 
            variants={fadeInUp}
            initial="initial"
            animate={isHeroInView ? "animate" : "initial"}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="font-bold text-5xl sm:text-6xl md:text-7xl tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-blue-300 via-sky-400 to-indigo-400"
          >
            Get In Touch
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            initial="initial"
            animate={isHeroInView ? "animate" : "initial"}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-gray-200 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light"
          >
            Ready to optimize your revenue operations and drive sustainable growth? 
            Let's discuss how I can help transform your business.
          </motion.p>
          
          <motion.div 
            variants={fadeInUp}
            initial="initial"
            animate={isHeroInView ? "animate" : "initial"}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="flex items-center justify-center gap-6 text-blue-300"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <MapPin size={16} />
              <span className="text-sm">{contactInfo.location.address}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span className="text-sm">{contactInfo.location.timezone}</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Contact Information Grid */}
        <div className="space-y-8">
          {/* Top Row - Contact Details and Form */}
          <motion.div
            ref={contactRef}
            variants={fadeInUp}
            initial="initial"
            animate={isContactInView ? "animate" : "initial"}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Left Column - Contact Info */}
            <div className="space-y-6">
              {/* Contact Methods & Social Links Combined */}
              <motion.div 
                variants={fadeInUp}
                initial="initial"
                animate={isContactInView ? "animate" : "initial"}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-300 via-sky-400 to-indigo-400 rounded-lg flex items-center justify-center">
                    <Phone className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-br from-blue-300 via-sky-400 to-indigo-400">Contact & Connect</h3>
                    <p className="text-xs text-gray-400">Quick ways to reach me and follow my work</p>
                  </div>
                </div>
                
                {/* Contact Methods */}
                <div className="flex items-center justify-center gap-4 py-3 mb-6">
                  <a 
                    href={`tel:${contactInfo.phone}`}
                    className="w-12 h-12 bg-gradient-to-br from-blue-300 via-sky-400 to-indigo-400 rounded-lg flex items-center justify-center hover:scale-110 transition-transform group"
                    title="Call me"
                  >
                    <Phone className="w-5 h-5 text-white" />
                  </a>
                  
                  <a 
                    href={`mailto:${contactInfo.email}`}
                    className="w-12 h-12 bg-gradient-to-br from-blue-300 via-sky-400 to-indigo-400 rounded-lg flex items-center justify-center hover:scale-110 transition-transform group"
                    title="Email me"
                  >
                    <Mail className="w-5 h-5 text-white" />
                  </a>
                  
                  <a 
                    href="#booking"
                    className="w-12 h-12 bg-gradient-to-br from-blue-300 via-sky-400 to-indigo-400 rounded-lg flex items-center justify-center hover:scale-110 transition-transform group"
                    title="Schedule a call"
                  >
                    <Calendar className="w-5 h-5 text-white" />
                  </a>
                </div>

                {/* Social Media Links */}
                <div className="border-t border-white/10 pt-4">
                  <div className="space-y-2">
                    {socialLinks.map((social) => (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group"
                      >
                        <div className="w-7 h-7 bg-gradient-to-br from-blue-300 via-sky-400 to-indigo-400 rounded-lg flex items-center justify-center">
                          <social.icon className="text-white w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="font-medium text-white text-sm">{social.name}</p>
                          <p className="text-xs text-gray-400">{social.description}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Office Hours */}
              <motion.div 
                variants={fadeInUp}
                initial="initial"
                animate={isContactInView ? "animate" : "initial"}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-300 via-sky-400 to-indigo-400 rounded-lg flex items-center justify-center">
                    <Clock className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-br from-blue-300 via-sky-400 to-indigo-400">Office Hours</h3>
                    <p className="text-xs text-gray-400">Central Time (CT)</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  {Object.entries(contactInfo.officeHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between items-center py-1">
                      <span className="font-medium text-gray-300">{day}</span>
                      <span className="text-gray-400">{hours}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Contact Form */}
            <motion.div 
              variants={fadeInUp}
              initial="initial"
              animate={isContactInView ? "animate" : "initial"}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-300 via-sky-400 to-indigo-400 rounded-lg flex items-center justify-center">
                  <Send className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-br from-blue-300 via-sky-400 to-indigo-400">Send a Message</h3>
                  <p className="text-xs text-gray-400">I'll get back to you within 24 hours</p>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-300">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-300">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      placeholder="john@company.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-300">
                    Subject *
                  </label>
                  <div className="relative">
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                      required
                    >
                      <option value="" className="bg-[#0f172a] text-gray-300">Select a subject</option>
                      <option value="revenue-ops" className="bg-[#0f172a] text-white">Revenue Operations Consulting</option>
                      <option value="data-analytics" className="bg-[#0f172a] text-white">Data Analytics & BI</option>
                      <option value="process-automation" className="bg-[#0f172a] text-white">Process Automation</option>
                      <option value="general" className="bg-[#0f172a] text-white">General Inquiry</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-300">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                    placeholder="Tell me about your project..."
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message
                      <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              {/* Success/Error Messages */}
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <div>
                      <h4 className="font-semibold text-green-400">Message Sent!</h4>
                      <p className="text-green-300 text-sm">I'll get back to you within 24 hours.</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <div>
                      <h4 className="font-semibold text-red-400">Something went wrong</h4>
                      <p className="text-red-300 text-sm">Please try again or contact me directly.</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Contact Info Footer */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                    </div>
                    <h4 className="font-medium text-white text-sm mb-1">Response Time</h4>
                    <p className="text-xs text-gray-400">Within 24 hours</p>
                  </div>
                  
                  <div>
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Phone className="w-4 h-4 text-blue-400" />
                    </div>
                    <h4 className="font-medium text-white text-sm mb-1">Direct Line</h4>
                    <p className="text-xs text-gray-400">{contactInfo.phone}</p>
                  </div>
                  
                  <div>
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Mail className="w-4 h-4 text-blue-400" />
                    </div>
                    <h4 className="font-medium text-white text-sm mb-1">Email Direct</h4>
                    <p className="text-xs text-gray-400">{contactInfo.email}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Full Width Map Below */}
          <motion.div 
            variants={fadeInUp}
            initial="initial"
            animate={isContactInView ? "animate" : "initial"}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="bg-white/5 backdrop-blur border border-white/10 rounded-xl overflow-hidden"
          >
            <div className="relative h-80 lg:h-96">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d429155.3198515831!2d-97.06195754882812!3d32.82058245000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864c19f77b45974b%3A0xb9ec9ba4f647678f!2sDallas-Fort%20Worth%20Metroplex%2C%20TX!5e0!3m2!1sen!2sus!4v1703876543210!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-xl"
              />
              <div className="absolute top-4 left-4 bg-[#0f172a]/90 backdrop-blur border border-white/10 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-white">Dallas-Fort Worth</span>
                </div>
                <p className="text-xs bg-clip-text text-transparent bg-gradient-to-br from-blue-300 via-sky-400 to-indigo-400 mt-1">Serving clients nationwide</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Services Section */}
        <motion.div
          ref={servicesRef}
          variants={fadeInUp}
          initial="initial"
          animate={isServicesInView ? "animate" : "initial"}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-12"
        >
          <div className="text-center space-y-4">
            <motion.h2 
              variants={fadeInUp}
              initial="initial"
              animate={isServicesInView ? "animate" : "initial"}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-blue-300 via-sky-400 to-indigo-400"
            >
              How I Can Help
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              initial="initial"
              animate={isServicesInView ? "animate" : "initial"}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-gray-200 text-lg max-w-2xl mx-auto leading-relaxed font-light"
            >
              Specialized expertise in revenue operations and business optimization
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:items-stretch">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                variants={fadeInUp}
                initial="initial"
                animate={isServicesInView ? "animate" : "initial"}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.2 }}
                className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 group flex flex-col h-full"
              >
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  {service.title}
                </h3>
                
                <p className="text-gray-300 mb-6 leading-relaxed flex-grow">
                  {service.description}
                </p>
                
                <div className="space-y-2 mt-auto">
                  {service.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate={isServicesInView ? "animate" : "initial"}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="text-center space-y-8 max-w-4xl mx-auto"
          id="booking"
        >
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-8 md:p-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Coffee className="w-8 h-8 text-blue-400" />
              <h3 className="font-bold text-2xl sm:text-3xl md:text-4xl tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-blue-300 via-sky-400 to-indigo-400">
                Ready to Get Started?
              </h3>
            </div>
            
            <p className="text-gray-200 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light mb-8">
              Schedule a free 30-minute discovery call to discuss your project and see how I can help drive your business forward.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group">
                <Calendar size={20} />
                Book Discovery Call
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              
              <Link
                href="/projects"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
              >
                <Star size={20} />
                View My Work
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10">
              <div className="text-center">
                <Clock className="w-6 h-6 text-blue-400 mx-auto mb-3" />
                <h4 className="font-semibold text-white mb-2">Response Time</h4>
                <p className="text-blue-300 text-sm">Within 24 hours</p>
              </div>
              
              <div className="text-center">
                <MapPin className="w-6 h-6 text-blue-400 mx-auto mb-3" />
                <h4 className="font-semibold text-white mb-2">Time Zone</h4>
                <p className="text-blue-300 text-sm">US Central (CT)</p>
              </div>
              
              <div className="text-center">
                <Coffee className="w-6 h-6 text-blue-400 mx-auto mb-3" />
                <h4 className="font-semibold text-white mb-2">Consultation</h4>
                <p className="text-blue-300 text-sm">Free 30-min call</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
    </>
  )
}
