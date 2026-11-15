import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/config'
import { getOpenJobs } from '@/lib/server-data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { jobs } = await getOpenJobs()
  const pages = ['', '/menu', '/about', '/gallery', '/contact', '/reservations', '/careers']
  return [
    ...pages.map((path) => ({ url: `${SITE_URL}${path}` })),
    ...jobs.map((job) => ({ url: `${SITE_URL}/careers/${job.slug}` })),
  ]
}
