import { MapPin } from 'lucide-react'
import { PageHero } from '@/components/site/page-hero'
import { CtaLink, Eyebrow, Placeholder } from '@/components/site/primitives'
import { VisitDetails } from '@/components/site/visit-details'
import { getSiteState } from '@/lib/server-data'
import { directionsHref } from '@/lib/site-config'

export default async function ContactPage() {
  const { site } = await getSiteState()
  const directions = directionsHref(site.contact)

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Come and <em className="text-champagne">find us</em>
          </>
        }
        image="/images/coffee-pour.png"
        imageAlt="Arabic coffee being poured"
      />
      <section className="mx-auto grid max-w-7xl gap-14 px-5 py-20 md:grid-cols-12 md:px-8 md:py-28">
        <div className="md:col-span-5">
          <Eyebrow>Visit</Eyebrow>
          <h2 className="mt-5 font-serif text-4xl md:text-5xl">Details &amp; directions</h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Items marked <span className="eyebrow border border-current px-1 text-[0.55rem]">TBC</span> are placeholders
            awaiting verified information from the restaurant.
          </p>
          <VisitDetails className="mt-10 text-foreground" />
          <CtaLink href="/reservations" variant="olive" className="mt-10">
            Reserve a Table
          </CtaLink>
        </div>
        <div className="md:col-span-7">
          <div className="pattern-girih relative flex aspect-[4/3] items-center justify-center overflow-hidden border border-border bg-secondary">
            <div className="flex flex-col items-center gap-4 bg-background/90 px-8 py-8 text-center">
              <MapPin className="size-7 text-olive" aria-hidden="true" />
              {directions ? (
                <CtaLink href={directions} variant="outline-dark">
                  Open in Maps
                </CtaLink>
              ) : (
                <>
                  <p className="font-serif text-2xl">Map coming soon</p>
                  <Placeholder className="text-sm">Add verified location to enable directions</Placeholder>
                </>
              )}
              {site.contact.address ? <p className="text-sm text-muted-foreground">{site.contact.address}</p> : null}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
