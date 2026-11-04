import { Outlet } from 'react-router'
import { DesktopFooter } from '@/app/components/desktop-footer/desktop-footer'
import { DesktopHeader } from '@/app/components/desktop-header/desktop-header'
import { SkipToContentLink } from '@/app/components/skip-to-content-link'

export function DesktopAppShell() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SkipToContentLink />
      <DesktopHeader />
      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto w-full max-w-7xl flex-1 px-6 py-8 focus:outline-none"
      >
        <Outlet />
      </main>
      <DesktopFooter />
    </div>
  )
}
