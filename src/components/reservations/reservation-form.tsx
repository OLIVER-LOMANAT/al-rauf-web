'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { AlertCircle, Loader2 } from 'lucide-react'
import { submitReservation } from '@/lib/reservation-actions'
import { ctaBase, StarMark } from '@/components/site/primitives'
import { MAX_GUESTS, type ReservationField, type ReservationState } from '@/lib/reservations'
import { cn } from '@/lib/utils'

const initialState: ReservationState = { status: 'idle' }

const inputClass =
  'mt-2 block w-full border-0 border-b border-foreground/25 bg-transparent px-0 py-3 text-base text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-olive focus:outline-none focus:ring-0 aria-[invalid=true]:border-destructive'

function localDateKey() {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60_000
  return new Date(now.getTime() - offset).toISOString().slice(0, 10)
}

export function ReservationForm() {
  const [state, formAction, pending] = useActionState(submitReservation, initialState)
  // Worked out in the browser after the page loads, so the visitor's own date is used (the server may be in another timezone).
  const [minDate, setMinDate] = useState<string | undefined>(undefined)
  const [dismissed, setDismissed] = useState<ReservationState | null>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const errorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMinDate(localDateKey())
  }, [])

  useEffect(() => {
    if (state.status === 'success') resultRef.current?.focus()
    if (state.status === 'error') errorRef.current?.focus()
  }, [state])

  if (state.status === 'success' && dismissed !== state) {
    return (
      <div ref={resultRef} tabIndex={-1} role="status" className="border border-olive/40 bg-background p-8 outline-none md:p-12">
        <StarMark className="size-8 text-champagne" />
        <p className="eyebrow mt-6 text-olive">Request received</p>
        <h2 className="mt-4 text-balance font-serif text-4xl leading-tight">
          Thank you, {state.values.name.split(' ')[0]}.
        </h2>
        <p className="mt-4 max-w-md text-pretty leading-relaxed text-muted-foreground">
          Your table request has been sent to Al Rauf. The restaurant will confirm by phone or email — this is not an
          instant booking.
        </p>
        <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-border py-6 text-sm sm:grid-cols-3">
          {[
            ['Date', state.values.date],
            ['Time', state.values.time],
            ['Guests', state.values.guests],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="eyebrow text-[0.6rem] text-muted-foreground">{label}</dt>
              <dd className="mt-1 font-serif text-xl">{value}</dd>
            </div>
          ))}
        </dl>
        <button
          type="button"
          onClick={() => setDismissed(state)}
          className={cn(ctaBase, 'mt-8 border border-foreground/30 hover:border-olive hover:text-olive')}
        >
          Start a new request
        </button>
      </div>
    )
  }

  const errors = state.status === 'error' ? state.errors : {}
  const values = state.status === 'error' ? state.values : undefined

  const fieldProps = (name: ReservationField) => ({
    id: `reservation-${name}`,
    name,
    defaultValue: values?.[name],
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `reservation-${name}-error` : undefined,
  })

  const FieldError = ({ name }: { name: ReservationField }) =>
    errors[name] ? (
      <p id={`reservation-${name}-error`} className="mt-2 text-sm text-destructive">
        {errors[name]}
      </p>
    ) : null

  const Label = ({ name, children, optional }: { name: ReservationField; children: string; optional?: boolean }) => (
    <label htmlFor={`reservation-${name}`} className="eyebrow text-[0.62rem] text-foreground/70">
      {children}
      {optional ? <span className="ml-2 normal-case tracking-normal text-muted-foreground">(optional)</span> : null}
    </label>
  )

  return (
    <form action={formAction} noValidate className="space-y-8">
      {state.status === 'error' ? (
        <div
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          className="flex items-start gap-3 border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive outline-none"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {state.message}
        </div>
      ) : null}

      <div>
        <Label name="name">Full name</Label>
        <input {...fieldProps('name')} type="text" autoComplete="name" required className={inputClass} />
        <FieldError name="name" />
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <Label name="email">Email address</Label>
          <input {...fieldProps('email')} type="email" autoComplete="email" required className={inputClass} />
          <FieldError name="email" />
        </div>
        <div>
          <Label name="phone">Phone number</Label>
          <input {...fieldProps('phone')} type="tel" autoComplete="tel" required className={inputClass} />
          <FieldError name="phone" />
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-3">
        <div>
          <Label name="date">Date</Label>
          <input {...fieldProps('date')} type="date" min={minDate} required className={inputClass} />
          <FieldError name="date" />
        </div>
        <div>
          <Label name="time">Preferred time</Label>
          <input {...fieldProps('time')} type="time" required className={inputClass} />
          <FieldError name="time" />
        </div>
        <div>
          <Label name="guests">Guests</Label>
          <input
            {...fieldProps('guests')}
            type="number"
            inputMode="numeric"
            min={1}
            max={MAX_GUESTS}
            step={1}
            defaultValue={values?.guests ?? '2'}
            required
            className={inputClass}
          />
          <FieldError name="guests" />
        </div>
      </div>

      <div>
        <Label name="requests" optional>
          Special requests
        </Label>
        <textarea
          {...fieldProps('requests')}
          rows={3}
          maxLength={1000}
          placeholder="Occasions, dietary needs, seating preferences…"
          className={cn(inputClass, 'resize-none')}
        />
      </div>

      <div className="flex flex-col gap-5 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
          Requests are confirmed by the restaurant. You will hear back once your table is checked.
        </p>
        <button
          type="submit"
          disabled={pending}
          className={cn(ctaBase, 'bg-olive text-primary-foreground hover:bg-olive-deep disabled:opacity-60')}
        >
          {pending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
          {pending ? 'Sending request' : 'Request a Table'}
        </button>
      </div>
    </form>
  )
}
