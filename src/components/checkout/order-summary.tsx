'use client'

import { CreditCard, Loader2, Smartphone } from 'lucide-react'
import { formatPrice } from '@/lib/menu-data'
import { useSite } from '@/lib/site-context'
import { cn } from '@/lib/utils'
import { ctaBase } from '@/components/site/primitives'
import { CheckoutCard, fieldClass, labelClass } from './checkout-ui'

export type PaymentMethod = 'mpesa' | 'pay_on_arrival'

export type Totals = { subtotal: number; deliveryFee: number; vat: number; total: number }

export function PriceDetails({ totals, isDelivery }: { totals: Totals; isDelivery: boolean }) {
  const { pricing: livePricing } = useSite()
  const vatLabel = `VAT (${livePricing.taxRatePercent}%)`
  const incl = livePricing.pricesIncludeTax ? ' (VAT incl.)' : ''
  return (
    <CheckoutCard title="Price details">
      <dl className="flex flex-col gap-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Subtotal{incl}</dt>
          <dd className="tabular-nums">{formatPrice(totals.subtotal)}</dd>
        </div>
        {isDelivery ? (
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Delivery fee{incl}</dt>
            <dd className="tabular-nums">{formatPrice(totals.deliveryFee)}</dd>
          </div>
        ) : null}
        <div className="flex justify-between text-xs">
          <dt className="text-muted-foreground">{vatLabel}</dt>
          <dd className="tabular-nums text-muted-foreground">{formatPrice(totals.vat)}</dd>
        </div>
        <div className="mt-2 flex items-baseline justify-between border-t border-foreground/20 pt-4">
          <dt className="eyebrow text-foreground">Total</dt>
          <dd className="font-serif text-3xl tabular-nums">{formatPrice(totals.total)}</dd>
        </div>
      </dl>
    </CheckoutCard>
  )
}

export function PaymentPanel({
  method,
  onMethodChange,
  mpesaNumber,
  onMpesaNumberChange,
  blockers,
  pending,
  total,
  mpesaEnabled,
}: {
  method: PaymentMethod
  onMethodChange: (method: PaymentMethod) => void
  mpesaNumber: string
  onMpesaNumberChange: (value: string) => void
  blockers: string[]
  pending: boolean
  total: number
  mpesaEnabled: boolean
}) {
  const allOptions: { id: PaymentMethod; label: string; detail: string; Icon: typeof Smartphone }[] = [
    { id: 'pay_on_arrival', label: 'Pay on arrival', detail: 'Cash, card or M-Pesa when your order arrives', Icon: CreditCard },
    { id: 'mpesa', label: 'M-Pesa now', detail: 'Only if online M-Pesa is enabled by the restaurant', Icon: Smartphone },
  ]
  const options = allOptions.filter((option) => option.id !== 'mpesa' || mpesaEnabled)

  return (
    <CheckoutCard title="Payment method">
      <fieldset>
        <legend className="sr-only">Choose a payment method</legend>
        <ul className="divide-y divide-border border-y border-border">
          {options.map(({ id, label, detail, Icon }) => (
            <li key={id}>
              <label className="flex cursor-pointer items-center gap-4 py-4">
                <input
                  type="radio"
                  name="payment"
                  value={id}
                  checked={method === id}
                  onChange={() => onMethodChange(id)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex size-5 shrink-0 items-center justify-center rounded-full border peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-champagne',
                    method === id ? 'border-olive bg-olive' : 'border-foreground/40',
                  )}
                >
                  {method === id ? <span className="size-2 rounded-full bg-primary-foreground" /> : null}
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold">{label}</span>
                  <span className="block text-xs text-muted-foreground">{detail}</span>
                </span>
                <Icon className="size-5 text-olive" aria-hidden="true" />
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      {method === 'mpesa' ? (
        <div className="mt-6">
          <label htmlFor="mpesa" className={labelClass}>
            Mobile money number
          </label>
          <div className="mt-2 flex">
            <span className="inline-flex items-center border border-r-0 border-border bg-secondary px-4 text-sm text-muted-foreground">
              +254
            </span>
            <input
              id="mpesa"
              type="tel"
              inputMode="numeric"
              value={mpesaNumber}
              onChange={(event) => onMpesaNumberChange(event.target.value.replace(/\D/g, '').slice(0, 9))}
              placeholder="712 345 678"
              className={cn(fieldClass, 'mt-0')}
            />
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            We&apos;ll send a payment request to this number. Approve it on your phone to pay.
          </p>
        </div>
      ) : (
        <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
          You&apos;ll enter your card details on a secure payment page after placing the order.
        </p>
      )}

      {blockers.length > 0 ? (
        <div className="mt-6 border-l-2 border-champagne bg-secondary px-4 py-3" aria-live="polite">
          <p className="text-sm font-semibold">Before you can place this order:</p>
          <ul className="mt-2 list-disc pl-5 text-xs leading-relaxed text-muted-foreground">
            {blockers.map((blocker) => (
              <li key={blocker}>{blocker}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        aria-disabled={blockers.length > 0}
        className={cn(
          ctaBase,
          'mt-6 w-full',
          blockers.length > 0
            ? 'bg-olive/40 text-primary-foreground'
            : 'bg-olive text-primary-foreground hover:bg-olive-deep',
        )}
      >
        {pending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
        {pending ? 'Placing order' : `Place order · ${formatPrice(total)}`}
      </button>
    </CheckoutCard>
  )
}
