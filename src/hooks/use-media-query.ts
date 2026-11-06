import { useSyncExternalStore } from 'react'

const canUseMatchMedia = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'

const mediaQueryLists = new Map<string, MediaQueryList>()

function getMediaQueryList(query: string): MediaQueryList | null {
  if (!canUseMatchMedia()) {
    return null
  }

  let mediaQueryList = mediaQueryLists.get(query)

  if (!mediaQueryList) {
    mediaQueryList = window.matchMedia(query)
    mediaQueryLists.set(query, mediaQueryList)
  }

  return mediaQueryList
}

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mediaQueryList = getMediaQueryList(query)

      if (!mediaQueryList) {
        return () => {}
      }

      mediaQueryList.addEventListener('change', onStoreChange)

      return () => mediaQueryList.removeEventListener('change', onStoreChange)
    },
    () => getMediaQueryList(query)?.matches ?? false,
    () => false,
  )
}
