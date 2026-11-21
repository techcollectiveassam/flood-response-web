import {
  CircleAlert,
  CircleHelp,
  OctagonAlert,
  TriangleAlert,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import type { TranslationKey } from '@/lib/i18n/catalog'
import { cn } from '@/lib/utils'
import { useReportDraft } from '../contexts/report-draft-context'
import type { ReportSeverity } from '../types/report-draft'
import { OptionRadioIndicator } from './option-radio-indicator'

type SeverityOption = {
  value: ReportSeverity
  icon: LucideIcon
  titleKey: TranslationKey
  descriptionKey: TranslationKey
  iconClassName: string
}

const severityOptions: SeverityOption[] = [
  {
    value: 'critical',
    icon: OctagonAlert,
    titleKey: 'affectedArea.situation.severity.critical.title',
    descriptionKey:
      'affectedArea.situation.severity.critical.description',
    iconClassName: 'bg-destructive-soft text-destructive',
  },
  {
    value: 'urgent',
    icon: TriangleAlert,
    titleKey: 'affectedArea.situation.severity.urgent.title',
    descriptionKey:
      'affectedArea.situation.severity.urgent.description',
    iconClassName: 'bg-urgent-soft text-urgent',
  },
  {
    value: 'moderate',
    icon: CircleAlert,
    titleKey: 'affectedArea.situation.severity.moderate.title',
    descriptionKey:
      'affectedArea.situation.severity.moderate.description',
    iconClassName: 'bg-warning-soft text-warning',
  },
  {
    value: 'unknown',
    icon: CircleHelp,
    titleKey: 'affectedArea.situation.severity.unknown.title',
    descriptionKey:
      'affectedArea.situation.severity.unknown.description',
    iconClassName: 'bg-muted text-muted-foreground',
  },
]

export function SeverityLevelField({
  error = false,
}: {
  error?: boolean
}) {
  const { t } = useTranslation()
  const { draft, updateSituation } = useReportDraft()
  const headingId = useId()
  const errorId = useId()
  const severity = draft.situation.severity
  const showError = error && !severity

  return (
    <section aria-labelledby={headingId}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2
          id={headingId}
          className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground"
        >
          {t('affectedArea.situation.severity.label')}
          <span className="ml-1 text-destructive" aria-hidden="true">
            *
          </span>
          <span className="sr-only">
            {' '}
            ({t('affectedArea.situation.required')})
          </span>
        </h2>
        <p className="text-xs text-muted-foreground">
          {t('affectedArea.situation.severity.hint')}
        </p>
      </div>

      <fieldset
        aria-labelledby={headingId}
        aria-describedby={showError ? errorId : undefined}
        aria-required="true"
        className="mt-3 grid grid-cols-2 gap-3"
      >
        {severityOptions.map((option) => {
          const isChecked = severity === option.value
          const Icon = option.icon

          return (
            <label
              key={option.value}
              className={cn(
                'flex cursor-pointer flex-col rounded-2xl border bg-card p-4 transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-ring/50',
                isChecked
                  ? 'border-primary/60 ring-1 ring-primary/20'
                  : 'border-border-subtle',
              )}
            >
              <input
                type="radio"
                name="situation-severity"
                value={option.value}
                checked={isChecked}
                onChange={() => updateSituation({ severity: option.value })}
                aria-label={t(option.titleKey)}
                className="sr-only"
              />

              <span className="flex items-start justify-between gap-2">
                <span
                  className={cn(
                    'flex size-10 items-center justify-center rounded-lg',
                    option.iconClassName,
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <OptionRadioIndicator checked={isChecked} />
              </span>

              <span className="mt-3 block text-base font-bold leading-tight text-foreground">
                {t(option.titleKey)}
              </span>
              <span className="mt-1 block text-sm leading-snug text-muted-foreground">
                {t(option.descriptionKey)}
              </span>
            </label>
          )
        })}
      </fieldset>

      {showError && (
        <p
          id={errorId}
          role="alert"
          className="mt-2 text-xs font-semibold text-destructive"
        >
          {t('affectedArea.situation.severity.requiredError')}
        </p>
      )}
    </section>
  )
}
