import type { MobileMenuGroup } from './mobile-menu-config'
import { t } from '@/lib/i18n'
import type { LanguageCode } from '@/lib/i18n'
import { MobileMenuNavLink } from './mobile-menu-nav-link'

type MobileMenuNavGroupProps = {
  group: MobileMenuGroup
  language: LanguageCode
}

export function MobileMenuNavGroup({ group, language }: MobileMenuNavGroupProps) {
  return (
    <section className="space-y-1">
      <h3 className="px-2 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {t(group.titleKey, language)}
      </h3>
      <ul className="space-y-0.5">
        {group.items.map((item) => (
          <li key={item.labelKey}>
            <MobileMenuNavLink item={item} language={language} />
          </li>
        ))}
      </ul>
    </section>
  )
}
