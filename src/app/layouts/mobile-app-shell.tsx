import { useState } from 'react'
import { Outlet } from 'react-router'
import { MobileHeader } from '@/app/components/mobile-header/mobile-header'
import { MobileMenuSheet } from '@/app/components/mobile-menu/mobile-menu-sheet'

export function MobileAppShell() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MobileHeader
        isMenuOpen={isMenuOpen}
        onMenuClick={() => setIsMenuOpen(true)}
      />
      <MobileMenuSheet open={isMenuOpen} onOpenChange={setIsMenuOpen} />
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
