'use client'

import React, { useState } from 'react'

import { Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { escapeHtml } from '@/lib/sanitization'
import { ContentType } from '@/generated/prisma/browser'
import DOMPurify from 'dompurify'
import { createContextLogger } from '@/lib/logger'
import { TIMING_CONSTANTS } from '@/lib/ui-thresholds'

const logger = createContextLogger('BlogContent')

// Base allowed tags for sanitization
const BASE_ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'em', 'strong', 'a', 'code', 'pre', 'blockquote',
  'ul', 'ol', 'li', 'img', 'table', 'thead', 'tbody', 'tr', 'td', 'th',
  'div', 'span'
] as const

// Base allowed attributes
const BASE_ALLOWED_ATTR = ['href', 'src', 'alt', 'class', 'data-language', 'target', 'rel', 'loading'] as const

// Shared DOMPurify base configuration
const DOMPURIFY_BASE = {
  ALLOW_DATA_ATTR: false,
  RETURN_DOM: false,
  RETURN_DOM_FRAGMENT: false,
} as const

// Full config with additional tags and attributes
const DOMPURIFY_CONFIG = {
  ...DOMPURIFY_BASE,
  ALLOWED_TAGS: [...BASE_ALLOWED_TAGS, 'small'],
  ALLOWED_ATTR: [...BASE_ALLOWED_ATTR, 'id', 'width', 'height', 'style'],
  FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'button'],
  FORBID_ATTR: ['on*', 'srcdoc', 'lowsrc', 'dynsrc'],
}

// Simplified config for inline content
const DOMPURIFY_INLINE_CONFIG = {
  ...DOMPURIFY_BASE,
  ALLOWED_TAGS: [...BASE_ALLOWED_TAGS],
  ALLOWED_ATTR: [...BASE_ALLOWED_ATTR],
}

interface BlogContentProps {
  content: string
  contentType: ContentType
  className?: string
  allowCopy?: boolean
}

