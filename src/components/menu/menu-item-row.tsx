'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { formatPrice, type MenuCategory, type MenuItem } from '@/lib/menu-data'
import { ItemOptionsDialog } from '@/components/order/item-options-dialog'

export function MenuItemRow({ item, category }: { item: MenuItem; category: MenuCategory }) {
  const [open, setOpen] = useState(false)
  return (
    <li className="py-5">
      <div className="flex items-baseline gap-4">
        <h3 className="font-serif text-2xl text-foreground">{item.name}</h3>
        {item.note ? <span className="eyebrow text-[0.58rem] text-olive">{item.note}</span> : null}
        <span className="mb-1.5 flex-1 border-b border-dotted border-foreground/25" aria-hidden="true" />
        <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {formatPrice(item.price)}
        </span>
      </div>
      <div className="mt-1.5 flex items-start justify-between gap-6">
        <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          className="inline-flex shrink-0 items-center gap-2 border border-olive px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-olive transition-colors hover:bg-olive hover:text-primary-foreground"
        >
          <Plus className="size-3.5" aria-hidden="true" />
          Add<span className="sr-only"> {item.name} to order</span>
        </button>
      </div>
      {open ? <ItemOptionsDialog item={item} category={category} onClose={() => setOpen(false)} /> : null}
    </li>
  )
}
