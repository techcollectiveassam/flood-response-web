import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { useLanguage } from '@/hooks/use-language'
import { formatNumber } from '@/lib/i18n/formatters'
import { buildLocalizedPath } from '@/lib/i18n/locale-segment'
import { DesktopReportProgress } from '../components/report/flow/desktop-report-progress'
import { DesktopSupportColumn } from '../components/report/support/desktop-support-column'
import type { ReportStepNumber } from '../utils/report-steps'

type DesktopReportStepLayoutProps = {
  currentStep: ReportStepNumber
  children: ReactNode
}

export function DesktopReportStepLayout({
  currentStep,
  children,
}: DesktopReportStepLayoutProps) {
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
            number: formatNumber(currentStep, language),
          })}
        </span>
      </div>

      <DesktopReportProgress currentStep={currentStep} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="flex min-w-0 flex-col gap-5">{children}</div>
        <DesktopSupportColumn />
      </div>
    </div>
  )
}
