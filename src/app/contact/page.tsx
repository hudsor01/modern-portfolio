'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ContactModal } from '@/components/ui/contact-modal'
import { ServiceJsonLd } from '@/components/seo/json-ld'
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
  Calendar,
  Coffee,
  Star,
  ArrowRight,
} from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
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
    address: 'Dallas-Fort Worth Metroplex',
    city: 'Dallas, TX',
    timezone: 'Central Time (CT)',
  },
  phone: '+1 (214) 555-0123',
  email: 'contact@richardwhudsonjr.com',
  linkedin: 'https://www.linkedin.com/in/hudsor01',
  github: 'https://github.com/hudsor01',
  twitter: 'https://twitter.com/richardhudson',
  officeHours: {
    'Mon-Thu': '9:00 AM - 6:00 PM CT',
    Friday: '9:00 AM - 5:00 PM CT',
    Weekend: 'By Appointment',
  },
}

const socialLinks = [
  {
    name: 'LinkedIn',
    icon: Linkedin,
    url: contactInfo.linkedin,
    description: 'Professional network',
  },
  {
    name: 'GitHub',
    icon: Github,
    url: contactInfo.github,
    description: 'Code repositories',
  },
]

const services = [
  {
    title: 'Revenue Operations',
    description: 'Optimize sales processes and drive growth',
    features: ['Sales Process Optimization', 'Revenue Forecasting', 'Pipeline Management'],
  },
  {
    title: 'Data Analytics',
    description: 'Transform data into actionable insights',
    features: ['Custom Dashboards', 'Predictive Analytics', 'Performance Metrics'],
  },
  {
    title: 'Process Automation',
    description: 'Streamline operations with automation',
    features: ['Workflow Automation', 'Integration Solutions', 'Efficiency Optimization'],
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    phone: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: '',
        phone: '',
      })
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <ServiceJsonLd />
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
          {/* Hero Section */}
          <div className="text-center space-y-8 max-w-4xl mx-auto pt-16">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 page-title-gradient">
              Get In Touch
            </h1>

            <p className="text-gray-200 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light">
              Ready to optimize your revenue operations and drive sustainable growth? Let's discuss
              how I can help transform your business.
            </p>

            <div className="flex items-center justify-center gap-6 text-blue-300">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <MapPin size={16} />
                <span className="text-sm">{contactInfo.location.address}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span className="text-sm">{contactInfo.location.timezone}</span>
              </div>
            </div>
          </div>

          {/* Contact Information Grid */}
          <div className="space-y-8">
            {/* Top Row - Contact Details and Form */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Contact Info */}
              <div className="space-y-6">
                {/* Contact Methods & Social Links Combined */}
                <div className="group relative bg-white/5 backdrop-blur border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25">
                  <div className="p-8">
                    <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center">
                          <Phone className="text-white" size={20} />
                        </div>
                        <div>
                          <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-500 bg-clip-text text-transparent">
                            Contact & Connect
                          </h3>
                          <p className="text-sm text-gray-400">
                            Quick ways to reach me and follow my work
                          </p>
                        </div>
                      </div>

                      {/* Contact Methods */}
                      <div className="flex items-center justify-center gap-4 py-3 mb-6">
                        <a
                          href={`tel:${contactInfo.phone}`}
                          className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center hover:scale-110 transition-transform group"
                          title="Call me"
                        >
                          <Phone className="w-5 h-5 text-white" />
                        </a>

                        <a
                          href={`mailto:${contactInfo.email}`}
                          className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center hover:scale-110 transition-transform group"
                          title="Email me"
                        >
                          <Mail className="w-5 h-5 text-white" />
                        </a>

                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center hover:scale-110 transition-transform group"
                          title="Schedule a call"
                        >
                          <Calendar className="w-5 h-5 text-white" />
                        </button>
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
                              <div className="w-7 h-7 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center">
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
                    </div>
                  </div>
                </div>

                {/* Office Hours */}
                <div className="group relative bg-white/5 backdrop-blur border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25">
                  <div className="p-8">
                    <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center">
                          <Clock className="text-white" size={20} />
                        </div>
                        <div>
                          <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-500 bg-clip-text text-transparent">
                            Office Hours
                          </h3>
                          <p className="text-sm text-gray-400">Central Time (CT)</p>
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
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Contact Form */}
              <div className="group relative bg-white/5 backdrop-blur border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25">
                <div className="p-8 h-full flex flex-col">
                  <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center">
                        <Send className="text-white" size={20} />
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-500 bg-clip-text text-transparent">
                          Send a Message
                        </h3>
                        <p className="text-sm text-gray-400">
                          I'll get back to you within 24 hours
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-white">Full Name *</label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:bg-white/15 transition-all duration-300 font-medium"
                            placeholder="John Doe"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-white">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:bg-white/15 transition-all duration-300 font-medium"
                            placeholder="john@company.com"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-white">Subject *</label>
                        <div className="relative">
                          <select
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:bg-white/15 transition-all duration-300 appearance-none cursor-pointer font-medium"
                            required
                          >
                            <option value="" className="bg-[#0f172a] text-gray-300">
                              Select a subject
                            </option>
                            <option value="revenue-ops" className="bg-[#0f172a] text-white">
                              Revenue Operations Consulting
                            </option>
                            <option value="data-analytics" className="bg-[#0f172a] text-white">
                              Data Analytics & BI
                            </option>
                            <option value="process-automation" className="bg-[#0f172a] text-white">
                              Process Automation
                            </option>
                            <option value="general" className="bg-[#0f172a] text-white">
                              General Inquiry
                            </option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                            <svg
                              className="w-5 h-5 text-blue-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-white">Message *</label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={6}
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:bg-white/15 transition-all duration-300 resize-none font-medium"
                          placeholder="Tell me about your project, goals, and how I can help..."
                          required
                        />
                      </div>

                      <div className="flex-1"></div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-base font-semibold px-8 py-4 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all duration-300 group border border-blue-400/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Sending Message...</span>
                          </>
                        ) : (
                          <>
                            <Send size={20} />
                            <span>Send Message</span>
                            <ArrowRight
                              size={20}
                              className="transition-transform duration-300 group-hover:translate-x-1"
                            />
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
                            <p className="text-green-300 text-sm">
                              I'll get back to you within 24 hours.
                            </p>
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
                            <p className="text-red-300 text-sm">
                              Please try again or contact me directly.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Map Container */}
            <div className="group relative bg-white/5 backdrop-blur border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25">
              <div className="p-8">
                <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center">
                      <MapPin className="text-white" size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-500 bg-clip-text text-transparent">
                        Location & Service Area
                      </h3>
                      <p className="text-sm text-gray-400">
                        Dallas-Fort Worth • Serving clients nationwide
                      </p>
                    </div>
                  </div>

                  <div className="relative w-full h-80 lg:h-96 bg-gray-900 rounded-2xl overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d429155.3198515831!2d-97.06195754882812!3d32.82058245000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864c19f77b45974b%3A0xb9ec9ba4f647678f!2sDallas-Fort%20Worth%20Metroplex%2C%20TX!5e0!3m2!1sen!2sus!4v1703876543210!5m2!1sen!2sus"
                      width="100%"
                      height="100%"
                      style={{ border: 0, display: 'block' }}
                      allowFullScreen={true}
                      loading="eager"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Dallas-Fort Worth Location Map"
                      className="w-full h-full"
                    />
                    <div className="absolute top-4 left-4 bg-[#0f172a]/95 backdrop-blur border border-white/20 rounded-xl p-3 shadow-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-sm font-bold text-white">Dallas-Fort Worth</span>
                      </div>
                      <p className="text-xs text-blue-300 font-medium">
                        Remote & On-site Available
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Services Section - Container-in-Container Design */}
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-blue-300 via-sky-400 to-indigo-400">
                How I Can Help
              </h2>
              <p className="text-gray-200 text-lg max-w-2xl mx-auto leading-relaxed font-light">
                Specialized expertise in revenue operations and business optimization
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:items-stretch">
              {services.map((service, _index) => (
                <div
                  key={service.title}
                  className="group relative bg-white/5 backdrop-blur border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25"
                >
                  <div className="p-8 h-full flex flex-col">
                    <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 h-full flex flex-col">
                      <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">
                        {service.title}
                      </h3>

                      <p className="text-gray-300 mb-6 leading-relaxed flex-grow">
                        {service.description}
                      </p>

                      <div className="space-y-2 mt-auto">
                        {service.features.map((feature, _i) => (
                          <div key={_i} className="flex items-center gap-3 text-sm">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                            <span className="text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section - Container-in-Container Design */}
          <div className="text-center space-y-8 max-w-4xl mx-auto" id="booking">
            <div className="group relative bg-white/5 backdrop-blur border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25">
              <div className="p-8 md:p-12">
                <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <Coffee className="w-8 h-8 text-blue-400" />
                    <h3 className="font-bold text-2xl sm:text-3xl md:text-4xl tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-blue-300 via-sky-400 to-indigo-400">
                      Ready to Get Started?
                    </h3>
                  </div>

                  <p className="text-gray-200 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light mb-8">
                    Schedule a free 30-minute discovery call to discuss your project and see how I
                    can help drive your business forward.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-blue-500/20 hover:scale-105 transition-all duration-300 group border border-blue-400/20"
                    >
                      <Calendar size={16} />
                      Book Discovery Call
                      <ArrowRight
                        size={16}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </button>

                    <Link
                      href="/projects"
                      className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-medium px-6 py-3 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 group border border-blue-400/20"
                    >
                      <Star size={16} />
                      View My Work
                      <ArrowRight
                        size={16}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-white/10">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <span className="text-lg font-bold text-white">8+</span>
                      </div>
                      <h4 className="font-semibold text-white mb-2">Projects Delivered</h4>
                      <p className="text-blue-300 text-sm">Successful implementations</p>
                    </div>

                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <span className="text-sm font-bold text-white">$3.7M+</span>
                      </div>
                      <h4 className="font-semibold text-white mb-2">Revenue Generated</h4>
                      <p className="text-blue-300 text-sm">Measurable business impact</p>
                    </div>

                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <span className="text-sm font-bold text-white">96.8%</span>
                      </div>
                      <h4 className="font-semibold text-white mb-2">Accuracy Rate</h4>
                      <p className="text-blue-300 text-sm">Data-driven precision</p>
                    </div>

                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <span className="text-sm font-bold text-white">87.5%</span>
                      </div>
                      <h4 className="font-semibold text-white mb-2">Automation Rate</h4>
                      <p className="text-blue-300 text-sm">Process optimization</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Modal */}
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      {/* Footer */}
      <Footer />
    </>
  )
}
