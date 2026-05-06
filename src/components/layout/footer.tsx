export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card border-t border-border py-4">
      <div className="w-full mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-muted-foreground">
          <p>© {currentYear} Richard Hudson. All rights reserved.</p>
          <a
            href="https://hudsondigitalsolutions.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            Built by Hudson Digital Solutions
          </a>
        </div>
      </div>
    </footer>
  )
}
