/**
 * Central business information for Al Rauf Cafe Restaurant.
 * These are only the built-in defaults. The live values (contact details, hours, social links, wording)
 * come from the restaurant's Settings through the API — see site-data.ts. Every `null` value renders as a
 * visible placeholder until the owner fills it in.
 */

export type OpeningHours = { days: string; hours: string }
export type SocialLink = { label: string; href: string }

export const defaultSite = {
  name: 'Al Rauf Cafe Restaurant',
  shortName: 'Al Rauf',
  description:
    'A website concept for Al Rauf Cafe Restaurant — a welcoming place for shared meals, good coffee and generous hospitality.',
  announcement: 'A taste of hospitality',
  contact: {
    address: null as string | null,
    phone: null as string | null,
    whatsapp: null as string | null,
    email: null as string | null,
    mapUrl: null as string | null,
  },
  hours: null as OpeningHours[] | null,
  social: [] as SocialLink[],
}

export type Site = typeof defaultSite

export const navigation = [
  { label: 'Home', href: '/' },
  { label: 'Our Story', href: '/about' },
  { label: 'Menu', href: '/menu' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' },
]

export function whatsappHref(number: string | null) {
  if (!number) return null
  const digits = number.replace(/\D/g, '')
  return digits ? `https://wa.me/${digits}` : null
}

export function telHref(number: string | null) {
  if (!number) return null
  return `tel:${number.replace(/[^\d+]/g, '')}`
}

export function directionsHref(contact: Site['contact']) {
  if (contact.mapUrl) return contact.mapUrl
  if (contact.address)
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`
  return null
}
