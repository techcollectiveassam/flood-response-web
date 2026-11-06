import {
  BriefcaseMedical,
  Building2,
  MapPin,
  Monitor,
  Siren,
  UserRound,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { TranslationKey } from '@/lib/i18n/catalog'

export type MobileMenuItemVariant = 'default' | 'emergency'

export type MobileMenuItem = {
  labelKey: TranslationKey
  icon: LucideIcon
  to: string
  variant?: MobileMenuItemVariant
}

export type MobileMenuGroup = {
  id: string
  titleKey: TranslationKey
  items: MobileMenuItem[]
}

export const mobileMenuGroups: MobileMenuGroup[] = [
  {
    id: 'citizen',
    titleKey: 'mobileMenu.group.citizen',
    items: [
      {
        labelKey: 'mobileMenu.item.reportFloodedArea',
        icon: MapPin,
        to: '#',
      },
      {
        labelKey: 'mobileMenu.item.requestRelief',
        icon: BriefcaseMedical,
        to: '#',
      },
      {
        labelKey: 'mobileMenu.item.emergencySos',
        icon: Siren,
        to: '#',
        variant: 'emergency',
      },
    ],
  },
  {
    id: 'coordination',
    titleKey: 'mobileMenu.group.coordination',
    items: [
      {
        labelKey: 'mobileMenu.item.volunteerRegistration',
        icon: UserRound,
        to: '#',
      },
      {
        labelKey: 'mobileMenu.item.ngoOnboarding',
        icon: Building2,
        to: '#',
      },
      {
        labelKey: 'mobileMenu.item.commandCenter',
        icon: Monitor,
        to: '#',
      },
    ],
  },
]
