'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ConciergeBell } from 'lucide-react'
import { ApiError, api, newIdempotencyKey } from '@/lib/api'
import { useCart } from '@/lib/cart'
import { useSite } from '@/lib/site-context'
import { formatPrice } from '@/lib/menu-data'
import { cn } from '@/lib/utils'
import { ctaBase, Eyebrow, StarMark } from '@/components/site/primitives'
import { DeliveryDetails, type DeliveryValues } from '@/components/checkout/delivery-details'
import { PaymentPanel, PriceDetails, type PaymentMethod } from '@/components/checkout/order-summary'
import { CheckoutCard, Toggle } from '@/components/checkout/checkout-ui'

type PlacedOrder = {
  orderNumber: string
  trackingToken: string
  total: number
  method: PaymentMethod
  phone: string
}

export default function CheckoutPage() {
  const { lines, subtotal, mode, clear } = useCart()
  const router = useRouter()
  const { pricing: livePricing, refresh } = useSite()
  const [details, setDetails] = useState<DeliveryValues>({
    name: '',
    email: '',
    address: '',
    estate: '',
    floor: '',
    instructions: '',
    phone: '',
  })
  const [workOrder, setWorkOrder] = useState(false)
  const [method, setMethod] = useState<PaymentMethod>('pay_on_arrival')
  const [mpesaNumber, setMpesaNumber] = useState('')
  const [showErrors, setShowErrors] = useState(false)
  const [pending, setPending] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [placed, setPlaced] = useState<PlacedOrder | null>(null)
  const [idempotencyKey] = useState(() => newIdempotencyKey())
  const confirmationRef = useRef<HTMLDivElement>(null)
  const pendingRef = useRef(false)

  // Re-read the money rules and the "ordering paused" switch so checkout always uses the current values.
  useEffect(() => {
    void refresh()
  }, [refresh])

  useEffect(() => {
    if (placed) confirmationRef.current?.focus()
  }, [placed])

  const isDelivery = mode === 'delivery'
  const deliveryFee = isDelivery ? livePricing.deliveryFee : 0
  const total = subtotal + deliveryFee
  const rate = livePricing.taxRatePercent / 100
  const vat =
    Math.round((livePricing.pricesIncludeTax ? total - total / (1 + rate) : total * rate) * 100) / 100
  const grandTotal = livePricing.pricesIncludeTax ? total : total + vat
  const totals = { subtotal, deliveryFee, vat, total: grandTotal }

  const blockers: string[] = []
  if (!livePricing.websiteOrderingEnabled) blockers.push('Online ordering is paused right now. Please call us or try again later.')
  if (isDelivery && livePricing.deliveryMinimumOrder > 0 && subtotal < livePricing.deliveryMinimumOrder)
    blockers.push(`Delivery orders start at ${formatPrice(livePricing.deliveryMinimumOrder)}.`)
  if (details.name.trim().length < 2) blockers.push('Add your name.')
  if (isDelivery && details.address.trim().length === 0) blockers.push('Add a delivery address.')
  if (!/^\d{9}$/.test(details.phone)) blockers.push('Add a phone number to place your order.')
  if (method === 'mpesa' && !/^\d{9}$/.test(mpesaNumber)) blockers.push('Enter the M-Pesa number to charge.')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (blockers.length > 0) {
      setShowErrors(true)
      return
    }
    if (pendingRef.current) return
    pendingRef.current = true
    setPending(true)
    setSubmitError(null)

    const payMethod =
      method === 'mpesa' ? 'MPESA' : isDelivery ? 'ON_DELIVERY' : 'AT_PICKUP'

    const body: Record<string, unknown> = {
      type: isDelivery ? 'DELIVERY' : 'PICKUP',
      customerName: details.name.trim(),
      customerPhone: `0${details.phone}`,
      items: lines.map((line) => ({
        dishId: line.itemId,
        quantity: line.quantity,
        optionChoiceIds: line.optionChoiceIds ?? [],
        note: undefined,
      })),
      payMethod,
      idempotencyKey,
      company: '', // honeypot — must stay empty
    }

    if (details.email.trim()) body.customerEmail = details.email.trim()
    if (isDelivery) {
      body.deliveryAddress = details.address.trim()
      if (details.estate.trim()) body.deliveryEstate = details.estate.trim()
      if (details.floor.trim()) body.deliveryFloor = details.floor.trim()
      if (details.instructions.trim()) body.deliveryInstructions = details.instructions.trim().slice(0, 300)
    }

    try {
      const { order } = await api.createWebsiteOrder(body)
      clear()
      setPlaced({
        orderNumber: order.orderNumber,
        trackingToken: order.trackingToken,
        total: order.totals?.total ?? total,
        method,
        phone: method === 'mpesa' ? mpesaNumber : details.phone,
      })
    } catch (e) {
      const err = e instanceof ApiError ? e : null
      setSubmitError(err?.message ?? 'We could not place your order. Please try again.')
    } finally {
      pendingRef.current = false
      setPending(false)
    }
  }

  if (placed) {
    return (
      <div className="bg-background pt-28 md:pt-32">
        <div className="mx-auto max-w-xl px-5 pb-24 md:px-8 md:pb-32">
          <div
            ref={confirmationRef}
            tabIndex={-1}
            role="status"
            className="border border-olive/40 bg-card p-8 outline-none md:p-12"
          >
            <StarMark className="size-8 text-champagne" />
            <p className="eyebrow mt-6 text-olive">Order received</p>
            <h1 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">Thank you</h1>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              Order <strong className="font-semibold text-foreground">#{placed.orderNumber}</strong> is with the
              restaurant. They will confirm it shortly.
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-4 border-y border-border py-6 text-sm">
              <div>
                <dt className="eyebrow text-[0.6rem] text-muted-foreground">Total</dt>
                <dd className="mt-1 font-serif text-2xl">{formatPrice(placed.total)}</dd>
              </div>
              <div>
                <dt className="eyebrow text-[0.6rem] text-muted-foreground">Payment</dt>
                <dd className="mt-1 font-serif text-2xl">
                  {placed.method === 'mpesa' ? 'M-Pesa' : isDelivery ? 'On delivery' : 'At pickup'}
                </dd>
              </div>
            </dl>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/track/${placed.trackingToken}`}
                className={cn(ctaBase, 'bg-olive text-primary-foreground hover:bg-olive-deep')}
              >
                Track order
              </Link>
              <Link
                href="/menu"
                className={cn(ctaBase, 'border border-foreground/30 text-foreground hover:border-olive hover:text-olive')}
              >
                Order something else
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background pt-28 md:pt-32">
      <div className="mx-auto max-w-6xl px-5 pb-24 md:px-8 md:pb-32">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex size-10 items-center justify-center rounded-full border border-border transition-colors hover:border-olive hover:text-olive"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            <span className="sr-only">Go back</span>
          </button>
          <div>
            <Eyebrow>Your order</Eyebrow>
            <h1 className="mt-2 font-serif text-5xl leading-none md:text-6xl">Checkout</h1>
          </div>
        </div>

        {lines.length === 0 ? (
          <div className="pattern-girih mt-12 flex flex-col items-center border border-border bg-card px-8 py-20 text-center">
            <span className="inline-flex size-16 items-center justify-center bg-champagne text-espresso">
              <ConciergeBell className="size-7" aria-hidden="true" />
            </span>
            <p className="mt-6 font-serif text-3xl">Your table is empty</p>
            <p className="mt-2 text-sm text-muted-foreground">Add a few dishes from the menu before checking out.</p>
            <Link href="/menu" className={cn(ctaBase, 'mt-8 bg-olive text-primary-foreground hover:bg-olive-deep')}>
              Browse the menu
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-12 grid items-start gap-6 lg:grid-cols-12">
            {/* honeypot */}
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
              aria-hidden="true"
            />
            <div className="flex flex-col gap-6 lg:col-span-7">
              <DeliveryDetails values={details} onChange={setDetails} total={total} showErrors={showErrors} />
              <CheckoutCard title="Type of order">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">Is this a work order?</p>
                    <p className="text-xs text-muted-foreground">We&apos;ll include a company receipt with the order.</p>
                  </div>
                  <Toggle checked={workOrder} onChange={setWorkOrder} label="Is this a work order?" />
                </div>
              </CheckoutCard>
              {submitError ? (
                <p role="alert" className="border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
                  {submitError}
                </p>
              ) : null}
            </div>
            <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:col-span-5">
              <PriceDetails totals={totals} isDelivery={isDelivery} />
              <PaymentPanel
                method={method}
                onMethodChange={setMethod}
                mpesaNumber={mpesaNumber}
                onMpesaNumberChange={setMpesaNumber}
                blockers={blockers}
                pending={pending}
                total={grandTotal}
                mpesaEnabled={livePricing.websiteMpesaEnabled}
              />
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
