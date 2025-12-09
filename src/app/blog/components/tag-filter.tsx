'use client'

interface TagFilterProps {
  tags: string[]
  selectedTag: string
  tagCounts?: Record<string, number>
  onTagChange: (tag: string) => void
}

export function TagFilter({ tags, selectedTag, tagCounts, onTagChange }: TagFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagChange(tag)}
          className={`
            inline-flex items-center gap-2 px-4 py-2 rounded-full text-size-sm font-medium
            transition-all duration-300
            ${
              selectedTag === tag
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'bg-transparent text-muted-foreground border border-border hover:border-primary/50 hover:text-primary'
            }
          `}
        >
          <span>{tag}</span>
          {tagCounts?.[tag] !== undefined && (
            <span
              className={`
                text-size-xs px-2 py-0.5 rounded-md font-medium
                ${
                  selectedTag === tag
                    ? 'bg-primary/30 text-primary'
                    : 'bg-muted text-muted-foreground'
                }
              `}
            >
              {tagCounts[tag]}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
