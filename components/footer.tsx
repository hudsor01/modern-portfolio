'use client';

import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-[#0c0c1f] text-gray-600 dark:text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Links</h3>
            <div className="grid grid-cols-2 gap-4">
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-gray-600 dark:text-gray-400 hover:text-[#0070f3] dark:hover:text-[#0070f3] transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-gray-600 dark:text-gray-400 hover:text-[#0070f3] dark:hover:text-[#0070f3] transition-colors"
                  >
                    About
                  </Link>
                </li>
              </ul>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/projects"
                    className="text-gray-600 dark:text-gray-400 hover:text-[#0070f3] dark:hover:text-[#0070f3] transition-colors"
                  >
                    Projects
                  </Link>
                </li>
                <li>
                  <Link
                    href="/resume"
                    className="text-gray-600 dark:text-gray-400 hover:text-[#0070f3] dark:hover:text-[#0070f3] transition-colors"
                  >
                    Resume
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-600 dark:text-gray-400 hover:text-[#0070f3] dark:hover:text-[#0070f3] transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-span-2 flex flex-col items-start md:items-end justify-between">
            <div className="space-y-2">
              <a
                href="https://linkedin.com/in/hudsor01"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-[#0070f3] dark:hover:text-[#0070f3] transition-colors inline-flex items-center"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/hudsor01"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-[#0070f3] dark:hover:text-[#0070f3] transition-colors inline-flex items-center ml-4"
              >
                GitHub
              </a>
            </div>

            <div className="text-right mt-8">
              <p className="text-sm text-gray-500 dark:text-gray-500">
                © {currentYear} Richard Hudson | All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
