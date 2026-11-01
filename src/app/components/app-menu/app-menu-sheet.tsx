import { Sheet, SheetContent } from '@/components/ui/sheet'
import { t } from '@/lib/i18n'
import type { LanguageCode } from '@/lib/i18n'
import { AppMenuFooter } from './app-menu-footer'
import { AppMenuHeader } from './app-menu-header'
import { menuGroups } from './menu-config'
import { MenuNavGroup } from './menu-nav-group'

type AppMenuSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  language: LanguageCode
  onLanguageChange: (language: LanguageCode) => void
}

export function AppMenuSheet({ open, onOpenChange, language, onLanguageChange }: AppMenuSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        id="app-menu-drawer"
        side="left"
        showCloseButton={false}
        className="gap-0 p-0 data-[side=left]:w-[85vw] data-[side=left]:max-w-xs data-[side=left]:sm:max-w-xs"
      >
        <AppMenuHeader language={language} />
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3">
          <nav aria-label={t('menu.navigationLabel', language)} className="space-y-1">
            {menuGroups.map((group) => (
              <MenuNavGroup key={group.id} group={group} language={language} />
            ))}
          </nav>
        </div>
        <AppMenuFooter language={language} onLanguageChange={onLanguageChange} />
      </SheetContent>
    </Sheet>
  )
}
