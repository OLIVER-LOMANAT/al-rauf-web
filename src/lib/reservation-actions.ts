import { ApiError, api } from '@/lib/api'
import { readReservation, validateReservation, type ReservationState } from '@/lib/reservations'

/**
 * Submit a table request to POST /api/reservations.
 */
export async function submitReservation(_prev: ReservationState, formData: FormData): Promise<ReservationState> {
  const values = readReservation(formData)
  const errors = validateReservation(values)

  if (Object.keys(errors).length > 0) {
    return { status: 'error', message: 'Please review the highlighted fields.', errors, values }
  }

  const guests = Number.parseInt(values.guests, 10)
  try {
    await api.createReservation({
      name: values.name,
      email: values.email,
      phone: values.phone,
      date: values.date,
      time: values.time,
      guests,
      requests: values.requests || null,
    })
    return { status: 'success', values }
  } catch (e) {
    if (e instanceof ApiError) {
      const fieldErrors = e.fieldErrors
      // Map backend field paths onto form fields
      const mapped: Partial<Record<keyof typeof values, string>> = {}
      for (const [k, v] of Object.entries(fieldErrors)) {
        if (k in values) mapped[k as keyof typeof values] = v
      }
      return {
        status: 'error',
        message: e.message || 'Please review the highlighted fields.',
        errors: Object.keys(mapped).length ? mapped : {},
        values,
      }
    }
    return {
      status: 'error',
      message: 'We could not send your request. Please try again in a moment.',
      errors: {},
      values,
    }
  }
}
