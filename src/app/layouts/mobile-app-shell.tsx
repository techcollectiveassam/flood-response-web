import { useState } from 'react'
import { Outlet } from 'react-router'
import { AppHeader } from '@/app/components/app-header'
import { AppMenuSheet } from '@/app/components/app-menu/app-menu-sheet'
import type { LanguageCode } from '@/lib/i18n'

export function MobileAppShell() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [language, setLanguage] = useState<LanguageCode>('en')

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader language={language} isMenuOpen={isMenuOpen} onMenuClick={() => setIsMenuOpen(true)} />
      <AppMenuSheet open={isMenuOpen} onOpenChange={setIsMenuOpen} language={language} onLanguageChange={setLanguage} />
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
