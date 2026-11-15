import { FullMenu } from '@/components/menu/full-menu'
import { IllustrativeNotice } from '@/components/menu/illustrative-notice'
import { PageHero } from '@/components/site/page-hero'
import { CtaLink } from '@/components/site/primitives'
import { getMenu } from '@/lib/server-data'

export default async function MenuPage() {
  const { categories, live } = await getMenu()

  return (
    <>
      <PageHero
        eyebrow="The Menu"
        title={
          <>
            Made to be <em className="text-champagne">shared</em>
          </>
        }
        intro={
          live
            ? 'Order online for pickup or delivery. Add dishes to your cart and check out when you are ready.'
            : "A first look at how the Al Rauf menu could be presented. Every dish and price below is an illustrative example awaiting the restaurant's confirmed menu."
        }
        image="/images/mezze.png"
        imageAlt="A spread of mezze dishes"
      />
      <div className="mx-auto max-w-7xl px-5 pt-12 md:px-8">
        {live ? (
          <p className="border border-olive/30 bg-card px-5 py-4 text-sm text-muted-foreground">
            Live menu from the restaurant — dishes and prices update when staff change them.
          </p>
        ) : (
          <IllustrativeNotice />
        )}
      </div>
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <FullMenu categories={categories} />
      </div>
      <section className="border-t border-border bg-secondary py-20 text-center">
        <h2 className="font-serif text-4xl md:text-5xl">Hungry already?</h2>
        <CtaLink href="/reservations" variant="olive" className="mt-8">
          Reserve a Table
        </CtaLink>
      </section>
    </>
  )
}
