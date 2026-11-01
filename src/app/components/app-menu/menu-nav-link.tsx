import { matchPath, useLocation } from 'react-router'
import type { MenuItem } from './menu-config'
import { cn } from '@/lib/utils'
import { t } from '@/lib/i18n'

type MenuNavLinkProps = {
  item: MenuItem
}

export function MenuNavLink({ item }: MenuNavLinkProps) {
  const { pathname } = useLocation()
  const Icon = item.icon
  const isEmergency = item.variant === 'emergency'
  const isActive =
    item.to !== '#' && matchPath({ path: item.to, end: false }, pathname) !== null

  return (
    <a
      href={item.to}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'flex min-h-11 items-center gap-2.5 rounded-lg px-2.5 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
        isEmergency
          ? 'bg-destructive-soft font-semibold text-destructive hover:bg-destructive/15'
          : isActive
            ? 'bg-primary-soft font-semibold text-primary'
            : 'text-foreground hover:bg-muted',
      )}
    >
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      <span className="truncate">{t(item.labelKey)}</span>
    </a>
  )
}
