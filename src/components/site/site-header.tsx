'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useSite } from '@/lib/site-context'
import { cn } from '@/lib/utils'
import { CtaLink, StarMark, Wordmark } from './primitives'
import { MenuOverlay } from './menu-overlay'
import { OrderControls } from '@/components/order/order-controls'

export function SiteHeader() {
  const darkHeroRoutes = ['/', '/menu', '/gallery', '/contact']
  const pathname = usePathname()
  const { site } = useSite()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [lastPath, setLastPath] = useState(pathname)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  if (pathname !== lastPath) {
    setLastPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus({ preventScroll: true })
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  function closeMenu() {
    setOpen(false)
    menuButtonRef.current?.focus({ preventScroll: true })
  }

  const hasDarkHero = darkHeroRoutes.includes(pathname)
  const solid = scrolled || !hasDarkHero

  return (
    <>
      <div
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-transform duration-500',
          scrolled ? '-translate-y-9' : 'translate-y-0',
        )}
      >
        <div className="flex h-9 items-center justify-center gap-3 bg-espresso text-champagne">
          <StarMark className="size-3" />
          <p className="eyebrow text-[0.62rem]">{site.announcement}</p>
          <StarMark className="size-3" />
        </div>

        <header
          className={cn(
            'border-b transition-colors duration-500',
            solid
              ? 'border-border bg-background/95 backdrop-blur-sm'
              : 'border-espresso-foreground/15 bg-transparent',
          )}
        >
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-5 md:px-8">
            <Link href="/" aria-label={`${site.name} — home`} className="shrink-0">
              <Wordmark light={!solid} />
            </Link>

            <div className="flex items-center gap-4 md:gap-6">
              <CtaLink
                href="/reservations"
                variant={solid ? 'olive' : 'solid'}
                className="hidden px-5 py-3 lg:inline-flex"
              >
                Reserve a Table
              </CtaLink>
              <OrderControls solid={solid} />
              <button
                ref={menuButtonRef}
                type="button"
                onClick={() => setOpen(true)}
                aria-expanded={open}
                aria-controls="site-menu"
                aria-haspopup="dialog"
                className={cn(
                  'group inline-flex items-center gap-3 py-2 text-sm font-semibold transition-colors',
                  solid ? 'text-foreground hover:text-olive' : 'text-espresso-foreground hover:text-champagne',
                )}
              >
                <span>Open</span>
                <span aria-hidden="true" className="flex w-8 flex-col items-end gap-1.5">
                  <span className="h-0.5 w-full bg-current transition-all duration-300" />
                  <span className="h-0.5 w-full bg-current transition-all duration-300 group-hover:w-1/2" />
                </span>
                <span className="sr-only">menu</span>
              </button>
            </div>
          </div>
        </header>
      </div>

      <MenuOverlay ref={closeButtonRef} open={open} pathname={pathname} onClose={closeMenu} />
    </>
  )
}
