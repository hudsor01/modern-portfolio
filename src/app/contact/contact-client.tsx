'use client'

import React, { useState } from 'react'
import {
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  Linkedin,
  Github,
  ArrowRight,
} from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

interface FormData {
  name: string
  email: string
  company: string
  subject: string
  message: string
  phone: string
}

const contactInfo = {
  email: 'contact@richardwhudsonjr.com',
  location: 'Dallas-Fort Worth Metroplex',
  linkedin: 'https://www.linkedin.com/in/hudsor01',
  github: 'https://github.com/hudsor01',
}

export default function ContactPageClient() {
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
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      
      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', company: '', subject: '', message: '', phone: '' })
      } else {
        setSubmitStatus('error')
      }
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-[#0f172a] text-white pt-20">
        <div className="container mx-auto px-6">
          {/* Header - No animation */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Let's Work Together
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Ready to transform your revenue operations? Let's discuss how we can optimize your sales processes.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form - Simplified without heavy animations */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                    placeholder="Your name *"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                    placeholder="Your email *"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                    placeholder="Company"
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                    placeholder="Phone"
                  />
                </div>

                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                >
                  <option value="">Select a topic *</option>
                  <option value="Revenue Operations Consulting">Revenue Operations Consulting</option>
                  <option value="Sales Process Optimization">Sales Process Optimization</option>
                  <option value="Data Analytics & Reporting">Data Analytics & Reporting</option>
                  <option value="Process Automation">Process Automation</option>
                  <option value="Other">Other</option>
                </select>

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 resize-none"
                  placeholder="Your message *"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>

                {submitStatus === 'success' && (
                  <div className="flex items-center gap-2 text-green-400 bg-green-400/10 p-4 rounded-xl">
                    <CheckCircle className="w-5 h-5" />
                    Message sent successfully!
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-4 rounded-xl">
                    <AlertCircle className="w-5 h-5" />
                    Failed to send message. Please try again.
                  </div>
                )}
              </form>
            </div>

            {/* Contact Information - Simplified */}
            <div className="space-y-8">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                <h3 className="text-xl font-bold mb-6">Get in Touch</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Mail className="w-6 h-6 text-blue-400" />
                    <a href={`mailto:${contactInfo.email}`} className="text-gray-300 hover:text-blue-400">
                      {contactInfo.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-4">
                    <MapPin className="w-6 h-6 text-purple-400" />
                    <span className="text-gray-300">{contactInfo.location}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Clock className="w-6 h-6 text-pink-400" />
                    <span className="text-gray-300">Mon-Fri: 9:00 AM - 6:00 PM CT</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                <h3 className="text-xl font-bold mb-6">Connect</h3>
                <div className="space-y-4">
                  <a
                    href={contactInfo.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <Linkedin className="w-6 h-6" />
                    <span>LinkedIn</span>
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </a>
                  <a
                    href={contactInfo.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <Github className="w-6 h-6" />
                    <span>GitHub</span>
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}