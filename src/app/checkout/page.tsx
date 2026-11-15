import type { Metadata } from 'next'
import CheckoutPage from '@/views/CheckoutPage'

// Personal to each visitor, so it stays out of search results
export const metadata: Metadata = { title: 'Checkout', robots: { index: false, follow: false } }

export default CheckoutPage
