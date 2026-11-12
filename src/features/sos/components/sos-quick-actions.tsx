import { useIsDesktop } from '@/hooks/use-is-desktop'
import { SosQuickActionsDesktop } from './sos-quick-actions-desktop'
import { SosQuickActionsMobile } from './sos-quick-actions-mobile'

export function SosQuickActions() {
  return useIsDesktop() ? <SosQuickActionsDesktop /> : <SosQuickActionsMobile />
}
