'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export const fieldClass =
  'mt-2 block w-full border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-olive focus:outline-none focus:ring-0 aria-[invalid=true]:border-destructive'

export const labelClass = 'eyebrow text-[0.6rem] text-muted-foreground'

export function CheckoutCard({
  title,
  children,
  className,
  headingLevel = 'h2',
}: {
  title: string
  children: ReactNode
  className?: string
  headingLevel?: 'h2' | 'h3'
}) {
  const Heading = headingLevel
  return (
    <section className={cn('border border-border bg-card', className)}>
      <div className="border-b border-border px-6 py-5 md:px-8">
        <Heading className="font-serif text-2xl leading-none">{title}</Heading>
      </div>
      <div className="px-6 py-6 md:px-8">{children}</div>
    </section>
  )
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors',
        checked ? 'border-olive bg-olive' : 'border-border bg-muted',
      )}
    >
      <span className="sr-only">{label}</span>
      <span
        aria-hidden="true"
        className={cn(
          'inline-block size-4 rounded-full bg-background shadow transition-transform',
          checked ? 'translate-x-6' : 'translate-x-1',
        )}
      />
    </button>
  )
}
