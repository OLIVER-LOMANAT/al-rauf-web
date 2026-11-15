import type { Metadata } from 'next'
import './globals.css'
import { CartDrawer } from '@/components/order/cart-drawer'
import { CursorFollower } from '@/components/site/cursor-follower'
import { SiteFooter } from '@/components/site/site-footer'
import { SiteHeader } from '@/components/site/site-header'
import { CartProvider } from '@/lib/cart'
import { SITE_URL } from '@/lib/config'
import { getSiteState } from '@/lib/server-data'
import { SiteProvider } from '@/lib/site-context'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Al Rauf Cafe Restaurant — Where Flavour Meets Hospitality',
    template: '%s | Al Rauf Cafe Restaurant',
  },
  description: 'A website for Al Rauf Cafe Restaurant — shared meals, good coffee and generous hospitality.',
  icons: { icon: [{ url: '/icon.svg', type: 'image/svg+xml' }], apple: '/apple-icon.png' },
  openGraph: {
    type: 'website',
    siteName: 'Al Rauf Cafe Restaurant',
    title: 'Al Rauf Cafe Restaurant — Where Flavour Meets Hospitality',
    description: 'Shared meals, good coffee and generous hospitality.',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Contact details, hours, wording and money rules, fetched on the server and handed to the browser
  const initial = await getSiteState()

  return (
    <html lang="en" className="bg-background" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Manrope:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <SiteProvider initial={initial}>
          <CartProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-champagne focus:px-4 focus:py-2 focus:text-espresso"
            >
              Skip to content
            </a>
            <CursorFollower />
            <SiteHeader />
            <main id="main">{children}</main>
            <CartDrawer />
            <SiteFooter />
          </CartProvider>
        </SiteProvider>
      </body>
    </html>
  )
}
