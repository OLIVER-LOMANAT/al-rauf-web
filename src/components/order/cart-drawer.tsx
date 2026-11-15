'use client'

import { useRef } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { ConciergeBell, Trash2, X } from 'lucide-react'
import { MAX_LINE_QUANTITY, useCart } from '@/lib/cart'
import { formatPrice } from '@/lib/menu-data'
import { useModal } from '@/lib/use-modal'
import { useIsClient } from '@/lib/use-is-client'
import { cn } from '@/lib/utils'
import { ctaBase } from '@/components/site/primitives'
import { QuantityStepper } from './quantity-stepper'

export function CartDrawer() {
  const { drawerOpen, closeDrawer, lines, count, subtotal, setQuantity, removeLine, mode } = useCart()
  const closeRef = useRef<HTMLButtonElement>(null)
  useModal(drawerOpen, closeDrawer, closeRef)
  const isClient = useIsClient()

  // The drawer attaches to <body>, which only exists in the browser. It is hidden until opened, so nothing is missed.
  if (!isClient) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[190]"
      inert={!drawerOpen}
      style={{ visibility: drawerOpen ? 'visible' : 'hidden', transition: `visibility 0s linear ${drawerOpen ? '0ms' : '500ms'}` }}
    >
      <div
        aria-hidden="true"
        onClick={closeDrawer}
        className={cn('absolute inset-0 bg-espresso/60 transition-opacity duration-500', drawerOpen ? 'opacity-100' : 'opacity-0')}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your order"
        className={cn(
          'absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-background shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.18,1)]',
          drawerOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <p className="eyebrow text-olive">{mode === 'delivery' ? 'Delivery order' : 'Pickup order'}</p>
            <h2 className="mt-1 font-serif text-3xl">Your order</h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={closeDrawer}
            className="inline-flex size-10 items-center justify-center rounded-full border border-border transition-colors hover:border-olive hover:text-olive"
          >
            <X className="size-4" aria-hidden="true" />
            <span className="sr-only">Close order</span>
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center pattern-girih">
            <span className="inline-flex size-16 items-center justify-center bg-champagne text-espresso">
              <ConciergeBell className="size-7" aria-hidden="true" />
            </span>
            <p className="mt-6 font-serif text-3xl">Your table is empty</p>
            <p className="mt-2 text-sm text-muted-foreground">Add a few dishes from the menu to get started.</p>
            <Link
              href="/menu"
              onClick={closeDrawer}
              className={cn(ctaBase, 'mt-8 bg-olive text-primary-foreground hover:bg-olive-deep')}
            >
              Browse the menu
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-border overflow-y-auto px-6">
              {lines.map((line) => (
                <li key={line.key} className="flex gap-4 py-5">
                  <div className="arch relative h-20 w-16 shrink-0 overflow-hidden bg-muted">
                    <img src={line.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-serif text-xl leading-tight">{line.name}</h3>
                      <button
                        type="button"
                        onClick={() => removeLine(line.key)}
                        className="text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                        <span className="sr-only">Remove {line.name}</span>
                      </button>
                    </div>
                    {line.selections.length > 0 ? (
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{line.selections.join(' · ')}</p>
                    ) : null}
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <QuantityStepper
                        size="sm"
                        value={line.quantity}
                        min={0}
                        max={MAX_LINE_QUANTITY}
                        onChange={(value) => setQuantity(line.key, value)}
                        label={`Quantity of ${line.name}`}
                      />
                      <span className="text-sm font-semibold tabular-nums">
                        {formatPrice(line.unitPrice * line.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-border bg-card px-6 py-5">
              <div className="flex items-baseline justify-between">
                <span className="eyebrow text-muted-foreground">
                  Subtotal · {count} {count === 1 ? 'item' : 'items'}
                </span>
                <span className="font-serif text-2xl tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">VAT included. Delivery fee calculated at checkout.</p>
              <Link
                href="/checkout"
                onClick={closeDrawer}
                className={cn(ctaBase, 'mt-5 w-full bg-olive text-primary-foreground hover:bg-olive-deep')}
              >
                Checkout · {formatPrice(subtotal)}
              </Link>
              <button
                type="button"
                onClick={closeDrawer}
                className="mt-3 w-full py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-olive"
              >
                Keep browsing
              </button>
            </div>
          </>
        )}
      </aside>
    </div>,
    document.body,
  )
}
