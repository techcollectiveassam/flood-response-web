export const languages = ['en', 'as', 'hi', 'bn'] as const

export type LanguageCode = (typeof languages)[number]

const en = {
  'appHeader.openMenu': 'Open navigation menu',
  'appHeader.brand': 'Flood Watch',
  'appHeader.subtitle': 'Assam Floods 2026',
  'appHeader.report': 'Report',
  'desktopHeader.navigationLabel': 'Desktop navigation',
  'desktopHeader.year': 'Assam 2026',
  'desktopHeader.liveStatus': 'Live · Last updated 10 min ago',
  'desktopHeader.volunteer': 'Volunteer',
  'menu.title': 'Flood Watch',
  'menu.subtitle': 'Assam Floods 2026',
  'menu.close': 'Close navigation menu',
  'menu.navigationLabel': 'Main navigation',
  'menu.group.citizen': 'Citizen services',
  'menu.group.coordination': 'Coordination & relief',
  'menu.item.reportFloodedArea': 'Report Flooded Area',
  'menu.item.requestRelief': 'Request Food & Medical Relief',
  'menu.item.emergencySos': 'Emergency SOS',
  'menu.item.volunteerRegistration': 'Volunteer Registration Portal',
  'menu.item.ngoOnboarding': 'NGO & Partner Onboarding',
  'menu.item.commandCenter': 'Command Center Staff Portal',
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
