import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { useLanguage } from '@/hooks/use-language'
import { formatNumber } from '@/lib/i18n/formatters'
import { buildLocalizedPath } from '@/lib/i18n/locale-segment'
import { DesktopReportProgress } from './desktop-report-progress'

export function ReportFloodDesktop() {
  const { t } = useTranslation()
  const { language } = useLanguage()

  return (
    <div className="mx-auto flex w-full flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav aria-label={t('affectedArea.breadcrumb.label')}>
          <ol className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <li>
              <Link
                to={buildLocalizedPath(language, '/')}
                className="rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                {t('affectedArea.breadcrumb.home')}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>{t('affectedArea.breadcrumb.citizenServices')}</li>
            <li aria-hidden="true">/</li>
            <li>
              <span aria-current="page" className="font-medium text-foreground">
                {t('affectedArea.breadcrumb.reportFloodedArea')}
              </span>
            </li>
          </ol>
        </nav>

        <span className="rounded-full border border-warning/30 bg-warning-soft px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-warning-foreground">
          {t('affectedArea.progress.step', {
            number: formatNumber(1, language),
          })}
        </span>
      </div>

      <DesktopReportProgress currentStep={1} />

      <section className="rounded-2xl border border-border-subtle bg-card p-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {t('affectedArea.location.title')}
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {t('affectedArea.location.description')}
        </p>
      </section>
    </div>
  )
}
