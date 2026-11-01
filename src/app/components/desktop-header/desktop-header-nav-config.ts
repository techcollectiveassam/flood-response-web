import { UserPlus } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { TranslationKey } from '@/lib/i18n'

export type DesktopHeaderNavItemVariant = 'default' | 'emergency'

export type DesktopHeaderNavItem = {
  labelKey: TranslationKey
  to: string
  icon?: LucideIcon
  variant?: DesktopHeaderNavItemVariant
}

export const desktopHeaderNavItems: DesktopHeaderNavItem[] = [
  {
    labelKey: 'desktopHeader.volunteer',
    to: '#',
    icon: UserPlus,
  },
]
