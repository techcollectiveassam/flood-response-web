import {
  BriefcaseMedical,
  Building2,
  MapPin,
  Monitor,
  Siren,
  UserRound,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { TranslationKey } from '@/lib/i18n'

export type MenuItemVariant = 'default' | 'emergency'

export type MenuItem = {
  labelKey: TranslationKey
  icon: LucideIcon
  to: string
  variant?: MenuItemVariant
}

export type MenuGroup = {
  id: string
  titleKey: TranslationKey
  items: MenuItem[]
}

export const menuGroups: MenuGroup[] = [
  {
    id: 'citizen',
    titleKey: 'menu.group.citizen',
    items: [
      {
        labelKey: 'menu.item.reportFloodedArea',
        icon: MapPin,
        to: '#',
      },
      {
        labelKey: 'menu.item.requestRelief',
        icon: BriefcaseMedical,
        to: '#',
      },
      {
        labelKey: 'menu.item.emergencySos',
        icon: Siren,
        to: '#',
        variant: 'emergency',
      },
    ],
  },
  {
    id: 'coordination',
    titleKey: 'menu.group.coordination',
    items: [
      {
        labelKey: 'menu.item.volunteerRegistration',
        icon: UserRound,
        to: '#',
      },
      {
        labelKey: 'menu.item.ngoOnboarding',
        icon: Building2,
        to: '#',
      },
      {
        labelKey: 'menu.item.commandCenter',
        icon: Monitor,
        to: '#',
      },
    ],
  },
]
