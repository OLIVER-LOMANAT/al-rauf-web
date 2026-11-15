'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bike, ChevronDown, ConciergeBell, ShoppingBag } from 'lucide-react'
import { useCart, type OrderMode } from '@/lib/cart'
import { cn } from '@/lib/utils'

const modes: { id: OrderMode; label: string; detail: string; Icon: typeof Bike }[] = [
  { id: 'delivery', label: 'Delivery', detail: 'Brought to your door', Icon: Bike },
  { id: 'pickup', label: 'Pickup', detail: 'Collect from the restaurant', Icon: ShoppingBag },
]

export function OrderControls({ solid }: { solid: boolean }) {
  const { count, mode, setMode, openDrawer } = useCart()
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const menuId = useId()
  const router = useRouter()

  useEffect(() => {
    if (!open) return
    const onPointer = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  function choose(next: OrderMode) {
    setMode(next)
    setOpen(false)
    router.push('/menu')
  }

  return (
    <div className="flex items-center gap-3 md:gap-4">
      <span aria-hidden="true" className={cn('hidden h-8 w-px md:block', solid ? 'bg-border' : 'bg-espresso-foreground/20')} />
      <div ref={wrapperRef} className="relative hidden md:block">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={menuId}
          className={cn(
            'inline-flex items-center gap-2 py-2 text-sm font-semibold transition-colors',
            solid ? 'text-foreground hover:text-olive' : 'text-espresso-foreground hover:text-champagne',
          )}
        >
          Order Now
          <ChevronDown className={cn('size-4 transition-transform duration-300', open && 'rotate-180')} aria-hidden="true" />
        </button>
        <div
          id={menuId}
          hidden={!open}
          className="animate-rise absolute right-0 top-full mt-3 w-72 border border-border bg-background p-2 shadow-xl"
        >
          <p className="eyebrow px-3 pb-2 pt-2 text-[0.6rem] text-muted-foreground">How would you like it?</p>
          <ul>
            {modes.map(({ id, label, detail, Icon }) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => choose(id)}
                  aria-current={mode === id ? 'true' : undefined}
                  className={cn(
                    'flex w-full items-center gap-4 px-3 py-3 text-left transition-colors hover:bg-secondary',
                    mode === id && 'bg-secondary',
                  )}
                >
                  <span className="inline-flex size-10 shrink-0 items-center justify-center bg-olive text-primary-foreground">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="flex-1">
                    <span className="block font-serif text-xl leading-tight text-foreground">{label}</span>
                    <span className="block text-xs text-muted-foreground">{detail}</span>
                  </span>
                  {mode === id ? <span className="size-2 rounded-full bg-olive" aria-hidden="true" /> : null}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        type="button"
        onClick={openDrawer}
        aria-haspopup="dialog"
        className="relative inline-flex size-12 items-center justify-center rounded-sm bg-champagne text-espresso transition-colors hover:bg-espresso-foreground"
      >
        <ConciergeBell className="size-6" aria-hidden="true" />
        <span className="sr-only">
          Open your order, {count} {count === 1 ? 'item' : 'items'}
        </span>
        {count > 0 ? (
          <span
            aria-hidden="true"
            className="absolute -right-1.5 -top-1.5 inline-flex min-w-5 items-center justify-center rounded-full bg-olive px-1 text-[0.65rem] font-bold leading-5 text-primary-foreground"
          >
            {count}
          </span>
        ) : null}
      </button>
    </div>
  )
}
