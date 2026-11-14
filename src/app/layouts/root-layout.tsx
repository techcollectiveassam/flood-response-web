import { useIsDesktop } from '@/hooks/use-is-desktop'
import { ReloadPrompt } from '@/app/components/reload-prompt'
import { DesktopAppShell } from './desktop-app-shell'
import { MobileAppShell } from './mobile-app-shell'

export function RootLayout() {
  const isDesktop = useIsDesktop()

  return (
    <>
      {isDesktop ? <DesktopAppShell /> : <MobileAppShell />}
      <ReloadPrompt />
    </>
  )
}
