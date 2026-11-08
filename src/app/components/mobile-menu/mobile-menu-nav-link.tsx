import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import type { MobileMenuItem } from './mobile-menu-config'
import { useIsActivePath } from '@/hooks/use-is-active-path'
import { useLanguage } from '@/hooks/use-language'
import { buildLocalizedPath } from '@/lib/i18n/locale-segment'
import { cn } from '@/lib/utils'

type MobileMenuNavLinkProps = {
  item: MobileMenuItem
  onNavigate?: () => void
}

export function MobileMenuNavLink({
  item,
  onNavigate,
}: MobileMenuNavLinkProps) {
  const { t } = useTranslation()
  const { language } = useLanguage()
  const Icon = item.icon
  const isEmergency = item.variant === 'emergency'
  const isActive = useIsActivePath(item.to)
  const isPlaceholder = item.to === '#'

  const className = cn(
    'flex min-h-11 items-center gap-2.5 rounded-lg px-2.5 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
    isEmergency
      ? 'bg-destructive-soft font-semibold text-destructive hover:bg-destructive/15'
      : isActive
        ? 'bg-primary-soft font-semibold text-primary'
        : 'text-foreground hover:bg-muted',
  )

  const content = (
    <>
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      <span className="truncate">{t(item.labelKey)}</span>
    </>
  )

  if (isPlaceholder) {
    return (
      <a
        href="#"
        aria-current={isActive ? 'page' : undefined}
        className={className}
      >
        {content}
      </a>
    )
  }

  return (
    <Link
      to={buildLocalizedPath(language, item.to)}
      aria-current={isActive ? 'page' : undefined}
      className={className}
      onClick={onNavigate}
    >
      {content}
    </Link>
  )
}
