import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

/** false while the server renders and during hydration, true afterwards. Used to attach portals to document.body. */
export function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
}
