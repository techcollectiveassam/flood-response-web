import { useSyncExternalStore } from 'react'

const canUseMatchMedia = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      if (!canUseMatchMedia()) {
        return () => {}
      }

      const mediaQueryList = window.matchMedia(query)
      mediaQueryList.addEventListener('change', onStoreChange)

      return () => mediaQueryList.removeEventListener('change', onStoreChange)
    },
    () => (canUseMatchMedia() ? window.matchMedia(query).matches : false),
    () => false,
  )
}
