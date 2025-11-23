import * as React from "react"
import { cn } from "@/lib/utils"

// Table Component optimized for blog content
interface BlogTableProps extends React.HTMLAttributes<HTMLDivElement> {
  data: Array<Record<string, string | number>>
  columns: Array<{
    key: string
    header: string
    width?: string
    align?: "left" | "center" | "right"
  }>
  caption?: string
}

export const BlogTable = React.forwardRef<HTMLDivElement, BlogTableProps>(
  ({ className, data, columns, caption, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("my-8 overflow-x-auto", className)}
        {...props}
      >
        <table className="w-full border-collapse border border-border rounded-lg overflow-hidden">
          {caption && (
            <caption className="mb-3 text-sm text-muted-foreground text-left font-medium">
              {caption}
            </caption>
          )}
          <thead>
            <tr className="bg-muted/50">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "border border-border px-4 py-3 text-sm font-medium text-foreground",
                    column.align === "center" && "text-center",
                    column.align === "right" && "text-right",
                  )}
                  style={{ width: column.width }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-muted/20 transition-colors">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      "border border-border px-4 py-3 text-sm text-foreground",
                      column.align === "center" && "text-center",
                      column.align === "right" && "text-right",
                    )}
                  >
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
)
BlogTable.displayName = "BlogTable"