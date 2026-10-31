import { SheetFooter } from '@/components/ui/sheet'
import { LanguageSwitcher } from '@/components/language-switcher'
import { t } from '@/lib/i18n'
import type { LanguageCode } from '@/lib/i18n'

type AppMenuFooterProps = {
  language: LanguageCode
  onLanguageChange: (language: LanguageCode) => void
}

export function AppMenuFooter({
  language,
  onLanguageChange,
}: AppMenuFooterProps) {
  return (
    <SheetFooter className="mt-auto shrink-0 gap-2.5 border-t border-border px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <LanguageSwitcher value={language} onChange={onLanguageChange} />
      <p className="text-center text-[10px] leading-relaxed text-muted-foreground">
        {t('footer.copyright')}
      </p>
    </SheetFooter>
  )
}
