import type { TranslationKey } from '@/lib/i18n'

export type DesktopFooterLinkVariant = 'default' | 'emergency'

export type DesktopFooterLink = {
  labelKey: TranslationKey
  to: string
  variant?: DesktopFooterLinkVariant
}

export type DesktopFooterLinkGroup = {
  id: string
  titleKey: TranslationKey
  links: DesktopFooterLink[]
}

export const desktopFooterLinkGroups: DesktopFooterLinkGroup[] = [
  {
    id: 'citizen',
    titleKey: 'footer.citizenTitle',
    links: [
      {
        labelKey: 'footer.link.reportFloodedArea',
        to: '#',
        variant: 'emergency',
      },
      {
        labelKey: 'footer.link.requestRelief',
        to: '#',
      },
      {
        labelKey: 'footer.link.emergencySosHotline',
        to: '#',
      },
    ],
  },
  {
    id: 'coordination',
    titleKey: 'footer.coordinationTitle',
    links: [
      {
        labelKey: 'footer.link.volunteerRegistration',
        to: '#',
      },
      {
        labelKey: 'footer.link.ngoOnboarding',
        to: '#',
      },
      {
        labelKey: 'footer.link.commandCenter',
        to: '#',
      },
    ],
  },
]

export const desktopFooterPolicyLinks: DesktopFooterLink[] = [
  {
    labelKey: 'footer.privacyPolicy',
    to: '#',
  },
  {
    labelKey: 'footer.crisisDataTerms',
    to: '#',
  },
]
