import { useMediaQuery } from '@/hooks/use-media-query'
import { ReloadPrompt } from '@/app/components/reload-prompt'
import { DesktopAppShell } from './desktop-app-shell'
import { MobileAppShell } from './mobile-app-shell'

const DESKTOP_QUERY = '(min-width: 1024px)'

export function RootLayout() {
  const isDesktop = useMediaQuery(DESKTOP_QUERY)

  return (
    <>
      {isDesktop ? <DesktopAppShell /> : <MobileAppShell />}
      <ReloadPrompt />
    </>
  )
}
