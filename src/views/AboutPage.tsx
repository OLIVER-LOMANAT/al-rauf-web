import { CtaLink, Eyebrow, OrnamentRule, Placeholder, StarMark } from '@/components/site/primitives'

const principles = [
  {
    title: 'Welcome first',
    body: 'Every guest is greeted as someone expected — whether they come for a long dinner or a single cup of coffee.',
  },
  {
    title: 'Food for the middle of the table',
    body: 'Dishes designed to be passed, shared and returned to, so a meal becomes a conversation.',
  },
  {
    title: 'Care in the details',
    body: 'Thoughtful preparation and presentation, from the first plate to the last pour.',
  },
  {
    title: 'Time to linger',
    body: 'A cafe rhythm that never rushes you — stay for dessert, stay for another tea.',
  },
]

const ownerDetails = ['Founding story & year', 'Cuisine and culinary roots', 'The people behind the kitchen', 'Values in their own words']

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-secondary pt-36 md:pt-44">
        <div className="pattern-girih pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="relative mx-auto max-w-5xl px-5 text-center md:px-8">
          <Eyebrow className="justify-center">Our Story</Eyebrow>
          <h1 className="animate-rise mt-6 text-balance font-serif text-6xl leading-[0.98] md:text-8xl">
            Hospitality is <em className="text-olive">the heart</em> of the house
          </h1>
          <p className="mx-auto mt-8 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            This page outlines the hospitality philosophy proposed for Al Rauf. The restaurant&apos;s own history and
            voice will take its place once shared by the owners.
          </p>
        </div>
        <div className="relative mx-auto mt-16 max-w-6xl px-5 md:px-8">
          <div className="arch relative mx-auto aspect-[16/9] overflow-hidden md:aspect-[21/9]">
            <img
              src="/images/interior.png"
              alt="Concept image of a warm restaurant interior with arched alcoves"
              className="object-cover absolute inset-0 h-full w-full" />
          </div>
        </div>
      </section>

      <section aria-labelledby="principles-title" className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Eyebrow>Philosophy</Eyebrow>
            <h2 id="principles-title" className="mt-5 text-balance font-serif text-4xl md:text-5xl">
              Four ideas we would build the welcome around
            </h2>
          </div>
          <ol className="grid gap-x-12 gap-y-14 sm:grid-cols-2 md:col-span-8">
            {principles.map((principle, index) => (
              <li key={principle.title}>
                <span className="font-serif text-6xl italic leading-none text-champagne">{index + 1}</span>
                <h3 className="mt-4 font-serif text-3xl">{principle.title}</h3>
                <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">{principle.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="owner-title" className="bg-espresso py-24 text-espresso-foreground md:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 md:grid-cols-2 md:px-8">
          <div className="relative aspect-[4/5] overflow-hidden">
            <img
              src="/images/bread.png"
              alt="Freshly baked flatbread"
              className="object-cover absolute inset-0 h-full w-full" />
          </div>
          <div>
            <p className="eyebrow flex items-center gap-3 text-champagne">
              <StarMark className="size-3.5" />
              In their words
            </p>
            <h2 id="owner-title" className="mt-5 text-balance font-serif text-4xl md:text-5xl">
              A space reserved for the Al Rauf story
            </h2>
            <p className="mt-6 max-w-md text-pretty leading-relaxed text-espresso-foreground/70">
              We have deliberately left this chapter unwritten. Once the owners share it, this section will hold the
              real story of the restaurant.
            </p>
            <OrnamentRule className="my-10 max-w-md" />
            <ul className="space-y-4 text-espresso-foreground/85">
              {ownerDetails.map((detail) => (
                <li key={detail}>
                  <Placeholder>{detail}</Placeholder>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-24 text-center">
        <h2 className="mx-auto max-w-2xl text-balance font-serif text-4xl md:text-5xl">
          The best way to know a place is to sit at its table.
        </h2>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <CtaLink href="/reservations" variant="olive">
            Reserve a Table
          </CtaLink>
          <CtaLink href="/menu" variant="outline-dark">
            Explore the Menu
          </CtaLink>
        </div>
      </section>
    </>
  )
}
