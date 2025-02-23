"use client"
import dynamic from "next/dynamic"

// Import MDXEditor dynamically to avoid SSR issues
const MDXEditorComponent = dynamic(() => import("./mdx-editor-component"), { ssr: false })

interface EditorProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function MDXEditor({ value, onChange, disabled }: EditorProps) {
  return (
    <div className="relative min-h-[500px] w-full rounded-md border">
      <MDXEditorComponent
        markdown={value}
        onChange={onChange}
        contentEditableClassName="prose dark:prose-invert max-w-none"
        disabled={disabled}
      />
    </div>
  )
}

