import { cn } from '@/lib/utils'
import { t } from '@/lib/i18n'
import type { LanguageCode } from '@/lib/i18n'
import type { DesktopFooterLinkGroup } from './desktop-footer-config'

type DesktopFooterLinkGroupProps = {
  group: DesktopFooterLinkGroup
  language: LanguageCode
}

export function DesktopFooterLinkGroup({ group, language }: DesktopFooterLinkGroupProps) {
  return (
    <div>
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground">
        {t(group.titleKey, language)}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {group.links.map((link) => (
          <li key={link.labelKey}>
            <a
              href={link.to}
              className={cn(
                'inline-flex min-h-6 items-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
                link.variant === 'emergency'
                  ? 'font-medium text-emergency hover:text-emergency-hover'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {t(link.labelKey, language)}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
