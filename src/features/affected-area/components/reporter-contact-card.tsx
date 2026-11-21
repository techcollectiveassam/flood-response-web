import { ShieldCheck } from 'lucide-react'
import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { normalizeDigits } from '@/lib/normalize-digits'
import { cn } from '@/lib/utils'
import { useReportDraft } from '../contexts/report-draft-context'

function normalizeMobileInput(value: string): string {
  const digits = normalizeDigits(value).replace(/\D/g, '')
  const local =
    digits.startsWith('91') && digits.length > 10 ? digits.slice(2) : digits

  return local.slice(0, 10)
}

export function ReporterContactCard() {
  const { t } = useTranslation()
  const { draft, updateReporter } = useReportDraft()
  const [mobileTouched, setMobileTouched] = useState(false)
  const nameId = useId()
  const mobileId = useId()
  const mobileErrorId = useId()
  const mobile = draft.reporter.mobile ?? ''
  const mobileInvalid =
    mobileTouched && mobile.length > 0 && mobile.length !== 10

  return (
    <section className="rounded-2xl border border-border-subtle bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-bold text-foreground">
          {t('affectedArea.review.reporter.title')}
        </h2>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
          {t('affectedArea.review.reporter.optional')}
        </span>
      </div>

      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
        {t('affectedArea.review.reporter.description')}
      </p>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div>
          <label
            htmlFor={nameId}
            className="block text-xs font-semibold text-foreground"
          >
            {t('affectedArea.review.reporter.nameLabel')}
          </label>
          <input
            id={nameId}
            type="text"
            autoComplete="name"
            maxLength={100}
            value={draft.reporter.name ?? ''}
            onChange={(event) =>
              updateReporter({ name: event.target.value })
            }
            placeholder={t(
              'affectedArea.review.reporter.namePlaceholder',
            )}
            className="mt-1 h-12 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          />
        </div>

        <div>
          <label
            htmlFor={mobileId}
            className="block text-xs font-semibold text-foreground"
          >
            {t('affectedArea.review.reporter.mobileLabel')}
          </label>
          <div
            className={cn(
              'mt-1 flex h-12 items-center rounded-xl border bg-background focus-within:ring-2 focus-within:ring-ring/50',
              mobileInvalid
                ? 'border-destructive'
                : 'border-border',
            )}
          >
            <span
              className="flex h-full items-center border-r border-border px-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              +91
            </span>
            <input
              id={mobileId}
              type="text"
              inputMode="tel"
              autoComplete="tel"
              value={mobile}
              onChange={(event) =>
                updateReporter({
                  mobile: normalizeMobileInput(event.target.value),
                })
              }
              onBlur={() => setMobileTouched(true)}
              aria-invalid={mobileInvalid || undefined}
              aria-describedby={
                mobileInvalid ? mobileErrorId : undefined
              }
              placeholder={t(
                'affectedArea.review.reporter.mobilePlaceholder',
              )}
              className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          {mobileInvalid && (
            <p
              id={mobileErrorId}
              role="alert"
              className="mt-1 text-xs font-semibold text-destructive"
            >
              {t('affectedArea.review.reporter.mobileInvalid')}
            </p>
          )}
        </div>
      </div>

      <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
        <ShieldCheck
          className="mt-0.5 size-3.5 shrink-0 text-success-text"
          aria-hidden="true"
        />
        {t('affectedArea.review.reporter.privacy')}
      </p>
    </section>
  )
}
