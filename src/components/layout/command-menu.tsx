'use client'

import React, { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { DialogProps } from '@radix-ui/react-dialog'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/command'
import { asRoute } from '@/lib/utils/route-utils'
import { navConfig } from '@/lib/config/site'

export function CommandMenu({ ...props }: DialogProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const runCommand = useCallback(
    (command: () => unknown) => {
      setOpen(false)
      command()
    },
    [setOpen]
  )

  return (
    <>
      <Button
        variant="outline"
        className="relative size-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
        onClick={() => setOpen(true)}
        {...props}
      >
        <Search className="size-4 xl:mr-2" />
        <span className="hidden xl:inline-flex">Search...</span>
        <span className="sr-only">Search</span>
        <kbd className="bg-muted pointer-events-none absolute top-2 right-1.5 hidden h-6 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none xl:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Pages">
          {navConfig.mainNav.map((item: { href: string; title: string }) => (
            <CommandItem
              key={item.href}
              value={item.title}
              onSelect={() => {
                runCommand(() => router.push(asRoute(item.href)))
              }}
            >
              {item.title}
            </CommandItem>
          ))}
        </CommandGroup>
        {navConfig.footerNav.resources && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Resources">
              {navConfig.footerNav.resources.map((item: { href: string; title: string }) => (
                <CommandItem
                  key={item.href}
                  value={item.title}
                  onSelect={() => {
                    runCommand(() => router.push(asRoute(item.href)))
                  }}
                >
                  {item.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandDialog>
    </>
  )
}
