import { useState } from 'react'
import type { UseQuickViewModalResult } from '@/types/hooks'

/**
 * Hook for managing modal state with a selected item.
 * Combines the open/close state with the selected item state.
 */
export function useQuickViewModal<T>(): UseQuickViewModalResult<T> {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<T | null>(null)

  const open = (item: T) => {
    setSelectedItem(item)
    setIsOpen(true)
  }

  const close = () => {
    setIsOpen(false)
    setSelectedItem(null)
  }

  const setOpen = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setSelectedItem(null)
    }
  }

  return {
    isOpen,
    selectedItem,
    open,
    close,
    setOpen,
  }
}
