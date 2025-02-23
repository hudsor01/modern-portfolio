"use client"

import Link from "next/link"
import { siteConfig } from "@/config/site"
import { Icons } from "@/components/icons"
import { NewsletterForm } from "@/components/forms/newsletter-form"

export function SiteFooter() {
  return (
    <footer className="border-t bg-background mt-24">
      <div className="container py-8">
        {/* Newsletter Section */}
        <div className="mx-auto max-w-md text-center mb-8">
          <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Subscribe to get the latest updates on projects and insights.
          </p>
          <NewsletterForm />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start gap-8 py-6 border-t">
          {/* Brand & Description */}
          <div className="md:max-w-xs">
            <h3 className="font-semibold">{siteConfig.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{siteConfig.description}</p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {/* Navigation */}
            <div>
              <h4 className="font-semibold mb-3 text-sm">Navigation</h4>
              <ul className="space-y-2">
                {siteConfig.nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="font-semibold mb-3 text-sm">Connect</h4>
              <div className="flex flex-col space-y-2">
                {Object.entries(siteConfig.links).map(([platform, url]) => (
                  <Link
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                  >
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-3 text-sm">Contact</h4>
              <div className="space-y-2">
                <Link
                  href={`mailto:${siteConfig.author.email}`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
                >
                  {siteConfig.author.email}
                </Link>
                <p className="text-sm text-muted-foreground">Plano, TX</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t text-center sm:text-left">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex space-x-6">
            {Object.entries(siteConfig.links).map(([platform, url]) => {
              const Icon = Icons[platform as keyof typeof Icons]
              return Icon ? (
                <Link
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon className="h-5 w-5" />
                  <span className="sr-only">{platform}</span>
                </Link>
              ) : null
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}

