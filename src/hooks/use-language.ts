import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router'
import { resolveLanguage } from '@/lib/i18n/config'
import type { LanguageCode } from '@/lib/i18n/config'
import { storeLanguage } from '@/lib/i18n/detect-language'
import { stripLocalePrefix } from '@/lib/i18n/locale-segment'

export function useLanguage() {
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const { pathname, search, hash } = useLocation()
  const language = resolveLanguage(i18n.resolvedLanguage ?? i18n.language)

  const setLanguage = useCallback(
    async (nextLanguage: LanguageCode) => {
      storeLanguage(nextLanguage)
      await i18n.changeLanguage(nextLanguage)

      if (nextLanguage === language) {
        return
      }

      const rest = stripLocalePrefix(pathname, language)
      const path = rest === '/' ? '' : rest
      navigate(`/${nextLanguage}${path}${search}${hash}`)
    },
    [hash, i18n, language, navigate, pathname, search],
  )

  return { language, setLanguage }
}
