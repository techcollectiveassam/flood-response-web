import { useState } from 'react'
import { Outlet } from 'react-router'
import { AppHeader } from '@/app/components/app-header'
import { AppMenuSheet } from '@/app/components/app-menu/app-menu-sheet'

export function MobileAppShell() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader isMenuOpen={isMenuOpen} onMenuClick={() => setIsMenuOpen(true)} />
      <AppMenuSheet open={isMenuOpen} onOpenChange={setIsMenuOpen} />
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
