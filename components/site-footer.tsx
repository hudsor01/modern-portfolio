import { siteConfig } from "@/config/site"
import { siteMap } from "@/config/site-map"
import { Icons } from "@/components/icons"
import { NewsletterForm } from "@/components/forms/newsletter-form"

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col gap-8 py-8 md:py-12">
        {/* Newsletter Section */}
        <div className="mx-auto max-w-md text-center">
          <h3 className="mb-4 text-lg font-semibold">Subscribe to Newsletter</h3>
          <p className="mb-4 text-sm text-muted-foreground">Stay updated with my latest projects and blog posts.</p>
          <NewsletterForm />
        </div>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{siteConfig.name}</h3>
            <p className="text-sm text-muted-foreground">{siteConfig.description}</p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {siteMap.mainNav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-muted-foreground transition-colors hover:text-foreground">
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm">
              {siteMap.footerNav.resources.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-muted-foreground transition-colors hover:text-foreground">
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Connect</h3>
            <div className="flex space-x-4">
              {siteMap.footerNav.social.map((item) => {
                const Icon = Icons[item.icon as keyof typeof Icons]
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{item.title}</span>
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-4 border-t pt-8 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {siteMap.footerNav.legal.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="transition-colors hover:text-foreground">
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}

