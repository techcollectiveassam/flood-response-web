import { useTranslation } from 'react-i18next'
import { resolveLanguage } from '@/lib/i18n/config'
import { formatNumber } from '@/lib/i18n/formatters'
import { cn } from '@/lib/utils'
import { reportSteps } from '../utils/report-steps'
import type { ReportStepNumber } from '../utils/report-steps'

type MobileReportProgressProps = {
  currentStep: ReportStepNumber
}

export function MobileReportProgress({
  currentStep,
}: MobileReportProgressProps) {
  const { t, i18n } = useTranslation()
  const language = resolveLanguage(i18n.resolvedLanguage ?? i18n.language)

  return (
    <nav aria-label={t('affectedArea.progress.label')} className="w-full">
      <ol className="grid grid-cols-4 gap-2">
        {reportSteps.map((step) => {
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
                  'block h-1.5 rounded-full',
                  isCurrent ? 'bg-primary' : 'bg-secondary',
                )}
              />
              <span
                className={cn(
                  'mt-1.5 block text-[11px] font-semibold leading-tight',
                  isCurrent ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                {formatNumber(step.number, language)}. {t(step.labelKey)}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
