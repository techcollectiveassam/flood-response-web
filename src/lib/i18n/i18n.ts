import i18n from 'i18next'
import ICU from 'i18next-icu'
import { initReactI18next } from 'react-i18next'
import { resources } from './catalog'
import { DEFAULT_LANGUAGE } from './config'
import { resolveInitialLanguage } from './detect-language'

const initialLanguage =
  typeof window === 'undefined'
    ? DEFAULT_LANGUAGE
    : resolveInitialLanguage(window.location.pathname)

void i18n.use(ICU).use(initReactI18next).init({
  lng: initialLanguage,
  fallbackLng: DEFAULT_LANGUAGE,
  resources,
  keySeparator: false,
  nsSeparator: false,
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
})

export { i18n }