export function BlogPostArticle({
  content,
  contentType = ContentType.MARKDOWN,
  className,
  allowCopy = true
}: BlogContentProps) {
  const { theme } = useTheme()
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  // Markdown to HTML conversion with XSS protection
  const parseMarkdown = (markdown: string): string => {
      // SECURITY: Escape HTML entities first to prevent XSS
      let html = escapeHtml(markdown)

      // Headers
      html = html.replace(/^### (.*$)/gim, '<h3 class="typography-large mt-6 mb-3 text-foreground dark:text-white">$1</h3>')
      html = html.replace(/^## (.*$)/gim, '<h2 class="typography-h4 mt-8 mb-4 text-foreground dark:text-white">$1</h2>')
      html = html.replace(/^# (.*$)/gim, '<h1 class="typography-h3 mt-10 mb-6 text-foreground dark:text-white">$1</h1>')

      // Bold
      html = html.replace(/\*\*(.*)\*\*/gim, '<strong class="font-semibold">$1</strong>')
      html = html.replace(/__(.*)__/gim, '<strong class="font-semibold">$1</strong>')

      // Italic
      html = html.replace(/\*(.*)\*/gim, '<em class="italic">$1</em>')
      html = html.replace(/_(.*)_/gim, '<em class="italic">$1</em>')

      // Code blocks
      html = html.replace(/```(\w+)?\n([\s\S]*?)```/gim, (_match: string, lang: string, code: string) => {
        return `<pre data-language="${lang || 'text'}"><code>${code.trim()}</code></pre>`
      })

      // Inline code
      html = html.replace(/`([^`]+)`/gim, '<code class="px-1.5 py-0.5 bg-muted dark:bg-card rounded-xs text-sm font-mono">$1</code>')

      // Links - with URL validation
      html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, (_match, text, url) => {
        // Only allow safe URLs
        const isExternalUrl = url.startsWith('http') || url.startsWith('mailto:')
        const isRelativeUrl = url.startsWith('/')
        if (!isExternalUrl && !isRelativeUrl) {
          return text // Just return text if URL looks suspicious
        }
        return `<a href="${escapeHtml(url)}" class="text-primary dark:text-primary hover:underline" target="_blank" rel="noopener noreferrer">${text} <svg class="inline w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg></a>`
      })

      // Images
      html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" class="rounded-lg my-4 max-w-full h-auto" loading="lazy" />')

      // Lists
      html = html.replace(/^\* (.*$)/gim, '<li class="ml-4">$1</li>')
      html = html.replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>')

      // Blockquotes
      html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-primary pl-4 py-2 my-4 bg-primary/5 dark:bg-primary-bg italic text-muted-foreground dark:text-muted-foreground">$1</blockquote>')

      // Line breaks
      html = html.replace(/\n\n/gim, '</p><p class="mb-4 text-muted-foreground dark:typography-muted">')
      html = html.replace(/\n/gim, '<br />')

      // Wrap in paragraphs
      html = `<p class="mb-4 text-muted-foreground dark:typography-muted">${html}</p>`

      return html
    }

  // Copy code functionality
  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(code)
      setTimeout(() => setCopiedCode(null), TIMING_CONSTANTS.CLIPBOARD_COPY_DISPLAY)
    } catch (err) {
      logger.error('Failed to copy code', err instanceof Error ? err : new Error(String(err)))
    }
  }

  // Custom code block component
  const CodeBlock: React.FC<{
    children: string
    className?: string
    language?: string
  }> = ({ children, className, language = 'text' }) => {
    const codeString = String(children).replace(/\n$/, '')

    return (
      <div className={cn("relative group my-6", className)}>
        {allowCopy && (
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-black/50 hover:bg-black/70 text-white"
            onClick={() => copyToClipboard(codeString)}
          >
            {copiedCode === codeString ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        )}
        <pre className={cn(
          "rounded-lg text-sm p-4 overflow-x-auto",
          theme === 'dark' ? 'bg-background text-foreground' : 'bg-muted text-foreground'
        )}>
          <code className={`language-${language}`}>
            {codeString}
          </code>
        </pre>
      </div>
    )
  }

  // Helper to sanitize HTML content (no-op during SSR, sanitized on client)
  function sanitizeHtml(html: string, config: typeof DOMPURIFY_CONFIG | typeof DOMPURIFY_INLINE_CONFIG): string {
    if (typeof window === 'undefined') return html
    return DOMPurify.sanitize(html, config)
  }

  // Extract and render code blocks for markdown
  function renderMarkdownWithCodeBlocks(html: string): React.ReactNode[] {
    const parts = html.split(/(<pre data-language="([^"]*?)"><code>([\s\S]*?)<\/code><\/pre>)/g)

    return parts.map((part, index) => {
      const codeBlockMatch = part.match(/^<pre data-language="([^"]*?)"><code>([\s\S]*?)<\/code><\/pre>$/)

      if (codeBlockMatch) {
        const [, language, code] = codeBlockMatch
        return (
          <CodeBlock key={index} language={language || 'text'} className="my-6">{code || ''}</CodeBlock>
        )
      }

      return (
        <div
          key={index}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(part, DOMPURIFY_INLINE_CONFIG) }}
          className="prose prose-lg dark:prose-invert max-w-none"
        />
      )
    })
  }

  // Process content: parse markdown if needed, sanitize for non-markdown content
  const processedContent = contentType === 'MARKDOWN' ? parseMarkdown(content) : content
  const sanitizedContent = sanitizeHtml(processedContent, DOMPURIFY_CONFIG)

  return (
    <div
      className={cn(
        'blog-content animate-fade-in-up',
        'prose prose-lg dark:prose-invert max-w-none',
        'prose-headings:font-bold prose-headings:text-foreground dark:prose-headings:text-white',
        'prose-p:text-muted-foreground dark:prose-p:text-muted-foreground prose-p:leading-relaxed',
        'prose-a:text-primary dark:prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
        'prose-strong:text-foreground dark:prose-strong:text-white prose-strong:font-semibold',
        'prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:bg-muted dark:prose-code:bg-card prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded',
        'prose-blockquote:border-l-blue-500 prose-blockquote:bg-primary/5 dark:prose-blockquote:bg-primary-bg prose-blockquote:text-muted-foreground dark:prose-blockquote:text-muted-foreground',
        'prose-ul:text-muted-foreground dark:prose-ul:text-muted-foreground prose-ol:text-muted-foreground dark:prose-ol:text-muted-foreground',
        'prose-li:text-muted-foreground dark:prose-li:text-muted-foreground',
        'prose-img:rounded-lg prose-img:shadow-lg',
        className
      )}
    >
      {contentType === 'MARKDOWN' ? (
        renderMarkdownWithCodeBlocks(processedContent)
      ) : (
        <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
      )}
    </div>
  )
}
