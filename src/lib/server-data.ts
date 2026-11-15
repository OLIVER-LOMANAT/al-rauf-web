import 'server-only'
import { cache } from 'react'
import { mapPublicMenu } from '@/lib/api'
import type { Job } from '@/lib/careers-data'
import { SERVER_API_PREFIX } from '@/lib/config'
import { galleryImages as staticGallery, type GalleryImage } from '@/lib/gallery-data'
import { menuCategories as staticMenu, type MenuCategory } from '@/lib/menu-data'
import { buildSiteState, unwrapSettings, type SiteState } from '@/lib/site-data'

/**
 * Everything the public pages read from the API, fetched on the server.
 *
 * - Results are cached for REVALIDATE_SECONDS, so a change made in the staff app (menu, hours, gallery, jobs)
 *   shows on the website within about a minute without hammering the API on every visit.
 * - If the API cannot be reached, the pages fall back to the same built-in content the old site used.
 */
export const REVALIDATE_SECONDS = 60
const TIMEOUT_MS = 4000

class HttpStatusError extends Error {
  status: number
  constructor(status: number) {
    super(`HTTP ${status}`)
    this.status = status
  }
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${SERVER_API_PREFIX}${path}`, {
    headers: { Accept: 'application/json' },
    next: { revalidate: REVALIDATE_SECONDS },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  if (!res.ok) throw new HttpStatusError(res.status)
  return (await res.json()) as T
}

/** Contact details, hours, social links, wording and money rules. */
export const getSiteState = cache(async (): Promise<SiteState> => {
  try {
    return buildSiteState(unwrapSettings(await getJson<unknown>('/settings')))
  } catch {
    return buildSiteState(null)
  }
})

/** The live menu. `live` is false when the API could not be reached or has no dishes yet. */
export const getMenu = cache(async (): Promise<{ categories: MenuCategory[]; live: boolean }> => {
  try {
    const categories = mapPublicMenu(await getJson<unknown>('/menu'))
    return categories.length > 0 ? { categories, live: true } : { categories: staticMenu, live: false }
  } catch {
    return { categories: staticMenu, live: false }
  }
})

/** Photos from Website → Gallery. If there are none yet (or the API is unreachable) the built-in photos show. */
export const getGalleryImages = cache(async (): Promise<GalleryImage[]> => {
  try {
    const res = await getJson<{ images: { src: string; alt: string; caption: string | null; shape: GalleryImage['shape'] }[] }>('/gallery')
    const images = res.images.map((i) => ({ src: i.src, alt: i.alt, caption: i.caption ?? '', shape: i.shape }))
    return images.length > 0 ? images : staticGallery
  } catch {
    return staticGallery
  }
})

type ApiJob = {
  slug: string
  title: string
  department: string
  typeLabel: string
  location: string
  postedAt: string
  brief: string[]
  responsibilities: string[]
  requirements: string[]
}

function toJob(j: ApiJob): Job {
  return {
    slug: j.slug,
    title: j.title,
    department: j.department,
    type: j.typeLabel === 'Part-time' ? 'Part-time' : 'Full-time',
    location: j.location,
    postedAt: j.postedAt,
    brief: j.brief,
    responsibilities: j.responsibilities,
    requirements: j.requirements,
  }
}

/** Open roles from Website → Careers. Never falls back to demo jobs. */
export const getOpenJobs = cache(async (): Promise<{ jobs: Job[]; failed: boolean }> => {
  try {
    const res = await getJson<{ jobs: ApiJob[] }>('/jobs')
    return { jobs: res.jobs.map(toJob), failed: false }
  } catch {
    return { jobs: [], failed: true }
  }
})

/** One open role by its web address. `notFound` is true when the job is closed or does not exist. */
export const getOpenJob = cache(
  async (slug: string): Promise<{ job: Job | null; notFound: boolean; failed: boolean }> => {
    try {
      const res = await getJson<{ job: ApiJob }>(`/jobs/${encodeURIComponent(slug)}`)
      return { job: toJob(res.job), notFound: false, failed: false }
    } catch (e) {
      if (e instanceof HttpStatusError && (e.status === 404 || e.status === 410)) return { job: null, notFound: true, failed: false }
      return { job: null, notFound: false, failed: true }
    }
  },
)
