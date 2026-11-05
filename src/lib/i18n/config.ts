export const languages = ['en', 'as', 'hi', 'bn'] as const

export type LanguageCode = (typeof languages)[number]

export type LocaleConfig = {
  code: LanguageCode
  endonym: string
  intlLocale: string
  numberingSystem: 'latn' | 'beng' | 'deva'
  direction: 'ltr'
}

export const localeConfig: Record<LanguageCode, LocaleConfig> = {
  en: {
    code: 'en',
    endonym: 'English',
    intlLocale: 'en',
    numberingSystem: 'latn',
    direction: 'ltr',
  },
  as: {
    code: 'as',
    endonym: 'অসমীয়া',
    intlLocale: 'as',
    numberingSystem: 'beng',
    direction: 'ltr',
  },
  hi: {
    code: 'hi',
    endonym: 'हिन्दी',
    intlLocale: 'hi',
    numberingSystem: 'deva',
    direction: 'ltr',
  },
  bn: {
    code: 'bn',
    endonym: 'বাংলা',
    intlLocale: 'bn',
    numberingSystem: 'beng',
    direction: 'ltr',
  },
}

export const DEFAULT_LANGUAGE: LanguageCode = 'en'

export const LANGUAGE_STORAGE_KEY = 'flood-response.language'

export function isLanguageCode(value: string): value is LanguageCode {
  return (languages as readonly string[]).includes(value)
}

export function resolveLanguage(value: string | undefined): LanguageCode {
  if (!value) {
    return DEFAULT_LANGUAGE
  }

  const base = value.toLowerCase().split('-')[0]
  return isLanguageCode(base) ? base : DEFAULT_LANGUAGE
}
