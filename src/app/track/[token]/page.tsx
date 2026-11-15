import type { Metadata } from 'next'
import TrackOrderPage from '@/views/TrackOrderPage'

// Private to the customer, so it stays out of search results
export const metadata: Metadata = { title: 'Track your order', robots: { index: false, follow: false } }

export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  return <TrackOrderPage token={token} />
}
