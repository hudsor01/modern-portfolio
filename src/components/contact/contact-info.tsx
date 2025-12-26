'use client'

import {
  Mail,
  MapPin,
  Clock,
  Linkedin,
  Github,
  ArrowRight,
  Zap,
  MessageSquare,
} from 'lucide-react'

// ============================================================================
// Static Data
// ============================================================================

const contactInfo = {
  email: 'contact@richardwhudsonjr.com',
  location: 'Dallas-Fort Worth Metroplex',
  linkedin: 'https://www.linkedin.com/in/hudsor01',
  github: 'https://github.com/hudsor01',
  response: '24 hours',
  availability: 'Mon-Fri: 9:00 AM - 6:00 PM CT',
}

// ============================================================================
// Component
// ============================================================================

export function ContactInfo() {
  return (
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
    </div>
  )
}
