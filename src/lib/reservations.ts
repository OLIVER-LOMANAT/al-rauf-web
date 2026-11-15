export type ReservationField = 'name' | 'email' | 'phone' | 'date' | 'time' | 'guests' | 'requests'

export type ReservationRequest = Record<ReservationField, string>

export type ReservationState =
  | { status: 'idle' }
  | { status: 'error'; message: string; errors: Partial<Record<ReservationField, string>>; values: ReservationRequest }
  | { status: 'success'; values: ReservationRequest }

export const MAX_GUESTS = 20

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^\+?[\d\s()-]{7,20}$/

export function readReservation(formData: FormData): ReservationRequest {
  const get = (key: ReservationField) => String(formData.get(key) ?? '').trim()
  return {
    name: get('name').slice(0, 120),
    email: get('email').slice(0, 200),
    phone: get('phone').slice(0, 30),
    date: get('date'),
    time: get('time'),
    guests: get('guests'),
    requests: get('requests').slice(0, 1000),
  }
}

export function validateReservation(values: ReservationRequest, today = new Date()) {
  const errors: Partial<Record<ReservationField, string>> = {}

  if (values.name.length < 2) errors.name = 'Please enter your name.'
  if (!emailPattern.test(values.email)) errors.email = 'Please enter a valid email address.'
  if (!phonePattern.test(values.phone)) errors.phone = 'Please enter a valid phone number.'

  if (!/^\d{4}-\d{2}-\d{2}$/.test(values.date)) {
    errors.date = 'Please choose a date.'
  } else {
    // Allow one day of slack so guests in timezones behind UTC can still pick their local "today".
    const earliestKey = new Date(today.getTime() - 86_400_000).toISOString().slice(0, 10)
    if (values.date < earliestKey) errors.date = 'Please choose a date that is not in the past.'
  }

  if (!/^\d{2}:\d{2}$/.test(values.time)) errors.time = 'Please choose a preferred time.'

  const guests = Number(values.guests)
  if (!Number.isInteger(guests) || guests < 1 || guests > MAX_GUESTS) {
    errors.guests = `Please enter between 1 and ${MAX_GUESTS} guests.`
  }

  return errors
}
