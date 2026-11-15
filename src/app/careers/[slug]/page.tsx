import type { Metadata } from 'next'
import { getOpenJob } from '@/lib/server-data'
import CareerDetailPage from '@/views/CareerDetailPage'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { job } = await getOpenJob(slug)
  return job ? { title: job.title, description: `${job.title} — ${job.department}, ${job.location}. Apply at Al Rauf Cafe Restaurant.` } : { title: 'Careers' }
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  return <CareerDetailPage slug={slug} />
}
