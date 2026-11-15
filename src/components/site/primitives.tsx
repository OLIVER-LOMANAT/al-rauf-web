import Link from 'next/link'
import { cn } from '@/lib/utils'

type CtaVariant = 'solid' | 'outline-light' | 'outline-dark' | 'olive'

const ctaStyles: Record<CtaVariant, string> = {
  solid: 'bg-champagne text-espresso hover:bg-espresso-foreground',
  olive: 'bg-olive text-primary-foreground hover:bg-olive-deep',
  'outline-light': 'border border-espresso-foreground/40 text-espresso-foreground hover:border-champagne hover:text-champagne',
  'outline-dark': 'border border-foreground/30 text-foreground hover:border-olive hover:text-olive',
}

export const ctaBase =
  'inline-flex items-center justify-center gap-3 px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] transition-colors duration-300'

export function CtaLink({
  href,
  variant = 'solid',
  className,
  children,
}: {
  href: string
  variant?: CtaVariant
  className?: string
  children: React.ReactNode
}) {
  return (
    <Link href={href} className={cn(ctaBase, ctaStyles[variant], className)}>
      {children}
    </Link>
  )
}

export function TextLink({
  href,
  className,
  children,
}: {
  href: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em]',
        className,
      )}
    >
      <span className="border-b border-current pb-1">{children}</span>
      <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
        {'→'}
      </span>
    </Link>
  )
}

/** Eight-point star built from two squares — the recurring Al Rauf mark. */
export function StarMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn('size-4', className)} fill="none" stroke="currentColor" strokeWidth="1">
      <rect x="5" y="5" width="14" height="14" />
      <rect x="5" y="5" width="14" height="14" transform="rotate(45 12 12)" />
    </svg>
  )
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('eyebrow flex items-center gap-3 text-olive', className)}>
      <StarMark className="size-3.5" />
      {children}
    </p>
  )
}

export function OrnamentRule({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-4 text-champagne', className)} aria-hidden="true">
      <span className="h-px flex-1 bg-current opacity-50" />
      <StarMark className="size-3.5" />
      <span className="h-px flex-1 bg-current opacity-50" />
    </div>
  )
}

/** Visible marker for any unverified business detail. */
export function Placeholder({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2 italic opacity-70', className)}>
      <span className="not-italic eyebrow rounded-sm border border-current px-1.5 py-0.5 text-[0.55rem]">TBC</span>
      {children}
    </span>
  )
}

export function Wordmark({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <span className={cn('flex flex-col leading-none', className)}>
      <span className={cn('font-serif text-2xl font-medium tracking-wide md:text-[1.7rem]', light ? 'text-espresso-foreground' : 'text-foreground')}>
        Al Rauf
      </span>
      <span className={cn('mt-1 text-[0.55rem] font-semibold uppercase tracking-[0.42em]', light ? 'text-champagne' : 'text-olive')}>
        Cafe · Restaurant
      </span>
    </span>
  )
}
