'use client'

import { useRef, useState, type KeyboardEvent } from 'react'
import type { MenuCategory } from '@/lib/menu-data'
import { cn } from '@/lib/utils'
import { MenuItemRow } from './menu-item-row'

export function MenuTabs({ categories, idPrefix }: { categories: MenuCategory[]; idPrefix: string }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const active = categories[activeIndex]

  function onKeyDown(event: KeyboardEvent) {
    const last = categories.length - 1
    let next: number | null = null
    if (event.key === 'ArrowRight') next = activeIndex === last ? 0 : activeIndex + 1
    if (event.key === 'ArrowLeft') next = activeIndex === 0 ? last : activeIndex - 1
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = last
    if (next === null) return
    event.preventDefault()
    setActiveIndex(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Menu categories"
        onKeyDown={onKeyDown}
        className="-mx-5 flex gap-8 overflow-x-auto border-b border-border px-5 md:mx-0 md:justify-center md:gap-10 md:px-0"
      >
        {categories.map((category, index) => {
          const selected = index === activeIndex
          return (
            <button
              key={category.id}
              ref={(node) => {
                tabRefs.current[index] = node
              }}
              role="tab"
              type="button"
              id={`${idPrefix}-tab-${category.id}`}
              aria-selected={selected}
              aria-controls={`${idPrefix}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveIndex(index)}
              className={cn(
                '-mb-px shrink-0 whitespace-nowrap border-b-2 pb-4 font-serif text-xl transition-colors md:text-2xl',
                selected ? 'border-olive text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              {category.label}
            </button>
          )
        })}
      </div>

      <div
        id={`${idPrefix}-panel`}
        role="tabpanel"
        aria-labelledby={`${idPrefix}-tab-${active.id}`}
        className="mt-14 grid items-center gap-12 md:grid-cols-12 md:gap-16"
      >
        <div key={active.id} className="animate-rise relative md:col-span-5">
          <div className="relative aspect-square overflow-hidden rounded-full bg-muted">
            <img src={active.image} alt={active.imageAlt} className="object-cover absolute inset-0 h-full w-full" />
          </div>
          <div className="absolute -inset-4 rounded-full border border-dashed border-champagne/70" aria-hidden="true" />
        </div>

        <div className="md:col-span-7">
          <p className="font-serif text-2xl italic text-olive">{active.intro}</p>
          <ul className="mt-8 divide-y divide-border border-y border-border">
            {active.items.map((item) => (
              <MenuItemRow key={item.id} item={item} category={active} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
