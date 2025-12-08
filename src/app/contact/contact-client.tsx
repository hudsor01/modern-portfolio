'use client'

import React, { useState, useEffect } from 'react'
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
  User,
  Building,
  Phone,
  MessageSquare,
  Calendar,
  Briefcase,
  Zap,
  Shield,
  Eye,
  EyeOff,
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
  budget: string
  timeline: string
  projectType: string
  howDidYouHear: string
}

interface FormErrors {
  [key: string]: string
}

const contactInfo = {
  email: 'contact@richardwhudsonjr.com',
  location: 'Dallas-Fort Worth Metroplex',
  linkedin: 'https://www.linkedin.com/in/hudsor01',
  github: 'https://github.com/hudsor01',
  response: '24 hours',
  availability: 'Mon-Fri: 9:00 AM - 6:00 PM CT',
}

const subjectOptions = [
  { value: 'revenue-ops-consulting', label: 'Revenue Operations Consulting', icon: Briefcase },
  { value: 'job-opportunity', label: 'Job Opportunity', icon: User },
  { value: 'project-collaboration', label: 'Project Collaboration', icon: MessageSquare },
  { value: 'partnership', label: 'Partnership Opportunity', icon: Building },
  { value: 'speaking', label: 'Speaking Engagement', icon: Calendar },
  { value: 'other', label: 'Other', icon: Mail },
]

const budgetRanges = [
  { value: 'under-5k', label: 'Under $5,000' },
  { value: '5k-15k', label: '$5,000 - $15,000' },
  { value: '15k-50k', label: '$15,000 - $50,000' },
  { value: '50k-plus', label: '$50,000+' },
  { value: 'not-sure', label: 'Not sure yet' },
]

const timelineOptions = [
  { value: 'asap', label: 'ASAP (Rush project)' },
  { value: '1-month', label: 'Within 1 month' },
  { value: '2-3-months', label: '2-3 months' },
  { value: '6-months', label: '6+ months' },
  { value: 'exploring', label: 'Just exploring' },
]

