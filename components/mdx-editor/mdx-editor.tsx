"use client"

import * as React from "react"
import type { MDXEditorMethods } from "@mdxeditor/editor"
import { MDXEditor as BaseMDXEditor } from "@mdxeditor/editor/MDXEditor"
import { headingsPlugin } from "@mdxeditor/editor/plugins/headings"
import { listsPlugin } from "@mdxeditor/editor/plugins/lists"
import { quotePlugin } from "@mdxeditor/editor/plugins/quote"
import { thematicBreakPlugin } from "@mdxeditor/editor/plugins/thematic-break"
import { markdownShortcutPlugin } from "@mdxeditor/editor/plugins/markdown-shortcut"
import { toolbarPlugin } from "@mdxeditor/editor/plugins/toolbar"
import { linkPlugin } from "@mdxeditor/editor/plugins/link"
import { linkDialogPlugin } from "@mdxeditor/editor/plugins/link-dialog"
import { imagePlugin } from "@mdxeditor/editor/plugins/image"
import { tablePlugin } from "@mdxeditor/editor/plugins/table"
import { codeBlockPlugin } from "@mdxeditor/editor/plugins/codeblock"
import { frontmatterPlugin } from "@mdxeditor/editor/plugins/frontmatter"
import { diffSourcePlugin } from "@mdxeditor/editor/plugins/diff-source"
import {
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  InsertCodeBlock,
  InsertFrontmatter,
  ViewMode,
} from "@mdxeditor/editor/plugins/toolbar"
import { uploadImage } from "@/lib/actions/upload"

interface MDXEditorProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  autoFocus?: boolean
  readOnly?: boolean
}

export function MDXEditor({ value, onChange, disabled, autoFocus, readOnly }: MDXEditorProps) {
  const ref = React.useRef<MDXEditorMethods>(null)

  // Image upload handler
  const imageUploadHandler = async (file: File) => {
    try {
      const imageUrl = await uploadImage(file)
      return imageUrl
    } catch (error) {
      console.error("Error uploading image:", error)
      throw error
    }
  }

  // Auto-save functionality
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (ref.current && !disabled && !readOnly) {
        const content = ref.current.getMarkdown()
        localStorage.setItem("mdx-editor-autosave", content)
      }
    }, 30000) // Auto-save every 30 seconds

    return () => clearInterval(interval)
  }, [disabled, readOnly])

  // Restore auto-saved content
  React.useEffect(() => {
    if (!value) {
      const savedContent = localStorage.getItem("mdx-editor-autosave")
      if (savedContent) {
        onChange(savedContent)
      }
    }
  }, [value, onChange])

  return (
    <div className="relative min-h-[500px] w-full rounded-md border">
      <BaseMDXEditor
        ref={ref}
        markdown={value}
        onChange={onChange}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          imagePlugin({
            imageUploadHandler,
          }),
          tablePlugin(),
          codeBlockPlugin({
            defaultCodeBlockLanguage: "typescript",
          }),
          frontmatterPlugin(),
          diffSourcePlugin(),
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <UndoRedo />
                <BoldItalicUnderlineToggles />
                <BlockTypeSelect />
                <CreateLink />
                <InsertImage />
                <InsertTable />
                <InsertThematicBreak />
                <InsertCodeBlock />
                <InsertFrontmatter />
                <ViewMode />
              </>
            ),
          }),
        ]}
        contentEditableClassName="prose dark:prose-invert max-w-none px-4 py-4"
        readOnly={readOnly || disabled}
        autoFocus={autoFocus}
      />
    </div>
  )
}

