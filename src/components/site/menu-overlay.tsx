'use client'

import Link from 'next/link'
import { forwardRef } from 'react'
import { ArrowUpRight, X } from 'lucide-react'
import { navigation } from '@/lib/site-config'
import { useSite } from '@/lib/site-context'
import { cn } from '@/lib/utils'
import { CtaLink, StarMark, Wordmark } from './primitives'

const EASE = 'cubic-bezier(0.77, 0, 0.18, 1)'

type MenuOverlayProps = {
  open: boolean
  pathname: string
  onClose: () => void
}

export const MenuOverlay = forwardRef<HTMLButtonElement, MenuOverlayProps>(function MenuOverlay(
  { open, pathname, onClose },
  closeButtonRef,
) {
  const { site } = useSite()
  const reveal = (delay: number) => ({
    transitionProperty: 'opacity, transform',
    transitionDuration: open ? '700ms' : '250ms',
    transitionTimingFunction: EASE,
    transitionDelay: open ? `${delay}ms` : '0ms',
  })

  return (
    <div
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      inert={!open}
      className="fixed inset-0 z-[60] overflow-hidden bg-background pattern-girih"
      style={{
        visibility: open ? 'visible' : 'hidden',
        transition: `visibility 0s linear ${open ? '0ms' : '900ms'}`,
      }}
    >
      <div className="grid h-full grid-rows-[auto_1fr] overflow-y-auto lg:grid-cols-[1fr_minmax(340px,32%)] lg:grid-rows-1">
        <nav
          aria-label="Primary"
          className="order-2 flex items-center px-6 py-10 sm:px-10 [@media(max-height:640px)]:py-4 lg:order-1 lg:justify-end lg:px-16"
        >
          <ul className="flex w-full flex-col gap-4 md:gap-6 lg:w-auto lg:items-end [@media(max-height:640px)]:gap-2">
            {navigation.map((item, index) => {
              const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
              return (
                <li
                  key={item.href}
                  className={cn(open ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0')}
                  style={reveal(550 + index * 80)}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={active ? 'page' : undefined}
                    className="group flex items-center justify-between gap-6 lg:justify-end lg:gap-10"
                  >
                    <span
                      className={cn(
                        'font-serif text-[clamp(3rem,6vw,5.25rem)] leading-none text-foreground transition-colors duration-300 group-hover:text-olive [@media(max-height:640px)]:text-5xl',
                        active && 'italic text-olive',
                      )}
                    >
                      {item.label}
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        'inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-all duration-300 group-hover:rotate-45 group-hover:border-olive group-hover:bg-olive group-hover:text-espresso-foreground md:size-16 xl:size-20 [@media(max-height:640px)]:size-12',
                        active && 'border-olive text-olive',
                      )}
                    >
                      <ArrowUpRight className="size-5" />
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <aside className="order-1 flex flex-col border-border px-6 pb-4 pt-6 sm:px-10 lg:order-2 lg:border-l lg:px-12 lg:pb-12 lg:pt-8">
          <div className="flex items-center justify-between lg:justify-end">
            <Link href="/" onClick={onClose} aria-label={`${site.name} — home`} className="lg:hidden">
              <Wordmark />
            </Link>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="group inline-flex items-center gap-3 py-2 text-sm font-semibold text-foreground"
            >
              Close
              <X
                className="size-8 stroke-[1.25] transition-transform duration-500 group-hover:rotate-90"
                aria-hidden="true"
              />
            </button>
          </div>

          <div
            className={cn(
              'mt-auto hidden flex-col gap-10 lg:flex',
              open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
            )}
            style={reveal(850)}
          >
            <div className="flex items-center gap-3 text-olive">
              <StarMark className="size-3" />
              <p className="eyebrow">{site.announcement}</p>
            </div>

            <div className="flex flex-col gap-2">
              <p className="eyebrow text-foreground">Address</p>
              <p className="text-lg font-medium leading-relaxed text-foreground">
                {site.contact.address ?? (
                  <span className="text-muted-foreground">Address to be confirmed</span>
                )}
              </p>
            </div>

            {site.hours && site.hours.length > 0 ? (
              <div className="flex flex-col gap-2">
                <p className="eyebrow text-foreground">Hours</p>
                <ul className="flex flex-col gap-1 text-foreground">
                  {site.hours.map((entry) => (
                    <li key={entry.days} className="flex justify-between gap-4">
                      <span>{entry.days}</span>
                      <span className="text-muted-foreground">{entry.hours}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {site.social.length > 0 ? (
              <ul className="flex flex-wrap gap-3">
                {site.social.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex rounded-full border border-border px-4 py-2 text-sm text-foreground transition-colors hover:border-olive hover:text-olive"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}

            <CtaLink href="/reservations" variant="olive" className="w-full">
              Reserve a Table
            </CtaLink>
          </div>
        </aside>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[-10%] top-0 flex h-[115%] items-center justify-center rounded-b-[50%_14%] bg-espresso"
        style={{
          transform: open ? 'translateY(-101%)' : 'translateY(0)',
          transition: `transform 900ms ${EASE} ${open ? '150ms' : '0ms'}`,
        }}
      >
        <div
          className={cn('transition-opacity duration-300', open ? 'opacity-0' : 'opacity-100')}
        >
          <Wordmark light />
        </div>
      </div>
    </div>
  )
})
