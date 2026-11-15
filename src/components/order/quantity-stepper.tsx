'use client'

import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 20,
  label,
  size = 'md',
}: {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  label: string
  size?: 'sm' | 'md'
}) {
  const button = cn(
    'inline-flex items-center justify-center rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-40',
    size === 'md' ? 'size-10' : 'size-8',
  )
  return (
    <div role="group" aria-label={label} className="inline-flex items-center gap-4">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={cn(button, 'border-foreground/30 text-foreground hover:border-olive hover:text-olive')}
      >
        <Minus className="size-4" aria-hidden="true" />
      </button>
      <span aria-live="polite" className="min-w-6 text-center text-sm font-semibold tabular-nums">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
        className={cn(button, 'border-olive bg-olive text-primary-foreground hover:bg-olive-deep')}
      >
        <Plus className="size-4" aria-hidden="true" />
      </button>
    </div>
  )
}
