'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ApiError, api } from '@/lib/api'
import { formatPrice } from '@/lib/menu-data'
import { cn } from '@/lib/utils'
import { ctaBase, Eyebrow, StarMark } from '@/components/site/primitives'

export default function TrackOrderPage({ token }: { token: string }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [order, setOrder] = useState<Awaited<ReturnType<typeof api.trackOrder>>['order'] | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!token) {
        setError('Missing tracking code.')
        setLoading(false)
        return
      }
      try {
        const res = await api.trackOrder(token)
        if (!cancelled) {
          setOrder(res.order)
          setError(null)
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof ApiError ? e.message : 'We could not find that order.')
          setOrder(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    const id = window.setInterval(() => void load(), 20_000)
    return () => {
      cancelled = true
      window.clearInterval(id)
    }
  }, [token])

  return (
    <div className="bg-background pt-28 md:pt-32">
      <div className="mx-auto max-w-xl px-5 pb-24 md:px-8 md:pb-32">
        <Eyebrow>Track order</Eyebrow>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl">Your order</h1>

        {loading && !order ? (
          <p className="mt-8 text-sm text-muted-foreground">Looking up your order…</p>
        ) : null}

        {error && !order ? (
          <div className="mt-8 border border-destructive/40 bg-destructive/5 p-6 text-sm text-destructive" role="alert">
            {error}
            <Link href="/menu" className={cn(ctaBase, 'mt-6 border border-foreground/30 text-foreground')}>
              Back to menu
            </Link>
          </div>
        ) : null}

        {order ? (
          <div className="mt-8 border border-border bg-card p-6 md:p-8">
            <StarMark className="size-7 text-champagne" />
            <p className="eyebrow mt-4 text-olive">Order #{order.orderNumber}</p>
            <p className="mt-3 font-serif text-2xl leading-snug">{order.message}</p>
            {order.rejectionReason ? (
              <p className="mt-2 text-sm text-destructive">{order.rejectionReason}</p>
            ) : null}
            <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              {order.type.replace('_', ' ')} · {order.stage} · {order.paymentStatus}
            </p>

            <ul className="mt-8 divide-y divide-border border-y border-border">
              {order.items.map((item, i) => (
                <li key={i} className="flex justify-between gap-4 py-3 text-sm">
                  <span>
                    {item.quantity} × {item.name}
                    {item.note ? <span className="block text-xs text-muted-foreground">{item.note}</span> : null}
                  </span>
                  <span className="tabular-nums">{formatPrice(item.lineTotal)}</span>
                </li>
              ))}
            </ul>

            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="tabular-nums">{formatPrice(order.totals.subtotal)}</dd>
              </div>
              {order.totals.deliveryFee > 0 ? (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Delivery</dt>
                  <dd className="tabular-nums">{formatPrice(order.totals.deliveryFee)}</dd>
                </div>
              ) : null}
              <div className="flex justify-between border-t border-border pt-3 font-semibold">
                <dt>Total</dt>
                <dd className="tabular-nums">{formatPrice(order.totals.total)}</dd>
              </div>
            </dl>

            {order.restaurant?.phone ? (
              <p className="mt-6 text-sm text-muted-foreground">
                Need help? Call {order.restaurant.name}:{' '}
                <a className="text-foreground underline decoration-champagne underline-offset-4" href={`tel:${order.restaurant.phone}`}>
                  {order.restaurant.phone}
                </a>
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}
