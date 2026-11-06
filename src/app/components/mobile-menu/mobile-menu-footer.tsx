import { useTranslation } from 'react-i18next'
import { SheetFooter } from '@/components/ui/sheet'
import { LanguageSwitcher } from '@/components/language-switcher'

export function MobileMenuFooter() {
  const { t } = useTranslation()

  return (
    <SheetFooter className="mt-auto shrink-0 gap-2.5 border-t border-border px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <LanguageSwitcher />
      <p className="text-center text-[10px] leading-relaxed text-muted-foreground">
        {t('footer.copyright')}
      </p>
    </SheetFooter>
  )
}
