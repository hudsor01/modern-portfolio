'use client'

import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-100 dark:bg-[#0c0c1f] text-gray-700 dark:text-gray-300 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/resume" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  Resume
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 flex items-center justify-center md:justify-end">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} Richard Hudson | Revenue Operations Professional. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}