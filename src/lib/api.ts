import { API_PREFIX } from '@/lib/config'
import type { MenuCategory, MenuItem, OptionGroup } from '@/lib/menu-data'

export class ApiError extends Error {
  status: number
  fieldErrors: Record<string, string>
  constructor(status: number, message: string, fieldErrors: Record<string, string> = {}) {
    super(message)
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_PREFIX}${path}`, {
    method,
    credentials: 'include',
    headers: body !== undefined ? { 'Content-Type': 'application/json', Accept: 'application/json' } : { Accept: 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  let data: unknown = null
  const text = await res.text()
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = { error: text }
    }
  }

  if (!res.ok) {
    const b = (data ?? {}) as Record<string, unknown>
    const message = typeof b.error === 'string' ? b.error : typeof b.message === 'string' ? b.message : 'Request failed'
    const fieldErrors: Record<string, string> = {}
    if (Array.isArray(b.issues)) {
      for (const issue of b.issues as { field?: string; message?: string }[]) {
        const field = issue.field || '_form'
        if (issue.message && !fieldErrors[field]) fieldErrors[field] = issue.message
      }
    }
    throw new ApiError(res.status, Object.values(fieldErrors)[0] || message, fieldErrors)
  }

  return data as T
}

/** Map backend public menu → website MenuCategory shape (same UI components). */
export function mapPublicMenu(raw: unknown): MenuCategory[] {
  if (!Array.isArray(raw)) {
    if (raw && typeof raw === 'object' && Array.isArray((raw as { categories?: unknown }).categories)) {
      return mapPublicMenu((raw as { categories: unknown[] }).categories)
    }
    return []
  }

  const placeholder = '/images/mezze.png'
  return raw.map((c) => {
    const cat = c as Record<string, unknown>
    const dishes = Array.isArray(cat.dishes) ? cat.dishes : []
    const items: MenuItem[] = dishes.map((d) => {
      const dish = d as Record<string, unknown>
      const groups = Array.isArray(dish.optionGroups) ? dish.optionGroups : []
      const options: OptionGroup[] = groups.map((g) => {
        const group = g as Record<string, unknown>
        const choices = Array.isArray(group.choices) ? group.choices : []
        const maxSelect = Number(group.maxSelect ?? 1)
        return {
          id: String(group.id),
          title: String(group.name ?? ''),
          required: Boolean(group.isRequired ?? Number(group.minSelect ?? 0) > 0),
          max: maxSelect > 0 ? maxSelect : 1,
          choices: choices.map((ch) => {
            const choice = ch as Record<string, unknown>
            return {
              id: String(choice.id),
              label: String(choice.name ?? ''),
              price: Number(choice.priceDelta ?? 0),
            }
          }),
        }
      })
      return {
        id: String(dish.id),
        name: String(dish.name ?? ''),
        description: String(dish.description ?? ''),
        price: Number(dish.price ?? 0),
        note: (dish.note as string | undefined) || undefined,
        options: options.length ? options : undefined,
      }
    })

    return {
      id: String(cat.id),
      label: String(cat.name ?? ''),
      intro: String(cat.description ?? ''),
      image: (cat.imageUrl as string) || placeholder,
      imageAlt: String(cat.name ?? 'Menu'),
      items,
    }
  })
}

export const api = {
  createReservation: (body: {
    name: string
    email: string
    phone: string
    date: string
    time: string
    guests: number
    requests?: string | null
  }) => request<{ reservation?: unknown; message?: string }>('POST', '/reservations', body),


  createWebsiteOrder: (body: Record<string, unknown>) =>
    request<{
      order: {
        orderNumber: string
        trackingToken: string
        type: string
        acceptance: string
        payMethod: string
        paymentStatus: string
        totals: { subtotal: number; deliveryFee: number; tax: number; total: number }
        items: unknown[]
        createdAt: string
      }
    }>('POST', '/website/orders', body),

  trackOrder: (token: string) =>
    request<{
      order: {
        orderNumber: string
        type: string
        stage: string
        message: string
        rejectionReason: string | null
        payMethod: string
        paymentStatus: string
        items: { name: string; quantity: number; note: string | null; options: unknown[]; lineTotal: number }[]
        totals: { subtotal: number; discount: number; serviceCharge: number; tax: number; deliveryFee: number; total: number }
        createdAt: string
        restaurant: { name: string; phone: string | null }
      }
    }>('GET', `/website/orders/track/${encodeURIComponent(token)}`),
}

export function newIdempotencyKey() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, '').slice(0, 24)
  }
  return `web_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
}
