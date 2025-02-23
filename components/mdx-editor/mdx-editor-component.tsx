"use client"

import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  tablePlugin,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  imageUploadPlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  Separator,
  InsertTable,
  InsertThematicBreak,
  CreateLink,
  InsertImage,
  InsertCodeBlock,
  ListsToggle,
  BlockTypeSelect,
} from "@mdxeditor/editor"
import { uploadImage } from "@/lib/actions/upload"

interface EditorProps {
  markdown: string
  onChange: (value: string) => void
  disabled?: boolean
  contentEditableClassName?: string
}

export default function MDXEditorComponent({ markdown, onChange, disabled, contentEditableClassName }: EditorProps) {
  return (
    <MDXEditor
      markdown={markdown}
      onChange={onChange}
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        tablePlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        imagePlugin(),
        imageUploadPlugin({
          uploadImage: async (file) => {
            try {
              const url = await uploadImage(file)
              return url
            } catch (error) {
              console.error("Failed to upload image:", error)
              throw error
            }
          },
        }),
        codeBlockPlugin({ defaultCodeBlockLanguage: "typescript" }),
        codeMirrorPlugin({
          codeBlockLanguages: {
            typescript: "TypeScript",
            javascript: "JavaScript",
            jsx: "JSX",
            tsx: "TSX",
            html: "HTML",
            css: "CSS",
          },
        }),
        diffSourcePlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <UndoRedo />
              <Separator />
              <BoldItalicUnderlineToggles />
              <Separator />
              <ListsToggle />
              <Separator />
              <BlockTypeSelect />
              <Separator />
              <CreateLink />
              <InsertImage />
              <Separator />
              <InsertTable />
              <InsertThematicBreak />
              <InsertCodeBlock />
            </>
          ),
        }),
      ]}
      contentEditableClassName={contentEditableClassName}
      readOnly={disabled}
    />
  )
}

