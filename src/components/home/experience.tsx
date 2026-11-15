import { StarMark } from '@/components/site/primitives'

const moments = [
  {
    title: 'For the gathering',
    body: 'Long tables for families, friends and colleagues — food arrives to be passed, shared and talked over.',
  },
  {
    title: 'For the pause',
    body: 'A quiet corner, a slow coffee, something sweet. The cafe is as much a part of Al Rauf as the kitchen.',
  },
  {
    title: 'For the occasion',
    body: 'Celebrations of every size deserve a setting that feels considered, warm and unhurried.',
  },
]

export function Experience() {
  return (
    <section
      aria-labelledby="experience-title"
      className="relative overflow-hidden bg-olive-deep py-24 text-espresso-foreground md:py-36"
    >
      <div className="pattern-girih pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 md:grid-cols-12 md:px-8">
        <div className="md:col-span-5">
          <p className="eyebrow flex items-center gap-3 text-champagne">
            <StarMark className="size-3.5" />
            The Experience
          </p>
          <h2 id="experience-title" className="mt-6 text-balance font-serif text-5xl leading-[1.02] md:text-6xl">
            An atmosphere made for <em className="text-champagne">staying longer</em>
          </h2>
          <ol className="mt-12 space-y-8">
            {moments.map((moment, index) => (
              <li
                key={moment.title}
                className="grid grid-cols-[auto_1fr] gap-6 border-t border-espresso-foreground/15 pt-6"
              >
                <span className="font-serif text-lg italic text-champagne">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="font-serif text-2xl">{moment.title}</h3>
                  <p className="mt-2 text-pretty text-sm leading-relaxed text-espresso-foreground/70">{moment.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="md:col-span-7 md:col-start-6">
          <div className="relative pb-16 pr-10 md:pb-20 md:pr-20">
            <figure className="relative aspect-[4/3] overflow-hidden">
              <img
                src="/images/sharing-table.png"
                alt="Concept image of friends passing plates across a table"
                className="object-cover absolute inset-0 h-full w-full" />
            </figure>
            <figure className="arch absolute bottom-0 right-0 aspect-[3/4] w-[38%] overflow-hidden border-[6px] border-olive-deep">
              <img
                src="/images/tea-detail.png"
                alt="Mint tea beside a brass teapot"
                className="object-cover absolute inset-0 h-full w-full" />
            </figure>
          </div>
          <blockquote className="mt-6 max-w-sm font-serif text-2xl italic leading-snug text-espresso-foreground/85 md:-mt-14">
            {'“Hospitality is the dish we hope every guest remembers.”'}
          </blockquote>
        </div>
      </div>
    </section>
  )
}
