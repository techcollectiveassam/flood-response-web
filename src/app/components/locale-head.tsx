import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'
import { languages, resolveLanguage } from '@/lib/i18n/config'
import { stripLocalePrefix } from '@/lib/i18n/locale-segment'

export function LocaleHead() {
  const { t, i18n } = useTranslation()
  const { pathname, search } = useLocation()
  const language = resolveLanguage(i18n.resolvedLanguage ?? i18n.language)
  const rest = stripLocalePrefix(pathname, language)
  const pathSuffix = rest === '/' ? '' : rest
  const origin = typeof window === 'undefined' ? '' : window.location.origin
  const canonical = `${origin}${pathname}${search}`

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = 'ltr'
  }, [language])

  return (
    <>
      <title>{t('meta.title')}</title>
      <meta name="description" content={t('meta.description')} />
      <link rel="canonical" href={canonical} />
      {languages.map((locale) => (
        <link
          key={locale}
          rel="alternate"
          hrefLang={locale}
          href={`${origin}/${locale}${pathSuffix}${search}`}
        />
      ))}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${origin}/en${pathSuffix}${search}`}
      />
    </>
  )
}
