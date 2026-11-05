import { matchPath, useLocation } from 'react-router'
import { useLanguage } from '@/hooks/use-language'
import { stripLocalePrefix } from '@/lib/i18n/locale-segment'

export function useIsActivePath(to: string): boolean {
  const { language } = useLanguage()
  const { pathname } = useLocation()

  if (to === '#') {
    return false
  }

  const localizedPathname = stripLocalePrefix(pathname, language) || '/'

  return matchPath({ path: to, end: to === '/' }, localizedPathname) !== null
}
