import type { MenuGroup } from './menu-config'
import { t } from '@/lib/i18n'
import { MenuNavLink } from './menu-nav-link'

type MenuNavGroupProps = {
  group: MenuGroup
}

export function MenuNavGroup({ group }: MenuNavGroupProps) {
  return (
    <section className="space-y-1">
      <h3 className="px-2 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {t(group.titleKey)}
      </h3>
      <ul className="space-y-0.5">
        {group.items.map((item) => (
          <li key={item.labelKey}>
            <MenuNavLink item={item} />
          </li>
        ))}
      </ul>
    </section>
  )
}
