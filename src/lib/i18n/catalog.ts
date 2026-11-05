import en from './locales/en.json'
import as from './locales/as.json'
import hi from './locales/hi.json'
import bn from './locales/bn.json'
import type { LanguageCode } from './config'

export type EnCatalog = typeof en

export type TranslationKey = keyof EnCatalog

export const catalogs: Record<LanguageCode, EnCatalog> = {
  en,
  as,
  hi,
  bn,
}

export const resources = {
  en: { translation: en },
  as: { translation: as },
  hi: { translation: hi },
  bn: { translation: bn },
} as const
