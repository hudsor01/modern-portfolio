#!/usr/bin/env bun
/**
 * Properly replace framer-motion with CSS animations
 * Run with: bun scripts/replace-framer-motion.ts
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

const srcDir = './src'

// Files to skip
const skipFiles = [
  'src/lib/motion/',
  'src/app/globals.css',
]

function getAllTsxFiles(dir: string): string[] {
  const files: string[] = []
  const items = readdirSync(dir)

  for (const item of items) {
    const fullPath = join(dir, item)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      files.push(...getAllTsxFiles(fullPath))
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      files.push(fullPath)
    }
  }

  return files
}

function processFile(filePath: string): void {
  if (skipFiles.some((s) => filePath.includes(s))) {
    console.log(`Skipping: ${filePath}`)
    return
  }

  let content = readFileSync(filePath, 'utf-8')
  const originalContent = content

  // Check if file uses framer-motion
  if (!content.includes('framer-motion') && !content.includes('<motion.') && !content.includes('<m.')) {
    return
  }

  console.log(`Processing: ${filePath}`)

  // Step 1: Remove all framer-motion imports
  content = content.replace(/import\s*{[^}]*}\s*from\s*['"]framer-motion['"][\s;]*/g, '')
  content = content.replace(/import\s+type\s*{[^}]*}\s*from\s*['"]framer-motion['"][\s;]*/g, '')

  // Step 2: Remove imports of fadeInUp/staggerContainer from any file
  content = content.replace(/,?\s*fadeInUp\s*/g, '')
  content = content.replace(/,?\s*staggerContainer\s*/g, '')

  // Clean up empty import blocks like: import {  } from './constants'
  content = content.replace(/import\s*{\s*}\s*from\s*['"][^'"]+['"][\s;]*/g, '')

  // Step 3: Remove variant definitions
  content = content.replace(/const\s+(fadeInUp|staggerContainer)\s*[:=][^;]*;?\s*/g, '')
  content = content.replace(/const\s+variants\s*[:=]\s*{[^}]*}\s*/g, '')

  // Step 4: Convert motion elements to regular elements
  // Handle the common elements
  const elements = ['div', 'section', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'a', 'button', 'main', 'article', 'aside', 'nav', 'ul', 'li', 'path']

  for (const el of elements) {
    // Replace closing tags first
    content = content.replace(new RegExp(`</motion\\.${el}>`, 'g'), `</${el}>`)

    // Replace opening tags - this is the tricky part
    // We need to:
    // 1. Change <motion.div to <div
    // 2. Remove animation props (initial, animate, exit, variants, transition, whileHover, whileInView, whileTap, viewport)
    // 3. Add animate-fade-in-up to className

    // First, just change motion.element to element
    content = content.replace(new RegExp(`<motion\\.${el}`, 'g'), `<${el}`)
  }

  // Step 5: Remove animation props from opening tags
  // These props need to be removed: initial, animate, exit, variants, transition, whileHover, whileInView, whileTap, viewport

  // Remove simple props like variants={...}
  content = content.replace(/\s+variants=\{[^}]+\}/g, '')

  // Remove props with nested braces like transition={{ duration: 0.6 }}
  content = content.replace(/\s+transition=\{\{[^}]*\}\}/g, '')
  content = content.replace(/\s+initial=\{\{[^}]*\}\}/g, '')
  content = content.replace(/\s+animate=\{\{[^}]*\}\}/g, '')
  content = content.replace(/\s+exit=\{\{[^}]*\}\}/g, '')
  content = content.replace(/\s+whileHover=\{\{[^}]*\}\}/g, '')
  content = content.replace(/\s+whileInView=\{\{[^}]*\}\}/g, '')
  content = content.replace(/\s+whileTap=\{\{[^}]*\}\}/g, '')
  content = content.replace(/\s+viewport=\{\{[^}]*\}\}/g, '')

  // Remove simple string props
  content = content.replace(/\s+initial="[^"]*"/g, '')
  content = content.replace(/\s+animate="[^"]*"/g, '')
  content = content.replace(/\s+exit="[^"]*"/g, '')

  // Remove props that reference variables
  content = content.replace(/\s+initial=\{[^}]+\}/g, '')
  content = content.replace(/\s+animate=\{[^}]+\}/g, '')
  content = content.replace(/\s+variants=\{[^}]+\}/g, '')

  // Step 6: Add animation class to elements that had motion props
  // Find elements that are now plain <div, <section etc and add animate-fade-in-up if they don't have it
  // This is tricky because we need to handle existing className

  // Step 7: Remove AnimatePresence wrapper
  content = content.replace(/<AnimatePresence[^>]*>\s*/g, '')
  content = content.replace(/\s*<\/AnimatePresence>/g, '')

  // Step 8: Clean up any double spaces and empty lines
  content = content.replace(/\n{3,}/g, '\n\n')
  content = content.replace(/  +/g, ' ')

  // Step 9: Remove useInView imports and usage
  content = content.replace(/const\s+\w+\s*=\s*useInView\([^)]*\)\s*/g, '')
  content = content.replace(/ref=\{\w+Ref\}\s*/g, '')

  // Remove refs that were used for useInView
  content = content.replace(/const\s+\w+Ref\s*=\s*useRef[^)]*\([^)]*\)\s*/g, '')

  if (content !== originalContent) {
    writeFileSync(filePath, content)
    console.log(`  Updated: ${filePath}`)
  }
}

// Main execution
const files = getAllTsxFiles(srcDir)
console.log(`Found ${files.length} TypeScript files to process`)

for (const file of files) {
  processFile(file)
}

console.log('\nDone!')