export default function ContactPageClient() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    phone: '',
    budget: '',
    timeline: '',
    projectType: '',
    howDidYouHear: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [progress, setProgress] = useState(0)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  // Calculate form completion progress
  useEffect(() => {
    const requiredFields = ['name', 'email', 'subject', 'message']
    const filledRequired = requiredFields.filter(field => formData[field as keyof FormData]).length
    const allFields = Object.keys(formData).filter(key => key !== 'howDidYouHear')
    const filledAll = allFields.filter(field => formData[field as keyof FormData]).length
    const newProgress = Math.round((filledRequired / requiredFields.length) * 60 + (filledAll / allFields.length) * 40)
    setProgress(newProgress)
  }, [formData])

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        return value.length < 2 ? 'Name must be at least 2 characters' : ''
      case 'email': {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return !emailRegex.test(value) ? 'Please enter a valid email address' : ''
      }
      case 'phone':
        if (value && !/^[\d\s+()-]+$/.test(value)) {
          return 'Please enter a valid phone number'
        }
        return ''
      case 'message':
        return value.length < 10 ? 'Message must be at least 10 characters' : ''
      default:
        return ''
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    // Real-time validation
    const error = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: error }))
    
    // Clear submit status on new input
    if (submitStatus !== 'idle') setSubmitStatus('idle')
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    // Validate all fields
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value)
      if (error) newErrors[key] = error
    })
    
    // Check required fields
    const requiredFields = ['name', 'email', 'subject', 'message']
    requiredFields.forEach(field => {
      if (!formData[field as keyof FormData]) {
        newErrors[field] = 'This field is required'
      }
    })
    
    if (!agreedToTerms) {
      newErrors.terms = 'Please agree to the privacy policy'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      setSubmitStatus('error')
      return
    }
    
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          submittedAt: new Date().toISOString(),
          userAgent: navigator.userAgent,
        }),
      })
      
      if (response.ok) {
        setSubmitStatus('success')
        setFormData({
          name: '',
          email: '',
          company: '',
          subject: '',
          message: '',
          phone: '',
          budget: '',
          timeline: '',
          projectType: '',
          howDidYouHear: '',
        })
        setProgress(0)
        setAgreedToTerms(false)
        setErrors({})
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
      <section className="min-h-screen bg-[#0f172a] text-foreground pt-20">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Let's Connect
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Ready to optimize your revenue operations? Let's discuss how we can drive growth together.
            </p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-warning" />
                <span>24hr Response Time</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-success" />
                <span>Confidential Discussions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>$4.8M+ Revenue Generated</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Enhanced Contact Form */}
            <div className="glass rounded-3xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Send a Message</h2>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-muted-foreground">Form Progress</div>
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="text-sm text-primary font-medium">{progress}%</div>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className={`w-full pl-12 pr-4 py-3 bg-white/10 border rounded-xl focus:outline-none focus:ring-2 text-foreground placeholder-gray-400 transition-all ${
                        errors.name 
                          ? 'border-destructive focus:ring-red-500' 
                          : 'border-white/20 focus:ring-cyan-500'
                      }`}
                      placeholder="Your name *"
                    />
                    {errors.name && <span className="text-destructive text-sm mt-1 block">{errors.name}</span>}
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={`w-full pl-12 pr-4 py-3 bg-white/10 border rounded-xl focus:outline-none focus:ring-2 text-foreground placeholder-gray-400 transition-all ${
                        errors.email 
                          ? 'border-destructive focus:ring-red-500' 
                          : 'border-white/20 focus:ring-cyan-500'
                      }`}
                      placeholder="Your email *"
                    />
                    {errors.email && <span className="text-destructive text-sm mt-1 block">{errors.email}</span>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Building className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-foreground placeholder-gray-400 transition-all"
                      placeholder="Company"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-3 bg-white/10 border rounded-xl focus:outline-none focus:ring-2 text-foreground placeholder-gray-400 transition-all ${
                        errors.phone 
                          ? 'border-destructive focus:ring-red-500' 
                          : 'border-white/20 focus:ring-cyan-500'
                      }`}
                      placeholder="Phone"
                    />
                    {errors.phone && <span className="text-destructive text-sm mt-1 block">{errors.phone}</span>}
                  </div>
                </div>

                {/* Subject Selection with Visual Cards */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-3">What can I help you with? *</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {subjectOptions.map((option) => {
                      const Icon = option.icon
                      const isSelected = formData.subject === option.value
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, subject: option.value }))
                            setErrors(prev => ({ ...prev, subject: '' }))
                          }}
                          className={`p-4 rounded-xl border text-center transition-all duration-200 ${
                            isSelected
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-white/20 bg-white/5 text-muted-foreground hover:border-primary/50 hover:bg-white/10'
                          }`}
                        >
                          <Icon className="w-6 h-6 mx-auto mb-2" />
                          <div className="text-xs font-medium">{option.label}</div>
                        </button>
                      )
                    })}
                  </div>
                  {errors.subject && <span className="text-destructive text-sm mt-1 block">{errors.subject}</span>}
                </div>

                {/* Additional Fields for Better Qualification */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Project Timeline</label>
                    <select
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                    >
                      <option value="">Select timeline</option>
                      {timelineOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Budget Range</label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                    >
                      <option value="">Select budget</option>
                      {budgetRanges.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className={`w-full pl-12 pr-4 py-3 bg-white/10 border rounded-xl focus:outline-none focus:ring-2 text-foreground placeholder-gray-400 resize-none transition-all ${
                      errors.message 
                        ? 'border-destructive focus:ring-red-500' 
                        : 'border-white/20 focus:ring-cyan-500'
                    }`}
                    placeholder="Tell me about your project or requirements... *"
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                    {formData.message.length}/500
                  </div>
                  {errors.message && <span className="text-destructive text-sm mt-1 block">{errors.message}</span>}
                </div>

                {/* Privacy Agreement */}
                <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                  <input
                    type="checkbox"
                    id="privacy"
                    checked={agreedToTerms}
                    onChange={(e) => {
                      setAgreedToTerms(e.target.checked)
                      setErrors(prev => ({ ...prev, terms: '' }))
                    }}
                    className="mt-0.5 w-4 h-4 text-primary bg-transparent border-border rounded focus:ring-cyan-500"
                  />
                  <div className="text-sm">
                    <label htmlFor="privacy" className="text-muted-foreground cursor-pointer">
                      I agree to the{' '}
                      <button
                        type="button"
                        onClick={() => setShowPrivacy(!showPrivacy)}
                        className="text-primary hover:text-primary/70 underline inline-flex items-center gap-1"
                      >
                        privacy policy
                        {showPrivacy ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                      {' '}and consent to processing my data for this inquiry. *
                    </label>
                    {showPrivacy && (
                      <div className="mt-2 p-3 bg-white/5 rounded text-xs text-muted-foreground border border-white/10">
                        Your information will be used solely to respond to your inquiry. We don't share personal data with third parties and you can request deletion at any time.
                      </div>
                    )}
                    {errors.terms && <div className="text-destructive text-sm mt-1">{errors.terms}</div>}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !agreedToTerms}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-foreground font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                      Send Message
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>

                {submitStatus === 'success' && (
                  <div className="flex items-center gap-2 text-success bg-success/10 p-4 rounded-xl">
                    <CheckCircle className="w-5 h-5" />
                    Message sent successfully!
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-4 rounded-xl">
                    <AlertCircle className="w-5 h-5" />
                    Failed to send message. Please try again.
                  </div>
                )}
              </form>
            </div>

            {/* Contact Information & Social Proof */}
            <div className="space-y-8">
              <div className="glass rounded-3xl p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-warning" />
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                    <Mail className="w-6 h-6 text-primary" />
                    <div>
                      <a href={`mailto:${contactInfo.email}`} className="text-muted-foreground hover:text-primary font-medium">
                        {contactInfo.email}
                      </a>
                      <div className="text-xs text-muted-foreground">Primary contact</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-white/5 rounded-xl">
                    <MapPin className="w-6 h-6 text-primary" />
                    <div>
                      <span className="text-muted-foreground">{contactInfo.location}</span>
                      <div className="text-xs text-muted-foreground">Available for remote work</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-white/5 rounded-xl">
                    <Clock className="w-6 h-6 text-success" />
                    <div>
                      <span className="text-muted-foreground">{contactInfo.availability}</span>
                      <div className="text-xs text-muted-foreground">Response within {contactInfo.response}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass rounded-3xl p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Connect Socially
                </h3>
                <div className="space-y-4">
                  <a
                    href={contactInfo.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-primary/10 hover:border-primary/30 border border-transparent transition-all duration-300 group"
                  >
                    <Linkedin className="w-6 h-6 text-primary group-hover:text-primary" />
                    <div className="flex-1">
                      <span className="font-medium">LinkedIn</span>
                      <div className="text-xs text-muted-foreground">Professional network</div>
                    </div>
                    <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                  </a>
                  <a
                    href={contactInfo.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-purple-500/10 hover:border-purple-500/30 border border-transparent transition-all duration-300 group"
                  >
                    <Github className="w-6 h-6 text-muted-foreground group-hover:text-purple-400" />
                    <div className="flex-1">
                      <span className="font-medium">GitHub</span>
                      <div className="text-xs text-muted-foreground">Code repositories</div>
                    </div>
                    <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
              
              {/* Success Stories Teaser */}
              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-primary/20 rounded-3xl p-8">
                <h4 className="text-lg font-bold mb-4 text-primary">Recent Success</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span>$4.8M+ revenue generated</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span>432% transaction growth</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span>2,217% network expansion</span>
                  </div>
                </div>
                <div className="mt-4 text-xs text-muted-foreground">
                  Real results from recent partnerships
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