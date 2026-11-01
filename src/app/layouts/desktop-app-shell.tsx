import { useState } from 'react'
import { Outlet } from 'react-router'
import { DesktopFooter } from '@/app/components/desktop-footer/desktop-footer'
import { DesktopHeader } from '@/app/components/desktop-header/desktop-header'
import type { LanguageCode } from '@/lib/i18n'

export function DesktopAppShell() {
  const [language, setLanguage] = useState<LanguageCode>('en')

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <DesktopHeader language={language} onLanguageChange={setLanguage} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        <Outlet />
      </main>
      <DesktopFooter language={language} onLanguageChange={setLanguage} />
    </div>
  )
}
