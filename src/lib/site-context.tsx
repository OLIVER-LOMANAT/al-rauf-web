'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { API_PREFIX } from '@/lib/config'
import { buildSiteState, textFrom, unwrapSettings, type SiteState } from '@/lib/site-data'

type SiteContextValue = SiteState & {
  /** Text the owner edited, or the fallback. */
  text: (key: string, fallback: string) => string
  /** Re-reads the settings straight from the API (the checkout page does this so the money rules are current). */
  refresh: () => Promise<void>
}

const SiteContext = createContext<SiteContextValue | null>(null)

/** Hands the settings the server fetched to every client component. */
export function SiteProvider({ initial, children }: { initial: SiteState; children: ReactNode }) {
  const [state, setState] = useState<SiteState>(initial)

  const refresh = useCallback(async () => {
    const controller = new AbortController()
    const timer = window.setTimeout(() => controller.abort(), 3000)
    try {
      const res = await fetch(`${API_PREFIX}/settings`, { headers: { Accept: 'application/json' }, signal: controller.signal })
      if (!res.ok) return
      const settings = unwrapSettings(await res.json())
      if (settings) setState(buildSiteState(settings))
    } catch {
      /* offline or slow: keep what the server gave us */
    } finally {
      window.clearTimeout(timer)
    }
  }, [])

  const value = useMemo<SiteContextValue>(
    () => ({ ...state, text: (key, fallback) => textFrom(state.content, key, fallback), refresh }),
    [state, refresh],
  )

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}

export function useSite() {
  const context = useContext(SiteContext)
  if (!context) throw new Error('useSite must be used inside SiteProvider')
  return context
}
