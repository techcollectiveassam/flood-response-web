import { House, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import {
  SheetClose,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useLanguage } from '@/hooks/use-language'
import { buildLocalizedPath } from '@/lib/i18n/locale-segment'
import { cn } from '@/lib/utils'

type MobileMenuHeaderProps = {
  className?: string
  onNavigate?: () => void
}

export function MobileMenuHeader({
  className,
  onNavigate,
}: MobileMenuHeaderProps) {
  const { t } = useTranslation()
  const { language } = useLanguage()

  return (
    <SheetHeader
      className={cn(
        'flex shrink-0 flex-row items-center gap-2.5 border-b border-border px-3 pt-[max(1rem,env(safe-area-inset-top))] pb-3',
        className,
      )}
    >
      <Link
        to={buildLocalizedPath(language, '/')}
        onClick={onNavigate}
        className="flex min-h-11 min-w-0 flex-1 items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <House className="size-4" aria-hidden="true" />
        </span>

        <div className="min-w-0">
          <SheetTitle className="truncate text-base font-semibold leading-tight">
            {t('mobileMenu.title')}
          </SheetTitle>
          <SheetDescription className="truncate text-[10px] font-medium uppercase tracking-[0.12em]">
            {t('mobileMenu.subtitle')}
          </SheetDescription>
        </div>
      </Link>

      <SheetClose
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-11 shrink-0"
            aria-label={t('mobileMenu.close')}
          />
        }
      >
        <X aria-hidden="true" />
      </SheetClose>
    </SheetHeader>
  )
}
