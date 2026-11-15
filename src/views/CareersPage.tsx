import { JobCard } from '@/components/careers/job-card'
import { Eyebrow } from '@/components/site/primitives'
import { getOpenJobs } from '@/lib/server-data'

export default async function CareersPage() {
  const { jobs, failed } = await getOpenJobs()
  const loading = false // the list is already loaded by the time the page is shown
  const openings = [...jobs].sort((a, b) => b.postedAt.localeCompare(a.postedAt))

  return (
    <>
      <section className="relative overflow-hidden bg-secondary pb-20 pt-36 md:pb-28 md:pt-44">
        <div className="pattern-girih pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl px-5 text-center md:px-8">
          <Eyebrow className="justify-center">Careers</Eyebrow>
          <h1 className="animate-rise mt-6 text-balance font-serif text-6xl leading-[0.98] md:text-8xl">
            Grow with <em className="text-olive">our family</em>
          </h1>
          <p className="mx-auto mt-8 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            Hospitality is made by people. If you care about good food, warm service and the small details, we would
            love to hear from you.
          </p>
        </div>
      </section>

      <section aria-labelledby="openings-title" className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <div className="flex flex-col items-center text-center">
          <Eyebrow className="justify-center">{loading ? 'Careers' : `${openings.length} open ${openings.length === 1 ? 'role' : 'roles'}`}</Eyebrow>
          <h2 id="openings-title" className="mt-5 font-serif text-5xl md:text-6xl">
            Latest Openings
          </h2>
        </div>
        {openings.length > 0 ? (
          <ul className="mt-16 grid border-t border-border md:grid-cols-2">
            {openings.map((job) => (
              <JobCard key={job.slug} job={job} />
            ))}
          </ul>
        ) : (
          <p className="mt-16 text-center text-muted-foreground">
            {loading
              ? 'Loading openings…'
              : failed
                ? 'We could not load the openings right now. Please try again shortly.'
                : 'There are no open roles at the moment. Please check back soon.'}
          </p>
        )}
      </section>
    </>
  )
}
