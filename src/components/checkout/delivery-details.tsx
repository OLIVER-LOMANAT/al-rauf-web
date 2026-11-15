'use client'

import { useState } from 'react'
import { Bike, ChevronDown, ShoppingBag } from 'lucide-react'
import { useCart, type OrderMode } from '@/lib/cart'
import { formatPrice } from '@/lib/menu-data'
import { useSite } from '@/lib/site-context'
import { cn } from '@/lib/utils'
import { CheckoutCard, fieldClass, labelClass } from './checkout-ui'

export const INSTRUCTIONS_MAX = 400

export type DeliveryValues = {
  name: string
  email: string
  address: string
  estate: string
  floor: string
  instructions: string
  phone: string
}

export function DeliveryDetails({
  values,
  onChange,
  total,
  showErrors,
}: {
  values: DeliveryValues
  onChange: (values: DeliveryValues) => void
  total: number
  showErrors: boolean
}) {
  const { mode, setMode, lines, count } = useCart()
  const { site } = useSite()
  const [itemsOpen, setItemsOpen] = useState(false)
  const set = (key: keyof DeliveryValues) => (event: { target: { value: string } }) =>
    onChange({ ...values, [key]: event.target.value })

  const addressMissing = mode === 'delivery' && values.address.trim().length === 0
  const phoneInvalid = !/^\d{9}$/.test(values.phone)

  const modes: { id: OrderMode; label: string; Icon: typeof Bike }[] = [
    { id: 'delivery', label: 'Delivery', Icon: Bike },
    { id: 'pickup', label: 'Pickup', Icon: ShoppingBag },
  ]

  return (
    <CheckoutCard title={mode === 'delivery' ? 'Delivery details' : 'Pickup details'}>
      <div role="radiogroup" aria-label="Order type" className="grid grid-cols-2 border border-border">
        {modes.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={mode === id}
            onClick={() => setMode(id)}
            className={cn(
              'inline-flex items-center justify-center gap-2 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition-colors',
              mode === id ? 'bg-olive text-primary-foreground' : 'text-muted-foreground hover:text-olive',
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="customer-name" className={labelClass}>
              Your name
            </label>
            <input
              id="customer-name"
              value={values.name}
              onChange={set('name')}
              autoComplete="name"
              required
              aria-invalid={showErrors && values.name.trim().length < 2 ? true : undefined}
              className={fieldClass}
            />
            {showErrors && values.name.trim().length < 2 ? (
              <p className="mt-2 text-sm text-destructive">Please enter your name.</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="customer-email" className={labelClass}>
              Email <span className="normal-case tracking-normal text-muted-foreground">(optional)</span>
            </label>
            <input
              id="customer-email"
              type="email"
              value={values.email}
              onChange={set('email')}
              autoComplete="email"
              className={fieldClass}
            />
          </div>
        </div>

        {mode === 'delivery' ? (
          <div>
            <label htmlFor="address" className={labelClass}>
              Deliver to
            </label>
            <input
              id="address"
              value={values.address}
              onChange={set('address')}
              autoComplete="street-address"
              placeholder="Building, street and area — e.g. Swansea Apartments, Muthangari"
              aria-invalid={showErrors && addressMissing}
              aria-describedby={showErrors && addressMissing ? 'address-error' : undefined}
              className={fieldClass}
            />
            {showErrors && addressMissing ? (
              <p id="address-error" className="mt-2 text-xs text-destructive">
                Add a delivery address to place your order.
              </p>
            ) : null}
          </div>
        ) : (
          <div className="border-l-2 border-champagne bg-secondary px-4 py-3">
            <p className={labelClass}>Collect from</p>
            <p className="mt-1 text-sm text-foreground">{site.contact.address ?? `${site.name} — address to be confirmed`}</p>
          </div>
        )}

        <div>
          <label htmlFor="phone" className={labelClass}>
            {mode === 'delivery' ? 'Who should the rider call?' : 'Contact number'}
          </label>
          <div className="mt-2 flex">
            <span className="inline-flex items-center border border-r-0 border-border bg-secondary px-4 text-sm text-muted-foreground">
              +254
            </span>
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              value={values.phone}
              onChange={(event) => onChange({ ...values, phone: event.target.value.replace(/\D/g, '').slice(0, 9) })}
              placeholder="712 345 678"
              aria-invalid={showErrors && phoneInvalid}
              aria-describedby={showErrors && phoneInvalid ? 'phone-error' : undefined}
              className={cn(fieldClass, 'mt-0')}
            />
          </div>
          {showErrors && phoneInvalid ? (
            <p id="phone-error" className="mt-2 text-xs text-destructive">
              Add a 9-digit phone number to place your order.
            </p>
          ) : null}
        </div>

        {mode === 'delivery' ? (
          <div className="border-t border-border pt-6">
            <p className="mb-4 text-sm font-semibold text-foreground">Help the rider find you</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="min-w-0">
                <label htmlFor="estate" className={labelClass}>
                  Estate / location
                </label>
                <input
                  id="estate"
                  value={values.estate}
                  onChange={set('estate')}
                  placeholder="e.g. Sunrise Estate"
                  className={fieldClass}
                />
              </div>
              <div className="min-w-0">
                <label htmlFor="floor" className={labelClass}>
                  Floor / door number
                </label>
                <input
                  id="floor"
                  value={values.floor}
                  onChange={set('floor')}
                  placeholder="e.g. 3rd, door 12"
                  className={fieldClass}
                />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline justify-between gap-3">
                <label htmlFor="instructions" className={labelClass}>
                  Delivery instructions
                </label>
                <span className="shrink-0 text-[0.65rem] tabular-nums text-muted-foreground">
                  {values.instructions.length}/{INSTRUCTIONS_MAX}
                </span>
              </div>
              <textarea
                id="instructions"
                rows={3}
                maxLength={INSTRUCTIONS_MAX}
                value={values.instructions}
                onChange={set('instructions')}
                placeholder="Gate, building name or landmark"
                className={cn(fieldClass, 'resize-none')}
              />
            </div>
          </div>
        ) : null}

        <div className="border-t border-border pt-6">
          <button
            type="button"
            onClick={() => setItemsOpen((open) => !open)}
            aria-expanded={itemsOpen}
            aria-controls="checkout-items"
            className="flex w-full items-center justify-between text-left"
          >
            <span>
              <span className="block text-sm font-semibold">
                {count} {count === 1 ? 'item' : 'items'}
              </span>
              <span className="mt-1 block text-xs text-muted-foreground">Total {formatPrice(total)}</span>
            </span>
            <ChevronDown className={cn('size-4 transition-transform', itemsOpen && 'rotate-180')} aria-hidden="true" />
          </button>
          <ul id="checkout-items" hidden={!itemsOpen} className="mt-4 divide-y divide-border">
            {lines.map((line) => (
              <li key={line.key} className="flex justify-between gap-4 py-3 text-sm">
                <span>
                  <span className="font-medium">
                    {line.quantity} × {line.name}
                  </span>
                  {line.selections.length > 0 ? (
                    <span className="block text-xs text-muted-foreground">{line.selections.join(' · ')}</span>
                  ) : null}
                </span>
                <span className="shrink-0 tabular-nums">{formatPrice(line.unitPrice * line.quantity)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </CheckoutCard>
  )
}
