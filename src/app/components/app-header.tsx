import { House, Menu } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { t } from '@/lib/i18n'

type AppHeaderProps = {
  onMenuClick: () => void
  isMenuOpen?: boolean
}

export function AppHeader({ onMenuClick, isMenuOpen = false }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 pt-[env(safe-area-inset-top)] backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-1.5 px-2 sm:px-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-11 shrink-0"
          aria-label={t('appHeader.openMenu')}
          aria-haspopup="dialog"
          aria-expanded={isMenuOpen}
          aria-controls="app-menu-drawer"
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
              {t('appHeader.brand')}
            </p>
            <p className="truncate text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
              {t('appHeader.subtitle')}
            </p>
          </div>
        </div>

        <a
          href="#"
          className={cn(
            buttonVariants({ size: 'sm' }),
            'ml-auto min-h-9 px-3 text-xs font-semibold uppercase tracking-[0.08em]',
          )}
        >
          {t('appHeader.report')}
        </a>
      </div>
    </header>
  )
}
