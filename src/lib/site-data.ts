import { DELIVERY_FEE, VAT_RATE } from '@/lib/constants'
import { defaultSite, type OpeningHours, type Site, type SocialLink } from '@/lib/site-config'

/**
 * The restaurant's live settings (contact details, hours, social links, wording and money rules),
 * as sent by GET /api/settings. Everything here is plain data with no mutation, so the same code
 * is safe on the server (one copy per request) and in the browser.
 */

export type PublicSettings = {
  tagline?: string | null
  contact?: { phone?: string | null; whatsapp?: string | null; email?: string | null; address?: string | null; mapUrl?: string | null }
  social?: { instagramUrl?: string | null; facebookUrl?: string | null; tiktokUrl?: string | null }
  pricing?: {
    deliveryFee?: number
    taxRatePercent?: number
    pricesIncludeTax?: boolean
    deliveryMinimumOrder?: number
    websiteOrderingEnabled?: boolean
    websiteMpesaEnabled?: boolean
  }
  hours?: { dayOfWeek: number; isClosed: boolean; opensAt: string | null; closesAt: string | null }[]
  isOpenNow?: boolean | null
  content?: Record<string, string>
}

/** Money rules and switches from Settings. Defaults apply only if the server cannot be reached. */
export type LivePricing = {
  deliveryFee: number
  taxRatePercent: number
  pricesIncludeTax: boolean
  deliveryMinimumOrder: number
  websiteOrderingEnabled: boolean
  websiteMpesaEnabled: boolean
  isOpenNow: boolean | null
  loaded: boolean
}

export type SiteState = {
  site: Site
  pricing: LivePricing
  /** Text the owner edited under Website → Text, by key. */
  content: Record<string, string>
}

export const defaultPricing: LivePricing = {
  deliveryFee: DELIVERY_FEE,
  taxRatePercent: VAT_RATE * 100,
  pricesIncludeTax: true,
  deliveryMinimumOrder: 0,
  websiteOrderingEnabled: true,
  websiteMpesaEnabled: false,
  isOpenNow: null,
  loaded: false,
}

/** Text the owner edited. Empty or missing falls back to the wording already in the page. */
export function textFrom(content: Record<string, string>, key: string, fallback: string): string {
  const value = content[key]
  return value && value.trim() ? value : fallback
}

const DAY_SHORT = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function time12(value: string) {
  const [h, m] = value.split(':').map(Number)
  if (h === undefined || m === undefined || Number.isNaN(h) || Number.isNaN(m)) return value
  const suffix = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 === 0 ? 12 : h % 12
  return `${hour}:${String(m).padStart(2, '0')} ${suffix}`
}

/** Groups neighbouring days that share the same hours: "Mon – Fri  11:00 AM – 10:00 PM". */
function groupHours(rows: NonNullable<PublicSettings['hours']>): OpeningHours[] | null {
  if (rows.length === 0) return null
  const label = (r: (typeof rows)[number]) => (r.isClosed || !r.opensAt || !r.closesAt ? 'Closed' : `${time12(r.opensAt)} – ${time12(r.closesAt)}`)
  const sorted = [...rows].sort((a, b) => a.dayOfWeek - b.dayOfWeek)
  const out: OpeningHours[] = []
  let start = 0
  for (let i = 1; i <= sorted.length; i++) {
    if (i === sorted.length || label(sorted[i]!) !== label(sorted[start]!)) {
      const first = sorted[start]!
      const last = sorted[i - 1]!
      const days = first.dayOfWeek === last.dayOfWeek ? DAY_SHORT[first.dayOfWeek]! : `${DAY_SHORT[first.dayOfWeek]} – ${DAY_SHORT[last.dayOfWeek]}`
      out.push({ days, hours: label(first) })
      start = i
    }
  }
  return out
}

/** Turns the API's settings into the shapes the pages use. Pass null when the API could not be reached. */
export function buildSiteState(s: PublicSettings | null): SiteState {
  if (!s) return { site: defaultSite, pricing: defaultPricing, content: {} }

  const c = s.contact ?? {}
  const social: SocialLink[] = []
  if (s.social?.instagramUrl) social.push({ label: 'Instagram', href: s.social.instagramUrl })
  if (s.social?.facebookUrl) social.push({ label: 'Facebook', href: s.social.facebookUrl })
  if (s.social?.tiktokUrl) social.push({ label: 'TikTok', href: s.social.tiktokUrl })

  const site: Site = {
    ...defaultSite,
    announcement: s.tagline ? s.tagline : defaultSite.announcement,
    contact: {
      phone: c.phone ?? null,
      whatsapp: c.whatsapp ?? null,
      email: c.email ?? null,
      address: c.address ?? null,
      mapUrl: c.mapUrl ?? null,
    },
    hours: s.hours ? groupHours(s.hours) : null,
    social,
  }

  const p = s.pricing ?? {}
  const pricing: LivePricing = {
    deliveryFee: p.deliveryFee ?? defaultPricing.deliveryFee,
    taxRatePercent: p.taxRatePercent ?? defaultPricing.taxRatePercent,
    pricesIncludeTax: p.pricesIncludeTax ?? defaultPricing.pricesIncludeTax,
    deliveryMinimumOrder: p.deliveryMinimumOrder ?? 0,
    websiteOrderingEnabled: p.websiteOrderingEnabled ?? true,
    websiteMpesaEnabled: p.websiteMpesaEnabled ?? false,
    isOpenNow: s.isOpenNow ?? null,
    loaded: true,
  }

  return { site, pricing, content: s.content ?? {} }
}

/** The API wraps the settings as { settings: {...} }; older responses were flat. Accept both. */
export function unwrapSettings(body: unknown): PublicSettings | null {
  if (!body || typeof body !== 'object') return null
  const b = body as { settings?: PublicSettings } & PublicSettings
  return b.settings ?? b
}
