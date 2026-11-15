'use client'

import { useEffect, type RefObject } from 'react'

/** Locks page scroll, focuses the given element and closes on Escape while `open` is true. */
export function useModal(open: boolean, onClose: () => void, focusRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    focusRef.current?.focus({ preventScroll: true })
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
      previouslyFocused?.focus?.({ preventScroll: true })
    }
  }, [open, onClose, focusRef])
}
