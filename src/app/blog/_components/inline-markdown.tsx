'use client'

const INLINE_MARKDOWN_PATTERN = /(\*\*[^*]+?\*\*|__[^_]+?__|\*[^*]+?\*|_[^_]+?_)/g

interface InlineMarkdownProps {
  value: string
}

export function InlineMarkdown({ value }: InlineMarkdownProps) {
  const tokens = value.split(INLINE_MARKDOWN_PATTERN)

  return (
    <>
      {tokens.map((token, index) => {
        if (
          (token.startsWith('**') && token.endsWith('**')) ||
          (token.startsWith('__') && token.endsWith('__'))
        ) {
          const content = token.slice(2, -2)
          return (
            <strong key={`${token}-${index}`} className="font-semibold text-foreground">
              {content}
            </strong>
          )
        }

        if (
          (token.startsWith('*') && token.endsWith('*')) ||
          (token.startsWith('_') && token.endsWith('_'))
        ) {
          const content = token.slice(1, -1)
          return (
            <em key={`${token}-${index}`} className="italic">
              {content}
            </em>
          )
        }

        const normalizedToken = token.replace(/\*\*/g, '').replace(/__/g, '')
        return <span key={`${token}-${index}`}>{normalizedToken}</span>
      })}
    </>
  )
}
