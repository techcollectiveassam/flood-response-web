import { useState } from 'react'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import type { LanguageCode } from '@/lib/i18n'
import { AppMenuFooter } from './app-menu-footer'
import { AppMenuHeader } from './app-menu-header'

type AppMenuSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AppMenuSheet({ open, onOpenChange }: AppMenuSheetProps) {
  const [language, setLanguage] = useState<LanguageCode>('en')

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        id="app-menu-drawer"
        side="left"
        showCloseButton={false}
        className="gap-0 p-0 data-[side=left]:w-[85vw] data-[side=left]:max-w-xs data-[side=left]:sm:max-w-xs"
      >
        <AppMenuHeader />
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3" />
        <AppMenuFooter language={language} onLanguageChange={setLanguage} />
      </SheetContent>
    </Sheet>
  )
}
