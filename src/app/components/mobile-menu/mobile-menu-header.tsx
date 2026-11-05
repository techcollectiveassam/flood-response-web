import { House, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  SheetClose,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

type MobileMenuHeaderProps = {
  className?: string
}

export function MobileMenuHeader({ className }: MobileMenuHeaderProps) {
  const { t } = useTranslation()

  return (
    <SheetHeader
      className={cn(
        'flex shrink-0 flex-row items-center gap-2.5 border-b border-border px-3 pt-[max(1rem,env(safe-area-inset-top))] pb-3',
        className,
      )}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <House className="size-4" aria-hidden="true" />
      </span>

      <div className="min-w-0 flex-1">
        <SheetTitle className="truncate text-base font-semibold leading-tight">
          {t('mobileMenu.title')}
        </SheetTitle>
        <SheetDescription className="truncate text-[10px] font-medium uppercase tracking-[0.12em]">
          {t('mobileMenu.subtitle')}
        </SheetDescription>
      </div>

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
