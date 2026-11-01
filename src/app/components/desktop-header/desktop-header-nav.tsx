import type { DesktopHeaderNavItem } from './desktop-header-nav-config'
import { cn } from '@/lib/utils'
import { t } from '@/lib/i18n'

type DesktopHeaderNavProps = {
  items: DesktopHeaderNavItem[]
  className?: string
}

export function DesktopHeaderNav({ items, className }: DesktopHeaderNavProps) {
  return (
    <nav
      aria-label={t('desktopHeader.navigationLabel')}
      className={cn('flex items-center gap-1', className)}
    >
      {items.map((item) => {
        const Icon = item.icon
        const isEmergency = item.variant === 'emergency'

        return (
          <a
            key={item.labelKey}
            href={item.to}
            className={cn(
              'flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
              isEmergency
                ? 'bg-destructive-soft font-semibold text-destructive hover:bg-destructive/15'
                : 'text-foreground hover:bg-muted',
            )}
          >
            {Icon ? <Icon className="size-4 shrink-0" aria-hidden="true" /> : null}
            <span>{t(item.labelKey)}</span>
          </a>
        )
      })}
    </nav>
  )
}
