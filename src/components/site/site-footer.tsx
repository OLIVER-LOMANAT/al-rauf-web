import Link from 'next/link'
import { navigation, telHref } from '@/lib/site-config'
import { getSiteState } from '@/lib/server-data'
import { CtaLink, OrnamentRule, Placeholder, Wordmark } from './primitives'

export async function SiteFooter() {
  const { site } = await getSiteState()
  const year = new Date().getFullYear()
  const phone = site.contact.phone
  const tel = telHref(phone)

  return (
    <footer className="relative overflow-hidden bg-olive-deep text-espresso-foreground">
      <div className="pattern-girih pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-20 md:px-8">
        <div className="flex flex-col items-start justify-between gap-8 border-b border-espresso-foreground/15 pb-14 md:flex-row md:items-end">
          <h2 className="max-w-xl text-balance font-serif text-4xl leading-tight md:text-5xl">
            Come hungry. <em className="text-champagne">Stay a while.</em>
          </h2>
          <CtaLink href="/reservations">Reserve a Table</CtaLink>
        </div>

        <div className="grid gap-12 py-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <Wordmark light />
            <p className="mt-6 max-w-sm text-pretty text-sm leading-relaxed text-espresso-foreground/70">
              A cafe and restaurant built around shared plates, good coffee and the simple pleasure of being welcomed.
            </p>
          </div>

          <nav aria-label="Footer" className="md:col-span-3">
            <h3 className="eyebrow text-champagne">Explore</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-espresso-foreground/80 transition-colors hover:text-champagne">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/reservations" className="text-espresso-foreground/80 transition-colors hover:text-champagne">
                  Reservations
                </Link>
              </li>
            </ul>
          </nav>

          <div className="md:col-span-4">
            <h3 className="eyebrow text-champagne">Visit</h3>
            <ul className="mt-5 space-y-3 text-sm text-espresso-foreground/80">
              <li>{site.contact.address ?? <Placeholder>Street address</Placeholder>}</li>
              <li>
                {phone && tel ? (
                  <a href={tel} className="hover:text-champagne">
                    {phone}
                  </a>
                ) : (
                  <Placeholder>Phone number</Placeholder>
                )}
              </li>
              <li>
                {site.social.length > 0 ? (
                  <span className="flex flex-wrap gap-4">
                    {site.social.map((social) => (
                      <a key={social.href} href={social.href} className="hover:text-champagne" target="_blank" rel="noreferrer">
                        {social.label}
                      </a>
                    ))}
                  </span>
                ) : (
                  <Placeholder>Social media links</Placeholder>
                )}
              </li>
            </ul>
          </div>
        </div>

        <OrnamentRule />
        <div className="mt-8 flex flex-col justify-between gap-3 text-xs text-espresso-foreground/55 md:flex-row">
          <p>
            {'© '}
            {year} {site.name}. All rights reserved.
          </p>
          <p>Website concept — content and imagery are illustrative pending confirmation.</p>
        </div>
      </div>
    </footer>
  )
}
