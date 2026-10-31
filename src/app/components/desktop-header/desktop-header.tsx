import { House } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/language-switcher'
import { cn } from '@/lib/utils'
import { t } from '@/lib/i18n'
import type { LanguageCode } from '@/lib/i18n'
import { DesktopHeaderNav } from './desktop-header-nav'
import { desktopHeaderNavItems } from './desktop-header-nav-config'

type DesktopHeaderProps = {
  language: LanguageCode
  onLanguageChange: (language: LanguageCode) => void
}

export function DesktopHeader({ language, onLanguageChange }: DesktopHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-6">
        <div className="flex shrink-0 items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <House className="size-4" aria-hidden="true" />
          </span>
          <span className="text-base font-semibold leading-none text-foreground">
            {t('appHeader.brand')}
          </span>
        </div>

        <span className="shrink-0 rounded-md border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
          {t('desktopHeader.year')}
        </span>

        <div className="hidden items-center gap-1.5 rounded-full border border-success/25 bg-success-soft px-3 py-1.5 text-[11px] font-medium whitespace-nowrap text-success xl:flex">
          <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
          {t('desktopHeader.liveStatus')}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitcher
            value={language}
            onChange={onLanguageChange}
            variant="segmented"
          />
          <DesktopHeaderNav items={desktopHeaderNavItems} />
          <a
            href="#"
            className={cn(
              buttonVariants(),
              'h-10 px-4 text-xs font-semibold uppercase tracking-[0.08em]',
            )}
          >
            {t('appHeader.report')}
          </a>
        </div>
      </div>
    </header>
  )
}
