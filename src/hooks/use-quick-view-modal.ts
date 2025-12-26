import { useState, useCallback } from 'react'

interface UseQuickViewModalResult<T> {
  isOpen: boolean
  selectedItem: T | null
  open: (item: T) => void
  close: () => void
  setOpen: (isOpen: boolean) => void
}

/**
 * Hook for managing modal state with a selected item.
 * Combines the open/close state with the selected item state.
 */
export function useQuickViewModal<T>(): UseQuickViewModalResult<T> {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<T | null>(null)

  const open = useCallback((item: T) => {
    setSelectedItem(item)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setSelectedItem(null)
  }, [])

  const setOpen = useCallback(
    (open: boolean) => {
      setIsOpen(open)
      if (!open) {
        setSelectedItem(null)
      }
    },
    []
  )

  return {
    isOpen,
    selectedItem,
    open,
    close,
    setOpen,
  }
}
