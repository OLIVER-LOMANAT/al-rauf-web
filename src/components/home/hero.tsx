import { CtaLink } from '@/components/site/primitives'
import { getSiteState } from '@/lib/server-data'
import { textFrom } from '@/lib/site-data'

export async function Hero() {
  const { content } = await getSiteState()
  const siteText = (key: string, fallback: string) => textFrom(content, key, fallback)
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-espresso text-espresso-foreground"
    >
      <img
        src="/images/hero-feast-full.png"
        alt="A tableed edge to edge with grilled skewers, saffron rice, hummus, salads, mezze and warm flatbread"
        className="animate-slow-zoom -z-10 object-cover object-center absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 -z-10 bg-espresso/70" aria-hidden="true" />
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.35),transparent_70%)]"
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-espresso/80 to-transparent" aria-hidden="true" />

      <div className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-5 pb-40 pt-36 md:px-8">
        <div className="flex max-w-3xl flex-col items-center text-center">
          <h1
            id="hero-title"
            className="animate-rise text-balance font-serif text-5xl font-normal leading-[0.95] sm:text-6xl lg:text-7xl"
          >
            {siteText('home.heroTitle', '') || (
              <>
                Where Flavour <em className="block font-light text-champagne">Meets Hospitality</em>
              </>
            )}
          </h1>
          <p className="animate-rise mt-6 max-w-md text-pretty text-sm leading-relaxed text-espresso-foreground/80 [animation-delay:120ms] md:text-base">
            {siteText(
              'home.heroSubtitle',
              'Discover a welcoming dining experience inspired by rich flavours, thoughtful preparation, and the pleasure of sharing a meal.',
            )}
          </p>
          <div className="animate-rise mt-8 flex flex-col gap-3 [animation-delay:240ms] sm:flex-row">
            <CtaLink href="/menu">Explore Our Menu</CtaLink>
            <CtaLink href="/reservations" variant="outline-light">
              Reserve a Table
            </CtaLink>
          </div>
        </div>
      </div>

      <div className="mx-auto hidden w-full max-w-7xl items-center justify-between border-t border-espresso-foreground/15 px-5 py-6 text-espresso-foreground/60 md:flex md:px-8">
        <p className="eyebrow text-[0.62rem]">Shared plates · Coffee · Gathering</p>
        <a href="#welcome" className="eyebrow flex items-center gap-3 text-[0.62rem] transition-colors hover:text-champagne">
          Scroll to discover
          <span aria-hidden="true" className="block h-px w-10 bg-current" />
        </a>
      </div>
    </section>
  )
}
