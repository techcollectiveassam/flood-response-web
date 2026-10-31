import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { t } from '@/lib/i18n'
import type { LanguageCode } from '@/lib/i18n'
import { AppMenuFooter } from './app-menu-footer'

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
        className="data-[side=left]:w-[85vw] data-[side=left]:max-w-xs data-[side=left]:sm:max-w-xs"
      >
        <SheetHeader>
          <SheetTitle>{t('menu.placeholderTitle')}</SheetTitle>
          <SheetDescription>{t('menu.placeholderDescription')}</SheetDescription>
        </SheetHeader>
        <AppMenuFooter
          language={language}
          onLanguageChange={setLanguage}
        />
      </SheetContent>
    </Sheet>
  )
}
