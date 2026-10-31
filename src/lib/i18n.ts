export const languages = ['en', 'as', 'hi', 'bn'] as const

export type LanguageCode = (typeof languages)[number]

const en = {
  'appHeader.openMenu': 'Open navigation menu',
  'appHeader.brand': 'Flood Watch',
  'appHeader.subtitle': 'Assam Floods 2026',
  'appHeader.report': 'Report',
  'menu.title': 'Flood Watch',
  'menu.subtitle': 'Assam Floods 2026',
  'menu.close': 'Close navigation menu',
  'footer.languageLabel': 'Language',
  'footer.copyright': '© 2026 FloodResponse · Coordinated under ASDMA',
  'language.english': 'English',
  'language.assamese': 'অসমীয়া',
  'language.hindi': 'हिन्दी',
  'language.bengali': 'বাংলা',
} as const

export type TranslationKey = keyof typeof en

const messages: Record<LanguageCode, Partial<Record<TranslationKey, string>>> = {
  en,
  as: {},
  hi: {},
  bn: {},
}

export function t(key: TranslationKey, language: LanguageCode = 'en'): string {
  return messages[language][key] ?? en[key]
}
