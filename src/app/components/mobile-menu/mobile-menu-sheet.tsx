import { Sheet, SheetContent } from '@/components/ui/sheet'
import { t } from '@/lib/i18n'
import type { LanguageCode } from '@/lib/i18n'
import { MobileMenuFooter } from './mobile-menu-footer'
import { MobileMenuHeader } from './mobile-menu-header'
import { mobileMenuGroups } from './mobile-menu-config'
import { MobileMenuNavGroup } from './mobile-menu-nav-group'

type MobileMenuSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  language: LanguageCode
  onLanguageChange: (language: LanguageCode) => void
}

export function MobileMenuSheet({ open, onOpenChange, language, onLanguageChange }: MobileMenuSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        id="mobile-menu-drawer"
        side="left"
        showCloseButton={false}
        className="gap-0 p-0 data-[side=left]:w-[85vw] data-[side=left]:max-w-xs data-[side=left]:sm:max-w-xs"
      >
        <MobileMenuHeader language={language} />
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3">
          <nav aria-label={t('mobileMenu.navigationLabel', language)} className="space-y-1">
            {mobileMenuGroups.map((group) => (
              <MobileMenuNavGroup key={group.id} group={group} language={language} />
            ))}
          </nav>
        </div>
        <MobileMenuFooter language={language} onLanguageChange={onLanguageChange} />
      </SheetContent>
    </Sheet>
  )
}
