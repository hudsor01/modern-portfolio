'use client'

import type React from 'react'
import { useState } from 'react'

import { Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { markdownToHtml, decodeHtmlEntities } from '@/lib/markdown'
// ContentType is a string union ('MARKDOWN' | 'HTML' | 'RICH_TEXT') in Drizzle;
// callers compare against the literal so we don't need a runtime enum here.
type ContentType = 'MARKDOWN' | 'HTML' | 'RICH_TEXT'
// Plain `dompurify` (browser-only). Module-load is side-effect-free —
// the factory only touches `window` when `.sanitize()` is called. We
// previously used `isomorphic-dompurify`, which pulled `jsdom` into the
// server bundle; under Next.js 16 / Turbopack production runtime, jsdom's
// `data/patch.json` lookup fails ("Cannot find module '../data/patch.json'
// from ''") and 500s every /blog/[slug] render. The `sanitizeHtml` helper
// below already gates the actual sanitize call on `typeof window`, so the
// server returns raw HTML (acceptable — blog content is from our own DB,
// not untrusted user input). Sanitization happens after hydration.
import DOMPurify from 'dompurify'
import { createContextLogger } from '@/lib/logger'
import { TIMING_CONSTANTS } from '@/lib/ui-thresholds'

const logger = createContextLogger('BlogContent')

// Base allowed tags for sanitization
const BASE_ALLOWED_TAGS = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'br',
  'em',
  'strong',
  'a',
  'code',
  'pre',
  'blockquote',
  'ul',
  'ol',
  'li',
  'img',
  'table',
  'thead',
  'tbody',
  'tr',
  'td',
  'th',
  'div',
  'span',
] as const

// Base allowed attributes
const BASE_ALLOWED_ATTR = [
  'href',
  'src',
  'alt',
  'class',
  'data-language',
  'target',
  'rel',
  'loading',
] as const

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
  contentType = 'MARKDOWN',
  className,
  allowCopy = true,
}: BlogContentProps) {
  const { theme } = useTheme()
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

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
      <div className={cn('relative group my-6', className)}>
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
        <pre
          className={cn(
            'rounded-lg text-sm p-4 overflow-x-auto',
            theme === 'dark' ? 'bg-background text-foreground' : 'bg-muted text-foreground'
          )}
        >
          <code className={`language-${language}`}>{codeString}</code>
        </pre>
      </div>
    )
  }

  // Helper to sanitize HTML content (no-op during SSR, sanitized on client)
  function sanitizeHtml(
    html: string,
    config: typeof DOMPURIFY_CONFIG | typeof DOMPURIFY_INLINE_CONFIG
  ): string {
    if (typeof window === 'undefined') return html
    return DOMPurify.sanitize(html, config)
  }

  // Extract and render code blocks for markdown. `marked` emits
  // `<pre><code class="language-x">…</code></pre>` with the body HTML-escaped;
  // we split those out into the themed <CodeBlock> (copy button) and decode the
  // entities so React renders the original source rather than double-escaping.
  function renderMarkdownWithCodeBlocks(html: string): React.ReactNode[] {
    const parts = html.split(/(<pre><code(?: class="language-[\w-]+")?>[\s\S]*?<\/code><\/pre>)/g)

    return parts.map((part, index) => {
      const codeBlockMatch = part.match(
        /^<pre><code(?: class="language-([\w-]+)")?>([\s\S]*?)<\/code><\/pre>$/
      )

      if (codeBlockMatch) {
        const [, language, code] = codeBlockMatch
        return (
          <CodeBlock key={index} language={language || 'text'} className="my-6">
            {decodeHtmlEntities(code || '')}
          </CodeBlock>
        )
      }

      return (
        <div
          key={index}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: blog HTML from trusted token-gated DB, sanitized client-side via DOMPurify
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(part, DOMPURIFY_INLINE_CONFIG) }}
          className="prose prose-lg dark:prose-invert max-w-none"
        />
      )
    })
  }

  // Process content: parse markdown if needed, sanitize for non-markdown content.
  // For HTML/RICH_TEXT content, defensively demote any in-body <h1> to <h2> so
  // we never get a double-h1 alongside the page title in blog-post-layout.tsx.
  // (Markdown content has its headings demoted by markdownToHtml.) Browser audit
  // surfaced this on `/blog/stop-using-generic-scripts...` — the post body
  // shipped with a literal <h1> matching the page title.
  const demoteH1 = (html: string): string =>
    html.replace(/<h1(\s[^>]*)?>/gi, '<h2$1>').replace(/<\/h1>/gi, '</h2>')
  const processedContent = contentType === 'MARKDOWN' ? markdownToHtml(content) : demoteH1(content)
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
        'prose-code:text-accent prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded',
        'prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:text-muted-foreground',
        'prose-ul:text-muted-foreground dark:prose-ul:text-muted-foreground prose-ol:text-muted-foreground dark:prose-ol:text-muted-foreground',
        'prose-li:text-muted-foreground dark:prose-li:text-muted-foreground',
        'prose-img:rounded-lg prose-img:shadow-lg',
        className
      )}
    >
      {contentType === 'MARKDOWN' ? (
        renderMarkdownWithCodeBlocks(processedContent)
      ) : (
        // biome-ignore lint/security/noDangerouslySetInnerHtml: blog HTML from trusted token-gated DB, sanitized client-side via DOMPurify
        <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
      )}
    </div>
  )
}
