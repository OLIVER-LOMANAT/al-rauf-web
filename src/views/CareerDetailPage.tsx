import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CtaLink, Eyebrow, OrnamentRule } from '@/components/site/primitives'
import { postedAgo } from '@/lib/careers-data'
import { getOpenJob, getSiteState } from '@/lib/server-data'

export default async function CareerDetailPage({ slug }: { slug: string }) {
  const { job, notFound } = await getOpenJob(slug)
  const { site } = await getSiteState()
  // A closed or unknown role sends the visitor back to the list, as before
  if (notFound) redirect('/careers')
  if (!job)
    return (
      <p className="px-5 pb-24 pt-44 text-center text-muted-foreground">
        We could not load this role right now. Please try again shortly.
      </p>
    )

  const sections = [
    { title: 'Job brief', items: job.brief },
    { title: 'Responsibilities', items: job.responsibilities },
    { title: 'Requirements', items: job.requirements },
  ]

  const applyHref = site.contact.email
    ? `mailto:${site.contact.email}?subject=${encodeURIComponent(`Application: ${job.title}`)}`
    : '/contact'

  return (
    <>
      <section className="relative overflow-hidden bg-secondary pb-16 pt-36 md:pb-20 md:pt-44">
        <div className="pattern-girih pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-5 md:px-8">
          <Link
            href="/careers"
            className="group inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground hover:text-olive"
          >
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-x-1">
              {'←'}
            </span>
            All openings
          </Link>
          <p className="mt-10 text-muted-foreground">{postedAgo(job.postedAt)}</p>
          <h1 className="animate-rise mt-3 text-balance font-serif text-6xl leading-[0.98] md:text-8xl">{job.title}</h1>
          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
            {[
              ['Department', job.department],
              ['Type', job.type],
              ['Location', job.location],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="eyebrow text-olive">{label}</dt>
                <dd className="mt-1 font-serif text-xl">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-label="Job details" className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-14 md:grid-cols-3 md:gap-0">
          {sections.map((section, index) => (
            <div
              key={section.title}
              className={index > 0 ? 'md:border-l md:border-border md:pl-10' : 'md:pr-10'}
            >
              <h2 className="font-serif text-3xl">{section.title}</h2>
              <ul className="mt-8 flex flex-col gap-4">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-3 leading-relaxed text-foreground/85">
                    <span aria-hidden="true" className="mt-[0.7em] size-1.5 shrink-0 rotate-45 bg-champagne" />
                    <span className="text-pretty">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-espresso py-20 text-espresso-foreground md:py-28">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-5 text-center md:px-8">
          <Eyebrow className="justify-center text-champagne">Apply</Eyebrow>
          <h2 className="mt-5 text-balance font-serif text-4xl md:text-5xl">Think this role is for you?</h2>
          <p className="mt-5 max-w-lg text-pretty leading-relaxed text-espresso-foreground/75">
            Send us your CV and a few words about yourself. Mention the role you are applying for and we will be in
            touch.
          </p>
          <OrnamentRule className="my-10 w-full max-w-xs" />
          <div className="flex flex-wrap justify-center gap-4">
            <CtaLink href={applyHref}>Apply for this job</CtaLink>
            <CtaLink href="/careers" variant="outline-light">
              View all openings
            </CtaLink>
          </div>
        </div>
      </section>
    </>
  )
}
