import { CtaLink, StarMark } from '@/components/site/primitives'
import { VisitDetails } from '@/components/site/visit-details'

export function Visit() {
  return (
    <section aria-labelledby="visit-title" className="bg-espresso text-espresso-foreground">
      <div className="mx-auto grid max-w-7xl md:grid-cols-2">
        <div className="relative min-h-80 md:min-h-full">
          <img
            src="/images/coffee-pour.png"
            alt="Arabic coffee being poured from a brass dallah"
            className="object-cover absolute inset-0 h-full w-full" />
        </div>
        <div className="px-5 py-20 md:px-14 md:py-28">
          <p className="eyebrow flex items-center gap-3 text-champagne">
            <StarMark className="size-3.5" />
            Visit &amp; Reserve
          </p>
          <h2 id="visit-title" className="mt-6 text-balance font-serif text-5xl leading-[1.02] md:text-6xl">
            Your table is <em className="text-champagne">waiting</em>
          </h2>
          <VisitDetails className="mt-10" />
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <CtaLink href="/reservations">Reserve a Table</CtaLink>
            <CtaLink href="/contact" variant="outline-light">
              Contact &amp; Directions
            </CtaLink>
          </div>
        </div>
      </div>
    </section>
  )
}
