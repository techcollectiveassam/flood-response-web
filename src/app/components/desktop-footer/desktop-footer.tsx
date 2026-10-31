import { Download, House } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/language-switcher'
import { cn } from '@/lib/utils'
import { t } from '@/lib/i18n'
import type { LanguageCode } from '@/lib/i18n'
import {
  desktopFooterLinkGroups,
  desktopFooterPolicyLinks,
} from './desktop-footer-config'
import { DesktopFooterLinkGroup } from './desktop-footer-link-group'

type DesktopFooterProps = {
  language: LanguageCode
  onLanguageChange: (language: LanguageCode) => void
}

export function DesktopFooter({
  language,
  onLanguageChange,
}: DesktopFooterProps) {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto w-full max-w-7xl px-6 py-10">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,1.15fr)]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <House className="size-4" aria-hidden="true" />
              </span>
              <span className="text-base font-semibold leading-none text-foreground">
                {t('appHeader.brand')}
              </span>
            </div>

            <p className="mt-5 text-xs font-semibold uppercase leading-relaxed tracking-[0.06em] text-primary">
              {t('footer.crisisTitle')}
            </p>

            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {t('footer.description')}
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-success/25 bg-success-soft px-3 py-1.5 text-[11px] font-medium text-success">
              <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
              {t('footer.systemStatus')}
            </div>
          </div>

          <nav aria-label={t('footer.navigationLabel')} className="contents">
            {desktopFooterLinkGroups.map((group) => (
              <DesktopFooterLinkGroup key={group.id} group={group} />
            ))}
          </nav>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground">
              {t('footer.verificationTitle')}
            </h3>

            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              {t('footer.verificationBody')}
            </p>

            <p className="mt-4 rounded-lg border border-border bg-surface-soft px-3 py-3 text-xs leading-relaxed text-muted-foreground">
              {t('footer.privacyNotice')}
            </p>

           
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-6 py-4 text-[11px] text-muted-foreground lg:flex-row lg:items-center lg:justify-between">
          <p>{t('footer.copyrightDesktop')}</p>

          <div className="flex flex-wrap items-center gap-3">
            <LanguageSwitcher value={language} onChange={onLanguageChange} />

            <span aria-hidden="true" className="h-4 w-px bg-border" />

            <nav aria-label={t('footer.legalLabel')}>
              <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
                {desktopFooterPolicyLinks.map((link) => (
                  <li key={link.labelKey}>
                    <a
                      href={link.to}
                      className="inline-flex min-h-6 items-center transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                    >
                      {t(link.labelKey)}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}
