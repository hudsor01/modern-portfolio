'use client'

import {
  Linkedin,
  Github,
  ArrowRight,
  MessageSquare,
} from 'lucide-react'

// ============================================================================
// Static Data
// ============================================================================

const socialLinks = {
  linkedin: 'https://www.linkedin.com/in/hudsor01',
  github: 'https://github.com/hudsor01',
}

// ============================================================================
// Component
// ============================================================================

export function ContactInfo() {
  return (
    <div className="bg-card border border-border rounded-2xl p-8">
      <h3 className="typography-h4 mb-6 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-primary" />
        Connect Socially
      </h3>
      <div className="space-y-4">
        <a
          href={socialLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl hover:bg-primary/10 hover:border-primary/30 border border-transparent transition-all duration-300 ease-out group"
        >
          <Linkedin className="w-6 h-6 text-primary" />
          <div className="flex-1">
            <span className="font-medium text-foreground">LinkedIn</span>
            <div className="typography-small text-muted-foreground">Professional network</div>
          </div>
          <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground group-hover:translate-x-1 transition-transform" />
        </a>
        <a
          href={socialLinks.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl hover:bg-secondary/10 hover:border-secondary/30 border border-transparent transition-all duration-300 ease-out group"
        >
          <Github className="w-6 h-6 text-foreground" />
          <div className="flex-1">
            <span className="font-medium text-foreground">GitHub</span>
            <div className="typography-small text-muted-foreground">Code repositories</div>
          </div>
          <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </div>
  )
}
