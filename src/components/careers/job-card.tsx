import Link from 'next/link'
import { type Job, postedAgo } from '@/lib/careers-data'

export function JobCard({ job }: { job: Job }) {
  return (
    <li className="border-b border-border md:[&:nth-child(odd)]:border-r">
      <Link
        href={`/careers/${job.slug}`}
        className="group relative flex h-full flex-col gap-6 overflow-hidden px-6 py-12 transition-colors duration-500 hover:bg-secondary focus-visible:bg-secondary sm:flex-row sm:items-start sm:justify-between md:px-12 md:py-16"
      >
        <span
          className="pattern-girih pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
          aria-hidden="true"
        />
        <span className="relative flex flex-col">
          <span className="eyebrow text-olive">{job.department}</span>
          <h3 className="mt-3 text-balance font-serif text-3xl leading-tight md:text-4xl">{job.title}</h3>
          <span className="mt-4 text-sm text-muted-foreground">{postedAgo(job.postedAt)}</span>
        </span>
        <span className="relative flex flex-col gap-2 sm:items-end sm:text-right">
          <span className="eyebrow text-foreground">{job.location}</span>
          <span className="text-sm text-muted-foreground">{job.type}</span>
          <span
            aria-hidden="true"
            className="mt-4 text-lg text-olive transition-transform duration-300 group-hover:translate-x-1"
          >
            {'→'}
          </span>
        </span>
      </Link>
    </li>
  )
}
