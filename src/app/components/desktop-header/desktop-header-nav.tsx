import type { DesktopHeaderNavItem } from './desktop-header-nav-config'
import { useTranslation } from 'react-i18next'
import { useIsActivePath } from '@/hooks/use-is-active-path'
import { cn } from '@/lib/utils'

type DesktopHeaderNavProps = {
  items: DesktopHeaderNavItem[]
  className?: string
}

function DesktopHeaderNavLink({ item }: { item: DesktopHeaderNavItem }) {
  const { t } = useTranslation()
  const isActive = useIsActivePath(item.to)
  const Icon = item.icon
  const isEmergency = item.variant === 'emergency'

  return (
    <a
      href={item.to}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
        isEmergency
          ? 'bg-destructive-soft font-semibold text-destructive hover:bg-destructive/15'
          : isActive
            ? 'bg-primary-soft font-semibold text-primary'
            : 'text-foreground hover:bg-muted',
      )}
    >
      {Icon ? <Icon className="size-4 shrink-0" aria-hidden="true" /> : null}
      <span>{t(item.labelKey)}</span>
    </a>
  )
}

export function DesktopHeaderNav({ items, className }: DesktopHeaderNavProps) {
  const { t } = useTranslation()

  return (
    <nav
      aria-label={t('desktopHeader.navigationLabel')}
      className={cn('flex items-center gap-1', className)}
    >
      {items.map((item) => (
        <DesktopHeaderNavLink key={item.labelKey} item={item} />
      ))}
    </nav>
  )
}
