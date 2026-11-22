import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { useLanguage } from '@/hooks/use-language'
import { buildLocalizedPath } from '@/lib/i18n/locale-segment'
import { cn } from '@/lib/utils'
import type { DesktopFooterLinkGroup } from './desktop-footer-config'

type DesktopFooterLinkGroupProps = {
  group: DesktopFooterLinkGroup
}

export function DesktopFooterLinkGroup({ group }: DesktopFooterLinkGroupProps) {
  const { t } = useTranslation()
  const { language } = useLanguage()

  return (
    <div>
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground">
        {t(group.titleKey)}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {group.links.map((link) => {
          const className = cn(
            'inline-flex min-h-8 items-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
            link.variant === 'emergency'
              ? 'font-medium text-emergency hover:text-emergency-hover'
              : 'text-muted-foreground hover:text-foreground',
          )

          return (
            <li key={link.labelKey}>
              {link.to === '#' ? (
                <a href="#" className={className}>
                  {t(link.labelKey)}
                </a>
              ) : (
                <Link
                  to={buildLocalizedPath(language, link.to)}
                  className={className}
                >
                  {t(link.labelKey)}
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
