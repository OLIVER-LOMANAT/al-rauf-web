import { Eyebrow, TextLink } from '@/components/site/primitives'
import { getSiteState } from '@/lib/server-data'
import { textFrom } from '@/lib/site-data'

export async function Introduction() {
  const { content } = await getSiteState()
  const siteText = (key: string, fallback: string) => textFrom(content, key, fallback)
  return (
    <section id="welcome" aria-labelledby="welcome-title" className="scroll-mt-24 bg-background py-24 md:py-36">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 md:grid-cols-12 md:gap-10 md:px-8">
        <div className="relative md:col-span-5">
          <div className="arch relative aspect-[4/5] overflow-hidden bg-muted">
            <img
              src="/images/interior.png"
              alt="Concept image of a warm dining room with arched alcoves and brass lamps"
              className="object-cover absolute inset-0 h-full w-full" />
          </div>
          <div className="arch absolute -inset-3 -z-0 border border-champagne/60 md:-inset-4" aria-hidden="true" />
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <Eyebrow>Welcome to Al Rauf</Eyebrow>
          <h2 id="welcome-title" className="mt-6 text-balance font-serif text-5xl leading-[1.02] md:text-7xl">
            {siteText('home.introTitle', '') || (
              <>
                More Than <em className="text-olive">a Meal.</em>
              </>
            )}
          </h2>
          <div className="mt-8 max-w-lg space-y-5 text-pretty leading-relaxed text-muted-foreground">
            {siteText('home.introText', '')
              ? siteText('home.introText', '')
                  .split(/\n\s*\n/)
                  .map((paragraph) => <p key={paragraph}>{paragraph}</p>)
              : (
                <>
                  <p>
                    Some meals are about eating. The best ones are about everything around the food — the conversation
                    that runs long, the plate passed across the table, the coffee that arrives just as the evening slows
                    down.
                  </p>
                  <p>
                    Al Rauf is imagined as that kind of place: a cafe for unhurried mornings and a restaurant for
                    generous evenings, where every guest is received like someone expected.
                  </p>
                </>
              )}
          </div>
          <dl className="mt-10 grid max-w-lg grid-cols-3 border-y border-border">
            {[
              ['Gather', 'Plates for sharing'],
              ['Linger', 'Coffee & conversation'],
              ['Welcome', 'Every guest received'],
            ].map(([term, detail]) => (
              <div key={term} className="border-r border-border py-5 pr-4 last:border-r-0 [&:not(:first-child)]:pl-4">
                <dt className="font-serif text-2xl text-foreground">{term}</dt>
                <dd className="mt-1 text-xs leading-snug text-muted-foreground">{detail}</dd>
              </div>
            ))}
          </dl>
          <TextLink href="/about" className="mt-10 text-olive">
            Discover Our Story
          </TextLink>
        </div>
      </div>
    </section>
  )
}
