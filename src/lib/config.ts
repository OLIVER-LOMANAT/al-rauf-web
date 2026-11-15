/**
 * Where the backend API lives.
 *
 *  - API_PREFIX        : used by the visitor's browser (checkout, reservations, order tracking).
 *  - SERVER_API_PREFIX : used by the Next.js server (menu, settings, gallery, jobs). It can be a private
 *                        address (e.g. http://backend:4000 inside Docker) via API_INTERNAL_URL.
 */
const publicBase = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000').replace(/\/+$/, '')
const internalBase = (process.env.API_INTERNAL_URL || publicBase).replace(/\/+$/, '')

export const API_BASE_URL = publicBase
export const API_PREFIX = `${publicBase}/api`
export const SERVER_API_PREFIX = `${internalBase}/api`

/** The public address of this website, for canonical links and the sitemap. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '')
