import { ReservationForm } from '@/components/reservations/reservation-form'
import { Eyebrow, Placeholder } from '@/components/site/primitives'
import { getSiteState } from '@/lib/server-data'
import { telHref } from '@/lib/site-config'

export default async function ReservationsPage() {
  const { site } = await getSiteState()
  const tel = telHref(site.contact.phone)

  return (
    <div className="bg-background pt-28 md:pt-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 pb-24 md:grid-cols-12 md:gap-16 md:px-8 md:pb-32">
        <aside className="md:col-span-5">
          <div className="md:sticky md:top-32">
            <Eyebrow>Reservations</Eyebrow>
            <h1 className="mt-5 text-balance font-serif text-5xl leading-[1.02] md:text-7xl">
              Request <em className="text-olive">a table</em>
            </h1>
            <p className="mt-6 max-w-md text-pretty leading-relaxed text-muted-foreground">
              Tell us when you would like to join us and how many will be at the table. Requests are confirmed by the
              restaurant — there is no live availability on this website.
            </p>
            <div className="arch relative mt-10 hidden aspect-[4/5] max-w-sm overflow-hidden md:block">
              <img
                src="/images/interior.png"
                alt="Warm restaurant interior with arched alcoves and brass lamps"
                className="object-cover absolute inset-0 h-full w-full" />
            </div>
            <p className="mt-8 text-sm text-muted-foreground">
              Prefer to call?{' '}
              {site.contact.phone && tel ? (
                <a href={tel} className="font-medium text-foreground underline decoration-champagne underline-offset-4">
                  {site.contact.phone}
                </a>
              ) : (
                <Placeholder>Phone number</Placeholder>
              )}
            </p>
          </div>
        </aside>
        <div className="md:col-span-7 md:pt-4">
          <ReservationForm />
        </div>
      </div>
    </div>
  )
}
