/**
 * HeroHeader Component
 * Hero section with profile image, action buttons, and social links
 */

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileDown, Mail, Globe, Eye, Github, Linkedin } from 'lucide-react'

interface HeroHeaderProps {
  isHeroInView: boolean
  showPdf: boolean
  isDownloading: boolean
  onDownloadResume: () => void
  onToggleView: () => void
}

export function HeroHeader({
  isHeroInView,
  showPdf,
  isDownloading,
  onDownloadResume,
  onToggleView,
}: HeroHeaderProps) {
  return (
    <div
      className={`text-center space-y-8 max-w-4xl mx-auto animate-fade-in-up ${isHeroInView ? 'opacity-100' : 'opacity-0'}`}
    >
      <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8">
        <span className="block hero-name-gradient">
          Richard Hudson
        </span>
      </h1>

      <h2 className="text-xl sm:text-xl md:text-2xl font-light max-w-4xl mx-auto mb-6">
        <span className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-primary/40 px-6 py-3 text-primary/70 font-medium backdrop-blur-xs shadow-lg shadow-primary/25">
          Revenue Operations Professional
        </span>
      </h2>

      <div className="flex flex-col items-center mb-8">
        <p className="text-lg md:typography-lead max-w-3xl mx-auto leading-relaxed text-center">
          Experienced Revenue Operations Professional with a proven track record of driving business growth through data-driven insights, process optimization, and strategic operational improvements. Expert in building scalable systems that increase efficiency and revenue performance.
        </p>
      </div>

      {/* Interactive Action Buttons */}
      <div className="relative max-w-4xl mx-auto pt-8">
        {/* Enhanced Action Buttons Container */}
        <div className="glass-interactive rounded-2xl p-8 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/25">
          <div className="glass rounded-2xl p-6">
            {/* Action Buttons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Download Resume - Primary Action */}
              <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-primary/30 hover:border-primary/50 transition-all duration-500 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Button
                  size="lg"
                  className="relative w-full h-20 bg-transparent hover:bg-transparent text-foreground border-0 shadow-none p-6"
                  onClick={onDownloadResume}
                  disabled={isDownloading}
                >
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <FileDown size={20} className="text-primary group-hover:animate-bounce transition-all duration-300" />
                    <span className="text-sm font-medium">
                      {isDownloading ? 'Downloading...' : 'Download PDF'}
                    </span>
                  </div>
                </Button>
              </div>

              {/* View Toggle - Interactive */}
              <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 border border-purple-400/30 hover:border-purple-400/50 transition-all duration-500 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Button
                  size="lg"
                  className="relative w-full h-20 bg-transparent hover:bg-transparent text-foreground border-0 shadow-none p-6"
                  onClick={onToggleView}
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
              <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-500 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Link
                  href="/contact"
                  className="relative block w-full h-20 bg-transparent hover:bg-transparent text-foreground p-6 rounded-lg transition-all duration-200"
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
      </div>

      {/* Enhanced Social Icons Container */}
      <div className="max-w-2xl mx-auto pt-8">
        <div className="glass-interactive rounded-2xl p-8 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/25">
          <div className="glass rounded-2xl p-6">
            <div className="flex justify-center gap-6">
              <a
                href="mailto:hello@richardwhudsonjr.com"
                className="text-muted-foreground hover:text-primary social-icon"
                aria-label="Email"
              >
                <Mail className="h-7 w-7" />
              </a>
              <a
                href="https://linkedin.com/in/hudsor01"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary social-icon"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-7 w-7" />
              </a>
              <a
                href="https://github.com/hudsor01"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary social-icon"
                aria-label="GitHub"
              >
                <Github className="h-7 w-7" />
              </a>
              <a
                href="https://richardwhudsonjr.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary social-icon"
                aria-label="Website"
              >
                <Globe className="h-7 w-7" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
