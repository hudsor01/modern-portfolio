'use client'

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
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  useContactForm,
  contactInfo,
  subjectOptions,
  budgetRanges,
  timelineOptions,
} from '@/hooks/use-contact-form'

// Icon map for subject options
const iconMap = {
  Briefcase,
  User,
  MessageSquare,
  Building,
  Calendar,
  Mail,
} as const

export default function ContactPageClient() {
  const {
    formData,
    errors,
    submitStatus,
    progress,
    showPrivacy,
    agreedToTerms,
    isSubmitting,
    handleInputChange,
    handleSubjectSelect,
    handleSubmit,
    setShowPrivacy,
    setAgreedToTerms,
  } = useContactForm()

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-[#0f172a] text-foreground pt-20">
        <div className="w-full mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-xl sm:text-xl md:text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Let's Connect
            </h1>
            <p className="typography-lead max-w-3xl mx-auto mb-8">
              Ready to optimize your revenue operations? Let's discuss how we can drive growth together.
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8 typography-small text-muted-foreground">
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
            <div className="glass rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="typography-h3">Send a Message</h2>
                <div className="flex items-center gap-2">
                  <div className="typography-small text-muted-foreground">Form Progress</div>
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
                {/* Name & Email Row */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative">
                    <div className="absolute left-3 top-3.5 text-muted-foreground">
                      <User className="w-5 h-5" />
                    </div>
                    <Input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your name *"
                      required
                      aria-invalid={!!errors.name}
                      className="pl-12"
                    />
                    {errors.name && <span className="text-destructive text-sm mt-1 block">{errors.name}</span>}
                  </div>
                  <div className="relative">
                    <div className="absolute left-3 top-3.5 text-muted-foreground">
                      <Mail className="w-5 h-5" />
                    </div>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Your email *"
                      required
                      aria-invalid={!!errors.email}
                      className="pl-12"
                    />
                    {errors.email && <span className="text-destructive text-sm mt-1 block">{errors.email}</span>}
                  </div>
                </div>

                {/* Company & Phone Row */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative">
                    <div className="absolute left-3 top-3.5 text-muted-foreground">
                      <Building className="w-5 h-5" />
                    </div>
                    <Input
                      name="company"
                      type="text"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Company"
                      className="pl-12"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute left-3 top-3.5 text-muted-foreground">
                      <Phone className="w-5 h-5" />
                    </div>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Phone"
                      aria-invalid={!!errors.phone}
                      className="pl-12"
                    />
                    {errors.phone && <span className="text-destructive text-sm mt-1 block">{errors.phone}</span>}
                  </div>
                </div>

                {/* Subject Selection */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-3">
                    What can I help you with? *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {subjectOptions.map((option) => {
                      const Icon = iconMap[option.icon as keyof typeof iconMap]
                      const isSelected = formData.subject === option.value
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleSubjectSelect(option.value)}
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

                {/* Timeline & Budget Row */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Project Timeline</label>
                    <select
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-cyan-500 text-white"
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
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-cyan-500 text-white"
                    >
                      <option value="">Select budget</option>
                      {budgetRanges.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className={`w-full pl-12 pr-4 py-3 bg-white/10 border rounded-xl focus:outline-hidden focus:ring-2 text-foreground placeholder-gray-400 resize-none transition-all ${
                      errors.message
                        ? 'border-destructive focus:ring-red-500'
                        : 'border-white/20 focus:ring-cyan-500'
                    }`}
                    placeholder="Tell me about your project or requirements... *"
                  />
                  <div className="absolute bottom-3 right-3 typography-small text-muted-foreground">
                    {formData.message.length}/500
                  </div>
                  {errors.message && <span className="text-destructive text-sm mt-1 block">{errors.message}</span>}
                </div>

                {/* Privacy Agreement */}
                <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                  <Checkbox
                    id="privacy"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
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
                      <div className="mt-2 p-3 bg-white/5 rounded-xs typography-small text-muted-foreground border border-white/10">
                        Your information will be used solely to respond to your inquiry. We don't share personal data with third parties and you can request deletion at any time.
                      </div>
                    )}
                    {errors.terms && <div className="text-destructive text-sm mt-1">{errors.terms}</div>}
                  </div>
                </div>

                {/* Submit Button */}
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

                {/* Status Messages */}
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
              {/* Contact Info Card */}
              <div className="glass rounded-2xl p-8">
                <h3 className="typography-h4 mb-6 flex items-center gap-2">
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
                      <div className="typography-small text-muted-foreground">Primary contact</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-white/5 rounded-xl">
                    <MapPin className="w-6 h-6 text-primary" />
                    <div>
                      <span className="typography-muted">{contactInfo.location}</span>
                      <div className="typography-small text-muted-foreground">Available for remote work</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-white/5 rounded-xl">
                    <Clock className="w-6 h-6 text-success" />
                    <div>
                      <span className="typography-muted">{contactInfo.availability}</span>
                      <div className="typography-small text-muted-foreground">Response within {contactInfo.response}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links Card */}
              <div className="glass rounded-2xl p-8">
                <h3 className="typography-h4 mb-6 flex items-center gap-2">
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
                      <div className="typography-small text-muted-foreground">Professional network</div>
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
                      <div className="typography-small text-muted-foreground">Code repositories</div>
                    </div>
                    <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Success Stories Card */}
              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-primary/20 rounded-xl p-8">
                <h4 className="typography-large mb-4 text-primary">Recent Success</h4>
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
                <div className="mt-4 typography-small text-muted-foreground">
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
