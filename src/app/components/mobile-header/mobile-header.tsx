import { House, Menu } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type MobileHeaderProps = {
  onMenuClick: () => void
  isMenuOpen?: boolean
}

export function MobileHeader({ onMenuClick, isMenuOpen = false }: MobileHeaderProps) {
  const { t } = useTranslation()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 pt-[env(safe-area-inset-top)] backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-1.5 px-2 sm:px-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-11 shrink-0"
          aria-label={t('mobileHeader.openMenu')}
          aria-haspopup="dialog"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu-drawer"
          onClick={onMenuClick}
        >
          <Menu aria-hidden="true" />
        </Button>

        <div className="flex min-w-0 items-center gap-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <House className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-tight">
              {t('header.brand')}
            </p>
            <p className="truncate text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
              {t('mobileHeader.subtitle')}
            </p>
          </div>
        </div>

        <a
          href="#"
          className={cn(
            buttonVariants({ size: 'sm' }),
            'ml-auto min-h-11 px-4 text-xs font-semibold uppercase tracking-[0.08em]',
          )}
        >
          {t('header.report')}
        </a>
      </div>
    </header>
  )
}
