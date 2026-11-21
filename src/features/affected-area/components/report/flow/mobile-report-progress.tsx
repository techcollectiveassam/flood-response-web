import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { reportSteps } from '../../../utils/report-steps'
import type { ReportStepNumber } from '../../../utils/report-steps'

type MobileReportProgressProps = {
  currentStep: ReportStepNumber
}

export function MobileReportProgress({
  currentStep,
}: MobileReportProgressProps) {
  const { t } = useTranslation()

  return (
    <nav aria-label={t('affectedArea.progress.label')} className="w-full">
      <ol className="grid grid-cols-4 gap-2">
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
                  'block h-1.5 rounded-full',
                  isComplete
                    ? 'bg-success'
                    : isCurrent
                      ? 'bg-primary'
                      : 'bg-secondary',
                )}
              />
              <span
                className={cn(
                  'mt-1.5 flex items-center gap-1 text-[11px] font-semibold leading-tight',
                  isComplete
                    ? 'text-success-text'
                    : isCurrent
                      ? 'text-primary'
                      : 'text-muted-foreground',
                )}
              >
                {isComplete ? (
                  <Check className="size-3 shrink-0" aria-hidden="true" />
                ) : isCurrent ? (
                  <span
                    className="size-1.5 shrink-0 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                ) : null}
                <span className="min-w-0">
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
    </nav>
  )
}
