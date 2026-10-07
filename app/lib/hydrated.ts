import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

/** false durante el prerender y la hidratación; true después, en el cliente. */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
}
