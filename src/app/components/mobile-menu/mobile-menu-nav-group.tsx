import { useTranslation } from 'react-i18next'
import type { MobileMenuGroup } from './mobile-menu-config'
import { MobileMenuNavLink } from './mobile-menu-nav-link'

type MobileMenuNavGroupProps = {
  group: MobileMenuGroup
  onNavigate?: () => void
}

export function MobileMenuNavGroup({
  group,
  onNavigate,
}: MobileMenuNavGroupProps) {
  const { t } = useTranslation()

  return (
    <section className="space-y-1">
      <h3 className="px-2 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {t(group.titleKey)}
      </h3>
      <ul className="space-y-0.5">
        {group.items.map((item) => (
          <li key={item.labelKey}>
            <MobileMenuNavLink item={item} onNavigate={onNavigate} />
          </li>
        ))}
      </ul>
    </section>
  )
}
