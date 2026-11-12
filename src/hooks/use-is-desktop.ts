import { useMediaQuery } from '@/hooks/use-media-query'

const DESKTOP_MEDIA_QUERY = '(min-width: 1024px)'

export function useIsDesktop(): boolean {
  return useMediaQuery(DESKTOP_MEDIA_QUERY)
}
