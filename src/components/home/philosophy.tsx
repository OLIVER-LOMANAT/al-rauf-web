import { Eyebrow, StarMark, TextLink } from '@/components/site/primitives'

const principles = [
  { title: 'Flavour first', body: 'Dishes built on aromatic spice, slow cooking and ingredients treated with care.' },
  { title: 'Made to share', body: 'Plates designed for the middle of the table, so every meal becomes a conversation.' },
  { title: 'Hospitality always', body: 'A warm welcome, attentive service and the feeling that there is no rush to leave.' },
]

export function Philosophy() {
  return (
    <section aria-labelledby="philosophy-title" className="relative overflow-hidden bg-limestone py-24 md:py-32">
      <div className="pattern-girih pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Eyebrow>Our Philosophy</Eyebrow>
            <h2 id="philosophy-title" className="mt-6 text-balance font-serif text-5xl leading-[1.02] md:text-6xl">
              Food is how we <em className="text-olive">welcome you</em>
            </h2>
            <p className="mt-8 max-w-md text-pretty leading-relaxed text-muted-foreground">
              Behind every plate is a simple belief: that a good meal should feel generous, honest and shared. That is
              the spirit Al Rauf is built around.
            </p>
            <TextLink href="/about" className="mt-10 text-olive">
              Read Our Story
            </TextLink>
          </div>

          <ul className="grid gap-px self-end bg-border md:col-span-7 md:grid-cols-3">
            {principles.map((principle) => (
              <li key={principle.title} className="bg-limestone p-7">
                <StarMark className="size-5 text-champagne" />
                <h3 className="mt-6 font-serif text-2xl">{principle.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{principle.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
