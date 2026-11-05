import { useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import { MobileHeader } from '@/app/components/mobile-header/mobile-header'
import { MobileMenuSheet } from '@/app/components/mobile-menu/mobile-menu-sheet'
import { SkipToContentLink } from '@/app/components/skip-to-content-link'
import { stripLocaleSegment } from '@/lib/i18n/locale-segment'

function MobileNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <MobileHeader
        isMenuOpen={isMenuOpen}
        onMenuClick={() => setIsMenuOpen(true)}
      />
      <MobileMenuSheet open={isMenuOpen} onOpenChange={setIsMenuOpen} />
    </>
  )
}

export function MobileAppShell() {
  const { pathname } = useLocation()
  const routeKey = stripLocaleSegment(pathname)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SkipToContentLink />
      <MobileNavigation key={routeKey} />
      <main
        id="main-content"
        tabIndex={-1}
        className="container mx-auto px-4 py-6 focus:outline-none"
      >
        <Outlet />
      </main>
    </div>
  )
}
