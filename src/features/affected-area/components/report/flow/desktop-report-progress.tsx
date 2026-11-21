import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { resolveLanguage } from '@/lib/i18n/config'
import { formatNumber } from '@/lib/i18n/formatters'
import { cn } from '@/lib/utils'
import { reportSteps } from '../../../utils/report-steps'
import type { ReportStepNumber } from '../../../utils/report-steps'

type DesktopReportProgressProps = {
  currentStep: ReportStepNumber
}

export function DesktopReportProgress({
  currentStep,
}: DesktopReportProgressProps) {
  const { t, i18n } = useTranslation()
  const language = resolveLanguage(i18n.resolvedLanguage ?? i18n.language)

  return (
    <section
      aria-label={t('affectedArea.progress.label')}
      className="rounded-2xl border border-border-subtle bg-card px-6 py-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-primary">
          {t('affectedArea.progress.stepOf', {
            current: formatNumber(currentStep, language),
            total: formatNumber(reportSteps.length, language),
          })}
        </p>
        <p className="text-xs text-muted-foreground">
          {t('affectedArea.progress.estimatedTime')}
        </p>
      </div>

      <ol className="mt-4 grid grid-cols-4 gap-3">
        {reportSteps.map((step) => {
          const isComplete = step.number < currentStep
          const isCurrent = step.number === currentStep

          return (
            <li
              key={step.number}
              aria-current={isCurrent ? 'step' : undefined}
              className="min-w-0"
            >
              <span
                aria-hidden="true"
                className={cn(
                  'block h-2 rounded-full',
                  isComplete
                    ? 'bg-success'
                    : isCurrent
                      ? 'bg-primary'
                      : 'bg-secondary',
                )}
              />
              <span className="mt-2 flex min-w-0 items-center gap-2">
                <span
                  className={cn(
                    'flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold',
                    isComplete
                      ? 'bg-success text-success-foreground'
                      : isCurrent
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-muted-foreground',
                  )}
                >
                  {isComplete ? (
                    <Check className="size-3.5" aria-hidden="true" />
                  ) : (
                    formatNumber(step.number, language)
                  )}
                </span>
                <span
                  className={cn(
                    'min-w-0 text-xs font-semibold leading-tight',
                    isComplete
                      ? 'text-success-text'
                      : isCurrent
                        ? 'text-primary'
                        : 'text-muted-foreground',
                  )}
                >
                  {isComplete && (
                    <span className="sr-only">
                      {t('affectedArea.progress.completed')}:{' '}
                    </span>
                  )}
                  {t(step.labelKey)}
                </span>
              </span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
