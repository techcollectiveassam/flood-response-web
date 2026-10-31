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
  'footer.navigationLabel': 'Footer navigation',
  'footer.legalLabel': 'Legal',
  'footer.copyright': '© 2026 FloodResponse · Coordinated under ASDMA',
  'footer.crisisTitle': 'Assam Floods 2026 Crisis Coordination',
  'footer.description':
    'An open humanitarian coordination platform connecting affected citizens, district administrations, NDRF rescue teams, and verified relief organizations in real-time.',
  'footer.systemStatus': 'System operational · Offline-ready sync enabled',
  'footer.citizenTitle': 'Citizen services',
  'footer.coordinationTitle': 'Coordination & relief',
  'footer.verificationTitle': 'Verification & data policy',
  'footer.link.reportFloodedArea': 'Report Flooded Area',
  'footer.link.requestRelief': 'Request Food & Medical Relief',
  'footer.link.emergencySosHotline': 'Emergency SOS Hotline',
  'footer.link.volunteerRegistration': 'Volunteer Registration Portal',
  'footer.link.ngoOnboarding': 'NGO & Agency Partner Onboarding',
  'footer.link.commandCenter': 'Command Center Staff Portal',
  'footer.verificationBody':
    'Coordinated in partnership with ASDMA (Assam State Disaster Management Authority), Revenue Circle Desks, and SDRF field officers.',
  'footer.privacyNotice':
    'Phone numbers (98******12) and precise household coordinates are strictly masked per crisis data privacy protocols.',
  'footer.installPwa': 'Install PWA for Offline Access',
  'footer.copyrightDesktop':
    '© 2026 FloodResponse Humanitarian Initiative • Coordinated under ASDMA disaster response protocol',
  'footer.privacyPolicy': 'Privacy Policy',
  'footer.crisisDataTerms': 'Crisis Data Terms',
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
