'use client'

import { useState } from 'react'
import type { MenuCategory } from '@/lib/menu-data'
import { cn } from '@/lib/utils'
import { MenuItemRow } from './menu-item-row'

export function FullMenu({ categories }: { categories: MenuCategory[] }) {
  const [filter, setFilter] = useState<string>('all')
  const visible = filter === 'all' ? categories : categories.filter((category) => category.id === filter)
  const options = [{ id: 'all', label: 'All' }, ...categories.map(({ id, label }) => ({ id, label }))]

  return (
    <div>
      <div className="sticky top-[var(--header-offset,4.5rem)] z-20 -mx-5 border-b border-border bg-background/95 px-5 py-4 backdrop-blur md:mx-0 md:px-0">
        <div role="group" aria-label="Filter menu by category" className="flex gap-2 overflow-x-auto">
          {options.map((option) => {
            const pressed = filter === option.id
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={pressed}
                onClick={() => setFilter(option.id)}
                className={cn(
                  'shrink-0 border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-colors',
                  pressed
                    ? 'border-olive bg-olive text-primary-foreground'
                    : 'border-border text-muted-foreground hover:border-olive hover:text-foreground',
                )}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {filter === 'all' ? 'all categories' : visible[0]?.label}
      </p>

      <div className="divide-y divide-border">
        {visible.map((category, index) => (
          <section
            key={category.id}
            aria-labelledby={`menu-${category.id}`}
            className="animate-rise grid gap-10 py-16 md:grid-cols-12 md:gap-16 md:py-24"
          >
            <div className={cn('md:col-span-4', index % 2 === 1 && 'md:order-2 md:col-start-9')}>
              <div className="md:sticky md:top-40">
                <div className="arch relative aspect-[4/5] overflow-hidden bg-muted">
                  <img
                    src={category.image}
                    alt={category.imageAlt}
                    className="object-cover absolute inset-0 h-full w-full" />
                </div>
              </div>
            </div>
            <div className={cn('md:col-span-7', index % 2 === 1 ? 'md:order-1 md:col-start-1' : 'md:col-start-6')}>
              <p className="eyebrow text-olive">{String(categories.indexOf(category) + 1).padStart(2, '0')}</p>
              <h2 id={`menu-${category.id}`} className="mt-3 font-serif text-5xl md:text-6xl">
                {category.label}
              </h2>
              <p className="mt-4 font-serif text-2xl italic text-muted-foreground">{category.intro}</p>
              <ul className="mt-10 divide-y divide-border border-y border-border">
                {category.items.map((item) => (
                  <MenuItemRow key={item.id} item={item} category={category} />
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
